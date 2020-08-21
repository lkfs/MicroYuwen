if("undefined" != typeof nw) {
    var pcscLib = window.pcscLib || {};
    pcscLib.pcsc = require('pcsclite')();
    pcscLib.myReader = null;
    pcscLib.myProtocol = null;
    pcscLib.myAtr = null;
    pcscLib.myReaderOnline = false;

    /* 读卡 */
    pcscLib.readCard = function (resolveTop, rejectTop) {
        if (!pcscLib.myReaderOnline) {
            alert('没有插卡');
            return false;
        }

        var simInfo = new Object();
        Promise.resolve("foo")
            //重新连接
            .then(function (str) {
                return new Promise(function (resolve, reject) {
                    pcscLib.myReader.disconnect(pcscLib.myReader.SCARD_RESET_CARD, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Disconnected');
                            resolve(str);
                        }
                    });
                })
            })
            .then(function (str) {
                return new Promise(function (resolve, reject) {
                    pcscLib.myReader.connect({share_mode: pcscLib.myReader.SCARD_SHARE_SHARED}, function (err, protocol) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Protocol(', pcscLib.myReader.name, '):', protocol);
                            resolve(str);
                        }
                    });
                })
            })
            //读取iccid
            .then(function (str) {
                return new Promise(function (resolve, reject) {
                    pcscLib.myReader.transmit(new Buffer([0xA0, 0xA4, 0x00, 0x00, 0x02, 0x3f, 0x00]), 40, pcscLib.myProtocol, function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("iccid1", pcscLib.toString16(data));
                            resolve(str);
                        }
                    });
                    return;

                })
            })
            .then(function (str) {
                return new Promise(function (resolve, reject) {
                    pcscLib.myReader.transmit(new Buffer([0xA0, 0xA4, 0x00, 0x00, 0x02, 0x2f, 0xe2]), 40, pcscLib.myProtocol, function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("iccid2", pcscLib.toString16(data));
                            resolve(str);
                        }
                    });
                })
            })
            .then(function (str) {
                return new Promise(function (resolve, reject) {
                    pcscLib.myReader.transmit(new Buffer([0xA0, 0xB0, 0x00, 0x00, 0x0A]), 40, pcscLib.myProtocol, function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("iccid3", pcscLib.toString16(data));
                            simInfo.iccid = pcscLib.toString16(data).replace(/\s/g, '');
                            resolve(str);
                        }
                    });
                });
            })
            //读取imsi
            .then(function (str) {
                return new Promise(function (resolve, reject) {
                    pcscLib.myReader.transmit(new Buffer([0xA0, 0xA4, 0x00, 0x00, 0x02, 0x3f, 0x00]), 40, pcscLib.myProtocol, function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            resolve(str);
                        }
                    });
                })
            })
            .then(function (str) {
                return new Promise(function (resolve, reject) {
                    pcscLib.myReader.transmit(new Buffer([0xA0, 0xA4, 0x00, 0x00, 0x02, 0x7f, 0x20]), 40, pcscLib.myProtocol, function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            resolve(str);
                        }
                    });
                })
            })
            .then(function (str) {
                return new Promise(function (resolve, reject) {
                    pcscLib.myReader.transmit(new Buffer([0xA0, 0xA4, 0x00, 0x00, 0x02, 0x6f, 0x07]), 40, pcscLib.myProtocol, function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            resolve(str);
                        }
                    });
                })
            })
            .then(function (str) {
                return new Promise(function (resolve, reject) {
                    pcscLib.myReader.transmit(new Buffer([0xA0, 0xB0, 0x00, 0x00, 0x09]), 40, pcscLib.myProtocol, function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            simInfo.imsi = pcscLib.toString16(data).replace(/\s/g, '');
                            resolve(str);
                        }
                    });
                });
            })
            //读取serialNo
            .then(function (str) {
                return new Promise(function (resolve, reject) {
                    pcscLib.myReader.transmit(new Buffer([0xA0, 0xA4, 0x00, 0x00, 0x02, 0x3f, 0x00]), 40, pcscLib.myProtocol, function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            resolve(str);
                        }
                    });
                })
            })
            .then(function (str) {
                return new Promise(function (resolve, reject) {
                    pcscLib.myReader.transmit(new Buffer([0xA0, 0xA4, 0x00, 0x00, 0x02, 0x2f, 0x02]), 40, pcscLib.myProtocol, function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            resolve(str);
                        }
                    });
                })
            })
            .then(function (str) {
                return new Promise(function (resolve, reject) {
                    pcscLib.myReader.transmit(new Buffer([0xA0, 0xB0, 0x00, 0x00, 0x0A]), 40, pcscLib.myProtocol, function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            var result = Array.from(data);
                            console.log('read serialNo by 0x0A, ' + result);
                            if(result.length ==2 && result[0] == 103 && result[1]==0){
                                resolve('not found'); //读取失败
                            }
                            else{
                                simInfo.serialNo = pcscLib.toString16Right(data).replace(/\s/g, '');
                                console.log(simInfo.serialNo);
                                resolve('success'); //读取成功
                            }
                        }
                    });
                });
            })
            .then(function (str) {
                return new Promise(function (resolve, reject) {
                    if(str=='success'){
                        resolve(str);
                    }
                    else{
                        pcscLib.myReader.transmit(new Buffer([0xA0, 0xB0, 0x00, 0x00, 0x09]), 40, pcscLib.myProtocol, function (err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                var result = Array.from(data);
                                console.log('read serialNo by 0x09, ' + result);
                                if(result.length ==2 && result[0] == 103 && result[1]==0){
                                    resolve('not found'); //读取失败
                                }
                                else{
                                    simInfo.serialNo = pcscLib.toString16Right(data).replace(/\s/g, '');
                                    console.log(simInfo.serialNo);
                                    resolve('success'); //读取成功
                                }
                            }
                        });
                    }
                });
            })
            .then(function (str) {
                return new Promise(function (resolve, reject) {
                    if(str=='success'){
                        resolve(str);
                    }
                    else{
                        pcscLib.myReader.transmit(new Buffer([0xA0, 0xB0, 0x00, 0x00, 0x08]), 40, pcscLib.myProtocol, function (err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                var result = Array.from(data);
                                console.log('read serialNo by 0x08, ' + result);
                                if(result.length ==2 && result[0] == 103 && result[1]==0){
                                    resolve('not found'); //读取失败
                                }
                                else{
                                    simInfo.serialNo = pcscLib.toString16Right(data).replace(/\s/g, '');
                                    console.log(simInfo.serialNo);
                                    resolve('success'); //读取成功
                                }
                            }
                        });
                    }
                });
            })
            //返回结果
            .then(function (str) {
                //alert(JSON.stringify(simInfo));
                simInfo.atr = Array.from(pcscLib.myAtr);
                resolveTop(simInfo);
            });
    }

    /* 执行apdu指令 */
    pcscLib.doApdu = function (resolveTop, rejectTop, apdu) {
        if (!pcscLib.myReaderOnline) {
            alert('没有插卡');
            return false;
        }
        apdu = new Buffer(apdu);

        var ctrl = apdu.readInt32LE(0);
        console.log("准备执行apdu指令，", pcscLib.toString16(apdu), "，控制码：", ctrl);
        if (ctrl == 0) {
            pcscLib.myReader.disconnect(pcscLib.myReader.SCARD_RESET_CARD, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Disconnected');
                    resolveTop(Array.from(pcscLib.myAtr));
                }
            });
        }
        else if(ctrl==1){
            pcscLib.myReader.connect({share_mode: pcscLib.myReader.SCARD_SHARE_SHARED}, function (err, protocol) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Protocol(', pcscLib.myReader.name, '):', protocol);
                    resolveTop(Array.from(pcscLib.myAtr));
                }
            });
        }
        else {
            var apduLen = apdu.readInt32LE(4);
            apdu = apdu.slice(8);
            console.log("apdu = ", apdu, ", length = ", apduLen);
            pcscLib.myReader.transmit(apdu, 512, pcscLib.myProtocol, function (err, data) {
                if (err) {
                    console.log('指令执行错误', err);
                } else {
                    console.log("执行apdu指令：", pcscLib.toString16(apdu), "，结果：", pcscLib.toString16(data));
                    var rtnData = new Buffer(4);
                    rtnData.writeInt32LE(data.length, 0);
                    rtnData = Buffer.concat([rtnData, data]);
                    console.log("返回结果：", pcscLib.toString16(rtnData));
                    resolveTop(Array.from(rtnData));
                }
            });
        }
    }

    pcscLib.toString16 = function (data) {
        var arr = Array.from(data);
        var rtn = new Array();
        for (var i = 0, length = arr.length; i < length; i++) {
            rtn.push(pcscLib.highToLow(arr[i].toString(16)));
        }
        return rtn.join(' ');
    };

    pcscLib.toString16Right = function (data) {
        var arr = Array.from(data);
        var rtn = new Array();
        for (var i = 0, length = arr.length; i < length; i++) {
            if(arr[i]<10)
                rtn.push('0'+arr[i].toString(16));
            else
                rtn.push(arr[i].toString(16));
        }
        return rtn.join(' ').toUpperCase();
    };

    pcscLib.highToLow = function (str) {
        if (str.length == 1) {
            return  str + '0';
        }
        else if (str.length == 2) {
            var rtn = str.substr(1, 1) + str.substr(0, 1)
            return rtn;
        }
        else
            return str;
    };

    /* pcsc监听 */
    pcscLib.pcsc.on('reader', function (reader) {
        console.log('New reader detected', reader.name);
        pcscLib.myReader = reader;

        reader.on('error', function (err) {
            console.log('Error(', this.name, '):', err.message);
        });

        reader.on('status', function (status) {
            console.log('Status:', JSON.stringify(status));
            pcscLib.myAtr = status.atr;
            /* check what has changed */
            var changes = this.state ^ status.state;
            if (changes) {
                if ((changes & this.SCARD_STATE_EMPTY) && (status.state & this.SCARD_STATE_EMPTY)) {
                    console.log("card removed");
                    /* card removed */
                    reader.disconnect(reader.SCARD_RESET_CARD, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Disconnected');
                            pcscLib.myReaderOnline = false;
                        }
                    });
                } else if ((changes & this.SCARD_STATE_PRESENT) && (status.state & this.SCARD_STATE_PRESENT)) {
                    console.log("card inserted");
                    /* card inserted */
                    reader.connect({share_mode: this.SCARD_SHARE_SHARED}, function (err, protocol) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Protocol(', reader.name, '):', protocol);
                            pcscLib.myReaderOnline = true;
                            pcscLib.myProtocol = protocol;
                        }
                    });
                }
            }
        });

        reader.on('end', function () {
            console.log('Reader', this.name, 'removed');
        });
    });

    pcscLib.pcsc.on('error', function (err) {
        console.log('PCSC error', err.message);
    });

    var socketLib = window.socketLib || {};
    socketLib.socket = io(WEBSOCKET_URL);

    /* 校验socket */
    socketLib.simRegister = function () {
        new Promise(function(resolveTop, rejectTop) {
            pcscLib.readCard(resolveTop, rejectTop);
        }).then(
            function (simInfo) {
                if(simInfo.iccid.length>19){
                    simInfo.iccid = simInfo.iccid.substr(0,19);
                }
                /*if(simInfo.serialNo.length>16){
                    simInfo.serialNo = simInfo.serialNo.substr(0,16);
                }*/
                console.log('read card data : ', JSON.stringify(simInfo));

                $.get('/order/orderPhones/readIccid', {"simInfo":simInfo, "orderId":$("#order_id").val()}, function (data) {
                    if(data.code==1) {
                        console.log('check card data : ', JSON.stringify(data));
                        agencySimInfo.order_id = data.order_id;
                        agencySimInfo.icp_id = data.icp_id;
                        agencySimInfo.sim_id = data.sim_id;
                        agencySimInfo.sim_no = data.sim_no;
                        //socket注册
                        socketLib.socket.emit('vscard.register', data, function (rtn) {
                            console.log(JSON.stringify(rtn));
                            $(".simMessage").text('订单已提交，等待后台处理，请稍候……');
                        });
                    }
                    else {
                        $(".simMessage").text(data.message);
                    }
                })
            },
            function (reason) {
                alert(reason);
            }
        );
    };

    socketLib.check = function (openerInfo, fn) {
        new Promise(function (resolveTop, rejectTop) {
            pcscLib.readCard(resolveTop, rejectTop);
        }).then(
            function (simInfo) {
                if (simInfo.iccid.length > 19) {
                    simInfo.iccid = simInfo.iccid.substr(0, 19);
                }
                /*if (simInfo.serialNo.length > 16) {
                    simInfo.serialNo = simInfo.serialNo.substr(0, 16);
                }*/
                console.log('read card data : ', JSON.stringify(simInfo));

                $.get('/order/orderPhones/readIccid', {
                    "simInfo": simInfo,
                    "orderId": $("#order_id").val()
                }, function (agencySimInfo) {
                    if (agencySimInfo.code == 1) {
                        if (agencySimInfo.sim_no == openerInfo.sim_no) {
                            console.log('校验成功');
                            agencySimInfo.code = 1;
                            fn(agencySimInfo);
                            $(".simMessage").text('正在开通中，随时准备写卡，请勿断开网络或插拔SIM卡！！！');
                        }
                        else {
                            console.log('插卡错误');
                            agencySimInfo.code = -1;
                            agencySimInfo.message = '插卡错误';
                            fn(agencySimInfo);
                        }
                    }
                    else {
                        var html = $(".simReload.hidden").clone();
                        $(html).removeClass('hidden');
                        $(html).find('.message').text(agencySimInfo.message);
                        $(html).find('.sim_no').text(agencySimInfo.sim_no);

                        $("#myModal .modal-body").html(html);
                        $('#myModal').modal('show');
                    }
                })
            },
            function (reason) {
                alert(reason);
            }
        );
    };

    socketLib.socket.on('check', function (openerInfo, fn) {
        if ("undefined" != typeof nw) {
            socketLib.check(openerInfo, fn);
        }
        else {
            alert('请在创造价值客户端中进行读写卡操作。')
        }
    });

    socketLib.socket.on('finish', function (fn) {
        if ("undefined" != typeof nw) {
            $(".simMessage").text('写卡完成');
            pcscLib.myReader.disconnect(pcscLib.myReader.SCARD_RESET_CARD, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Disconnected');
                    fn({"code":1})
                }
            });
        }
        else {
            alert('请在创造价值客户端中进行读写卡操作。')
        }
    });

    /* apdu socket */
    socketLib.socket.on('apdu', function (openerInfo, apdu, fn) {
        if ("undefined" != typeof nw) {
            new Promise(function (resolveTop, rejectTop) {
                pcscLib.doApdu(resolveTop, rejectTop, apdu);
            }).then(
                function (data) {
                    console.log('write card back data : ', data);
                    agencySimInfo.code = 1;
                    fn(agencySimInfo, data);
                },
                function (reason) {
                    alert(reason);
                }
            );
        }
        else {
            alert('请在创造价值客户端中进行读写卡操作。')
        }
    });
}