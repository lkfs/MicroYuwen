var fs = require('fs');
var path = require('path')
var request = require('request');
var unzip = require('unzip');
const rimraf = require('rimraf');

var Driver = function () { };
Driver.prototype = {
    /* 开始升级 */
    start : function(versionInfo){
        $("#modelName").text(versionInfo.modelName);
        $("#version").text(versionInfo.version);
        var self = this;
        /*var gui = require('nw.gui');
        var win = gui.Window.get();
        win.showDevTools();*/
        debugger;
        Promise.resolve(versionInfo)
            //初始化目录
            .then(function (versionInfo) {
                return new Promise(function (resolve, reject) {
                    debugger;
                    rimraf.sync(process.cwd() + '/../download');
                    rimraf.sync(process.cwd() + '/../extract');
                    fs.mkdirSync(process.cwd() + '/../download');
                    fs.mkdirSync(process.cwd() + '/../extract');
                    console.log('folder init finish.');
                    return resolve(versionInfo);
                })
            })
            //下载文件
            .then(function (versionInfo) {
                return new Promise(function (resolve, reject) {
                    debugger;
                    var zipFile = '../download/tmp.zip';
                    var t = (new Date()).getTime();
                    request.head(versionInfo.url+'?t='+t, function (err, res, body) {
                        request(versionInfo.url+'?t='+t)
                            .pipe(fs.createWriteStream(zipFile))
                            .on('close', function () {
                                var width = '60%';
                                $("#progress-bar").css("width",width).text(width);
                                console.log('download file finish.');
                                return resolve(versionInfo, zipFile);
                            });
                    });
                });
            })
            //解压
            .then(function(versionInfo, zipFile){
               return new Promise(function (resolve, reject) {
                   debugger;
                   /* 解压*/
                   var extract = unzip.Extract({
                       path: '../extract'
                   });
                   //获取根目录
                   var zipFile = '../download/tmp.zip';
                   fs.createReadStream(zipFile).pipe(extract);
                   extract.on('error', function (err) {
                       console.log('extract err. '+err);
                   });
                   extract.on('finish', function () {
                       console.log('extract file finish. ');
                   });
                   extract.on('close', function () {
                       var width = '70%';
                       $("#progress-bar").css("width",width).text(width);
                       console.log('extract file close. ');
                       resolve(versionInfo);
                   });
                   extract.on('end', function () {
                       console.log('extract end. ');});
               })
            })
            //停掉运行的cv-browser.exe
            .then(function(versionInfo){
                return new Promise(function(resolve, reject){
                    debugger;
                    if(versionInfo.target=='cv-browser' || versionInfo.target=='cv-browser-v2'){
                        const childProcess = require('child_process');
                        const bootStart = process.cwd() + '/../nwjs/';
                        const child = childProcess.exec('taskkill /im cv-browser.exe /f', function () {
                            console.log('taskkill cv-browser.exe finish');

                            const child = childProcess.exec('taskkill /im cv-chrome.exe /f', function () {
                                console.log('taskkill cv-chrome.exe finish');
                                var width = '80%';
                                $("#progress-bar").css("width",width).text(width);
                                setTimeout(function () {
                                    resolve(versionInfo);
                                },2000)
                            });
                        });
                    }
                    else{
                        resolve(versionInfo);
                    }
                });
            })
            //copy到程序安装目录
            .then(function(versionInfo){
                return new Promise(function(resolve, reject){
                    debugger;
                    self.copyFolder('../extract', '../'+versionInfo.target, function (err) {
                        debugger;
                        if(err){
                            debugger;
                            alert("文件被占用，自动升级失败，请重启电脑再试");
                            var width = '100%';
                            $("#progress-bar").css("width",width).text(width).addClass('progress-bar-danger').removeClass('active');
                        }
                        else{
                            var width = '90%';
                            $("#progress-bar").css("width",width).text(width);
                            console.log('copy folder finish');
                            resolve(versionInfo);
                        }
                    });
                });
            })
            //记录版本号，重启
            .then(function(versionInfo){
                return new Promise(function(resolve, reject){
                    debugger;
                    var localVersionFile = '../' + versionInfo.target + '/version.json';
                    fs.writeFile(localVersionFile, JSON.stringify(versionInfo), function() {
                        console.log('write local version finish');
                        try {
                            var width = '100%';
                            $("#progress-bar").css("width",width).text(width);
                            const childProcess = require('child_process');
                            const bootStart = process.cwd() + '/../nwjs/';
                            const child = childProcess.exec(bootStart+'cvloader.exe '+versionInfo.from, {'cwd':bootStart}, function () {
                                console.log('restart finish');
                                resolve(versionInfo);
                            });
                        }
                        catch (e){
                            console.log('restart error. '+e.message);
                            reject(e.message);
                        }
                    });
                });

            })
            .catch(function(mess){
                console.log('upgrade', mess);
            });
    },
    /* 得到易比较的版本号 */
    getNiceVersion:function (version) {
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
    },
    /*复制文件夹*/
    copyFolder : function(srcDir, tarDir, cb) {
        var self = this;
        if(!fs.existsSync(tarDir)){
            fs.mkdirSync(tarDir)
        }

        fs.readdir(srcDir, function(err, files) {
            var successCount = 0, errorCount = 0;
            var checkEnd = function(err) {
                if(err)
                    errorCount++;
                else
                    successCount++;

                if(errorCount + successCount == files.length){
                    debugger;
                    if(errorCount>0)
                        cb && cb('error');
                    else
                        cb && cb();
                }

            }

            if (err) {
                debugger;
                console.log('copyFolder', err);
                //checkEnd()
                return
            }

            files.forEach(function(file) {
                var srcPath = path.join(srcDir, file)
                var tarPath = path.join(tarDir, file)

                fs.stat(srcPath, function(err, stats) {
                    if (stats.isDirectory()) {
                        console.log('mkdir', tarPath)
                        if(!fs.existsSync(tarDir)){
                            fs.mkdirSync(tarDir)
                        }
                        self.copyFolder(srcPath, tarPath, checkEnd);
                    } else {
                        self.copyFile(srcPath, tarPath, checkEnd);
                    }
                })
            })

            //为空时直接回调
            files.length === 0 && cb && cb()
        })
    },
    /*复制文件*/
    copyFile : function(srcPath, tarPath, cb) {
        var rs = fs.createReadStream(srcPath)
        rs.on('error', function(err) {
            if (err) {
                //debugger;
                console.log('read error', srcPath)
            }
            cb && cb(err)
        })

        var ws = fs.createWriteStream(tarPath)
        ws.on('error', function(err) {
            if (err) {
                //debugger;
                console.log('write error', tarPath)
            }
            cb && cb(err)
        })
        ws.on('close', function(ex) {
            cb && cb(ex)
        })

        rs.pipe(ws)
    },
    /* 删除文件夹 */
    rmdirFile: function (paths, callback) {
        var self = this;
        var files = [];
        /* 递归删除文件夹*/
        if (fs.existsSync(paths)) {
            files = fs.readdirSync(paths); //同步请求
            files.forEach(function (files, index) {
                var curPath = paths + "/" + files; //遍历出每个子目录或文件
                if (fs.statSync(curPath).isDirectory()) { //recurse
                    self.rmdirFile(curPath); //递归删除
                } else {
                    fs.unlinkSync(curPath); //删除文件
                }
            });
            fs.rmdirSync(paths);
        }
        //setTimeout(function () {
            callback && callback();
        //},1)
    }
};