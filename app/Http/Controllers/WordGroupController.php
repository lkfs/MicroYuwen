<?php

namespace App\Http\Controllers;

use App\Models\MNewWord;
use App\Repositories\NewWordRepository;
use App\Repositories\WordGroupRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WordGroupController extends Controller
{
    private $repository;
    /**
     * NewWordsController constructor.
     */
    public function __construct(WordGroupRepository $_repository)
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
    public function create()
    {
        return $this->repository->make();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
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
