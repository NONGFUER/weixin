$(function(){
//	var jsonStr = window.location.search;
//	jsonStr = jsonStr.substr(9, jsonStr.length);
//	jsonStr = UrlDecode(jsonStr);
//	parm = JSON.parse(jsonStr);
//	var productId=parm.productId;//险种代码
//    var commodityNo=parm.commodityNo;//单品id
//    
//    var url=base.url+"/planManage/getClauseList.do";
//	var reqData={
//			"head":{
//				"userCode":"13987651230",
//				"transTime":$.getTimeStr(),
//				"channel":"1"
//			},"body":{
//				"productId":productId
//			}
//	}
//	$.toAjaxs(url, reqData, function(data){
//		data=JSON.parse(data);
//		console.log(data);
//		if(data.status.statusCode=="000000"){
//			for(var i in data.status.returns.listInfo){
//				
//			}
//		}else{
//			mui.alert(data.status.statusMessage,"温馨提示");
//		}
//	});
	$.setscroll();
//	$(".tiao_kuan").on("tap",function(){
//		if($(this).find(".icon_right").attr("src")=="../../imgs/noCar/dh_top.png"){
//			$(this).find(".icon_right").attr("src","../../imgs/noCar/dh_up.png");
//			$(this).next().show();
//		}else{
//			$(this).find(".icon_right").attr("src","../../imgs/noCar/dh_top.png");
//			$(this).next().hide();
//		}
//	})
	/*返回*/
		$(".mui-action-back").unbind("tap").bind("tap",function(){
//		if(systemsource == "ios"){
//			objcObject.OpenUrl("back");
//		}else if(systemsource == "android"){
//			android.goBack();
//		}
history.back();
	});
})


/* 设置滑动区域 */
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height() - 10;
	$(".content").height(Scrollheight + "px");
	$(".content").css("overflow","auto");
};