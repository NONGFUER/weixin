$(function() {
	/*--------------返回-----------*/
	$(".h_back,.backButtom").unbind("tap").bind("tap",function() {
		window.history.back();
	});
});