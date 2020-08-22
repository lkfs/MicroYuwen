<?php

/**
* Created by PhpStorm.
* User: HappyQi
* Date: 2017/9/28
* Time: 10:19
*/
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MArticle extends Model
{
    protected $table ='m_article';
    public $timestamps = true;
    protected $dates = ['deleted_at'];

    /*
    * 进行类型转换
    *
    * @var  array
    *
    */
    protected $casts = [
            ];
}



