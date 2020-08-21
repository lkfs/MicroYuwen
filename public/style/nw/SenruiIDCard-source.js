var FFI = require('ffi');
var fs = require('fs');
var ref = require('ref');
var Struct = require('ref-struct');
var ArrayType = require('ref-array');
var iconv = require('iconv-lite');

var T_Struct = new Struct({
	'address': new ArrayType('char', 1024),
	'authority': new ArrayType('char', 256),
	'avatar': new ArrayType('char', 1024),
	'birth': new ArrayType('char', 30),
	'cardNo': new ArrayType('char', 20),
	'ethnicity': new ArrayType('char', 50),
	'name': new ArrayType('char', 100),
	'period': new ArrayType('char', 50),
	'sex': new ArrayType('char', 10),
	'dn': new ArrayType('char', 50),
	'fingerprint': new ArrayType('char', 1024)
});

var IDCardInfoPtr = ref.refType(T_Struct);

var cardInfo = new T_Struct();

var cvrDll = {
	readCard: function () {
		var idCardInfo;
		var wltFilePath = process.cwd() + '/lib/senrui/SR.wlt';
		var BmpFilePath = process.cwd() + '/lib/senrui/SR.bmp';
		fs.unlink(wltFilePath);
		fs.unlink(BmpFilePath);

		var readerAPI = new FFI.Library(process.cwd() + '/lib/senrui/SRIDreadcard.dll', {
			'setTheServer': ['int', ['string', 'int', 'string', 'int']],
			'readCard': ['int', [IDCardInfoPtr, 'int']]
		});

		var wltAPI = new FFI.Library(process.cwd() + '/lib/senrui/WltRS.dll', {
			'GetBmp': ['int', ['string', 'int']]
		});

		readerAPI.setTheServer('sam1.esaleb.net', 6000, '114.119.32.12', 6000);

		var returnCode = readerAPI.readCard(cardInfo.ref(), 15);

		if (returnCode === 0) {
			// var wlt = iconv.encode(new Buffer(cardInfo.avatar),'GB18030').toString('hex');

			fs.writeFileSync(wltFilePath, new Buffer(cardInfo.avatar));

			wltAPI.GetBmp(wltFilePath, 2);

			var zp = fs.readFileSync(BmpFilePath, {
				'encoding': 'base64'
			});

			var wlt = new Buffer(cardInfo.avatar).toString('hex');

			var ValidBegin = '';
			var ValidEnd = '';
			var period = this.Decode(cardInfo.period);
			if (period.length >= 16) {
				var dateArray = period.split('-');
				ValidBegin = dateArray[0];
				ValidEnd = dateArray[1];
			} else {
				ValidBegin = period;
			}

			idCardInfo = {
				'name': this.Decode(cardInfo.name),
				'gender': this.Decode(cardInfo.sex),
				'genderCode': this.Decode(cardInfo.sex) == '男' ? '1' : '0',
				'nation': this.Decode(cardInfo.ethnicity),
				'nationCode': this.nations[this.Decode(cardInfo.ethnicity)],
				'birthday': this.Decode(cardInfo.birth),
				'address': this.Decode(cardInfo.address),
				'idCode': this.Decode(cardInfo.cardNo),
				'dept': this.Decode(cardInfo.authority),
				'validityStart': ValidBegin,
				'validityEnd': ValidEnd,
				'SAMID': this.Decode(cardInfo.dn),
				'code': 1,
				'zp': zp,
				'wlt': wlt,
				'message': '操作成功'
			};
			return idCardInfo;

		} else {
			console.log('操作失败: ' + returnCode + ' msg = ' + this.returnMsg(0 - returnCode));
			return {
				'code': returnCode,
				'message': this.returnMsg(0 - returnCode)
			};
		}
	},
	Decode: function (str) {
		return this.clearStr(iconv.decode(new Buffer(str), 'GB18030'));
	},
	returnMsg: function (idx) {
		idx = idx > 13 ? 13 : idx;
		var msg = ['读取成功', '没有找到阅读器', '不允许阅读器匹配多部手机', '网络异常，请检查当前网络状况', '请检查证件是否放置在设备上',
			'森锐服务器处理异常', '阅读器异常错误',
			'出现错误，需要重试', '打开身份证错误', '无法连接服务器', '服务器连接超时', '服务器连接失败', '服务器处理繁忙', '其他错误'
		];
		return msg[idx];
	},
	clearStr: function (str) {
		var result = '';
		for (var i = 0; i < str.length; i++) {
			var byte = str.charCodeAt(i);
			if (byte > 0) {
				result += str[i];
			}
		}
		return result;
	},
	nations: {
		'汉': '01',
		'蒙古': '02',
		'回': '03',
		'藏': '04',
		'维吾尔': '05',
		'苗': '06',
		'彝': '07',
		'壮': '08',
		'布依': '09',
		'朝鲜': '10',
		'满': '11',
		'侗': '12',
		'瑶': '13',
		'白': '14',
		'土家': '15',
		'哈尼': '16',
		'哈萨克': '17',
		'傣': '18',
		'黎': '19',
		'傈僳': '20',
		'佤': '21',
		'畲': '22',
		'高山': '23',
		'拉祜': '24',
		'水': '25',
		'东乡': '26',
		'纳西': '27',
		'景颇': '28',
		'柯尔克孜': '29',
		'土': '30',
		'达斡尔': '31',
		'仫佬': '32',
		'羌': '33',
		'布朗': '34',
		'撒拉': '35',
		'毛南': '36',
		'仡佬': '37',
		'锡伯': '38',
		'阿昌': '39',
		'普米': '40',
		'塔吉克': '41',
		'怒': '42',
		'乌孜别克': '43',
		'俄罗斯': '44',
		'鄂温克': '45',
		'德昂': '46',
		'保安': '47',
		'裕固': '48',
		'京': '49',
		'塔塔尔': '50',
		'独龙': '51',
		'鄂伦春': '52',
		'赫哲': '53',
		'门巴': '54',
		'珞巴': '55',
		'基诺': '56'
	}
};