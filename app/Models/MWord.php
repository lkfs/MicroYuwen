<?php

/**
* Created by PhpStorm.
* User: HappyQi
* Date: 2017/9/28
* Time: 10:19
*/
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MWord extends Model
{
    protected $table ='m_word';
    protected $primaryKey ='word_id';
    public $timestamps = true;
    protected $dates = ['deleted_at'];

}



