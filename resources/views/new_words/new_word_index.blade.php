@extends('common.layout_default')

@section('css')
    <style>
        .boxMain {
            display: flex;
            flex-direction: row;
        }
        .boxLeft {
            flex-direction: column ;
        }
        .boxRight {
            flex-direction: row ;
        }
    </style>

@endsection

@section('content')

    <form action="/newWords/" method="post" class="form-horizontal" id="newWordsForm">
        <div class="container-fluid">
            <input type="hidden" name="_token" value="{{ csrf_token() }}">
            <input type="hidden" name="_method" value="POST">
            <div class="form-group">
                <label for="card_type_name" class="col-xs-3 control-label">年级:</label>
                <div class="col-xs-3">
                    <select name="grade" class="form-control">
                        @foreach($grades as $gradeId=>$gradeName)
                            <option value="{{$gradeId}}" @if(isset($curGrade) && $curGrade==$gradeId) selected @endif>{{$gradeName}}</option>
                        @endforeach
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="card_type_name" class="col-xs-3 control-label">学期:</label>
                <div class="col-xs-3">
                    <label class="radio-inline">
                        <input type="radio" name="term" value="0" @if(isset($curTerm) && $curTerm==0) checked @endif> 上学期
                    </label>
                    <label class="radio-inline">
                        <input type="radio" name="term" value="1" @if(isset($curTerm) && $curTerm==1) checked @endif> 下学期
                    </label>
                </div>
            </div>
            <div class="form-group content">
                <label for="notes" class="col-xs-3 control-label">文章内容:</label>
                <div class="col-xs-9">
                    @foreach($data as $word)
                        <div class="boxMain">
                            <div class="boxLeft">

                                <p>{{$word->pinyin}}</p>
                                <p>{{$word->word}}</p>
                            </div>
                            <div class="boxRight">

                                <p>{{$word->word_groups}}</p>
                            </div>
                        </div>
                    @endforeach

                </div>
            </div>

        </div>
    </form>

@stop
@section('javascript')
<script>
    $(document).ready(function () {
    })
</script>
@append

