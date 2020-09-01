<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <title>{{ config('app.name', 'Laravel') }}</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="width=device-width, initial-scale=1" name="viewport"/>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta content="lkfs@163.com" name="author"/>
    <meta content="通信 售卡 宽带 缴费 手机 配件" name="description"/>
    <link href="/style/bootstrap.css" rel="stylesheet"/>
    <link href="/style/createValue.css" rel="stylesheet"/>
    <link href="/style/publicStyle.css" rel="stylesheet"/>
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="{{ config('app.cdn_path') }}/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="{{ config('app.cdn_path') }}/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    <link href="{{ config('app.cdn_path') }}/jqueryui/1.12.1/jquery-ui.min.css" rel="stylesheet"/>
    <link href="{{ config('app.cdn_path') }}/bootstrap-treeview/1.2.0/bootstrap-treeview.min.css" rel="stylesheet">
    <link href="{{ config('app.cdn_path') }}/bootstrap-switch/3.3.4/css/bootstrap3/bootstrap-switch.min.css" rel="stylesheet">

    @section('css')

    @show
</head>
<body>

@yield('content', '没有内容')

@include("common/includeWaitingBox")
@include("common/includeModal")
<script src="{{ config('app.cdn_path') }}/jquery/1.12.4/jquery.min.js"></script>
<script src="{{ config('app.cdn_path') }}/vue/vue.min.js"></script>
<script src="{{ config('app.cdn_path') }}/jquery-validate/1.16.0/jquery.validate.min.js"></script>
<script src="{{ config('app.cdn_path') }}/jquery.form/4.2.1/jquery.form.js"></script>
<script src="{{ config('app.cdn_path') }}/jqueryui/1.12.1/jquery-ui.min.js"></script>
<script src="{{ config('app.cdn_path') }}/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="{{ config('app.cdn_path') }}/bootstrap-treeview/1.2.0/bootstrap-treeview.min.js"></script>
<script src="{{ config('app.cdn_path') }}/bootstrap-switch/3.3.4/js/bootstrap-switch.min.js"></script>
<script src="{{asset('style/jquery-validation-1.16.0/localization/messages_zh.min.js', false).'?'.time()}}"></script>
<script src="{{asset('style/public.js', false).'?'.time()}}"></script>
<script src="{{asset('style/crud.js', false).'?'.time()}}"></script>
<script src="{{ config('app.cdn_path') }}/socket.io/2.0.3/socket.io.js"></script>
<script type="text/javascript">
    var WEBSOCKET_URL = "{{env('WEBSOCKET_URL')}}";
    var APP_URL = "{{env('APP_URL')}}";
</script>

@section('javascript')

@show
</body>
</html>
