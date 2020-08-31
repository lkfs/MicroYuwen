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

    <form action="/chars/" method="get" class="form-inline">
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
                    <button type="submit">查询</button>
                    <button type="button">追加单词</button>
                </div>
            </div>

        </div>
    </form>

    <div class="content">
        @foreach($data as $chr)
            <div class="boxMain">
                <div class="boxLeft">
                    <div class="t_pinyin">{{$chr->pinyin}}</div>
                    <div class="t_hanzi" data-content="{{$chr->chr}}">{{$chr->chr_wrap ?? $chr->chr}}</div>
                </div>
                <div class="boxRight">
                    @foreach($chr->words as $word)
                        <a class="boxItem crudDelete" style="color: rgb(51,122,{{233-$word->excellent*50}})"
                           data-id_value="{{$word->word}}">
                            {{$word->word_wrap ?? $word->word}}
                        </a>
                    @endforeach
                </div>
            </div>
        @endforeach
    </div>
    <div id="myModel">

    </div>
@stop
@section('javascript')
<script>
    crud.action = 'words';
    $(document).ready(function () {
        $('.boxItem').on('click', function () {
            let wordGroup = $(this).data('id_value');
            crud.title = wordGroup;
        })

        $("body").on("click", ".t_hanzi", function () {
            var word = $(this).data('content');
            return crudBase("/"+crud.action+"/create?word="+(word||""));
        });
    })
</script>
@append

