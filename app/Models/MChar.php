<?php

/**
* Created by PhpStorm.
* User: HappyQi
* Date: 2017/9/28
* Time: 10:19
*/
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MChar extends Model
{
    protected $table ='m_char';
    protected $primaryKey = 'chr_id';
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



