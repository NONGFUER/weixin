/**
 * http://usejsdoc.org/
 */
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
var mobile = urlParm.mobile;
var transToken = urlParm.transToken;
var productId = urlParm.productId;
$(function(){
	getProtocalRequest();
});
function getProtocalRequest( ){
	var url = base.url + "offlineCommodityComDetail/getOfflineProductModuleList.do";
	var sendJson = {
		"head":{
			"channel"  :"01",
            "userCode" :mobile,
            "transTime":$.getTimeStr(),
            "transToken":transToken
		},
		"body":{
			"productId": productId
		}
			
	} 
	$.reqAjaxs( url, sendJson,protocalCallback );
}
function protocalCallback(data){
	console.log(data);
	if(data.statusCode == "000000"){
		var body = data.returns;
		var productModuleList = body.productModuleList;
		var str = "";
		for(var i=0; i < productModuleList.length; i++ ){
			str += '<a class="pdiv" href="'+productModuleList[i].modueInfo+'"><div class="ltk">'+productModuleList[i].moduleName+'</div><div class="rtk">下载</div></a>'
		}
		$(".protocol").append(str);
	}else{
		modelAlert(data.statusMessage);
	}
}
function backlast(){
	urlParm.title = "产品详情";
	urlParm.leftIco = "1";
	urlParm.rightIco = "1";
	urlParm.downIco = "0";
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/insurance/main/liveProductDetail.html?jsonKey="+jsonStr;
}