var hostname = window.location.hostname;
$(function(){
	mobile=getUrlQueryString("mobile");
	ccId = getUrlQueryString("ccId");
	type = getUrlQueryString("type");
	if(mobile=="" || mobile==null || mobile==undefined){
		mobile="123";
	}
	var shareState = type +"-"+mobile+"-"+ccId;
	//sit:wx8072ddd1e7874afa
	//uat:wxfd8ae5c588d7959f
	//pro:wx8e38f82b04e3d17e
	if(hostname == "td-sit.ta-by.com"){
		window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8072ddd1e7874afa&redirect_uri=http%3A%2F%2Ftd-sit.ta-by.com%2FtongdaoPlatform%2FwxShere%2FwxShere.do&response_type=code&scope=snsapi_base&state='+shareState+'#wechat_redirect';// 分享链接
	}else if(hostname == "td-uat.ta-by.com"){
		window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfd8ae5c588d7959f&redirect_uri=http%3A%2F%2Ftd-uat.ta-by.com%2FtongdaoPlatform%2FwxShere%2FwxShere.do&response_type=code&scope=snsapi_base&state='+shareState+'#wechat_redirect';// 分享链接
	}else if(hostname == "td-pro.ta-by.com"){
		window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8e38f82b04e3d17e&redirect_uri=http%3A%2F%2Ftd-pro.ta-by.com%2FtongdaoPlatform%2FwxShere%2FwxShere.do&response_type=code&scope=snsapi_base&state='+shareState+'#wechat_redirect';// 分享链接
	}
})
