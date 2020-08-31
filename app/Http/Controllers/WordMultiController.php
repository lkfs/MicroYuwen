<?php

namespace App\Http\Controllers;

use App\Models\MChar;
use App\Models\MWord;
use App\Repositories\CharRepository;
use App\Repositories\WordRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * 词组，多音标注
 * Class WordMultiController
 * @package App\Http\Controllers
 */
class WordMultiController extends Controller
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
        $words = MWord::where('pinyin', 'like', '%|%')->limit(12)->get();
        $words = $words->map(function ($item, $key){
            $pinyin = collect( explode(',',$item->pinyin) );
            $pinyin = $pinyin->map(function($i,$k){
                return collect( explode('|', $i) );
            });
            $item->pinyin = $pinyin;
            return $item;
        });
        return view("word_multi.word_multi_index",['data'=>$words]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
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

        $word = MWord::find($id);
        $word->pinyin = $request->input('pinyin');
        $word->save();

        return array(
            'code'=>1,
            'message'=>'success'
        );
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
