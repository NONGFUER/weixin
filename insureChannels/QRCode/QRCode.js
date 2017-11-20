$(function(){
	productQR();
});

function productQR(){
	var url = base.url +'productCommon/productQR.do';
	var reqData = {
		"head":{
			"channel" : "02",
            "userCode" : mobile,
            "transTime" : $.getTimeStr(),
            "transToken": ""
		},
		"body":{
			"customerId": customerId,
			"url": urlParm.lastUrl,
			"flag":"1"//1产品列表，2产品详情
		}			
	}
	$.reqAjaxs( url, reqData, productQRCallback );
}

function productQRCallback(data){
	console.log(data);
	$("#QRCode").attr("src",data.returns.QRUrl);
}