var orderNo;
var customerId;
$(function(){
	var str =getUrlQueryString("jsonKey");
	str = UrlDecode(str);
	urlParm = JSON.parse(str);
	customerId=urlParm.customerId;
	serialNo=urlParm.serialNo;
	orderNo = urlParm.orderNo;
	ccId = urlParm.ccId;
	console.log(urlParm)
	$("#module_new_header .iconfont").attr("href","insure.html"+window.location.search);//返回
	$.setscrollarea("jwx_policy");
	/**网点代码***/
	$("#dotCode").change(function(){
		$("#dotCode").val($("#dotCode").val().toUpperCase());
		var dotCode=$("#dotCode").val();
		checkDotCode(dotCode)
	})
	
	$("#next").bind("tap",function(){
		saveChannelInfo();
	})
	/**页面初始化****/
	init();
});


/**页面初始化****/
function init(){
	var url = base.url + "cancerRisk/queryLatestInfo.do";
	var reqData = {
		"head":{
			"channel":"01",
			"userCode":"",
			"transTime":$.getTimeStr()
		},"body":{
			'customerId' : customerId,
			'orderNo':orderNo
		}
	}	
	$.toAjaxs(url,reqData,function(data){
	    if(data.statusCode == "000000") {
	    	if(data.returns.salesmanPostOffice!=null){
	    		$("#dotName").attr("data-code",data.returns.salesmanPostOffice.branchCompanyCode);
		    	$("#dotName").attr("data-midcode",data.returns.salesmanPostOffice.midBranchCompanyCode);
	    		$("#dotCode").val(data.returns.salesmanPostOffice.dotCode);
	    		$("#dotName").val(data.returns.salesmanPostOffice.dotName);
		    	$("#institutionName").val(data.returns.salesmanPostOffice.institutionName);
		    	$("#cityName").val(data.returns.salesmanPostOffice.cityName);
		    	$("#cityXy").val(data.returns.salesmanPostOffice.cityXy);
		    	$("#agentCode").val(data.returns.salesmanPostOffice.agentCode);
		    	$("#salesmanName").val(data.returns.salesmanPostOffice.salesmanName);
	    	}
	    }else {
		   modelAlert(data.statusMessage);
		}
	});
}

/**邮储网点代码校验****/
function checkDotCode(dotCode){
	if($.isNull(dotCode)){
		modelAlert("请输入邮储网点代码！");
		$("#dotName,#institutionName,#cityName,#cityXy,#agentCode,#salesmanName").val("");
		return false;
	}else{
		if(!/^[a-zA-Z0-9]{12}$/.test(dotCode)){
			modelAlert("请输入正确的邮储网点代码！");
			$("#dotName,#institutionName,#cityName,#cityXy,#agentCode,#salesmanName").val("");
			return false;
		}else{
			queryChannelInfo(dotCode)
		}
	}
	return true;
}
/**通过邮储网点代码查询渠道信息****/
function queryChannelInfo(dotCode){
	var url = base.url + "cancerRisk/queryChannelInfo.do";
	var reqData = {
		"head":{
			"channel":"01",
			"userCode":"",
			"transTime":$.getTimeStr()
		},"body":{
			'dotCode' : dotCode

		}
	}	
	$.toAjaxs(url,reqData,function(data){
	    if(data.statusCode == "000000") {
	    	$("#dotName").attr("data-code",data.returns.bxFaxSalesman.branchCompanyCode);
	    	$("#dotName").attr("data-midcode",data.returns.bxFaxSalesman.midBranchCompanyCode);
	    	$("#dotName").val(data.returns.bxFaxSalesman.dotName);
	    	$("#institutionName").val(data.returns.bxFaxSalesman.institutionName);
	    	$("#cityName").val(data.returns.bxFaxSalesman.cityName);
	    	$("#cityXy").val(data.returns.bxFaxSalesman.cityXy);
	    	$("#agentCode").val(data.returns.bxFaxSalesman.agentCode);
	    	$("#salesmanName").val(data.returns.bxFaxSalesman.salesmanName);
	    }else {
		   modelAlert(data.statusMessage);
		   $("#dotName,#institutionName,#cityName,#cityXy,#agentCode,#salesmanName").val("");
		}
	});
}





/**保存渠道信息****/
function saveChannelInfo(){
	if(!$.isNull($("#salesmanName").val())){
		var url = base.url + "cancerRisk/saveChannelInfo.do";
		var reqData = {
			"head":{
				"channel":"01",
				"userCode":"",
				"transTime":$.getTimeStr()
			},"body":{
				'salesmanPostOffice' : {
					"orderNo":orderNo,
					"dotCode":$("#dotCode").val().toUpperCase(),
					"dotName":$("#dotName").val(),
			    	"institutionName":$("#institutionName").val(),
			        "cityName":$("#cityName").val(),
			        "cityXy":$("#cityXy").val(),
			        "agentCode":$("#agentCode").val(),
			        "salesmanName":$("#salesmanName").val(),
			        "branchCompanyCode":$("#dotName").attr("data-code"),
			        "midBranchCompanyCode":$("#dotName").attr("data-midcode")
				},
				"orderNo":orderNo
	
			}
		}	
		$.toAjaxs(url,reqData,function(data){
		    if(data.statusCode == "000000") {
		    	payRequest(urlParm.serialNo)//核保成功,调支付接口		    	
		    }else {
			   modelAlert(data.statusMessage);
			}
		});
	}else{
		modelAlert("请输入合法的邮储网点代码！");
	}
}


////////////////////////////////////////////////////////////


/*支付接口*/
function payRequest(serialNo){
	if( ccId != "1" && ccId != "2" && ccId != "3"){
		var url = requestUrl.ecardPay;
	}else{
		var url = requestUrl.cancerPay;
	}
	var reqData = {
	    "head":{
	        "channel":"01",
	        "userCode":mobile,
	        "transTime":$.getTimeStr()
	    },"body":{
	        "serialNo":serialNo	       
	    }
	}
	reqData.body.orderResource = "8";
		
	$.toAjaxs(url,reqData,payReturnReponse);
}

//支付回调
function payReturnReponse(data){
	if(data.statusCode == "000000") {
	    $("#requestDoc").val(data.returns.pay);
	    $("#f1").attr("action", data.returns.payUrl);
	    $("form").submit();
	}else {
	    modelAlert(data.statusMessage);
	}
}