{{--操作信息--}}
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" style="overflow: hidden !important;">
    <div class="modal-dialog" role="document">
        <div class="modal-content" style="max-height: 90vh;overflow: hidden;overflow-y: auto">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">提示</h4>
            </div>
            <div class="modal-body">
                ...
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-primary">提交</button>
            </div>
        </div>
    </div>
</div>
{{--结果--}}
<div class="modal fade bs-example-modal-sm" id="showMessage" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
    <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content" style="padding: 15px">
            ...
        </div>
    </div>
</div>



@section('javascript')
<script type="text/javascript">
    $("#showBigImg").click(function () {
        $(this).addClass("hidden");
        $("body").css("overflow","auto");
    });
    function modalWidth(w,t) {
        $("#myModal .modal-dialog").css("width",w+"px");
        $("#myModal #myModalLabel").html(t);
    }

</script>
@append
