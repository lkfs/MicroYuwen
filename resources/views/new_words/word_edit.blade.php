@extends('common.layout_default')

@section('content')
    <form action="/words/" method="post" class="form-horizontal" id="wordForm">
        <div class="container-fluid">
            <input type="hidden" name="_token" value="{{ csrf_token() }}">
            <input type="hidden" name="_method" value="POST">
            <div class="form-group">
               <input type="text" name="word" value="{{$word ?? ''}}" class="form-control" id="word_group">
            </div>
        </div>
    </form>
@stop
@section('javascript')
    <form >
    <script>
        $(document).ready(function () {
            $("#wordForm").validate({
                submitHandler: function(form) {
                    $(form).ajaxSubmit({
                        success : function(data) {
                            if(data.code==1){
                                location.reload();
                            }
                            else{
                                alert(data.message);
                            }
                        }
                    });
                }
            });
        })
    </script>
    </form>
@append

