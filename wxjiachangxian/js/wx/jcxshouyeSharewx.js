$(function() {
	if(roleType == '00') {
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
		window.location.href = base.url + "weixin/wxusers/html/users/phoneValidate.html?fromtype=jcx&openid=" + openid + "&jsonKey=" + jsonStr + "&inviterPhone=" + shareMobile;
	} else {
		$(".PageInfo").show();
	}
	window.onresize = function() {
		var h = $(window).height();
		//console.log(h+','+window.screen.availHeight)
		var u = navigator.userAgent;
		if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
			if(h <= window.screen.availHeight / 2) {
				$('.anniumen').css({
					'position': 'absoult',
					"margin-top": "-.5rem",
					'display': 'none'
				});
			} else {
				$('.anniumen').css({
					'position': 'fixed',
					'display': 'block'
				});

			}
		}

	}
	$('input').on('focus', function() {
		$('.anniumen').hide();
	})
	$('input').on('blur', function() {
		$('.anniumen').show();
	})

	//拨打电话
	$(".kefu").unbind("tap").bind("tap", function() {
		if(systemsource == "ios") {
			objcObject.makeCallAction("4006895505");
		} else if(systemsource == "android") {
			android.JsCallPhone("4006895505");
		}
	})
	$(".successAnniu,.guanzhu").unbind("tap").bind("tap", function() {
		toDownload();
	})
	//条款
	$(".tiaokuan").unbind("tap").bind("tap", function() {
		toArticle();
	})
	//须知
	$(".xuzhi").unbind("tap").bind("tap", function() {
		toXuzhi();
	})
	//条款、须知页面返回
	$(".h_back3,.h_back2").unbind("tap").bind("tap", function() {
		$(".tiaokuanInfo").hide();
		$(".xuzhiInfo").hide();
		$(".PageInfo").show();
		$("body").css("background-color", "#fff");
		/* 设置滑动区域 */
		$.setscroll();
	})

	/* 设置滑动区域 */
	$.setscroll();
	$.replacePlaceholder($("#nameValue"), "请输入姓名");
	$.replacePlaceholder($("#IDcardValue"), "请输入身份证号码");
	$.replacePlaceholder($("#mobileValue"), "请输入手机号码");
	$.replacePlaceholder($("#chepaiValue"), "请输入车牌号码");
	$.replacePlaceholder($("#mailValue"), "请输入电子邮箱（选填）");
	//获取剩余份数
	$.getShengyu("21");
	//返回
	$(".h_back1").unbind("tap").bind("tap", function() {
		window.location.href = "zhuanqu.html" + window.location.search;
	})
	//进入订单列表
	$(".dingdan").unbind("tap").bind("tap", function() {
		var parm = {};
		parm.mobile = mobile;
		parm.productCode = productCode;
		var jsonStr = UrlEncode(JSON.stringify(parm));
		window.location.href = "orderManage.html?jsonKey=" + jsonStr;
	})
	//底部条款
	$("#kuang").unbind("tap").bind("tap", function() {
		var str = $("#kuang").attr("src");
		var index = str.lastIndexOf("/");
		kuang = str.substring(index + 1, str.length);
		if(kuang == "jcxyigouxuan.png") {
			$("#kuang").attr("src", "../../../images/jcxweigouxuan.png")
		} else {
			$("#kuang").attr("src", "../../../images/jcxyigouxuan.png")
		}
	})
	//赠送客户
	$(".zengsong").on("tap", function() {
		shareHandle();
	});
	//投保
	$(".toubao").unbind("tap").bind("tap", function() {
		var str = $("#kuang").attr("src");
		var index = str.lastIndexOf("/");
		kuang = str.substring(index + 1, str.length);
		if(kuang == "jcxweigouxuan.png") {
			//$(".shadow").show();
			modelAlert("请阅读投保须知与条款，勾选后可进行下一步操作！");
		} else {
			checkInfo();
			if(checkFlag) {
				var name = $("#nameValue").val(); //姓名
				var ID = $("#IDcardValue").val(); //身份证号
				var TBRmobile = $("#mobileValue").val(); //手机号
				var mail = $("#mailValue").val(); //邮箱
				var chepai = $("#chepaiValue").val().toUpperCase(); //车牌号 
				var sex = ""; //性别
				if(parseInt(ID.substr(16, 1)) % 2 == 1) {
					sex = "1"; //男
				} else {
					sex = "2"; //女
				}
				if(mail == "" || mail == null || mail == "请输入电子邮箱（选填）") {
					mail = "";
				}

				var url = base.url + "insuranceSave/insuranceSaveInfo.do"
				var reqData = {
					"head": {
						"channel": "02",
						"userCode": mobile,
						"transTime": "",
						"transToken": transToken
					},
					"body": {
						"carCode": chepai, //车牌号
						"email": mail, //邮箱
						"name": name, //投保人姓名
						"phone": TBRmobile, //投保人手机号
						"sex": sex, //投保人性别
						"pwd": ID, //投保人身份证						    
						"customePhone": mobile, //登录用户手机号
						"inviterPhone": mobile,
						"flag": "1", //1 公众号  2 分享 3 app
						"commodityCombinationId": "15",
						"commodityId": "21",
						"channelResource": "1", //1 公众号  2 分享 3 app
						"customeId": customerId,
						"customerId": customerId,
						"buyType": "2"
					}
				}
				$.reqAjaxs(url, reqData, function(data) {
					if(data.statusCode == "000000") {
						$(".shadow").show();
						$(".success").show();
					} else {
						modelAlert(data.statusMessage);
					}
				})
			}
		}
	})
	//投保成功点确定
	$(".successAnniu").unbind("tap").bind("tap", function() {
		toDownload();
	})
})
//投保前校验信息
function checkInfo() {
	var name = $("#nameValue").val(); //姓名
	var ID = $("#IDcardValue").val(); //身份证号
	var TBRmobile = $("#mobileValue").val(); //手机号
	var mail = $("#mailValue").val(); //邮箱
	var chepai = $("#chepaiValue").val().toUpperCase(); //车牌号
	if(name == "" || name == null || name == "请输入姓名") {
		$(".shadow").hide();
		modelAlert("姓名不能为空");
		checkFlag = false;
		return false;
	} else if(checkInputChar("nameValue", /^[\u4e00-\u9fa5a-zA-Z·]+$/) == false) {
		$(".shadow").hide();
		modelAlert("姓名格式不正确");
		checkFlag = false;
		return false;
	}
	if(ID == "" || ID == null || ID == "请输入身份证号码") {
		$(".shadow").hide();
		modelAlert("身份证号不能为空");
		checkFlag = false;
		return false;
	} else if(tit.regExp.isIdcard(ID) == false) {
		$(".shadow").hide();
		modelAlert("身份证号码格式不正确");
		checkFlag = false;
		return false;
	} else if($.checkIdCard(ID.toLocaleUpperCase()) != 0) {
		$(".shadow").hide();
		modelAlert("身份证号码规则不正确");
		checkFlag = false;
		return false;
	} else if($.checkAge(ID) == false) {
		$(".shadow").hide();
		modelAlert("投保年龄必须在18周岁~60周岁");
		checkFlag = false;
		return false;
	}
	if(TBRmobile == "" || TBRmobile == null || TBRmobile == "请输入手机号码") {
		$(".shadow").hide();
		modelAlert("手机号码不能为空");
		checkFlag = false;
		return false;
	} else if(tit.regExp.isMobile(TBRmobile) == false) {
		$(".shadow").hide();
		modelAlert("手机号码格式不正确");
		checkFlag = false;
		return false;
	}
	if(mail != "" && mail != null && mail != "请输入电子邮箱（选填）") {
		$(".shadow").hide();
		if(tit.regExp.isEmail(mail) == false) {
			modelAlert("邮箱格式不正确");
			checkFlag = false;
			return false;
		}
	}
	if($.isNull(chepai) || chepai == "请输入车牌号码") {
		modelAlert("车牌号不能为空");
		checkFlag = false;
		return false;
	}
	if(chepai.length == 7 || chepai.length == 8) {
		if(!checkCarNo($.trim(chepai))) {
			modelAlert("车牌号码格式不正确！");
			checkFlag = false;
			return false;
		}
	} else {
		modelAlert("车牌号码长度不正确");
		checkFlag = false;
		return false;
	}

	checkFlag = true;
}
//获取剩余份数
$.getShengyu = function(cId) {
	var url = base.url + "giveInsuranceAll/giveProductCount.do";
	var reqData = {
		"head": {
			"channel": "02",
			"userCode": mobile,
			"transTime": "",
			"transToken": transToken
		},
		"body": {
			"comdityId": cId,
			"customerId": customerId
		}

	}
	$.reqAjaxs(url, reqData, function(data) {
		console.log(data);
		$(".shengyuNum").html(data.returns.surplusNum);
	})
}
//校验年龄
$.checkAge = function(ID) {
	var myDate = new Date();
	var month = myDate.getMonth() + 1;
	var day = myDate.getDate();

	var age = myDate.getFullYear() - ID.substring(6, 10) - 1;
	if(ID.substring(10, 12) < month || ID.substring(10, 12) == month && ID.substring(12, 14) <= day) {
		age++;
	}
	if(age < 18 || age > 60) {
		return false;
	}
}
//车牌号
//输入一个汉字一个字母和5个数字
function checkCarNo(param) {
	reg = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5,6}$/;
	//reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
	return reg.test(param);
}
/**createOrder/check.do
 * ZT
 * 
 * 1.控件Id 2.正则表达式 3.提示信息
 */
function checkInputChar(kongjianId, zhengze) {
	var inputChar = zhengze;
	var ziduanming = $("#" + kongjianId + "").val();
	if(ziduanming != null && ziduanming != '') {
		if(!inputChar.test(ziduanming)) {
			return false;
		}
	}
	return true;
}
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height() - $(".anniumen").height();
	$("#contentHead1").height(Scrollheight);
	mui("#contentHead1").scroll();
};
$.setscroll2 = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#contentHead2").height(Scrollheight - 46);
	mui("#contentHead2").scroll();
};
$.setscroll3 = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#contentHead3").height(Scrollheight - 46);
	mui("#contentHead3").scroll();
};

function toArticle() {
	urlParm.title = "保险条款列表";
	urlParm.leftIco = "1";
	urlParm.rightIco = "0";
	urlParm.downIco = "0";
	urlParm.frompage = "jcxHtml";
	urlParm.cId = "21";
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/agreement/article.html?jsonKey=" + jsonStr;
}

function toDownload() {
	window.location.href = base.url + "tongdaoApp/html/share/download/appDownload.html";
}

//跳转投保须知
function toXuzhi() {
	urlParm.title = "投保须知";
	urlParm.leftIco = "1";
	urlParm.rightIco = "0";
	urlParm.downIco = "0";
	urlParm.ccId = "15";
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/agreement/changeXuzhi.html?jsonKey=" + jsonStr;
}

function shareHandle() {
	var title = "易安驾乘无忧意外保险";
	var desc = "驾车乘车都能保，20万保额免费领";
	var shareurl = base.url + "tongdaoApp/html/share/kongbai.html?mobile=" + mobile + '&ccId=' + ccId + '&type=4';
	var picUrl = base.url + "tongdaoApp/image/share/jiachenxianfenx.png";
	shareMethod(shareurl, title, desc, "baodan", picUrl);
};

function backlast() {
	urlParm.title = '驾乘无忧';
	urlParm.leftIco = "1";
	urlParm.rightIco = "0";
	urlParm.downIco = "0"
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = "zhuanqu.html?jsonKey=" + jsonStr;
}