<?php


namespace App\Repositories;

class BaseRepository
{
    public $grades;
    public $terms;

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
}
