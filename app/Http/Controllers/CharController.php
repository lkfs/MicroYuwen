<?php

namespace App\Http\Controllers;

use App\Repositories\CharRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CharController extends Controller
{
    private $repository;
    /**
     * NewWordsController constructor.
     */
    public function __construct(CharRepository $_repository)
    {
        $this->repository = $_repository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $grade = $request->get('grade', 1);
        $term = $request->get('term', 0);

        $all = $request->all();
        $all = array_unshift($all, $request->url());
        $key = md5($all);
        $data = Cache::tags([$request->url()])->remember($key, 10, function () use ($grade, $term){
            $data = $this->repository->getChars($grade, $term);
            return $data;
        } );
        return view("char.char_index", array(
            'grades'=>$this->repository->grades,
            'terms'=>$this->repository->terms,
            'curGrade'=>$grade,
            'curTerm'=>$term,
            'data'=>$data
        ));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
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
        return view("new_words.new_words_edit", array(
            'grades'=>$this->repository->grades,
            'terms'=>$this->repository->terms,
        ));
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
        //
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
        //
    }
}
