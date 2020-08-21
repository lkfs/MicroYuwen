var crud = new Object();
//crud.action = 'role.do';
//crud.title = '\u89d2\u8272';
//crud.width = 440;
$(document).ready(function(){
	/**
	 	html:<a class="crudAdd" data-query_str="{{ $queryStr}}" title="新增"></a>
	 */
	$("body").on("click", "a.crudAdd", function () {
		var queryStr = $(this).data('query_str');
		return crudBase("/"+crud.action+"/create?"+(queryStr||""));
	});

	/**
	 	html:<a class="crudEdit" data-id_value="{{$menu['menu_id']}}" title="编辑"></a>
	 */
	$("body").on("click", "a.crudEdit", function () {
		var idValue = $(this).data('id_value');
		return crudBase("/"+crud.action+"/"+idValue+"/edit");
	});

	/**
	 	html:<a class="crudView" data-id_value="{{$menu['menu_id']}}" title="显示"></a>
	 */
	$("body").on("click", "a.crudView", function () {
		var idValue = $(this).data('id_value');
		return crudBase("/"+crud.action+"/"+idValue);
	});

	/**
	 	html:<a class="crudDelete" data-id_value="{{$menu['menu_id']}}" data-form="#menuForm" title="删除"></a>
	 */
	$("body").on("click", "a.crudDelete", function () {
		var idValue = $(this).data('id_value');
		var form = $('<form method="post" target="_self"></form>').attr('action', "/"+crud.action+"/"+idValue);
		form.append('<input type="hidden" name="_method" value="DELETE">');
		form.append('<input type="hidden" name="_token" value="'+$('meta[name="csrf-token"]').attr('content')+'">');
		form.append('<span>确认删除该 '+crud.title+' 吗？</span>')
		form.validate({
			submitHandler: function(form) {
				$('#myModal').modal('hide');
				$("#waitingBox").removeClass("hidden");
				$(form).ajaxSubmit({
					success : function(data) {
						if(data.code==1){
							location.reload();
						}
						else{
							$("#waitingBox").addClass("hidden");
							$("#showMessage .modal-content").html(data.message);
							$('#showMessage').modal('show');
						}
					},
					error:function (XMLHttpRequest, textStatus, errorThrown) {
						$("#waitingBox").addClass("hidden");
						$("#showMessage .modal-content").html('<p class="text-danger">通讯错误，请重试</p>');
						$('#showMessage').modal('show');
					}
				});
			}
		});

		$("#myModal .modal-body").empty().append(form);
		$('#myModal').modal('show');

		return false;
	});

	// 模态框确认按钮提交
	$("body").on("click","#myModal .modal-footer .btn-primary",function () {
		$("#myModal form:first").submit();
	});
	$("body").on("click",".showBigImg",function () {
		$("#showBigImg>img").attr("src",$(this).attr("src"));
		$("#showBigImg").removeClass("hidden");
	});



});

/**
 *  crud 弹框
 */
function crudBase(url){
	$("#waitingBox").removeClass("hidden");
	modalWidth(crud.width,crud.title);
	$.get(url,
		function(data, status){
	 		var pattern = /<form [\s\S]*?<\/form>/img;
	      	if(status=="success"){
				var forms = data.match(pattern);
				if(forms)
					forms = forms.join("\n");
				else
					forms = data;

				$("#myModal .modal-body").html(forms);
				$('#myModal').modal('show');
	      	}
	      	else{
				$("#showMessage .modal-content").text("打开提示失败");
				$('#showMessage').modal('show');
	      	}
		}) .fail(function() {
			$("#showMessage .modal-content").text("打开提示失败");
			$('#showMessage').modal('show');
		}).always(function () {
			$("#waitingBox").addClass("hidden");
		});
	return false;
}
