if ("undefined" !== typeof nw) {
//身份证信息写入虚拟身份证阅读器
	if (idCardPicBytes !== 'undefined' && idCardPicBytes !== null) {
		console.log('IDReaderIO will be load.');
		var FFI = require('ffi');
		var ArrayType = require('ref-array');

		var VreaderAPI = new FFI.Library(process.cwd() + '/lib/IDReaderIO.dll', {
			'OnFindRDev': ['int', ['string']],
			'OnLinkDev': ['int', []],
			'OnRemoveData': ['int', []],
			'OnCloseHandle': ['int', []],
			'OnFillData': ['int', [new ArrayType('uchar'), new ArrayType('uchar')]]
		});

		var vRtnMsg = ['操作成功', '没有找到虚拟设备', '开启读卡器失败', '数据下发失败', '复位卡数据失败', '设备句柄释放失败', '链接设备错误', '保存bmp文件出错', '保存jpg文件出错', '读取身份证信息成功，但回写身份证图片到本地失败', 'SamID获取失败', '寻卡成功', '未知错误'];

		var OnLinkDev = VreaderAPI.OnLinkDev();
		console.log('OnLinkDev return Code = ' + OnLinkDev + ' vRtnMsg = ' + vRtnMsg[OnLinkDev]);
		if (OnLinkDev === 0) {

			var OnRemoveData = VreaderAPI.OnRemoveData();

			console.log('OnRemoveData return Code = ' + OnRemoveData + ' vRtnMsg = ' + vRtnMsg[OnRemoveData]);

			if (OnRemoveData === 0) {
				console.log('OnRemoveData ok...... return code = ' + OnRemoveData + ' vRtnMsg = ' + vRtnMsg[OnRemoveData]);

				var OnFillData = VreaderAPI.OnFillData(new Buffer(fillData), new Buffer(fillPic));

				if (OnFillData === 0) {
					console.log('OnFillData return Code = ' + OnFillData + ' vRtnMsg = ' + vRtnMsg[OnFillData]);

				} else {
					console.log('OnFillData return Code = ' + OnFillData + ' vRtnMsg = ' + vRtnMsg[OnFillData]);
				}

			} else {
				console.log('OnRemoveData failed...... return code = ' + OnRemoveData + ' vRtnMsg = ' + vRtnMsg[OnRemoveData]);
			}
			var OnCloseHandle = VreaderAPI.OnCloseHandle();
			console.log('OnCloseHandle return Code = ' + OnCloseHandle + ' vRtnMsg = ' + vRtnMsg[OnCloseHandle]);
		} else {
			console.log('OnLinkDev failed...... return code = ' + OnLinkDev + ' vRtnMsg = ' + vRtnMsg[OnLinkDev]);
		}
	}
	else {
		console.log('没找到虚拟身份证设备，请使用F8进入系统。');
		alert("没找到虚拟身份证设备，请使用F8进入系统。");
	}
} else {
	alert('请使用创造价值客户端');
}
