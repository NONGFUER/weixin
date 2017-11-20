/**
 * http://usejsdoc.org/
 */
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
$(function(){
	var picStr = '<img src="'+urlParm.picurl+'" />';
	$(".hetong").append(picStr);
});

function backlast(){
	urlParm.title = "产品详情";
	urlParm.leftIco = "1";
	if( urlParm.roleType != "00" ){
		urlParm.rightIco = "1";
	}else{
		urlParm.rightIco = "0";
	}	
	urlParm.downIco = "0";
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/insurance/main/productDetail.html?jsonKey="+jsonStr;
}