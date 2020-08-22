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

class MWordGroup extends Model
{
    protected $table ='m_word_group';
    protected $id ='group_id';
    public $timestamps = true;
    protected $dates = ['deleted_at'];

}



