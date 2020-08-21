if("undefined" != typeof nw) {
    var socketLib = window.socketLib || {};
    socketLib.socket = io(WEBSOCKET_URL);

    var vscardLib = window.vscardLib || {};
    var net = require('net');

    vscardLib.HOST = '127.0.0.1';
    vscardLib.PORT = 29500;

    //socket
    vscardLib.socketClient = new net.Socket({
        readable: true,
        writable: true,
        allowHalfOpen: false
    });
    vscardLib.socketClient.closed = true;
    vscardLib.socketClient.recvBuffer = false;
    vscardLib.socketClient.on('data', function (apdu) {
        console.log("clent data: " + vscardLib.toString16(apdu));
        if (vscardLib.socketClient.recvBuffer == false)
            vscardLib.socketClient.recvBuffer = apdu;
        else
            vscardLib.socketClient.recvBuffer = Buffer.concat([vscardLib.socketClient.recvBuffer, apdu]);

        if (vscardLib.socketClient.recvBuffer.length < 4) return;

        var ctrl = vscardLib.socketClient.recvBuffer.readInt32LE(0);
        if (ctrl == 0 || ctrl == 1) {
            var apdu = vscardLib.socketClient.recvBuffer.slice(0, 4);
            socketLib.socket.emit('vscard.apdu', openerSimInfo, Array.from(apdu), function (rtnStatus, rtnData) {
                console.log('apdu = ', apdu, ', atr = ', JSON.stringify(rtnData));
                var atr = new Buffer(rtnData);
                var atrLen = new Buffer(4);
                atrLen.writeUInt32LE(atr.length, 0);
                atr = Buffer.concat([atrLen, atr]);
                vscardLib.socketClient.write(atr);
            });
            vscardLib.socketClient.recvBuffer = vscardLib.socketClient.recvBuffer.slice(4);
        }
        else{
            var apduLen = vscardLib.socketClient.recvBuffer.readInt32LE(4);
            if (vscardLib.socketClient.recvBuffer.length >= apduLen + 8) {
                var apdu = vscardLib.socketClient.recvBuffer.slice(0, 8 + apduLen);
                vscardLib.socketClient.recvBuffer = vscardLib.socketClient.recvBuffer.slice(8 + apduLen);
                console.log('apdu=', apdu, 'buffer=', vscardLib.toString16(vscardLib.socketClient.recvBuffer));
                socketLib.socket.emit('vscard.apdu', openerSimInfo, Array.from(apdu), function (rtnStatus, rtnData) {
                    console.log('apdu back, rtnStatus = ' + JSON.stringify(rtnStatus) + ', rtnData = ' + JSON.stringify(rtnData));
                    if (rtnStatus.code == 1) {
                        rtnData = new Buffer(rtnData);
                        console.log('back write = ', rtnData);
                        vscardLib.socketClient.write(rtnData);
                    }
                    else {
                        alert(rtnStatus.message);
                    }
                });
            }
        }
    });
    vscardLib.socketClient.on('error', function (exc) {
        console.log("clent error: " + exc);
        vscardLib.socketClient.destroy();
    });
    vscardLib.socketClient.on('close', function () {
        console.log('client connection closed');
        vscardLib.socketClient.destroy();
    });


    //event socket
    if (!vscardLib.socketEvent) {
        vscardLib.socketEvent = new net.Socket();
        vscardLib.socketEvent.closed = true;
        vscardLib.socketEvent.on('data', function (data) {
            console.log("event data: " + vscardLib.toString16(data));
        });
        vscardLib.socketEvent.on('error', function (exc) {
            console.log("event error: " + exc);
        });
        vscardLib.socketEvent.on('close', function () {
            console.log('event connection closed');
        });
    }
    vscardLib.insertCard = function (atr) {
        console.log('start insert card');
        if (vscardLib.socketClient.destroyed || vscardLib.socketClient.closed) {
            vscardLib.socketClient.connect(vscardLib.PORT, vscardLib.HOST, function () {
                console.log('client connected to: ' + vscardLib.HOST + ':' + vscardLib.PORT);
                vscardLib.socketClient.closed = false;
            });
        }
        setTimeout(function () {
            if (vscardLib.socketEvent.destroyed || vscardLib.socketEvent.closed) {
                vscardLib.socketEvent.connect(vscardLib.PORT + 1, vscardLib.HOST, function () {
                    console.log('event connnected to: ' + vscardLib.HOST + ':' + (vscardLib.PORT + 1));
                    vscardLib.socketEvent.closed = false;
                    vscardLib.socketEvent.write(new Buffer([0x01]), null, function () {
                        console.log('card inserted with connect')
                        $("#btnRemoveCard").removeAttr('disabled');
                        $("#btnInsertCard").attr('disabled', true);
                    });
                });
            }
            else {
                vscardLib.socketEvent.write(new Buffer([0x01]), null, function () {
                    console.log('card inserted')
                    $("#btnRemoveCard").removeAttr('disabled');
                    $("#btnInsertCard").attr('disabled', true);
                });
            }
        }, 500);
    }

    vscardLib.removeCard = function () {
        console.log('start remove card');
        if (!vscardLib.socketEvent.destroyed && !vscardLib.socketEvent.closed) {
            vscardLib.socketEvent.end(new Buffer([0x00]));
            vscardLib.socketEvent.closed = true;
            setTimeout(function () {
                vscardLib.socketClient.end();
                vscardLib.socketClient.closed = true;
                console.log('card removed');
                $("#btnRemoveCard").attr('disabled', true);
                $("#btnInsertCard").removeAttr('disabled');
            }, 500);
        }
    }

    vscardLib.clearCard = function () {
        console.log('start clear card');
            vscardLib.socketClient.end();
            vscardLib.socketClient.closed = true;
            console.log('card cleared');
    }

    vscardLib.toString16 = function (data) {
        var arr = Array.from(data);
        var rtn = new Array();
        for (var i = 0, length = arr.length; i < length; i++) {
            var str = arr[i].toString(16);
            if (str.length == 1) str = '0' + str;
            rtn.push(str);
        }
        return rtn.join(' ');
    };

    //绑定beforeunload事件
    $(window).bind('beforeunload',function(){
        console.log('离开写卡页面自动断开虚拟写卡器');
        vscardLib.removeCard();
    });
}