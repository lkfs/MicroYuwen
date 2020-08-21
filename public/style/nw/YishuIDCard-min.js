var FFI=require("ffi");var fs=require("fs");var ref=require("ref");var ArrayType=require("ref-array");var iconv=require("iconv-lite");var cArray32=new ArrayType("uchar",32);var cArray64=new ArrayType("uchar",64);var cArray256=new ArrayType("uchar",256);var cArray4096=new ArrayType("uchar",4096);var cPtr32=ref.refType(cArray32);var cPtr64=ref.refType(cArray64);var cPtr256=ref.refType(cArray256);var cPtr4096=ref.refType(cArray4096);var cvrDll={readCard:function(){fs.unlink(process.cwd()+"/zp.wlt");var e=new FFI.Library(process.cwd()+"/lib/yishu/CardReader.dll",{ReadCard:[cPtr32,[]],DeviceID:[cPtr32,[]],NameL:[cPtr64,[]],Sex:[cPtr32,[]],SexL:[cPtr32,[]],NationL:[cPtr32,[]],Born:[cPtr32,[]],CardNo:[cPtr32,[]],Police:[cPtr64,[]],ActivityLFrom:[cPtr32,[]],ActivityLTo:[cPtr32,[]],ActivityL:[cPtr64,[]],Address:[cPtr256,[]],GetImage:[cPtr4096,[]]});var r=this.Decode(e.ReadCard());console.log("ReadCard: Return code = "+r);if(r==="0"){var o=0;var c=this.Decode(e.DeviceID());console.log("getDeviceID: Return code = "+c);if(c===""){o++;console.log("SAMID读取失败");return{code:-2,message:"SAMID读取失败"}}var t=this.Decode(e.NameL());console.log("getNameL: Return code = "+t);if(t===""){o++;console.log("身份证姓名读取失败");return{code:-2,message:"身份证姓名读取失败"}}var a=this.Decode(e.Sex());console.log("getSex: Return code = "+a);if(a===""){o++;console.log("身份证性别信息读取失败");return{code:-2,message:"身份证性别信息读取失败"}}var s=this.Decode(e.SexL());console.log("getSexL: Return code = "+s);if(s===""){o++;console.log("身份证性别信息读取失败");return{code:-2,message:"身份证性别信息读取失败"}}var n=this.Decode(e.NationL());console.log("getNationL: Return code = "+n);if(n===""){o++;console.log("民族信息读取失败");return{code:-2,message:"民族信息读取失败"}}var d=this.Decode(e.Born());console.log("getBorn: Return code = "+d);if(d===""){o++;console.log("出生日期读取失败");return{code:-2,message:"出生日期读取失败"}}var i=this.Decode(e.CardNo());console.log("getCardNo: Return code = "+i);if(i===""){o++;console.log("身份证号码读取失败");return{code:-2,message:"身份证号码读取失败"}}var l=this.Decode(e.Police());console.log("getPolice: Return code = "+l);if(l===""){o++;console.log("身份证发证机关读取失败");return{code:-2,message:"身份证发证机关读取失败"}}var g=this.Decode(e.Address());console.log("getAddress: Return code = "+g);if(g===""){o++;console.log("身份证地址信息读取失败");return{code:-2,message:"身份证地址信息读取失败"}}var v=this.Decode(e.ActivityLFrom());console.log("getActivityLFrom: Return code = "+v);if(v===""){o++;console.log("身份证有效期开始日期读取失败");return{code:-2,message:"身份证有效期开始日期读取失败"}}var u=this.Decode(e.ActivityLTo());console.log("getActivityLTo: Return code = "+u);if(u===""){o++;console.log("身份证有效期结束日期读取失败");return{code:-2,message:"身份证有效期结束日期读取失败"}}var f=this.Decode(e.ActivityL());console.log("getActivityL: Return code = "+f);if(f===""){o++;console.log("身份证有效期读取失败");return{code:-2,message:"身份证有效期读取失败"}}var y=this.Decode(e.GetImage());console.log("getGetImage: Return code = "+y);if(y===""){o++;console.log("身份证照片信息读取失败");return{code:-2,message:"身份证照片信息读取失败"}}var A=fs.readFileSync(process.cwd()+"/zp.wlt").toString("hex");if(o===0&&A!==""){var m={name:t,gender:s,genderCode:a,nation:n,nationCode:this.nations[n],birthday:d,address:g,idCode:i,dept:l,validityStart:v,validityEnd:u,SAMID:c,code:1,zp:y.replace(/\r\n/g,""),wlt:A,message:"身份证信息读取成功"};return m}else{console.log("操作失败: 异常错误");return{code:-3,message:"操作失败：异常错误"}}}else{console.log("ReadCard操作失败: msg = "+r);return{code:-1,message:r}}},Decode:function(e){return ref.readCString(new Buffer(iconv.decode(new Buffer(e),"GB18030")))},nations:{"汉":"01","蒙古":"02","回":"03","藏":"04","维吾尔":"05","苗":"06","彝":"07","壮":"08","布依":"09","朝鲜":"10","满":"11","侗":"12","瑶":"13","白":"14","土家":"15","哈尼":"16","哈萨克":"17","傣":"18","黎":"19","傈僳":"20","佤":"21","畲":"22","高山":"23","拉祜":"24","水":"25","东乡":"26","纳西":"27","景颇":"28","柯尔克孜":"29","土":"30","达斡尔":"31","仫佬":"32","羌":"33","布朗":"34","撒拉":"35","毛南":"36","仡佬":"37","锡伯":"38","阿昌":"39","普米":"40","塔吉克":"41","怒":"42","乌孜别克":"43","俄罗斯":"44","鄂温克":"45","德昂":"46","保安":"47","裕固":"48","京":"49","塔塔尔":"50","独龙":"51","鄂伦春":"52","赫哲":"53","门巴":"54","珞巴":"55","基诺":"56"}};