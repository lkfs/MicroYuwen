var FFI = require('ffi');
var fs = require('fs');
var ref = require('ref');
var Struct = require('ref-struct');
var ArrayType = require('ref-array');
var iconv = require('iconv-lite');

var T_Struct = new Struct({
	'Name': new ArrayType('char', 32),
	'Sex': new ArrayType('char', 4),
	'Nation': new ArrayType('char', 10),
	'Birthday': new ArrayType('char', 18),
	'Address': new ArrayType('char', 72),
	'IDCardNo': new ArrayType('char', 38),
	'GrantDept': new ArrayType('char', 32),
	'ValidBegin': new ArrayType('char', 18),
	'ValidEnd': new ArrayType('char', 18),
	'AppendMsg': new ArrayType('char', 72),
	'sexCode': new ArrayType('char', 4),
	'nationCode': new ArrayType('char', 4),
	'PhotoFileName': new ArrayType('char', 255),
	'SAMID': new ArrayType('char', 128),
	'imgBase64': new ArrayType('char', 8000),
	'WltBuffer': new ArrayType('uchar', 1024)
});

var IDCardInfoPtr = ref.refType(T_Struct);

var cardInfo = new T_Struct();

var cvrDll = {
	readCard: function () {
		fs.unlink(process.cwd() + '/lib/senter/zp.wlt');
		var idCardInfo;
		FFI.Library(process.cwd() + '/lib/senter/sdtapi.dll');
		var readerAPI = new FFI.Library(process.cwd() + '/lib/senter/IDCardReader.dll', {
			'FindCard': ['int', []],
			'GetIDCardInfo': ['int', [IDCardInfoPtr]]
		});

		var scard = readerAPI.FindCard();
		if (scard === 11) {
			var returnCode = readerAPI.GetIDCardInfo(cardInfo.ref());

			var wlt = fs.readFileSync(process.cwd() + '/lib/senter/zp.wlt').toString('hex');

			if (returnCode === 0) {
				idCardInfo = {
					'name': this.Decode(cardInfo.Name),
					'gender': this.Decode(cardInfo.Sex),
					'genderCode': this.Decode(cardInfo.sexCode),
					'nation': this.Decode(cardInfo.Nation),
					'nationCode': this.Decode(cardInfo.nationCode),
					'birthday': this.Decode(cardInfo.Birthday),
					'address': this.Decode(cardInfo.Address),
					'idCode': this.Decode(cardInfo.IDCardNo),
					'dept': this.Decode(cardInfo.GrantDept),
					'validityStart': this.Decode(cardInfo.ValidBegin),
					'validityEnd': this.Decode(cardInfo.ValidEnd),
					'SAMID': this.Decode(cardInfo.SAMID),
					'code': 1,
					'zp': this.Decode(cardInfo.imgBase64),
					'wlt': wlt,
					'message': this.returnMsg(returnCode)
				};
				return idCardInfo;

			} else {
				console.log('操作失败: ' + returnCode + ' msg = ' + this.returnMsg(returnCode));
				return {
					'code': 0 - returnCode,
					'message': this.returnMsg(returnCode)
				};
			}
		} else {
			console.log('操作失败: ' + scard + ' msg = ' + this.returnMsg(scard));
			return {
				'code': 0 - scard,
				'message': this.returnMsg(scard)
			};
		}
	},
	Decode: function (str) {
		return iconv.decode(new Buffer(str), 'GB18030');
	},
	returnMsg: function (idx) {
		idx = idx > 11 ? 12 : idx;
		var msg = ['操作成功', '没有找到读卡器', '开启读卡器失败', '关闭读卡器失败', '识别不到身份证',
			'识别到身份证，但读取身份证信息失败', '读取身份证信息成功，但回写身份证图片到本地失败',
			'保存bmp文件出错', '保存jpg文件出错', 'SamID获取失败', '寻卡失败', '寻卡成功', '其他错误'];
		return msg[idx];
	}
};