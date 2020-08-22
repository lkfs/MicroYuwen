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


    public function make(){
        $newWords = MNewWord::orderBy('grade')
            ->orderBy('term')
            ->limit(3)
            ->get();
        $newWords->each(function ($newWord, $key){
            Log::info('word = '.json_encode($newWord));
            $wordGroups = $this->searchWordGroup($newWord->word);
            $wordGroups = collect($wordGroups);
            $wordGroups->filter(function($wordGroup, $key) use ($newWord){
                return strpos($wordGroup, $newWord->word);
            })->each(function($wordGroup, $key){
                MWordGroup::where('word_group', $wordGroup)->delete();

                $newWordGroup = new MWordGroup();
                $newWordGroup->word_group = $wordGroup;
                list($grade, $term) = $this->computeGradeAndTerm($wordGroup);
                $newWordGroup->grade = $grade;
                $newWordGroup->term = $term;
                $newWordGroup->save();
            });
            sleep(2);
        });
        return 'success';
    }

    public function computeGradeAndTerm($wordGroup){
        $pattern = '/[\x{4e00}-\x{9fa5}]/u';
        $grade = -1;
        $term = -1;
        if(preg_match_all($pattern, $wordGroup, $matches)){
            Log::info('$matches  ='.json_encode($matches));
            $newWords = collect( $matches[0] );
            $newWords->each(function($item, $key) use ($grade, $term,$wordGroup){
               $newWord = MNewWord::where('word', $item)
                   ->first();
               if($newWord){
                   if(($grade*10+$term)< ($newWord->grade*10+$newWord->term)){
                       $grade = $newWord->grade;
                       $term = $newWord->term;
                   }
               }
               else{
                   Log::info('生僻字 = '.$wordGroup);
               }
            });
        }
        Log::info('$grade = '.$grade.', $term = '.$term);
        return array($grade, $term);
    }

    //调用百度汉语，查找词组
    public function searchWordGroup($word){
        $client = new Client([
            'base_uri' => 'https://hanyu.baidu.com',
            'timeout'  => 5.0,
        ]);
        $url = 'https://hanyu.baidu.com/s?wd='.urlencode($word).'&from=zici';

        $response =  $client->request('GET', $url);
        $code = $response->getStatusCode();
        if($code==200){
            $body = $response->getBody();
            //Log::info('$word = '.$word.', body = '.$body);
            $pinyinPattern = '/<a href=".*ptype=term">([\x{4e00}-\x{9fa5}].*)<\/a>/u';
            if(preg_match_all($pinyinPattern, $body, $matches)){
                return $matches[1];
            }
        }
        else{
            throw new Exception('$word = '.$word.' error, $code = '.$code);
        }
    }

}
