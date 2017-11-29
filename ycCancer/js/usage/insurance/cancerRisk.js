//点击三个banner图
//点击banner图，获取ccId
var ccid = "";
$(function(){
	$(".risk_detail").unbind("tap").bind("tap",function(){
		ccId = $(this).attr("data-ccid");
		mobile = getUrlQueryString("mobile") ? getUrlQueryString("mobile") : "";//"13852291705";
		customerId = getUrlQueryString("cusId") ? getUrlQueryString("cusId") : "";//"812";
		roleType = getUrlQueryString("type") ? getUrlQueryString("type") : "";//"01";
		openid = getUrlQueryString("openid") ? getUrlQueryString("openid") : "";
		var jsonKey = makeJsonKey(ccId,mobile,customerId,roleType,openid);
		window.location.href = 'productDetail.html?jsonKey='+jsonKey;
	});
});

function makeJsonKey(ccId,mobile,customerId,roleType,openid){
	var urlParm = {};
	urlParm.mobile = mobile;//手机号
	urlParm.customerId = customerId;//
	urlParm.roleType = roleType;//
	urlParm.ccId = ccId;//	
	urlParm.openid = openid;//
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	return jsonStr;
}
function backlast(){
	
}