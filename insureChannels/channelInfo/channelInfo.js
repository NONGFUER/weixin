$(function(){
	mui('.mui-scroll-wrapper').scroll({
		deceleration: 0.0005 
	});
	loadArea()		//加载省市选择
	loadChannel()	//
	loadDot()
	validateSalesManInfo()
	queryShowInfo()
	$('#next').unbind('tap').bind('tap',function(){
		toInsuranceMall();
	});
});

function loadArea(){
	var url = base.url + 'channel/loadArea.do';
	var reqData = {}
	$.reqAjaxs( url, reqData, loadAreaCallback );
}

function loadAreaCallback(data){
	console.log("加载城市")
	console.log(data)
}

function loadChannel(){
	var url = base.url + 'channel/loadChannel.do';
	var reqData = {
			'request':{
				"cityCode" : "180002"
			}
	}
	$.reqAjaxs( url, reqData, loadChannelCallback );
}

function loadChannelCallback(data){
	console.log("加载渠道")
	console.log(data)
}

function loadDot(){
	var url = base.url + 'channel/loadDot.do';
	var reqData = {
			'request':{
				"channelCode" : "03"
			}
	}
	$.reqAjaxs( url, reqData, loadDotCallback );
}

function loadDotCallback(data){
	console.log("加载网点")
	console.log(data)
}

function validateSalesManInfo(){
	var url = base.url + 'channel/validateSalesManInfo.do';
	var reqData = {
			'request':{
				"salesManCode" : "01", // 工号
				"channelCode" : "05"
			}
	}
	$.reqAjaxs( url, reqData, validateSalesManInfoCallback );
}

function validateSalesManInfoCallback(data){
	console.log("验证工号")
	console.log(data)
}

function queryShowInfo(){
	var url = base.url + 'channel/queryShowInfo.do';
	var reqData = {
			'request':{
				"customerId" : "89166"
			}
	}
	$.reqAjaxs( url, reqData, queryShowInfoCallback );
}

function queryShowInfoCallback(data){
	console.log(data)
}

function saveShowInfo(){
	var url = base.url + 'channel/saveShowInfo.do';
	var reqData = {
			'request':{
				"customerId" :{ "agentId": "111",
				"bySalesmanCode": "11",
				"bySalesmanName": "1",
				"bySalesmanOrgCode": "1",
				"bySalesmanOrgName": "1",
				"bySalesmanSubOrgCode": "1",
				"bySalesmanSubOrgName": "1",

				"salesProvinceCode": "1",
				"salesProvinceName": "1",
				"salesCityCode": "1",
				"salesCityName": "1",
				"salesChannelCode": "1",
				"salesChannelName": "1",
				"dotCode": "1",
				"dotName": "1",
				"salesmanCode": "1",
				"salesmanMobile": "1",
				"salesmanName": "1"}
			}
	}
	$.reqAjaxs( url, reqData, saveShowInfoCallback );
}

function saveShowInfoCallback(data){
	console.log(data)
}

//跳转到下个页面
function toInsuranceMall(){
	var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + 'weixin/insureChannels/insuranceMall/insuranceMall.html?jsonKey=' + jsonStr;
}