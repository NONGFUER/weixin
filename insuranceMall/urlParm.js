//?cusId=812&mobile=13852291705&roletype=01&openid=ohNt9vx44UP2EnqzE6_C2dOXZQ4Q
if(getUrlQueryString("jsonKey")){
	var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
	var mobile = urlParm.mobile + '';
	var customerId = urlParm.customerId + '';
	var roleType = urlParm.roleType + '';
	var openid = urlParm.openid;
	var provinceCode = '';
	var cityCode = '';
	var agentId = '';
}else{
	var urlParm = {};
	var mobile     = getUrlQueryString("mobile") ? getUrlQueryString("mobile")+"" : "";
	var customerId = (getUrlQueryString("cusId") && getUrlQueryString("cusId") != 'null') ? getUrlQueryString("cusId")+"" : "";
	var roleType   = getUrlQueryString("roletype")+ '' ? getUrlQueryString("roletype")+"" : "";
	var openid	   = getUrlQueryString("openid")+ '' ? getUrlQueryString("openid")+"" : "";
	var ctName = getUrlQueryString("cityName")+ '' ? getUrlQueryString("cityName")+"" : "";
	var ctCode = getUrlQueryString("cityCode")+ '' ? getUrlQueryString("cityCode")+"" : "";
	var agentId = getUrlQueryString("agentId")+ '' ? getUrlQueryString("agentId")+"" : "";
	var provinceCode = $.isNull(getUrlQueryString("provinceCode")) ? '' :getUrlQueryString("provinceCode");
	var cityCode = $.isNull(getUrlQueryString("cityCode")) ? '' :getUrlQueryString("cityCode");
	var shareFlag =$.isNull(getUrlQueryString("shareFlag")) ? '' :getUrlQueryString("shareFlag");
	urlParm.mobile     = mobile;
	urlParm.customerId = customerId;
	urlParm.roleType   = roleType;
	urlParm.openid     = openid;
	urlParm.shareFlag  = shareFlag;
}


