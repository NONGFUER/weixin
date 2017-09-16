var myScroll;
$(function() {
	$(".h_back").unbind("tap").bind("tap",function(){
		window.history.back();
	})

	/*设置滑动区域*/
	$.setscroll();
});

/*设置滑动区域*/
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height() - 10;
	$("#noticecontent").height(Scrollheight + "px");
};