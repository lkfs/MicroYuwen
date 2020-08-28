<?php

/**
* Created by PhpStorm.
* User: HappyQi
* Date: 2017/9/28
* Time: 10:19
*/
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SMulti extends Model
{
    protected $table ='s_multi';
    protected $primaryKey = 'chr_id';
    public $timestamps = true;
    protected $dates = ['deleted_at'];

}



