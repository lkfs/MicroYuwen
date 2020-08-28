@extends('common.layout_default')

@section('content')

    <form action="/wordGroups/" method="post" class="form-horizontal" id="wordGroupsForm">
        <div class="container-fluid">
            <input type="hidden" name="_token" value="{{ csrf_token() }}">
            <input type="hidden" name="_method" value="POST">
            <div class="form-group">
               <input type="text" name="word_group" value="{{$word ?? ''}}" class="form-control" id="word_group">
            </div>
        </div>
    </form>

@stop
@section('javascript')
    <form >
    <script>
        $(document).ready(function () {
            $("#wordGroupsForm").validate({
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

