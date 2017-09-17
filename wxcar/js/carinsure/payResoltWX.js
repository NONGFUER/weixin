var i=0;
var issueChannel;//渠道
$(function(){
	 orderNo = GetQueryString('orderNo');
	 /**---请求后台查询信息-----*/
	 setTimeout(function(){
		 toInitAjax();
	 }, 5000)
	 
	$.setscrollarea("indexpart");	

	/**-----返回------*/
	$(".ps_appload").on("tap",function(){
		if(issueChannel=="08"){
			window.location.href="http://wap.maquee.cn/MyInformation/Index";
		}else if(issueChannel=="09"){
			window.location.href="https://app.660pp.com/api/insurance/tianan.php";
		}else{
			WeixinJSBridge.call('closeWindow');
		}
	});
});
function GetQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 


/*显示的信息*/
function init(data,orderStatus){
	$(".ps_paydingdan").html(GetQueryString("orderNo"));
	$(".orderTime").html(data.returns.gfbCxOrder.insertTime);
	var orderStatusName="";
	if(orderStatus=="07"){
		orderStatusName="支付成功";
	}else if(orderStatus=="06"){
		orderStatusName="支付失败";
	}else if(orderStatus=="09"){
		orderStatusName="待生效";
	}else if(orderStatus=="10"){
		orderStatusName="承保成功";
	}
	$(".orderStatus").html(orderStatusName);
	if(orderStatus== "07"||orderStatus== "09"||orderStatus== "10"){
		$(".payResult").html("支付成功");
		$(".orderMoney").html(data.returns.gfbCxOffer.totalPre);
		$(".ps_payicon img").attr("src","../../images/pay.png");
	}else {
		$(".payResult").html("支付失败");
		$(".ps_payicon img").attr("src","../../images/payf.png");
		$(".fee").hide();
	}
	issueChannel=data.returns.gfbCxOrder.issueChannel;
	$(".indexpart").show();
	$(".ajax_prevent").remove();
}
/**---请求后台查询信息-----*/
function toInitAjax(){
	++i;
	 var url=base.url + "vi/queryCarPayStatus.do";
	 var reqData={
			"head":{
				"userCode":"",
				"transTime":$.getTimeStr(),
				"channel":"1"
			},"body":{
				"orderNo":orderNo,
			}
		}
	var requestJson = aesEncrypt(JSON.stringify(reqData), secretKey, secretKey);
	requestJson=URLencodeForBase64(requestJson);
	$.ajax({
		url : url,
		type : 'POST',
		data : "jsonKey=" + requestJson,
		dataType : "json",
		timeout : 60000,
		success : function(data) {
			console.log(data);
			if(data.statusCode=="000000"){
				 var orderStatus=data.returns.gfbCxOrder.orderStatus;
				 if(orderStatus!="05"){
					 init(data,orderStatus);
				 }else{
					 if(i>=2){
						 mui.alert("订单异常，请联系管理员","温馨提示");
						 
					 }else{
						 toInitAjax();
					 }
				 }
				 
			}else{
				mui.alert(data.statusMessage,"温馨提示");
			}
			
		},
		error : function(data) {
			$(".ajax_prevent").remove();
			modelAlert("网络好像开小差了呢，请设置给力一点儿网络吧！");
		},
		async : true,
	});
}

