$(function(){
	$(".h_back").unbind("tap").bind("tap",function(){
		window.parent.ifremhide();
	});

	/*设置滑动区域*/
	$.setscroll();	
});

/*设置滑动区域*/
$.setscroll = function(){
	var Scrollheight = window.innerHeight - $("header").height();
	$("#noticecontent").height(Scrollheight+"px");
	mui("#noticecontent").scroll();
};