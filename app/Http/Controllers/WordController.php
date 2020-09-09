<?php

namespace App\Http\Controllers;

use App\Models\MChar;
use App\Models\MWord;
use App\Repositories\CharRepository;
use App\Repositories\WordRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
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
       $words = MWord::where('pinyin', 'like', '%|%')->get();
        return view("word.word_index",['data'=>$words]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        $word = $request->input('word');
        return view("char.word_edit",['word'=>$word]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $word = $request->input('word');
        Cache::tags('word')->flush();
        return $this->repository->add($word);

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
        Cache::tags('word')->flush();
        return array(
            'code'=>1,
            'message'=>'success'
        );
    }

}
