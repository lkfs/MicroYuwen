@extends('common.layout_default')

@section('css')
    <style>
        .toolbar {
            display: flex;
            flex-wrap:wrap;
            flex-direction: row;
            justify-content:center
        }
        .content {
            display: flex;
            flex-wrap:wrap;
            flex-direction: row;
        }
        .charMain {
            //width: 310px;
            display: flex;
            flex-direction: row;
        }
        .charMain .charLeft {
            margin: 5px;
            display: flex;
            flex-direction: column ;
            //width:50px;
            //height:80px;
        }
        .charMain .charLeft .charPinyin{
            width: 50px;
            height: 30px;
            border: solid #ACC0D8 1px;
            text-align: center;
            line-height:30px;
        }
        .charMain .charLeft .charHanzi{
            width: 50px;
            height: 50px;
            border: solid #ACC0D8 1px;
            border-top-width:0px;
            text-align: center;
            line-height:50px;
        }
        .charMain .charRight {
            max-width: 250px;
            margin: 5px;
            display: flex;
            flex-direction: row ;
            flex-wrap: wrap;
        }
        .charMain .charRight .wordItem {
            margin: 3px 5px;
        }
    </style>

@endsection

@section('content')

    <form action="/chars/" method="get" class="form-inline">
        <div class="toobar">
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
            </div>
        </div>
    </form>

    <div class="content">
        @foreach($data as $chr)
            <div class="charMain">
                <div class="charLeft">
                    <div class="charPinyin">{{$chr->pinyin}}</div>
                    <div class="charHanzi" data-content="{{$chr->chr}}">{{$chr->chr_wrap ?? $chr->chr}}</div>
                </div>
                <div class="charRight">
                    @foreach($chr->words as $word)
                        <a class="wordItem crudDelete" style="color: rgb(51,122,{{$word->grade>=9?255:(233-$word->excellent*50)}})"
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

        $("body").on("click", ".charHanzi", function () {
            var word = $(this).data('content');
            return crudBase("/"+crud.action+"/create?word="+(word||""));
        });
    })
</script>
@append

