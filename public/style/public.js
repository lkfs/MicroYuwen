function logout() {
	var form = $('<form></form>');
	form.attr('action', "/auth/logout");
	form.attr('method', 'post');
	form.attr('target', '_self');
	form.append($("form:first").find("input[name='_token']"))
	$("body").append(form);
	form.submit();
	return false;
}

function lunxun() {
    $.ajax({
        url: '/card/excel/poll',
        type: 'get',
        success: function(data){
            if (data.code==1)
            {
                $("#waitingBox").addClass("hidden");
                window.open(data.message);
            }
            else
            {
                $("#waitingBox").removeClass("hidden");
                setInterval(lunxun(),20*1000);//轮询执行，500ms一次
            }
        }
    });
}


/* 得到易比较的版本号 */
var getNiceVersion = function (version) {
    var vers = version.split('.');
    for(var i=0, len=vers.length; i<len; i++){
        switch(vers[i].length){
            case 1:
                vers[i] = '00' + vers[i]; break;
            case 2:
                vers[i] = '0' + vers[i]; break;
        }
    }
    return vers.join('.');
};
function upgrade(from) {
    var fs = require('fs');
    debugger;
    $.getJSON(APP_URL+"/upgrade.json?t="+(new Date().getTime()), function (data) {
        /* var gui = require('nw.gui');
         var win = gui.Window.get();
         win.showDevTools();*/
        debugger;

        for ( var key in data ){
            if (!fs.existsSync('../' + key )) {
                continue;
            }

            var localVersion = '';
            try{
                var versionJson = fs.readFileSync('../' + key + '/version.json');
                localVersion = JSON.parse(versionJson).version;
            }
            catch (e){
                fs.writeFileSync('../' + key + '/version.json', '{"version":"0.0.1"}');
                localVersion = "0.0.1";
            }
            localVersion = getNiceVersion(localVersion);

            var remoteVersion = "0.0.1";
            try{ remoteVersion = data[key].versions[0].version; } catch(e){}
            remoteVersion = getNiceVersion(remoteVersion);

            if(remoteVersion>localVersion){
                var packageJson = fs.readFileSync('../update/package.json');
                packageJson = JSON.parse(packageJson);
                if(from==undefined)
                    from = 'cv-client';

                packageJson['main'] = APP_URL+'/app/upgrade?target=' + key + '&from='+from;
                packageJson['node-remote'] = '<all_urls>';
                fs.writeFile('../update/package.json', JSON.stringify(packageJson), function (err) {
                    try {
                        const childProcess = require('child_process');
                        const bootStart = process.cwd() + '/../nwjs/';
                        const child = childProcess.exec(bootStart+'cvupdate.exe', {'cwd':bootStart});
                    }
                    catch (e){
                        alert(e.message);
                    }
                });
            }
        }
    });
}


/*根据出生日期算出年龄*/
function jsGetAge(strBirthday){
	var returnAge;
	var strBirthdayArr=strBirthday.split("-");
	var birthYear = strBirthdayArr[0];
	var birthMonth = strBirthdayArr[1];
	var birthDay = strBirthdayArr[2];
	d = new Date();
	var nowYear = d.getFullYear();
	var nowMonth = d.getMonth() + 1;
	var nowDay = d.getDate();
	if(nowYear == birthYear){
		returnAge = 0;//同年 则为0岁
	}
	else{
		var ageDiff = nowYear - birthYear ; //年之差
		if(ageDiff > 0){
			if(nowMonth == birthMonth) {
				var dayDiff = nowDay - birthDay;//日之差
				if(dayDiff < 0)
				{
					returnAge = ageDiff - 1;
				}
				else
				{
					returnAge = ageDiff ;
				}
			}
			else
			{
				var monthDiff = nowMonth - birthMonth;//月之差
				if(monthDiff < 0)
				{
					returnAge = ageDiff - 1;
				}
				else
				{
					returnAge = ageDiff ;
				}
			}
		}
		else
		{
			returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
		}
	}
	return returnAge;//返回周岁年龄
}
$(document).ready(function(){
	/*提示框Start*/
	var dialog = $('<div id="dialog"></div>').appendTo("body");
	dialog.dialog({
		autoOpen: false,
		modal: true,
		title: "提示",
		maxWidth: 600,
		minWidth: 100,
		buttons: { "Ok": function(){ $( this ).dialog( "close" ); } }
	});
	/*提示框End*/

	/*CSRF*/
	$.ajaxSetup({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});

	/**
	 * 定义并初始化级联标签
	 html:
	 <select name="province_id" class="form-control dynSelect" id="province_id"  title="省份"
	 		data-value="{{$qo['province_id']}}" data-table="regions"
	 		data-filter_to="city_id" data-filter_to_field="parent_id" data-filter_param='{"region_id":"210000", "region_level":"1"}'>
	 	<option value="">全部省份</option>
	 </select>
	 <select name="city_id" class="form-control dynSelect" id="city_id"  title="城市"
	 		data-value="{{$qo['city_id']}}" data-table="regions">
	 	<option value="">全部城市</option>
	 </select>
	 javascript:
	 $("#province_id").trigger("init");
	 */
	$("body").on("init", "select.dynSelect", selectInit).on("change", "select.dynSelect", selectChange);

	//分页标签之每页数量
    $(".paginate_perPage")
        .trigger("init")
        .on('change', function () {
            var formId = $(this).data('target_form_id');
            if(formId)
                formId = $(formId);
            else
                formId = $(this).parents('form') || $('form:first');

            var fieldName = $(this).data('form_field_name');
            $(formId)
                .append( $('<input type="hidden" name="'+fieldName+'" value="'+$(this).val()+'">') )
				.submit();
        });
});

var selectInit = function () {
	var self = this;
    $(self).find(".dyn").remove();
	var originalValue = ( ""+$(self).data("value") ).split(",");
	var table = $(self).data("table");
	if(table){
		//$(self).prop("disabled", true);
		var url = "/dataCache/"+table;
		var filterParam = $(self).data('filter_param');
		var allCol = (filterParam && filterParam.hasOwnProperty('allCol'))?filterParam['allCol']:0;
		$.get(url,{
				where : filterParam
			}, function(data, status){
				//$(self).find(".dyn").remove();
				if(allCol==1){
                    for(var k in data) {
                        $(self).append("<option class='dyn' value='"+data[k]['id']+"' data-json='"+JSON.stringify(data[k])+"'>"+data[k]['name']+"</option>");
                    }
				}
				else{
                    for(var k in data) {
                        $(self).append("<option class='dyn' value='"+k+"'>"+data[k]+"</option>");
                    }
				}

				if(originalValue.length>0){
					for(var i=0;i<originalValue.length;i++)
						$(self).find("option[value='"+originalValue[i]+"']").prop("selected","selected");
				}
				multiselect(self);
				//var filterTo = $(self).data('filter_to');
				//if(filterTo) {
					$(self).trigger("change");
				//}
			}) .always(function() {
				//$(self).prop("disabled", false);
			}) .fail(function() {
				$(self).append("<option class='dyn' value='' selected>数据加载失败，请重试</option>");
			});
	}
	else {
		//已有数据源，选中先前的值
		if(originalValue.length>0){
			for(var i=0;i<originalValue.length;i++)
				$(self).find("option[value='"+originalValue[i]+"']").prop("selected","selected");
		}
		multiselect(self);
		var filterTo = $(this).data('filter_to');
		if(filterTo) {
			$(self).trigger("change");
		}
	}
};

var selectChange = function () {
	var filterTo = $(this).data('filter_to');
	if(filterTo){
		var filterParam = new Object();
		var filterToField = $(this).data('filter_to_field')
		filterParam[filterToField] = $(this).val();

		filterTo = filterTo.split(",");
		for(var i=0;i<filterTo.length;i++){
			var curFilterParam = $("#"+filterTo[i]).data('filter_param');
			curFilterParam = $.extend(curFilterParam, filterParam);
			$("#"+filterTo[i]).data('filter_param', curFilterParam);
			$("#"+filterTo[i]).trigger("init");
		}
	}
};

//构建多选下拉框
function multiselect(self){
	if($(self).data('options')){
		try{
			$(self).multiselect($(self).data('options'));
			$(self).multiselect('rebuild');
		}catch(e){ alert(e)}
	}
	else if($(self).prop('multiple') || $(self).attr("data-multiple")=='multiple'){
		try{
			$(self).multiselect({
				maxHeight: 200,
				includeSelectAllOption: true,
				selectAllText: '<全选>',
				buttonText: function(options, select) {
					if (options.length === 0) {
						return '全部'+$(self).attr('title');
					}
					else if (options.length > 3) {
						return '已选' + options.length + '个'+$(self).attr('title');
					}
					else {
						var labels = [];
						options.each(function() {
							if ($(this).attr('label') !== undefined) {
								labels.push($(this).attr('label'));
							}
							else {
								labels.push($(this).html());
							}
						});
						return labels.join(', ') + '';
					}
				}
			});
			$(self).multiselect('rebuild');
		}catch(e){ alert(e)}
	}
}



function getBase64(t,f) {
	var file = t.files[0];
	var that = t;
	if (!/\/(?:jpeg|png|gif)/i.test(file.type)) return;
	var reader = new FileReader();
	reader.onload = function () {
		var result = this.result;
		f(t,result);
	};
	reader.readAsDataURL(file);
}

//requestAnimationFrame ie9-以下的兼容（加入购物车动画）
var isParabolaMove = false;
var lastTime = 0;
var vendors = ['webkit', 'moz'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
	window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // name has changed in Webkit
		window[vendors[x] + 'CancelRequestAnimationFrame'];
}
if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = function(callback, element) {
		var currTime = new Date().getTime();
		var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
		var id = window.setTimeout(function() {
			callback(currTime + timeToCall);
		}, timeToCall);
		lastTime = currTime + timeToCall;
		return id;
	};
}
if (!window.cancelAnimationFrame) {
	window.cancelAnimationFrame = function(id) {
		clearTimeout(id);
	};
}

function funParabolaCallback(targetElement,counts) {
	targetElement.addClass("spanScale");
	$(".glyphicon-shopping-cart .badge").html(counts);
	var setTime = setTimeout(function () {
		targetElement.removeClass("spanScale");
		clearTimeout(setTime);
	}, 1000);
}
//动画函数
var funParabola = function(moveElement,targetElement,time,changeClassName,counts){
	isParabolaMove = true;
	var x1 = parseInt(moveElement[0].getBoundingClientRect().left);
	var x2 = parseInt(targetElement[0].getBoundingClientRect().left);
	var y1 = parseInt(moveElement[0].getBoundingClientRect().top);
	var y2 = parseInt(targetElement[0].getBoundingClientRect().top);
	var x = x1,y;
	var intervalCount = (x2-x1)/time*16.7;      //16.7：是屏幕每16.7ms刷新一次
	var callBack = function(){
		isParabolaMove = false;
		// alert("已添加");
		funParabolaCallback(targetElement,counts);
	}
	var a = ((Math.sqrt(x2)-Math.sqrt(x1))/(y2-y1))*((Math.sqrt(x2)-Math.sqrt(x1))/(y2-y1));
	var b = Math.sqrt(x1/a)-y1;
	var step = function(){
		y=Math.sqrt(x/a)-b;                           //抛物线公式x=a(y+b)*(y+b),开口向右的抛物线
		moveElement.css({
			"left":x,
			"top":y1-(y-y1)-50
		});
		if(x>=x2){
			moveElement.hide();
			window.cancelAnimationFrame(step);
			return callBack();
		}
		else{
			x+=intervalCount;
			window.requestAnimationFrame(step);         //屏幕刷新一次调用一次
		}
	}
	moveElement.addClass(changeClassName);
	step();
}