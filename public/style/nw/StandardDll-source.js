var FFI = require('ffi');
var fs = require('fs');

var cvrDll = {
	readCard: function () {
		FFI.Library(process.cwd() + '/lib/standard/sdtapi.dll');
		FFI.Library(process.cwd() + '/lib/standard/IDCard.dll');
		var DllCommon = new FFI.Library(process.cwd() + '/lib/standard/termb.dll', {
			'InitComm': ['int32', ['int32']],
			'InitCommExt': ['int32', []],
			'CloseComm': ['int32', []],
			'Authenticate': ['int32', []],
			'Read_Content': ['int32', ['int32']],
			'Read_Content_Path': ['int32', ['string', 'int32']],
			'GetSAMID': ['string', []],
			'GetPhoto': ['int32', ['string']]
		});

		var iPort = DllCommon.InitCommExt();
		if (iPort === 0) {
			return {
				'code': 0,
				'message': '连接设备失败'
			};
		} else {
			var authenticate = DllCommon.Authenticate();
			if (authenticate !== 1) {
				DllCommon.CloseComm();
				return {
					'code': -1,
					'message': '未放身份证或身份证放置不正确，请重新放置身份证'
				};
			} else {
				var readContent = DllCommon.Read_Content(1);
				if (readContent !== 1) {
					DllCommon.CloseComm();
					return {
						'code': -2,
						'message': '读身份证信息失败'
					};
				}
				var getSamID = DllCommon.GetSAMID();
				if (getSamID === '') {
					DllCommon.CloseComm();
					return {
						'code': -4,
						'message': 'GetSAMID失败'
					};
				}
			}
			DllCommon.CloseComm();
		}

		var idCardInfo = {};
		var buf = fs.readFileSync(process.cwd() + '/wz.txt');
		if (buf.length >= 220) {
			idCardInfo = {
				'name': buf.toString('UCS-2', 0, 30),
				'genderCode': buf.toString('UCS-2', 30, 32),
				'nationCode': buf.toString('UCS-2', 32, 36),
				'birthday': buf.toString('UCS-2', 36, 52),
				'address': buf.toString('UCS-2', 52, 122),
				'idCode': buf.toString('UCS-2', 122, 158),
				'dept': buf.toString('UCS-2', 158, 188),
				'validityStart': buf.toString('UCS-2', 188, 204),
				'validityEnd': buf.toString('UCS-2', 204, 220),
				'SAMID': getSamID
			};
			idCardInfo.gender = idCardInfo.genderCode == '1' ? '男' : '女';
			idCardInfo.nation = this.nations[idCardInfo.nationCode];
		}

		var wlt = fs.readFileSync(process.cwd() + '/xp.wlt').toString('hex');
		var zp = fs.readFileSync(process.cwd() + '/zp.bmp', {
			'encoding': 'base64'
		});

		return Object.assign(idCardInfo, {
			'code': 1,
			'zp': zp,
			'wlt': wlt
		});
	},
	nations: {
		'01': '汉',
		'02': '蒙古',
		'03': '回',
		'04': '藏',
		'05': '维吾尔',
		'06': '苗',
		'07': '彝',
		'08': '壮',
		'09': '布依',
		'10': '朝鲜',
		'11': '满',
		'12': '侗',
		'13': '瑶',
		'14': '白',
		'15': '土家',
		'16': '哈尼',
		'17': '哈萨克',
		'18': '傣',
		'19': '黎',
		'20': '傈僳',
		'21': '佤',
		'22': '畲',
		'23': '高山',
		'24': '拉祜',
		'25': '水',
		'26': '东乡',
		'27': '纳西',
		'28': '景颇',
		'29': '柯尔克孜',
		'30': '土',
		'31': '达斡尔',
		'32': '仫佬',
		'33': '羌',
		'34': '布朗',
		'35': '撒拉',
		'36': '毛南',
		'37': '仡佬',
		'38': '锡伯',
		'39': '阿昌',
		'40': '普米',
		'41': '塔吉克',
		'42': '怒',
		'43': '乌孜别克',
		'44': '俄罗斯',
		'45': '鄂温克',
		'46': '德昂',
		'47': '保安',
		'48': '裕固',
		'49': '京',
		'50': '塔塔尔',
		'51': '独龙',
		'52': '鄂伦春',
		'53': '赫哲',
		'54': '门巴',
		'55': '珞巴',
		'56': '基诺'
	},
	//
	Text: function (text) {
		return new Buffer(text, 'ucs2').toString('binary');
	}
};