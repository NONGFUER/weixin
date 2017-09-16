var validateCode = "";
var openid = getUrlQueryString("openid");
var fromtype = getUrlQueryString("fromtype");
var jsonKey = getUrlQueryString("jsonKey");
if(jsonKey){
	var urlParm = JSON.parse(UrlDecode(jsonKey));
}

$(function() {
	/* 设置滑动区域 */
	$.setscroll();
	/* 格式校验 */
	$.infoCheck();
	//协议勾选
	$(".dagou").on("tap", function() {
		var picName = $(".dagou").attr("src").substring($(".dagou").attr("src").lastIndexOf("/") + 1);
		if(picName == "17.png") {
			$(".dagou").attr("src", "../../image/16.png");
			$("#nextstep").css("background-color", "#C0C0C0");
			$("#nextstep").attr("disabled", "disabled");
		} else {
			$(".dagou").attr("src", "../../image/17.png");
			$("#nextstep").css("background-color", "#1B6BB8");
			$("#nextstep").removeAttr("disabled");
		}
	});
	//注册条款
	$("#zc").bind("tap", function() {
		$(".first").hide();
		$(".second").show();
	});
	//注册条款返回效果
	$(".h_back").bind("tap", function() {
		$(".first").show();
		$(".second").hide();
	});
	//点击获取验证码
	$("#getPIN").on("tap", function() {
		//判断是否输入了手机号
		if($("#phone_input").val() == "请输入手机号码" || $("#phone_input").val() == "") {
			modelAlert("请输入手机号！");
			return false;
		}
		//判断手机号格式是否合法
		//如果合法，调用验证码短信接口
		if(tit.regExp.isMobile($("#phone_input").val())) {
			phoneNo = $("#phone_input").val();
			countdown = 60;
			settime();
			getRegCodeRequest();
//			var url = base.url + "/customer/GetRegCode.do";
//			var reqData = {
//				"head": {
//					"userCode": "",
//					"transTime": $.getTimeStr(),
//					"channel": "1"
//				},
//				"body": {
//					"userName": $("#phone_input").val(),
//					"type": "103"
//				}
//			};
//			$.reqAjaxs(url, reqData, function(data) {
//				console.log(data);
//				if(data.statusCode == "000000") {
//					validateCode = data.returns.validateCode;
//				} else {
//					modelAlert(data.statusMessage);
//				}
//			});
		} else {
			modelAlert('手机号校验错误，请重新输入！');
		}
	});
	//点击下一步，根据不同状态进入不同的页面（与前一页面流程连贯）	
	$("#nextstep").bind("tap", function() {
		if($("#phone_input").val() == "" || $("#phone_input").val() == "请输入手机号码") {
			modelAlert('请输入手机号!');
			return false;
		}
		if(tit.regExp.isMobile($("#phone_input").val()) == false) {
			modelAlert("手机号校验错误，请重新输入！");
			return false;
		}
		if($("#valificationCode_input").val() == "" || $("#valificationCode_input").val() == "请输入验证码") {
			modelAlert('请输入验证码!');
			return false;
		}
		var picName = $(".dagou").attr("src").substring($(".dagou").attr("src").lastIndexOf("/") + 1);
		if(phoneNo == $("#phone_input").val()) {
			if($("#valificationCode_input").val() == validateCode && $("#valificationCode_input").val() != "") {
				validate(phoneNo);
			} else {
				modelAlert('验证码有误，请重新输入！');
			}
		} else {
			modelAlert('验证码有误，请重新输入！');
		}
	});
});
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#order_index").height(Scrollheight);
	mui("#order_index").scroll();
};
$.infoCheck = function() {
	//提示语隐藏
	$.replacePlaceholder($("#phone_input"), "请输入手机号码");
	$.replacePlaceholder($("#valificationCode_input"), "请输入验证码");
};
//点击"获取验证码"
function settime() {
	if(countdown == 0) {
		document.getElementById("getPIN").removeAttribute("disabled");
		$("#getPIN").css("background-color", "#1B6BB8");
		$("#getPIN").val("获取验证码");
		countdown = 60;
		return false;
	} else {
		document.getElementById("getPIN").setAttribute("disabled", "disabled");
		$("#getPIN").css("background-color", "#C0C0C0");
		$("#getPIN").css("color", "rgb(255,255,255)");
		$("#getPIN").css("opacity", "1 !important");
		$("#getPIN").val(countdown + "秒");
		countdown--;
	}
	setTimeout(function() {
		settime()
	}, 1000)
}

//function validate(phoneNo) {
//	var url = base.url + "/register/quickRegister.do";
//	var reqData = {
//		"head": {
//			"userCode": "",
//			"transTime": $.getTimeStr(),
//			"channel": "1"
//		},
//		"body": {
//			"openId": openid,
//			"userName": phoneNo,
//			"flag": "10",
//			"customerSource": "2" //用户来源(1app注册，2微信注册（同道出行），3微信注册（微信代理人）)							
//		}
//	};
//	$.reqAjaxs(url, reqData, function(data) {
//		if(data.statusCode == "000000") {
//			$("#phone_input").val("请输入手机号码");
//			$("#valificationCode_input").val("请输入验证码");
//			$("#getPIN").val("获取验证码");
//			if(data.returns.idAuth == "0") { //未实名
//				if(fromtype == "ecard") {
//					var urlParm = JSON.parse(UrlDecode(jsonStr));
//					urlParm.head.mobile = phoneNo;
//					urlParm.body.customerId = data.returns.bxTdCustomer.id + "";
//					var jsonStr1 = UrlEncode(JSON.stringify(urlParm));
//					window.location.href = "certification.html?mobile=" + phoneNo + "&fromtype=" + fromtype + "&openid=" + openid + "&jsonKey=" + jsonStr1;
//				} else if(fromtype == "xpx") {
//					var urlParm = JSON.parse(UrlDecode(jsonStr));
//					urlParm.head.mobile = phoneNo;
//					urlParm.body.customerId = data.returns.bxTdCustomer.id + "";
//					var jsonStr1 = UrlEncode(JSON.stringify(urlParm));
//					window.location.href = "certification.html?mobile=" + phoneNo + "&fromtype=" + fromtype + "&openid=" + openid + "&jsonKey=" + jsonStr1;
//				}else if(fromtype == "cancer") {
//					var urlParm = JSON.parse(UrlDecode(jsonStr));
//					urlParm.head.mobile = phoneNo;
//					urlParm.head.customerId = data.returns.bxTdCustomer.id + "";
//					var jsonStr1 = UrlEncode(JSON.stringify(urlParm));
//					window.location.href = "certification.html?mobile=" + phoneNo + "&fromtype=" + fromtype + "&openid=" + openid + "&fromflag=" + fromType + "&channel=" + channel + "&jsonKey=" + jsonStr1;
//				} else if(fromtype == "Tian") {
//					var urlParm = JSON.parse(UrlDecode(jsonStr));
//					urlParm.head.mobile = phoneNo;
//					urlParm.body.customerId = data.returns.bxTdCustomer.id + "";
//					var jsonStr1 = UrlEncode(JSON.stringify(urlParm));
//					window.location.href = "certification.html?mobile=" + phoneNo + "&fromtype=" + fromtype + "&openid=" + openid + "&jsonKey=" + jsonStr1;
//				} else {
//					window.location.href = "certification.html?mobile=" + phoneNo + "&fromtype=" + fromtype + "&openid=" + openid;
//				}
//			} else { //影像已上传状态||用户离职
//				if(fromtype == "3") { //个人中心
//					window.location.href = "personal.html?openid=" + openid;
//				} else if(fromtype == "1") { //购买车险
//					window.location.href = base.url + "/weixin/wxcar/html/carinsure/carMes.html?openid=" + openid + "&mobile=" + phoneNo;
//				} else if(fromtype == "2") { //车险订单查询
//					window.location.href = base.url + "/weixin/wxcar/html/carinsure/PolicyManagement.html?openid=" + openid + "&mobile=" + phoneNo;
//				} else if(fromtype == "4") { //保单车询
//					window.location.href = base.url + "/weixin/wxcar/html/carinsure/policyQuery.html?openid=" + openid + "&mobile=" + phoneNo;
//				} else if(fromtype == "5") {
//					suixinyiPage();
//				} else if(fromtype == "ecard") {
//					var urlParm = JSON.parse(UrlDecode(jsonStr));
//					urlParm.head.mobile = phoneNo;
//					urlParm.body.customerId = data.returns.bxTdCustomer.id + "";
//					var jsonStr1 = UrlEncode(JSON.stringify(urlParm));
//					window.location.href = base.url + "tongdaoApp/page/html/ecardWechat/insureForm.html?jsonKey=" + jsonStr1;
//				} else if(fromtype == "xpx") {
//					var urlParm = JSON.parse(UrlDecode(jsonStr));
//					urlParm.head.mobile = phoneNo;
//					urlParm.body.customerId = data.returns.bxTdCustomer.id + "";
//					var jsonStr1 = UrlEncode(JSON.stringify(urlParm));
//					window.location.href = base.url + "tongdaoApp/page/html/TiananmashangWeChat/insureForm.html?jsonKey=" + jsonStr1;
//				}else if(fromtype == "cancer") {
//					var urlParm = JSON.parse(UrlDecode(jsonStr));
//					urlParm.head.mobile = phoneNo;
//					urlParm.head.customerId = data.returns.bxTdCustomer.id + "";
//					var jsonStr1 = UrlEncode(JSON.stringify(urlParm));
//					window.location.href = base.url + "tongdaoApp/page/html/cancerRisk/healthNotice.html?jsonKey=" + jsonStr1 + "&fromType=" + fromType + "&channel=" + channel;
//				}
//			}
//		} else {
//			modelAlert(data.statusMessage);
//		}
//	});
//};
//随心易，查询订单状态，根据订单状态跳页面
function suixinyiPage() {
	var url = suixinyi.url + "common/getTrafficTime.do";
	var reqData = {
		"head": {
			"channel": "01",
			"userCode": "2835",
			"transTime": ""
		},
		"body": {
			"phone": phoneNo
		}
	}
	$.reqAjaxs(url, reqData, function(data) {
		if(data.statusCode == "000000") {
			var policyStatus = data.returns.bxOrder.policyStatus; //订单状态
			if(policyStatus == "00") { //失效，跳到首页
				window.location.href = window.location.protocol + "//" + window.location.host + "/tongdaoSxyPlatform/" + "/weixin/suixinyi/html/suixinyi/shouye.html?mobile=" + phoneNo + "&fromtype=" + fromtype + "openid=" + openid + "&flag=1";;
			} else if(policyStatus == "01" || policyStatus == "02") { //支付失败、核保成功(未支付)跳到投保信息填写页面
				window.location.href = window.location.protocol + "//" + window.location.host + "/tongdaoSxyPlatform/" + "/weixin/suixinyi/html/suixinyi/customerInfoFill.html?mobile=" + phoneNo + "&fromtype=" + fromtype + "openid=" + openid + "&flag=1";
			} else if(policyStatus == "03" || policyStatus == "04" || policyStatus == "99") { //待生效、已生效、已过期，跳到出行方式选择页面
				window.location.href = window.location.protocol + "//" + window.location.host + "/tongdaoSxyPlatform/" + "/weixin/suixinyi/html/suixinyi/chooseChuxingWay.html?mobile=" + phoneNo;
			} else if(policyStatus == "05") { //支付中（后台未接收到易安支付回调）
				window.location.href = window.location.protocol + "//" + window.location.host + "/tongdaoSxyPlatform/" + "/weixin/suixinyi/html/suixinyi/payResoltWX.html?mobile=" + phoneNo + "&orderCode=0";
			}
		} else if(data.statusCode == "000002") { //无订单		
			window.location.href = window.location.protocol + "//" + window.location.host + "/tongdaoSxyPlatform/" + "/weixin/suixinyi/html/suixinyi/customerInfoFill.html?openid=" + openid + "&fromtype=" + fromtype + "&mobile=" + phoneNo + "&flag=1";
		}
	})
}

/////////////////////////////////////////////////////////////////////////////////////////////
//发送短信
function  getRegCodeRequest(){
	var url = req.getRegCode;
	var reqData = {
		"head": {
			"channel": "02",
			"userCode": "",
			"transTime": $.getTimeStr(),
			"transToken":""
		},
		"body": {
			"userName": $("#phone_input").val(),
			"type": "103"
		}
	};
	$.reqAjaxs( url, reqData, getRegCodeCallBack );
}

//发送短信回掉，获取到验证码
function getRegCodeCallBack(data){
	console.log(data);
	if(data.statusCode == "000000") {
		validateCode = data.returns.validateCode;
	} else {
		modelAlert(data.statusMessage);
	}
}

//
function validate(phoneNo) {
	var url = req.login;
	var reqData = {
		"head": {
			"userCode": "",
			"transTime": $.getTimeStr(),
			"channel": "02",
			"transToken" : ""
		},
		"body": {
			 "userName": phoneNo,
			 "passWord": "",
			 "uuid":"",
			 "version":"",
			 "mobileSf":"",
			 "loginSystem": "03",	//03同道出行 04 通道代理人
			 "systemVersion":"",
			 "loginType": "",
			 "openId": openid							
		}
	};
	$.reqAjaxs(url, reqData, loginCallBack );
}
function loginCallBack(data){
	console.log(data);
	if(data.statusCode == "000000") {
		$("#phone_input").val("请输入手机号码");
		$("#valificationCode_input").val("请输入验证码");
		$("#getPIN").val("获取验证码");		
		var customerId = data.returns.customerBasic.id + "";
		var userName = data.returns.customerBasic.userName;
		var type = data.returns.customerBasic.type;
		if(fromtype == "3") { //个人中心
			window.location.href = "personal.html?openid=" + openid;
		}else if( fromtype == "online" ){		
			toOnlineInsureHtml(customerId,userName,type);
		}else if( fromtype == "onlineHealth" ){
			toOnlineHealthHtml(customerId,userName,type);
		}else if( fromtype == "jcx" ){
			toJcxInsureHtml(customerId,userName,type);
		}else if( fromtype == "ghx" ){
			toOnlineInsureHtml(customerId,userName,type);
		}		
	}else{
		modelAlert(data.statusMessage);
	}	
}

//跳转驾乘险
function toJcxInsureHtml(customerId,userName,type){
	urlParm.customerId = customerId;
	urlParm.mobile = userName;
	urlParm.roleType = type;
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url +"tongdaoApp/html/share/insurance/jiachengxian/jcxshouyeShare.html?jsonKey="+jsonStr; 
}
//跳转在线投保||挂号线
function toOnlineInsureHtml(customerId,userName,type){
	urlParm.customerId = customerId;
	urlParm.mobile = userName;
	urlParm.roleType = type;
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/share/insurance/main/insure.html?jsonKey="+jsonStr;
}
//跳转健康告知
function toOnlineHealthHtml(customerId,userName,type){
	urlParm.customerId = customerId;
	urlParm.mobile = userName;
	urlParm.roleType = type;
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/share/insurance/main/healthNotice.html?jsonKey="+jsonStr;
}