/**
 * @maweiwei
 * 日期：2016-03-02
 * 描述：搭伙项目所用的一些基本方法和数据
 */
var userId = ""; //登录用户id
var userName = ""; //登录用户名
var loginflag = ""; //是否登录标记
var source = ""; //用户登录来源
var systemsource = ""; //判断系统类型 
var request;
//! function(e, t) {
//	function i() {
//		o = 1, e.devicePixelRatioValue = o, s = 1 / o;
//		var t = a.createElement("meta");
//		if(t.setAttribute("name", "viewport"), t.setAttribute("content", "initial-scale=" + s + ", maximum-scale=" + s + ", minimum-scale=" + s + ", user-scalable=no"), d.firstElementChild) d.firstElementChild.appendChild(t);
//		else {
//			var i = a.createElement("div");
//			i.appendChild(t), a.write(i.innerHTML)
//		}
//	}
//
//	function n() {
//		var e = Math.min(d.getBoundingClientRect().width, 750);
//		r = 100 * e / t.desinWidth, d.style.fontSize = r + "px"
//	}
//	var a = e.document,
//		d = a.documentElement,
//		o = (e.devicePixelRatio, 1),
//		s = 1;
//	i();
//	var l, r = 100;
//	t.desinWidth = 750, t.baseFont = 0.28, t.init = function() {
//		e.addEventListener("resize", function() {
//			clearTimeout(l), l = setTimeout(n, 300)
//		}, !1), e.addEventListener("pageshow", function(e) {
//			e.persisted && (clearTimeout(l), l = setTimeout(n, 300))
//		}, !1), "complete" === a.readyState ? a.body.style.fontSize = t.baseFont * o + "rem" : a.addEventListener("DOMContentLoaded", function() {}, !1), n(), d.setAttribute("data-dpr", o)
//	}
//}(window, window.adaptive || (window.adaptive = {}));
//window['adaptive'].init(); // 调用初始化方法
$(function() {
	/*判断系统类型 */
	issystemsource();
});
/*判断系统类型 */
function issystemsource() {
	var browser = {
		versions: function() {
			var u = navigator.userAgent,
				app = navigator.appVersion;
			return { //移动终端浏览器版本信息 
				webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核 
				mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端 
				weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
				ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端 
				android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
				//				trident: u.indexOf('Trident') > -1, //IE内核 
				//				presto: u.indexOf('Presto') > -1, //opera内核 
				//				gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核 
				//				iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQ HD浏览器 
				//				iPad: u.indexOf('iPad') > -1, //是否iPad 
				//				webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部 
			};
		}(),
		language: (navigator.browserLanguage || navigator.language).toLowerCase()
	}

	if(browser.versions.ios) {
		systemsource = "ios";
	} else if(browser.versions.android) {
		systemsource = "android";
	}
}

/*调用壳方法
 * 使用方法：sysback();
 * */
function sysback() {
	var ua = navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i) == "micromessenger") {
		document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
			WeixinJSBridge.call('closeWindow');
		})
	} else {
		if(systemsource == "ios") {
			objcObject.OpenUrl("back");
		} else if(systemsource == "android") {
			android.goBack();
		}
	}
}

function sysbackurl(parm) {
	var ua = navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i) == "micromessenger") {
		window.location.href = parm;
	} else {
		if(systemsource == "ios") {
			objcObject.OpenUrl(parm);
		} else if(systemsource == "android") {
			window.location.href = parm;
		}
	}
}

/*调用壳方法
 * 使用方法：sysback();
 * */
function sysbackproduct() {
	var ua = navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i) == "micromessenger") {		
			WeixinJSBridge.call('closeWindow');		
	} else {
		if(systemsource == "ios") {
			objcObject.OpenUrl("backProduct");
		} else if(systemsource == "android") {
			android.goHomePage();
		}
	}
}
/*调用壳方法，拨打客服电话 */
function callService(phone, obj) {
	var ua = navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i) == "micromessenger") {
		if(systemsource == "ios") {
			$(obj).attr("href", "tel:" + phone);
		} else if(systemsource == "android") {
			$(obj).attr("href", "tel:" + phone + "#mp.weixin.qq.com");
		}

	} else {
		if(systemsource == "ios") {
			objcObject.makeCallAction(phone);
		} else if(systemsource == "android") {
			android.JsCallPhone(phone);
		}
	}
}
/*调用壳方法，发短信 */
function callSendMessage(phone){
	var ua = navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i) == "micromessenger") {
		if(systemsource == "ios") {
			$(obj).attr("href", "sms:" + phone);
		} else if(systemsource == "android") {
			$(obj).attr("href", "sms:" + phone + "#mp.weixin.qq.com");
		}

	} else {
		if(systemsource == "ios") {
			objcObject.sendMessage(phone);
		} else if(systemsource == "android") {
			android.JsSendSms(phone);
		}
	}
}
//同道出行车险 壳上分享方法
function cxShareMethod(cxSessionId) {
	var shareStr = {
		"body": {
			"cxSessionId": cxSessionId
		}
	}
	shareStr = JSON.stringify(shareStr);
	shareStr = UrlEncode(shareStr); // 加密过后的操作
	var shareurl = base.url + 'weixin/wxcar/html/carinsure/shareOrderDetail.html?jsonKey=' + shareStr; // 分享链接
	if(systemsource == "ios") {
		var shareParams = {
			"url": shareurl,
			"flag": "1",
			"title": "同道出行", // 分享标题
			"desc": "专业车险在线展业平台" //描述
		}
		objcObject.share(shareParams)
	} else if(systemsource == "android") {
		android.JsShareBy("2", "同道出行", "专业车险在线展业平台", "", shareurl);
	}
}
//防癌险 壳上分享方法
function shareMethod(shareurl, title, desc, flag, picUrl) {
	if(systemsource == "ios") {
		var shareParams = {
			"url": shareurl,
			"flag": "2",
			"title": title, // 分享标题
			"desc": desc, //描述
			"descQuan": desc, //描述
			"picUrl": picUrl
		}
		objcObject.share(shareParams)
	} else if(systemsource == "android") {
		//android.JsShareByCopy("3", flag, title, desc, desc, shareurl);
		android.JsShareByCopy2("flag_eCard", picUrl, title, desc, desc, shareurl);
	}
}
//eCard 壳上分享方法
function ecardShareMethod(shareurl, title, desc, flag, picUrl) {
	if(systemsource == "ios") {
		var shareParams = {
			"url": shareurl,
			"flag": "2",
			"title": title, // 分享标题
			"desc": desc, //描述
			"descQuan": desc, //描述
			"picUrl": picUrl
		}
		objcObject.share(shareParams)
	} else if(systemsource == "android") {
		android.JsShareByCopy2("flag_eCard", picUrl, title, desc, desc, shareurl);
	}
}
//获取图片方法
function getImg() {
	if(systemsource == "ios") {
		objcObject.OpenUrl("image");
	} else if(systemsource == "android") {
		android.getImgUrl();
	}
}
/*与当前时间比较大小
 * @param date格式为2015-12-25 12:25:25
 * */
function comparetime(date) {
	var arr = date.split(/[- :]/);
	var oDate1 = new Date();
	var oDate2 = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
	if(oDate1.getTime() > oDate2.getTime()) {
		return true; //当前时间大
	} else {
		return false; //当前时间小
	};
}
/*比较两个时间的大小
 *@param date格式为2015-12-25 12:25:25
 * */
function comparetime1(date1, date2) {
	var oDate1 = new Date(date1);
	var oDate2 = new Date(date2);
	if(oDate1.getTime() > oDate2.getTime()) {
		return true; //第一个大
	} else {
		return false; //第二个大
	}
}

/*数组去重方法*/
function unique(arr) {
	var result = [],
		hash = {};
	for(var i = 0, elem;
		(elem = arr[i]) != null; i++) {
		if(!hash[elem]) {
			result.push(elem);
			hash[elem] = true;
		}
	}
	return result;
}

/*壳上不显示头部，微信浏览器显示头部*/
function headShow() {
	var ua = navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i) == "micromessenger") {
		$("header").show();
		$(".mui-scroll-wrapper").css("margin-top", "44px");
	} else {

	}
}
/*调用壳方法，进壳上登录*/
function loginControl() {
	if(systemsource == "ios") {
		objcObject.login();
	} else if(systemsource == "android") {
		android.login();
	}
}
/*调用壳方法，进壳上实名认证*/
function registerControl() {
	if(systemsource == "ios") {
		objcObject.register1();
	} else if(systemsource == "android") {
		android.register1();
	}
}
$.reqAjaxsFalse = function(url, requestData, callBack) {
	var requestJson = aesEncrypt(JSON.stringify(requestData), secretKey, secretKey);
	requestJson = URLencodeForBase64(requestJson);
	$.ajax({
		url: url,
		type: 'POST',
		data: "jsonKey=" + requestJson,
		dataType: "json",
		timeout: 60000,
		success: function(data) {
			$(".ajax_prevent").remove(); // 去除遮罩
			if(!$.isNull(callBack)) {
				callBack(data);
			}
		},
		error: function(data) {
			$(".ajax_prevent").remove(); // 去除遮罩
			modelAlert("网络好像开小差了呢，请设置给力一点儿网络吧！");
		},
		beforeSend: function(xhr) {
			$.ajaxPrevent();
		},
		async: false,
	});
};
/*mui滚动速度*/
mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006 
});
//设置头部
function setTitleMethod(back, tittle, type) {
	if(systemsource == "ios") {
		var titleParams = {
			"back": back,
			"tittle": tittle,
			"type": type
		}
		objcObject.setTittle(titleParams)
	} else if(systemsource == "android") {
		android.setTittle(back, tittle, type);
	}
}

/**改变壳上标题****/
function changeTitle(title){
	if(systemsource == "ios"){
		objcObject.changeTitle(title)
	}else if(systemsource == "android"){
		android.changeTitle(title);
	}
}
//控制头部右边按钮的显示
function showRightIcon() {
	if(systemsource == "ios") {
		objcObject.showRight()
	} else if(systemsource == "android") {
		android.setShareVisible();
	}
}

function isLogin(roletype, method) {
	if(roletype == "00" || roletype == "") {
		loginControl();
	} else {
		method();
	}
}
//function isLoginWechat(roletype,method,openid,fromtype){
//	if(roletype == "00" || roletype == ""){
//		method();
//	}else{
//		window.location.href = base.url + "weixin/wxusers/html/users/phoneValidate.html?fromtype="+ fromtype +"&openid="+openid;
//	}
//}

function ChangeDateFormat(jsondate) {
	jsondate = jsondate.replace("/Date(", "").replace(")/", "");

	if(jsondate.indexOf("+") > 0) {
		jsondate = jsondate.substring(0, jsondate.indexOf("+"));
	} else if(jsondate.indexOf("-") > 0) {
		jsondate = jsondate.substring(0, jsondate.indexOf("-"));
	}
	var date = new Date(parseInt(jsondate, 10));
	var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
	var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
	return date.getFullYear() + "-" + month + "-" + currentDate + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
};