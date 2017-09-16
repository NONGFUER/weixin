$(function() {
	/*--------------返回-----------*/
	$(".mui-action-back,.backButtom").unbind("tap").bind("tap",function() {
		window.history.back();
		return false;
	});
});