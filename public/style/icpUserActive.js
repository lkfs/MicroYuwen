if ("undefined" != typeof nw) {
    //保活相关处理
    var fs = require('fs');
    const exec = require('child_process').exec;
    $(document).ready(function(){
        //const browser_root = 'D:\\C#\\cvTools.v2\\Browser\\bin\\Debug\\';
        const browser_root = process.cwd() + '\\..\\cv-browser\\';
        //保活登录
        $("body").on("click", "a.crudLogin", function () {
            var self = $(this);
            fs.access(browser_root+'cv-browser.exe', function(err){
                if(err) {
                }
                else{
                    $(self).fadeOut("slow",function(){
                        $(this).fadeIn("slow");
                    });
                    $.get('/dict/icpUserActives/'+$(self).data('id_value')+'?t='+new Date().getTime(),
                        {
                            "order_id":$(self).data('order_id'),
                            "phone_no":$(self).data('phone_no')
                        },
                        function (data) {
                            if(data.code==1){
                                var icpUserName = 'A_'+data['icp_user_name'];
                                console.log('准备登录 to '+ icpUserName);
                                //fs.writeFileSync(browser_root + 'cv-browser.json', JSON.stringify(data), 'utf8');
                                fs.writeFileSync(browser_root + icpUserName + '.json', JSON.stringify(data), 'utf8');
                                const child = exec(browser_root+'cv-browser.exe '+icpUserName, function(error, stdout, stderr){
                                    if (error !== null) {
                                        console.log('exec error: '+error);
                                    }
                                });
                            }
                        }
                    );
                }
            });
        });


        //保活测试
        $('.btnAutoActive').on('click', function(){
            autoActive();
        });

        //自动保活
        var autoActive = function () {
            fs.access(browser_root+'cv-browser.exe', function(err){
                if(err) {
                }
                else{
                    $.get('/dict/icpUserActives/myActiveList?acitvely=1&back_active=1', function (data) {
                        console.log('保活登录,data.length = ' + data.length);

                        data.reduce(function(initPromise, currentValue, currentIndex, thisArray){
                            return initPromise.then(function () {
                                return new Promise(function(resolve, reject){
                                    var icpUserName = 'B_'+currentValue['icp_user_name'];
                                    //fs.writeFileSync(browser_root + 'cv-browser.json', JSON.stringify(currentValue), 'utf8');
                                    fs.writeFileSync(browser_root + icpUserName + '.json', JSON.stringify(currentValue), 'utf8');
                                    const child = exec(browser_root+'cv-browser.exe '+icpUserName, function(error, stdout, stderr){
                                        if (error !== null) {
                                            console.log('exec error: '+error);
                                            reject(error);
                                        }
                                        else{
                                            console.log('no.'+(currentIndex+1)+' active finish');
                                            if(currentIndex == thisArray.length-1){
                                            }
                                        }
                                    });
                                    resolve('no.'+(currentIndex+1)+' active finish');
                                });
                            });
                        }, Promise.resolve('init'));
                    }).always(function() {
                        setTimeout(function () {
                            console.log('autoActive query from 2');
                            autoActive();
                        }, 1000 * (60 * 2 + 5));
                    }) .fail(function() {
                        console.log('autoActive query error');
                    });
                }
            });
        }
        setTimeout(function () {
            console.log('autoActive query from 3');
            autoActive();
        }, 1000 * 10);
    });
}
