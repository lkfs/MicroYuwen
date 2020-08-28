<?php


namespace App\Repositories;

use App\Models\MChar;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use stdClass;

/**
 * 文章
 * @package App\Repositories
 */
class ArticleRepository
{
    public $grades;
    public $terms;
    public $articles;
    /**
     * NewWords constructor.
     */
    public function __construct()
    {
        $this->grades = array(
            1=>'一年级',
            2=>'二年级',
            3=>'三年级',
            4=>'四年级',
            5=>'五年级',
            6=>'六年级',
        );

        $this->terms = array(
          0=>'上学期',
          1=>'下学期',
        );
    }


    public function searchWord($word){

        $client = new Client([
            'base_uri' => 'https://hanyu.baidu.com',
            'timeout'  => 5.0,
        ]);
        $url = 'https://hanyu.baidu.com/s?wd='.urlencode($word).'&from=zici';

        $response =  $client->request('GET', $url);
        $code = $response->getStatusCode();
        if($code==200){
            $body = $response->getBody();
            Log::info('$word = '.$word.', body = '.$body);
            $pinyinPattern = '/<a href=".*ptype=term">([\x{4e00}-\x{9fa5}].*)<\/a>/u';
            if(preg_match_all($pinyinPattern, $body, $matches)){
                dd($matches);
            }
            return '$word = '.$word.' ok';
        }
        else{
            return '$word = '.$word.' error, $code = '.$code;
        }
    }

}
