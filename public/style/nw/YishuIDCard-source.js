var FFI = require('ffi');
var fs = require('fs');
var ref = require('ref');
var ArrayType = require('ref-array');
var iconv = require('iconv-lite');

var cArray32 = new ArrayType('uchar', 32);
var cArray64 = new ArrayType('uchar', 64);
var cArray256 = new ArrayType('uchar', 256);
var cArray4096 = new ArrayType('uchar', 4096);

var cPtr32 = ref.refType(cArray32);
var cPtr64 = ref.refType(cArray64);
var cPtr256 = ref.refType(cArray256);
var cPtr4096 = ref.refType(cArray4096);

var cvrDll = {
	readCard: function () {
		fs.unlink(process.cwd() + '/zp.wlt');
		var readerAPI = new FFI.Library(process.cwd() + '/lib/yishu/CardReader.dll', {
			'ReadCard': [cPtr32, []],
			'DeviceID': [cPtr32, []],
			'NameL': [cPtr64, []],
			'Sex': [cPtr32, []],
			'SexL': [cPtr32, []],
			'NationL': [cPtr32, []],
			'Born': [cPtr32, []],
			'CardNo': [cPtr32, []],
			'Police': [cPtr64, []],
			'ActivityLFrom': [cPtr32, []],
			'ActivityLTo': [cPtr32, []],
			'ActivityL': [cPtr64, []],
			'Address': [cPtr256, []],
			'GetImage': [cPtr4096, []]
		});

		var scard = this.Decode(readerAPI.ReadCard());
		console.log('ReadCard: Return code = ' + scard);

		if (scard === '0') {
			var err = 0;

			var getDeviceID = this.Decode(readerAPI.DeviceID());
			console.log('getDeviceID: Return code = ' + getDeviceID);
			if (getDeviceID === '') {
				err++;
				console.log('SAMID读取失败');
				return {
					'code': -2,
					'message': 'SAMID读取失败'
				};
			}

			var getNameL = this.Decode(readerAPI.NameL());
			console.log('getNameL: Return code = ' + getNameL);
			if (getNameL === '') {
				err++;
				console.log('身份证姓名读取失败');
				return {
					'code': -2,
					'message': '身份证姓名读取失败'
				};
			}

			var getSex = this.Decode(readerAPI.Sex());
			console.log('getSex: Return code = ' + getSex);
			if (getSex === '') {
				err++;
				console.log('身份证性别信息读取失败');
				return {
					'code': -2,
					'message': '身份证性别信息读取失败'
				};
			}

			var getSexL = this.Decode(readerAPI.SexL());
			console.log('getSexL: Return code = ' + getSexL);
			if (getSexL === '') {
				err++;
				console.log('身份证性别信息读取失败');
				return {
					'code': -2,
					'message': '身份证性别信息读取失败'
				};
			}

			var getNationL = this.Decode(readerAPI.NationL());
			console.log('getNationL: Return code = ' + getNationL);
			if (getNationL === '') {
				err++;
				console.log('民族信息读取失败');
				return {
					'code': -2,
					'message': '民族信息读取失败'
				};
			}

			var getBorn = this.Decode(readerAPI.Born());
			console.log('getBorn: Return code = ' + getBorn);
			if (getBorn === '') {
				err++;
				console.log('出生日期读取失败');
				return {
					'code': -2,
					'message': '出生日期读取失败'
				};
			}

			var getCardNo = this.Decode(readerAPI.CardNo());
			console.log('getCardNo: Return code = ' + getCardNo);
			if (getCardNo === '') {
				err++;
				console.log('身份证号码读取失败');
				return {
					'code': -2,
					'message': '身份证号码读取失败'
				};
			}

			var getPolice = this.Decode(readerAPI.Police());
			console.log('getPolice: Return code = ' + getPolice);
			if (getPolice === '') {
				err++;
				console.log('身份证发证机关读取失败');
				return {
					'code': -2,
					'message': '身份证发证机关读取失败'
				};
			}

			var getAddress = this.Decode(readerAPI.Address());
			console.log('getAddress: Return code = ' + getAddress);
			if (getAddress === '') {
				err++;
				console.log('身份证地址信息读取失败');
				return {
					'code': -2,
					'message': '身份证地址信息读取失败'
				};
			}

			var getActivityLFrom = this.Decode(readerAPI.ActivityLFrom());
			console.log('getActivityLFrom: Return code = ' + getActivityLFrom);
			if (getActivityLFrom === '') {
				err++;
				console.log('身份证有效期开始日期读取失败');
				return {
					'code': -2,
					'message': '身份证有效期开始日期读取失败'
				};
			}

			var getActivityLTo = this.Decode(readerAPI.ActivityLTo());
			console.log('getActivityLTo: Return code = ' + getActivityLTo);
			if (getActivityLTo === '') {
				err++;
				console.log('身份证有效期结束日期读取失败');
				return {
					'code': -2,
					'message': '身份证有效期结束日期读取失败'
				};
			}

			var getActivityL = this.Decode(readerAPI.ActivityL());
			console.log('getActivityL: Return code = ' + getActivityL);
			if (getActivityL === '') {
				err++;
				console.log('身份证有效期读取失败');
				return {
					'code': -2,
					'message': '身份证有效期读取失败'
				};
			}

			var getGetImage = this.Decode(readerAPI.GetImage());
			console.log('getGetImage: Return code = ' + getGetImage);
			if (getGetImage === '') {
				err++;
				console.log('身份证照片信息读取失败');
				return {
					'code': -2,
					'message': '身份证照片信息读取失败'
				};
			}

			var wlt = fs.readFileSync(process.cwd() + '/zp.wlt').toString('hex');
			if (err === 0 && wlt !== '') {
				var idCardInfo = {
					'name': getNameL,
					'gender': getSexL,
					'genderCode': getSex,
					'nation': getNationL,
					'nationCode': this.nations[getNationL],
					'birthday': getBorn,
					'address': getAddress,
					'idCode': getCardNo,
					'dept': getPolice,
					'validityStart': getActivityLFrom,
					'validityEnd': getActivityLTo,
					'SAMID': getDeviceID,
					'code': 1,
					'zp': getGetImage.replace(/\r\n/g,''),
					'wlt': wlt,
					'message': '身份证信息读取成功'
				};
				return idCardInfo;
			} else {
				console.log('操作失败: 异常错误');
				return {
					'code': -3,
					'message': '操作失败：异常错误'
				};
			}
		} else {
			console.log('ReadCard操作失败: msg = ' + scard);
			return {
				'code': -1,
				'message': scard
			};
		}
	},
	Decode: function (str) {
		return ref.readCString(new Buffer(iconv.decode(new Buffer(str), 'GB18030')));
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