// var name;
	// var idNo;
	// var openid = getUrlQueryString("openid");
	// var mobile = getUrlQueryString("mobile");
	// var fromtype = getUrlQueryString("fromtype");
	// var jsonStr = getUrlQueryString("jsonKey");
	// //防癌险下一页需要参数
	// var fromType = getUrlQueryString("fromflag");
	// var channel = getUrlQueryString("channel");
var req = {
		realName : base.url + 'login/userRealName.do'
}
var fromtype = getUrlQueryString("fromtype");
var mobile = getUrlQueryString("mobile");
var openid = getUrlQueryString("openid");
var customerId = getUrlQueryString("customerId");
var jsonKey = getUrlQueryString("jsonKey");
var wxchannel = getUrlQueryString("wxchannel");
var roleType = getUrlQueryString("roleType");
if(jsonKey){
	var urlParm = JSON.parse(UrlDecode(jsonKey));
}
var name = "";
var isNo = "";
$(function() {
	/* 设置滑动区域 */
	$.setscroll();
	/* 格式校验 */
	$.infoCheck();
	//d
	$("#nextstep").bind("tap",function (){
		name = $("#phone_input").val();
		idNo = $("#id_input").val();
		if(name == ""||name =="请输入您的真实姓名"){
			modelAlert('请输入您的真实姓名');
			return false;
		}
		if(idNo == ""||idNo =="请输入您的身份证号"){
			modelAlert('请输入您的身份证号');
			return false;
		}
		if($.checkIdCard($("#id_input").val().toLocaleUpperCase()) != 0) {
				modelAlert("身份证号输入有误，请重新输入！");
				return false;
		}
		if(isChineseorspot($("#phone_input").val()) == false) {
				modelAlert("姓名输入有误，请重新输入！");
				return false;
		}

		//调用实名接口
		realNameRequest(customerId,name,idNo,mobile);	

	});
});

//mui滚动
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#order_index").height(Scrollheight);
	mui("#order_index").scroll();
};
//提示语隐藏
$.infoCheck = function() {
	//提示语隐藏
	$.replacePlaceholder($("#phone_input"), "请输入您的真实姓名");
	$.replacePlaceholder($("#id_input"), "请输入您的身份证号");
};

//检验是否中文
 function isChineseorspot(str) {
			var reg = /^[\u4E00-\u9FFF|·]+$/;
			return reg.test(str);
}

///////////////////////////////////////////////////////////////////////////////////
//调用实名接口
function realNameRequest(customerId,name,idNo,mobile){
	var url = req.realName;
	var sendJson = {
		"head":{
			"userCode":mobile,
			"transTime":$.getTimeStr(),
			"channel":"02",
			"transToken":""
		},"body":{
			"customerId": customerId,	
			"userName"  : mobile,
			"name"      :name,
			"idNo"      :idNo
				
		}
	}
	$.reqAjaxs(url, sendJson, realNameCallBack );
}

//实名回调
function realNameCallBack(data){
	if(data.statusCode=="000000"){
		if(fromtype == "1"){
			//跳转到“个人中心”
			toPersonHtml(mobile,customerId,openid);
		}else if(fromtype == "licai"){
			tolicaiHtml();
		}else if(fromtype == "2"){
			tomydingdanHtml();
		}else if(fromtype == "3"){
			tomybaodanHtml();
		}else if(fromtype == "7"){
			tojcxHtml();
		}
	}else{
		modelAlert(data.statusMessage);
		return false;
	}
}

//跳转到“个人中心”personal.html
function toPersonHtml(mobile,customerId,openid){
	window.location.href = "personal.html?mobile=" + mobile + "&roleType=01&fromtype=1&customerId=" + customerId + "&openid=" + openid + "&wxchannel="+wxchannel;
}
//跳转投保
function toOnlineInsureHtml(openid){
	window.location.href = base.url + "tongdaoApp/html/share/insurance/main/insure.html?openid="+openid;
}
/*跳转到理财购买页*/
function tolicaiHtml(openid){
	urlParm.openid=openid;
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/managemoney/productDetailsWeChat/productDetailsWeChat.html?jsonKey="+jsonStr;
}
/*跳转到我的订单*/
function tomydingdanHtml(openid){
	urlParm.openid=openid;
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/account/myOrder/allOrderWeChat.html?jsonKey="+jsonStr;
}
/*跳转到我保单*/
function tomybaodanHtml(openid){
	urlParm.openid=openid;
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/account/myOrder/policyListWeChat.html?jsonKey="+jsonStr;
}
/*跳转到驾常险*/
function tojcxHtml(openid){
	urlParm.openid=openid;
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/managemoney/productDetailsWeChat/productDetailsWeChat.html?jsonKey="+jsonStr;
}