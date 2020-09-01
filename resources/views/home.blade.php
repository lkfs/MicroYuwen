@extends('common.layout_default')

@section('css')
    <style>
        .content {
            width: 800px;
            margin: 0 auto;
            display: flex;
            flex-wrap:wrap;
            flex-direction: column;
        }
        .boxMain {
            width: 310px;
            display: flex;
            flex-direction: row;
        }
        .boxLeft {
            margin: 5px;
            display: flex;
            flex-direction: column ;
            width:50px;
            height:80px;
        }
        .boxRight {
            margin: 5px;
            display: flex;
            flex-direction: row ;
            flex-wrap: wrap;
        }
        .boxItem {
            margin: 3px 5px;
        }
        .t_pinyin{
            width: 50px;
            height: 30px;
            border: solid #ACC0D8 1px;
            text-align: center;
            line-height:30px;
        }
        .t_hanzi{
            width: 50px;
            height: 50px;
            border: solid #ACC0D8 1px;
            border-top-width:0px;
            text-align: center;
            line-height:50px;
        }
    </style>

@endsection

@section('content')
<div class="content">
    <a href="/chars">生词表</a>
    <a href="/wordMultis">多音词组校对</a>
</div>
@stop
@section('javascript')
<script>
</script>
@append

