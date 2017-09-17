var globalno="";
var appno="";
var polno="";
var cxSessionId = "";
$(function() {
	/* 设置滑动区域 */
	$.setscroll();
	globalno=getUrlQueryString("globalno"); 
	appno=getUrlQueryString("appno");
	polno=getUrlQueryString("polno");
	$("#order_index").css("height",($("body").height() - $("header").height() + "px"));
	
	//返回按钮
	$(".h_back").unbind("tap").bind("tap",function() {
		window.history.go(-2);
	});


	// 获取订单信息
	$.loadOrderInf();
	
	// 查看详细投保信息
	$("#see_details").unbind("tap").bind("tap",function() {
		var parm={
			"body":{
				"cxSessionId":cxSessionId
			}	
		}
		var jsonStr = JSON.stringify(parm);
		jsonStr = UrlEncode(jsonStr); // 加密过后的操作
		window.location.href = "insureMes.html?jsonStr=" + jsonStr;
	});
	
});


// 获取订单信息模块初始化
$.loadOrderInf = function() {
	var url = base.url + "dhController/dhOrderQuery.do";
	var data = {
		'head':{
			'userCode': "",
			'transTime':$.getTimeStr(),
			'channel':"1",  //来源
		},'body':{
			'globalno':globalno, 
		    'appno':appno,
			'polno':polno
		}
	};
	$.reqAjaxs(url, data, $.loadData);
};
/**
 * 获取订单信息回调
 */
$.loadData = function(param) {
	param = eval("(" + param + ")");
      if (param != null || param != "") {
		orderPrams = JSON.stringify(param);// 传递参数到详情页面
		if (param.status.statusCode == "000000") {
			if (param.cxInfo != null) {
				cxSessionId=param.cxInfo.cxOrder.sessionid;
				//投保单号
				cxAppno=param.cxInfo.cxOrder.appno;
				$("#appno").html(cxAppno);
				//保单号
				cxPolno=param.cxInfo.cxOrder.polno;
				$("#polno").html(polno);
				if(polno==undefined){
					$(".appnoLi").show();
				}else{
					$(".polnoLi").show();
				}
				// 车险公司名称
				$("#comtype").html("天安财险");
				$("#version").html(param.cxInfo.cxOrder.commodityName);
				$("#comtype1").html("天安财险保险股份有限公司");
				if (!$.isNull(param.cxInfo.cxOrder.businessAppno)) {
					$("#businessAppnoArea").show("fast");
					// 商业险投保单号
					$("#businessAppno").html(param.cxInfo.cxOrder.businessAppno);// 商业险投保单号
				}
				if (!$.isNull(param.cxInfo.cxOrder.businessPolno)) {
					$("#busPolnoArea").show("fast");
					// 商业险保单号
					$("#busPolno").html(param.cxInfo.cxOrder.businessPolno);// 商业险保单号
				}
				if (!$.isNull(param.cxInfo.cxOrder.forceAppno)) {
					$("#forceAppnoArea").show("fast");
					// 交强险保单号
					$("#forceAppno").html(param.cxInfo.cxOrder.forceAppno);// 交强险投保单号
				}
				if (!$.isNull(param.cxInfo.cxOrder.forcePolno)) {
					$("#jqxPolnoArea").show("fast");
					// 交强险保单号
					$("#jqxPolno").html(param.cxInfo.cxOrder.forcePolno);// 交强险保单号
				}
				if (!$.isNull(param.cxInfo.cxParty.insuredname)) {
					$("#insuredNameArea").show("fast");
					$("#insuredname").html(param.cxInfo.cxParty.insuredname);
				}
				if (!$.isNull(param.cxInfo.cxParty.insuredidno)) {
					$("#insuredNober").show("fast");
					$("#insuredNo").html(param.cxInfo.cxParty.insuredidno);
				}
				if (!$.isNull(param.cxInfo.cxParty.insuredmobile)) {
					$("#insuredMobileArea").show("fast");
					$("#insuredMobile").html(param.cxInfo.cxParty.insuredmobile);
				}
				if (!$.isNull(param.cxInfo.cxOrder.plateno)) {
					$("#plateNoArea").show("fast");
					$("#plateNo").html(param.cxInfo.cxOrder.plateno);
				}
				// 总保费
				$("#summoney").html("￥"+ $.formatNumOfTwo(param.cxInfo.cxOffer.totalpremium));// ￥7200.00

				// 商业险保费
				$("#busmoney").html($.formatNumOfTwo(param.cxInfo.cxOffer.businessPre)+"元");// 6000.00

				// 交强险保费
				$("#jqxmoney").html($.formatNumOfTwo(param.cxInfo.cxOffer.jqxPre)+"元");// 900.00

				// 车船税
				$("#vehiclemoney").html($.formatNumOfTwo(param.cxInfo.cxOffer.vehicletaxPre)+"元");// 300.00
                //保单状态
				var orderStatus=param.cxInfo.cxOrder.orderStatus;
				if(orderStatus=="05"){
					orderStatus="待支付";
				}
				else if(orderStatus=="06"){
					orderStatus="承保失败";
				}
				else if(orderStatus=="07"){
					orderStatus="承保中 ";
				}
				else if(orderStatus=="09"){
					orderStatus="承保成功 ";
				}
				else if(orderStatus=="10"){
					orderStatus="保障中";
				}
				else if(orderStatus=="02"){
					orderStatus="已过期";
				}
				else if(orderStatus=="99"){
					orderStatus="已失效";
				}
				$("#orderStatus").html(orderStatus);
			}
		}else if(param.status.statusCode == "999999") {
			var str = "<div style='position:absolute;width:40%;height:100px;top:200px;left:30%;'><img src='../../images/dh_norecord.png'><P style='text-align:center'>没有相关数据</p></div>";
			$('#order_index').html(str);
		}else{
			modelAlert(param.status.statusMessage);
		}
	} else {
		modelAlert("查询订单信息异常！");
	}
};

/* 设置滑动区域 */
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#order_index").height(Scrollheight);
	mui("#order_index").scroll();
};
