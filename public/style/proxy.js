
$(document).ready(function(){
    const fs = require('fs');
    const cp = require('child_process');
    const iconv = require('iconv-lite');

    const browser_root = process.cwd() + '\\..\\cv-browser\\';
    //const browser_root = 'D:\\C#\\ProxyConfig\\ProxyConfig\\bin\\Debug\\';

    if("undefined" != typeof nw) {
        //当前的代理服务器
        {
            var child = cp.exec(browser_root + 'cv-proxy.exe get', {encoding: 'buffer'}, function (error, stdout, stderr) {
                if (error !== null) {
                    var error = iconv.decode(error, 'cp936')
                    console.log('exec error: ' + error);
                }
                //debugger;
                var stdout = iconv.decode(stdout, 'cp936')
                data = JSON.parse(stdout);
                if (data.code == 1) {
                    var proxyJson = fs.readFileSync(browser_root + 'cv-proxy.json', 'utf8');
                    proxyJson = JSON.parse(proxyJson);
                    var proxy_id = proxyJson[data.proxy]
                    setTimeout(function () {
                        $('#proxy_id').find("option[value='" + proxy_id + "']").prop("selected", "selected");
                    }, 200);
                }
                else {
                    console.log('router_id = error');
                }
            });
        }
        //连接到代理服务器
        $('#btnProxyConnect').on('click', function () {
            var proxy_id = $('#proxy_id').val();
            if(confirm('切换〖路由节点〗将强制关闭所有运营商窗口，是否继续？')){
                if (proxy_id == '') {
                    var child = cp.exec(browser_root + 'cv-proxy.exe', {encoding: 'buffer'}, function (error, stdout, stderr) {
                        if (error !== null) {
                            var error = iconv.decode(error, 'cp936')
                            console.log('exec error: ' + error);
                        }
                        var stdout = iconv.decode(stdout, 'cp936')
                        data = JSON.parse(stdout);
                        if (data.code == 1) {
                            fs.writeFileSync(browser_root + 'cv-proxy.json', '{}', 'utf8');
                            //alert(data.message);
                            window.location.reload(true);
                        }
                        else {
                            alert(stdout);
                        }
                    });
                }
                else {
                    $.get('/dict/routers/' + proxy_id + '/connect?t=' + (new Date().getTime()), function (data) {
                        if (data.code == 1) {
                            debugger;
                            if(data.proxy){
                                const child = cp.exec(browser_root + 'cv-proxy.exe ' + data.proxy + ' ' + data.nginxPort, {encoding: 'buffer'}, function (error, stdout, stderr) {
                                    if (error !== null) {
                                        console.log('exec error: ' + error);
                                    }
                                    var stdout = iconv.decode(stdout, 'cp936')
                                    var outData = JSON.parse(stdout);
                                    if (outData.code == 1) {
                                        var local = new Object();
                                        local[data.message] = $('#proxy_id').val();
                                        fs.writeFileSync(browser_root + 'cv-proxy.json', JSON.stringify(local), 'utf8');
                                        //alert(outData.message);
                                        debugger;
                                        window.location.reload(true);
                                    }
                                    else {
                                        alert(JSON.stringify(outData));
                                        window.location.reload(true);
                                    }
                                });
                            }
                            else{
                                alert('代理服务器无法连接');
                                window.location.reload(true);
                            }
                        }
                        else {
                            alert(data.message);
                        }
                    });
                }
            }
            else{
                window.location.reload(true);
            }
        })
    }
});