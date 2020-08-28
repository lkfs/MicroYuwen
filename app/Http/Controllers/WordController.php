<?php

namespace App\Http\Controllers;

use App\Models\MChar;
use App\Models\MWord;
use App\Repositories\CharRepository;
use App\Repositories\WordRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WordController extends Controller
{
    private $repository;
    /**
     * NewWordsController constructor.
     */
    public function __construct(WordRepository $_repository)
    {
        $this->repository = $_repository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        /* 生词表入库
        foreach ($this->repository->newWords as $key=>$list){
            foreach ($list as $word=>$pinyin){
                $newWord = new MNewWord();
                $newWord->word = $word;
                $newWord->pinyin = $pinyin;
                $newWord->grade = floor($key / 10);
                $newWord->term = $key % 10;
                Log::info('$word = '.$newWord.', $pinyin = '.$pinyin.json_encode($newWord));
                $newWord->save();
            }
        }*/
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        $word = $request->input('word');
        return view("new_words.word_group_edit",['word'=>$word]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $word_group = $request->input('word_group');

        $pattern = '/[\x{4e00}-\x{9fa5}]/u';

        if (preg_match_all($pattern, $word_group, $matches)) {
            Log::info('$matches  =' . json_encode($matches));
            $words = collect($matches[0]);
            if($words->count()>=2){
                $m_word_group = new MWord();
                $m_word_group->word_group = $word_group;
                $m_word_group->excellent = 3;
                $m_word_group->save();
                return array(
                    'code'=>1,
                    'message'=>'success'
                );
            }
        }
        return array(
            'code'=>-1,
            'message'=>'词组至少包含两个汉字'
        );

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return $this->repository->split();
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->repository->delete($id);
        return array(
            'code'=>1,
            'message'=>'success'
        );
    }

}