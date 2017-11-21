if(getUrlQueryString("jsonKey")){
	var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
	var mobile = urlParm.mobile + '';
	var customerId = urlParm.customerId + '';
	var roleType = urlParm.roleType + '';
	//var openid = urlParm.openid;
	var provinceCode = urlParm.provinceCode + '';
	var cityCode = urlParm.cityCode + '';
	var agentId = urlParm.agentId + '';
	var salesChannels = '13'//urlParm.salesChannels + '';
}
