if (WEBSOCKET_URL != undefined && WEBSOCKET_URL != "") {
    var socket = io(WEBSOCKET_URL);
}

$(document).ready(function () {
    //页面加载完自动注册websocket
    var user_id = $(".node_user_id").val();
    if (user_id == '') return;
    if (socket == undefined || socket == "") return;

    socket.on('connect', function () {
        socket.emit('login', user_id, function (rtn) {
            console.log('socket id = ' + socket.id + ', login = ' + JSON.stringify(rtn));
        });
    });
    //监听服务器发送的消息
    socket.on('sendMessage', function (message, fn) {
        $("#noticeMessage .list-group").prepend('<li class="list-group-item">' + message + '</li>');
        $("#noticeMessage").removeClass("hidden");
        fn({"code": 1, "message": message});

    });
    //监听保活
    if ("undefined" != typeof nw) {
        console.log('start listen icpUserActive');
        socket.on('icpUserActive', function (active_id, callback) {
            console.log('websocket icpUserActive active_id = ' + active_id);

            const fs = require('fs');
            const exec = require('child_process').exec;
            const browser_root = process.cwd() + '\\..\\cv-browser\\';
            fs.access(browser_root + 'cv-browser.exe', function (err) {
                if (err) {
                } else {
                    $.get('/dict/icpUserActiveV2s/' + active_id + '?t=' + new Date().getTime(),
                        {"load_position": 2},
                        function (data) {
                            if (data.code == 1) {
                                var icpUserName = 'B_' + data['icp_user_name'];
                                console.log('准备登录 to ' + icpUserName);
                                var exe_name = 'cv-browser.exe';
                                var ie_version = data['ie_version']
                                if (ie_version == 'chrome') {
                                    exe_name = 'cv-chrome.exe';
                                }
                                fs.writeFileSync(browser_root + icpUserName + '.json', JSON.stringify(data), 'utf8');
                                const child = exec(browser_root + exe_name + ' ' + icpUserName + ' ' + ie_version, function (error, stdout, stderr) {
                                    if (error !== null) {
                                        console.log('exec error: ' + error);
                                    }
                                });
                            }
                        }
                    );
                }
            });
            callback({"code": 1, "message": 'success'});
        });
    }
    //全局通知
    var shop_id = $(".node_shop_id").val();
    socket.on('MessageNotification_' + shop_id, function (data) {
        console.log(data);
        if (data.code == 1) {
            $("#noticeMessage .list-group").prepend('<li class="list-group-item">' + data.message + '</li>');
            $("#noticeMessage").removeClass("hidden");
        }
    });

});

