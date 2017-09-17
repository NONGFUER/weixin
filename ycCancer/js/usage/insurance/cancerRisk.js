//点击三个banner图
//点击banner图，获取ccId
var ccid = "";
$(function(){
	$(".risk_detail").unbind("tap").bind("tap",function(){
		ccId = $(this).attr("data-ccid");
		mobile = "13852291705";
		customerId = "812";
		roleType = "01";
		var jsonKey = makeJsonKey(ccId,mobile,customerId,roleType);
		window.location.href = 'productDetail.html?jsonKey='+jsonKey;
	});
});

function makeJsonKey(ccId,mobile,customerId,roleType){
	var urlParm = {};
	urlParm.mobile = mobile;//手机号
	urlParm.customerId = customerId;//
	urlParm.roleType = roleType;//
	urlParm.ccId = ccId;//	
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	return jsonStr;
}