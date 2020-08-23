<?php


namespace App\Repositories;

use App\Models\MNewWord;
use App\Models\MWordGroup;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use stdClass;

/**
 * 词组
 * @package App\Repositories
 */
class WordGroupRepository extends BaseRepository
{
    private $splitServer = array('114.67.84.223', '120.26.6.172', '116.196.101.207');
    private $splitIndex = 0;

    public function make()
    {
        $newWords = MNewWord::orderBy('grade')
            ->where('word_id', '>=', 429)
            ->orderBy('term')//->limit(10)
            ->get();
        $newWords->each(function ($newWord, $key) {
            Log::info('word = ' . $newWord->word);
            $wordGroups = $this->searchWordGroup($newWord->word);
            if ($wordGroups) {
                $wordGroups = collect($wordGroups);
                $wordGroups->filter(function ($wordGroup, $key) use ($newWord) {
                    return strpos($wordGroup, $newWord->word);
                })->each(function ($wordGroup, $key) {
                    MWordGroup::where('word_group', $wordGroup)->delete();

                    $newWordGroup = new MWordGroup();
                    $newWordGroup->word_group = $wordGroup;
                    list($grade, $term) = $this->computeGradeAndTerm($wordGroup);
                    $newWordGroup->grade = $grade;
                    $newWordGroup->term = $term;
                    $newWordGroup->save();
                });
                sleep(5);
            }
        });
        return 'success';
    }

    public function computeGradeAndTerm($wordGroup)
    {
        $pattern = '/[\x{4e00}-\x{9fa5}]/u';
        $grade = -1;
        $term = -1;
        if (preg_match_all($pattern, $wordGroup, $matches)) {
            Log::info('$matches  =' . json_encode($matches));
            $newWords = collect($matches[0]);
            $newWords->each(function ($item, $key) use (&$grade, &$term, $wordGroup) {
                $newWord = MNewWord::where('word', $item)
                    ->first();
                if ($newWord) {
                    if (($grade * 10 + $term) < ($newWord->grade * 10 + $newWord->term)) {
                        $grade = $newWord->grade;
                        $term = $newWord->term;
                    }
                } else {
                    Log::info('生僻字 = ' . $wordGroup);
                    $grade = 9;
                    $term = 9;
                }
            });
        }
        return array($grade, $term);
    }

    //调用梁斌分词，过滤乱七八糟的词组
    public function splitWord($words)
    {
        Log::info('fenci = ' . implode(',', $words));
        $client = new Client([
            'base_uri' => 'http://api.pullword.com/',
            'timeout' => 5.0,
        ]);
        $url = 'http://' . $this->splitServer[$this->splitIndex++] . '/get.php?source=' . urlencode(implode(',', $words)) . ' &param1=0.5&param2=0';
        if ($this->splitIndex >= 3) $this->splitIndex = 0;
        try {
            $response = $client->request('GET', $url);
            $code = $response->getStatusCode();
            if ($code == 200) {
                $body = $response->getBody();
                $pattern = '/[\x{4e00}-\x{9fa5}].*/u';
                if (preg_match_all($pattern, $body, $matches)) {
                    return $matches[0];
                }
                return null;
            }
        } catch (Exception $e) {
            Log::info('sleep 60 seconds');
            sleep(60);
            return $this->splitWord($words);
        }
    }

    //调用百度汉语，查找词组
    public function searchWordGroup($word)
    {
        Log::info('baidu = ' . $word);
        $client = new Client([
            'base_uri' => 'https://hanyu.baidu.com',
            'timeout' => 5.0,
        ]);
        $url = 'https://hanyu.baidu.com/s?wd=' . urlencode($word) . '&from=zici';
        $response = $client->request('GET', $url);
        $code = $response->getStatusCode();
        if ($code == 200) {
            $body = $response->getBody();
            $pinyinPattern = '/<a href=".*ptype=term">([\x{4e00}-\x{9fa5}].*)<\/a>/u';
            if (preg_match_all($pinyinPattern, $body, $matches)) {
                return $this->splitWord($matches[1]);
            }
            return null;
        } else {
            throw new Exception('$word = ' . $word . ' error, $code = ' . $code);
        }
    }

}
