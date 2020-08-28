<?php


namespace App\Repositories;

use App\Models\MChar;
use App\Models\MWord;
use App\Models\SMulti;
use App\Models\SPinYin;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use stdClass;

/**
 * 词组
 * @package App\Repositories
 */
class WordRepository extends BaseRepository
{
    private $pinyin_total;
    private $multi_total;
    private $split_char_pattern = '/[\x{4e00}-\x{9fa5}]/u';

    /**
     * WordRepository constructor.
     * @param $pinyin_total
     */
    public function __construct()
    {
        $this->pinyin_total = Cache::remember("pinyin_total", 10, function(){
            return  SPinYin::get();
        });
        $this->multi_total = Cache::remember("multi_total", 10, function(){
            return  SMulti::get();
        });
    }

    /**
     * 标注
     * @param $char
     */
    public function toPinyin($word){
        if (preg_match_all($this->split_char_pattern, $word->word, $matches)) {
            $result = array();
            $chars = $matches[0];
            foreach ($chars as $char){
                $pinyin = $this->pinyin_total->where('chr', $char);
                if($pinyin->count()==1){
                    $result[] = $pinyin->first()->duyin;
                }
                else {
                    $default = $pinyin->first()->duyin;
                    $pinyin = $this->multi_total->where('chr', $char);
                    if($pinyin->count()>0)
                        $result[] = $pinyin->implode('duyin', '|');
                    else
                        $result[] = $default;
                }
            }
            echo 'to pinyin, word = '.$word->word.', pinyin = '.implode(',',$result)."\n";
            return implode(',',$result);
        }
        echo 'to pinyin, $word = '.$word."\n";
        return '';
    }
    /**
     * 词组拆分为单字，便于拼音标注
     */
    public function batchMark()
    {
        $words = MWord::orderBy('grade')
           // ->where('word', 'like', '不%可%')
            ->orderBy('term')
            ->get();
        $words->each(function ($word, $key) {
            $word->pinyin = $this->toPinyin($word);
            //echo json_encode($word)."\n";
            $word->save();
        });

    }

    private $multi = <<<eof
eof;

    public function multi(){
        $rows = explode("\n", $this->multi);
        foreach ($rows as $row){
            $row = explode('：', $row);
            $char = $row[0];
            $pinyin = $row[1];
            $multi = SMulti::where('chr', $char)->where('duyin',$pinyin)->get();
            if(!$multi){
                $multi = new SMulti();
                $multi->chr = $char;
                $multi->duyin = $pinyin;
                $multi->save();
                echo $multi->chr.' - '.$multi->duyin."\n";
            }
            else{
                echo $char.' - '.$pinyin." 已存在\n";
            }
        }
    }
}
