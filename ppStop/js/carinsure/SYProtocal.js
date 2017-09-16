$(function(){
	/*设置滑动区域*/
	$.setscroll();
	/*返回上一页*/
	$(".shiming_back").unbind("tap").bind("tap",function(){
		window.location.href="insuranceTerms.html";
	});
	
});
/*设置滑动区域*/
$.setscroll = function(){
	var Scrollheight = window.innerHeight - $("header").height();
	$("#inpartcontent").height(Scrollheight+"px");
	mui("#inpartcontent").scroll();
};