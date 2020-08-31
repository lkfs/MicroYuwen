@extends('common.layout_default')

@section('css')
    <style>
        .content {
            display: flex;
            flex-wrap:wrap;
            flex-direction: row;
        }
        .boxMain {
            display: flex;
            flex-direction: row;
        }
        .boxLeft {
            margin: 5px;
            display: flex;
            flex-direction: column ;
            width:350px;
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
            font-size: large;
            border: solid #ACC0D8 1px;
            text-align: center;

            display: flex;
            flex-direction: row;
        }
        .t_pinyin .py{
            width: 50px;
            line-height:30px;
            display: flex;
            flex-direction: column;
        }
        .t_pinyin .pyi{
            margin: 5px;
        }
        .t_hanzi{
            border: solid #ACC0D8 1px;
            border-top-width:0px;
            text-align: center;
            line-height:50px;
        }
    </style>

@endsection

@section('content')
    <div class="content">
        @foreach($data as $word)
            <div class="boxMain">
                <div class="boxLeft" data-id="{{$word->word_id}}">
                    <div class="t_pinyin">
                        @foreach($word->pinyin as $pinyins)
                            <div class="py">
                            @if($pinyins->count()==1)
                                <div class="pyi">
                                {{$pinyins->first()}}
                                </div>
                            @else
                                @foreach($pinyins as $py)
                                    <div class="pyi">
                                    {{$py}}
                                    </div>
                                @endforeach
                            @endif
                            </div>
                        @endforeach
                    </div>
                    <div class="t_hanzi">
                        {{$word->word}}
                        <button type="button" class="save form-control" data-id="{{$word->word_id}}" >save</button>
                    </div>
                </div>
            </div>
        @endforeach
    </div>
@stop
@section('javascript')
<script>
    crud.action = 'words';
    $(document).ready(function () {
        $('.pyi').on('click', function () {
            $(this).siblings().remove();
        })


        $('.save').on('click', function () {
            var self = this;
            var pinyin = '';
            $(this).parents('.boxLeft').find('.pyi').each(function(){
                if(pinyin) pinyin+=",";
                pinyin+=$.trim( $(this).text() );
            });
            var id = $(this).data('id');
            $.post("wordMultis/"+id,
                {
                    "_method": "PUT",
                    "pinyin": pinyin
                },
                function(data){
                    if(data.code==1){
                        $(self).fadeOut("slow",function(){
                            $(self).fadeIn("slow");
                        });
                    }
                    else{
                        alert(data.message);
                    }
                });
        })

    })
</script>
@append

