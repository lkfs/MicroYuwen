//            下载海报被调用函数
function DownLoadReportIMG(imgPathURL) {
    //如果隐藏IFRAME不存在，则添加
    if (!document.getElementById("IframeReportImg"))
        $('<iframe style="display:none;" id="IframeReportImg" name="IframeReportImg" onload="DoSaveAsIMG();" width="0" height="0" src="about:blank"></iframe>').appendTo("body");
    if (document.all.IframeReportImg.src != imgPathURL) {
        //加载图片
        document.all.IframeReportImg.src = imgPathURL;
    }
    else {
        //图片直接另存为
        DoSaveAsIMG();
    }
}
function DoSaveAsIMG() {
    if (document.all.IframeReportImg.src != "about:blank")
        window.frames["IframeReportImg"].document.execCommand("SaveAs");
}
//判断是否为ie浏览器
function browserIsIe() {
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
    else
        return false;
}
function download(src) {
    var $a = $("<a></a>").attr("href", src).attr("download", "img.png");
    $a[0].click();
}