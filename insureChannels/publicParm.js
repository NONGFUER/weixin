if(getUrlQueryString("jsonKey")){
	var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));	
}else{
	var urlParm = {};
	urlParm.openid = getUrlQueryString("openid");
	urlParm.roleType = getUrlQueryString("roletype");
	urlParm.shareMobile = getUrlQueryString("shareMobile");
	urlParm.shareCusId = getUrlQueryString("shareCusId");
	urlParm.provinceCode = getUrlQueryString("provinceCode");
	urlParm.cityCode = getUrlQueryString("cityCode");
	urlParm.ccId = getUrlQueryString("ccId");
	urlParm.customerId = getUrlQueryString("customerId") ? getUrlQueryString("customerId"):"";
	urlParm.shareFlag = getUrlQueryString("shareFlag");
	urlParm.mobile = getUrlQueryString("mobile") ? getUrlQueryString("mobile") : "";
	urlParm.entry = getUrlQueryString("entry") ? getUrlQueryString("entry") : "app";
	urlParm.agentId = getUrlQueryString("agentId") ? getUrlQueryString("agentId") : "";
	urlParm.salesChannels = getUrlQueryString("salesChannels") ? getUrlQueryString("salesChannels") : "";
}
var mobile = urlParm.mobile + '';
var customerId = urlParm.customerId + '';
var roleType = urlParm.roleType + '';
//var openid = urlParm.openid;
var provinceCode = urlParm.provinceCode + '';
var cityCode = urlParm.cityCode + '';
var agentId = urlParm.agentId + '';
var salesChannels = urlParm.salesChannels + '';
if(urlParm.shareFlag != 'Y'){
	$('#local').removeClass('yincang')
}