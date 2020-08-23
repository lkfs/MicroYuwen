@extends('common.layout_default')

@section('css')
    <style>
        .content {
            display: flex;
            flex-wrap:wrap;
            flex-direction: row;
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

    <form action="/newWords/" method="get" class="form-inline" id="newWordsForm">
        <div class="container">
            <div class="">
                <div class="form-group ">
                    <select name="grade" class="form-control">
                        @foreach($grades as $gradeId=>$gradeName)
                            <option value="{{$gradeId}}" @if(isset($curGrade) && $curGrade==$gradeId) selected @endif>{{$gradeName}}</option>
                        @endforeach
                    </select>
                </div>
                <div class="form-group text-center">
                    <label class="radio-inline">
                        <input type="radio" name="term" value="0" @if(isset($curTerm) && $curTerm==0) checked @endif> 上学期
                    </label>
                    <label class="radio-inline">
                        <input type="radio" name="term" value="1" @if(isset($curTerm) && $curTerm==1) checked @endif> 下学期
                    </label>
                </div>
                <div class="form-group text-center">
                    <button type="submit">
                        <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>
                    </button>
                </div>
            </div>

        </div>
    </form>

    <div class="content">
        @foreach($data as $word)
            <div class="boxMain">
                <div class="boxLeft">
                    <div class="t_pinyin">{{$word->pinyin}}</div>
                    <div class="t_hanzi" data-content="{{$word->word}}">{{$word->word_wrap ?? $word->word}}</div>
                </div>
                <div class="boxRight">
                    @foreach($word->word_groups as $word_group)
                        <a class="boxItem crudDelete" data-id_value="{{$word_group->word_group}}">{{$word_group->word_group_wrap ?? $word_group->word_group}}</a>
                    @endforeach
                </div>
            </div>
        @endforeach

    </div>
@stop
@section('javascript')
<script>
    crud.action = 'wordGroups';
    crud.title = '词组';
    $(document).ready(function () {

        $('.boxItem').on('click', function () {
            let wordGroup = $(this).data('id_value');
            crud.title = wordGroup;
            //alert(wordGroup);
            //$.ajax()
        })
    })
</script>
@append

