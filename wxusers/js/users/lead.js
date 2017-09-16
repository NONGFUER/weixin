$(function(){
	var mobile = getUrlQueryString("mobile");
	var openid = getUrlQueryString("openid");
	var fromtype = getUrlQueryString("fromtype");
//	console.log(mobile)
	/* 设置滑动区域 */
	$.setscroll();
	$("#taby").bind("tap",function (){
		window.location.href = "aboutBY.html?s=2&mobile="+mobile+"&openid="+openid+"&fromtype="+fromtype;
	});
	$("#tongdao").bind("tap",function (){
		window.location.href = "tongdaoIntro.html?s=2&mobile="+mobile+"&openid="+openid+"&fromtype="+fromtype;
	});
	$("#enter").bind("tap",function (){
//		window.location.href = "phoneValidate.html?mobile="+mobile+"&openid="+openid+"&fromtype="+fromtype;
		window.location.href = "phoneValidate.html?openid="+openid+"&fromtype="+fromtype;
	});
	$("#certification").bind("tap",function (){
		window.location.href = "certification.html?mobile="+mobile+"&openid="+openid+"&fromtype="+fromtype;
	});
	
	
});
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#order_index").height(Scrollheight);
	mui("#order_index").scroll();
};