<?php


namespace App\Utils;


use App\Components\Common\Utils;
use Illuminate\Support\Facades\Log;

class DBUtil
{

    public static function printSQL()
    {
        // 在需要打印SQL的语句前添加监听事件。
        \DB::listen(function ($query) {
            $bindings = $query->bindings;
            $sql = $query->sql;
            foreach ($bindings as $replace) {
                $value = is_numeric($replace) ? $replace : "'" . $replace . "'";
                $sql = preg_replace('/\?/', $value, $sql, 1);
            }
            Log::info("执行SQL语句:" . $sql);
        });
    }

}
