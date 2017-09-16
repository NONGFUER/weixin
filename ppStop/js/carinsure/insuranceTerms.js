$(function(){
	/*设置滑动区域*/
	$.setscroll();
	$(".h_back").unbind("tap").bind("tap",function(){
		window.parent.ifremhide();
	});
	//商业险条款
	$("#SYProtocal").unbind("tap").bind("tap",function(){
		window.location.href="SYProtocal.html";
	})
	//交强险条款
	$("#JQProtocal").unbind("tap").bind("tap",function(){
		window.location.href="JQProtocal.html";
	})
});


/*设置滑动区域*/
$.setscroll = function(){
	var Scrollheight = window.innerHeight - $("header").height();
	$("#noticecontent").height(Scrollheight+"px");
	mui("#noticecontent").scroll();
};

