//售卡、活动订单，页面读证按钮
if ("undefined" !== typeof nw) {
    $(".btnReadIdCard").on('click', function () {
        var FFI = require('ffi');
        var VreaderAPI = new FFI.Library(process.cwd() + '/lib/IDReaderIO.dll', {
            'OnFindRDev': ['int', ['string']],
            'OnCleanPath': ['int', ['string', 'int']]
        });
        var DevDll = null;
        var proceed = VreaderAPI.OnCleanPath(process.cwd(), 1);
        proceed = VreaderAPI.OnCleanPath(process.cwd() + '/lib', 2);

        //Device Detection
        // 信通
        if (VreaderAPI.OnFindRDev('VID_10C4&PID_8A1B') === 0) {
            DevDll = 'SenterIDCard';
        }
        // 森锐
        else if (VreaderAPI.OnFindRDev('VID_2015&PID_0008') === 0) {
            DevDll = 'SenruiIDCard';
        }
        //亿数
        else if (VreaderAPI.OnFindRDev('VID_9573&PID_4836') === 0) {
            DevDll = 'YishuIDCard';
        }
        //神思
        else if (VreaderAPI.OnFindRDev('VID_0400&PID_C35A') === 0) {
            DevDll = 'StandardDll';
        } else {
            alert('没有找到适配的身份证阅读器');
        }

        if (DevDll !== null) {
            $.getScript('/style/nw/' + DevDll + '-min.js?t=' + (new Date().getTime()), function () {
                var idCardData = cvrDll.readCard();
                if (idCardData.code === 1) {
                    var idCardId = $("#id_card_id").val();
                    if (idCardId === '') idCardId = 0;
                    idCardData.idCardId = idCardId;
                    idCardData.client_type = DevDll;

                    $.post("/order/orderPhones/" + idCardId + "/uploadIdCard", {
                            "idCardData": idCardData
                        },
                        function (data) {
                            if (data.code === 1) {
                                $("#id_card_id").val(data.idCardId);

                                var idCardDiv = $(".configIdCard");
                                $(idCardDiv).find(".name").text(idCardData.name);
                                $(idCardDiv).find(".gender").text(idCardData.gender);
                                $(idCardDiv).find(".nation").text(idCardData.nation);
                                $(idCardDiv).find(".birthday").text(idCardData.birthday);
                                $(idCardDiv).find(".address").text(idCardData.address);
                                $(idCardDiv).find(".idCode").text(idCardData.idCode);
                                $(idCardDiv).find(".dept").text(idCardData.dept);

                                $(idCardDiv).find(".validityStart").text(idCardData.validityStart.substr(0, 4) + '.' + idCardData.validityStart.substr(4, 2) + '.' + idCardData.validityStart.substr(6, 2));
                                $(idCardDiv).find(".validityEnd").text(idCardData.validityEnd.substr(0, 4) + '.' + idCardData.validityEnd.substr(4, 2) + '.' + idCardData.validityEnd.substr(6, 2));

                                $(idCardDiv).find("img").attr('src', 'data:image/png;base64,' + idCardData.zp);


                            } else {
                                alert(data.message);
                            }
                        }
                    );
                } else {
                    alert(idCardData.message);
                }
            });
        } else {
            alert('请尝试重新插拔身份证阅读器');
        }
    });
} else {
    alert('请使用创造价值客户端');
}
