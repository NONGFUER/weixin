var cxSessionId = "";// 车险投保唯一流水号;
var orderPrams = "";// 页面传递订单信息
var cxorderStatus = "";// 订单状态
var orderNos = "";
var payUrl = "";
var parm;
$(function() {
	/* 设置滑动区域 */
	$.setscroll();
	var str = window.location.search;
	str = str.substr(9, str.length);
	str = UrlDecode(str);
	parm = JSON.parse(str);
	cxSessionId = parm.body.cxSessionId;
	var issueChannel=parm.head.issueChannel;
	$("#order_index").css("height",($("body").height() - $("header").height() + "px"));
	$("#indexpart").css("padding-bottom", "10rem");
	$("#indexpart_scroll").css("padding-bottom", "10rem");
	
	//返回按钮
	$(".h_back").unbind("tap").bind("tap",function() {
		window.location.href = "policyManagement.html?userId=" + parm.head.userName+"&issueChannel="+issueChannel;
	});

	/**--返回列表----*/
	$("#btn_backHome").unbind("tap").bind("tap",function() {
		window.location.href = "policyManagement.html?userId=" + parm.head.userName+"&issueChannel="+issueChannel;
	});

	// 获取订单信息
	$.loadOrderInf();
	
	$(".ul_left img").attr("src",base.imagePath + "carinsure/moneybtn.png");
	// 查看详细投保信息
	$("#see_details").unbind("tap").bind("tap",function() {
		parm.body.orderNos = orderNos;
		var jsonStr = JSON.stringify(parm);
		jsonStr = UrlEncode(jsonStr); // 加密过后的操作
		window.location.href = "insureMes.html?jsonStr=" + jsonStr;
	});
	// 去支付按钮
	$("#pay").unbind("tap").bind("tap",function() {
		 window.location.href =payUrl;
	});
});

// 获取订单信息模块初始化
$.loadOrderInf = function() {
	var url = base.url + "cx/getAllInfo.do";
	var data = {
		"sessionId" : cxSessionId,// 车险投保唯一流水号
	};
	$.toAjaxs(url, data, $.loadData);
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
				cxorderStatus = param.cxInfo.cxOrder.orderStatus;// 订单状态
				// 订单号
				orderNos = param.cxInfo.cxOrder.orderNo;
				$("#orderno").html(orderNos);// A123456789012345657
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
				if (cxorderStatus == '05') {//“去支付”按钮显示
					payUrl = param.cxInfo.cxOrder.payUrl;
					$("#topay_btn_area").show();
					$("#orderStatus").html("待支付");
				}else if (cxorderStatus == "03") {// “核保失败”状态，显示核保失败原因
					$("#hebaoFail_reason_area").show();
					// 核保失败原因
					$("#failName").html("核保失败原因");// 核保失败原因
					$("#hebaoFailInfo").html(param.cxInfo.cxOrder.refuseReason);// 核保失败原因
					$("#orderStatus").html("核保失败");
				}else if (cxorderStatus == "04") {// “审核中”状态
					$("#hebaoFail_reason_area").show();
					// 审核中
					$("#failName").html("审核中");// 审核中
					$("#hebaoFailInfo").html(param.returns.cxOrder.refuseReason);// 审核中
					$("#orderStatus").html("核保中");
				}else if (cxorderStatus == "06") {// “支付失败”状态，显示支付失败原因
					$("#hebaoFail_reason_area").show();
					// 支付失败原因
					$("#failName").html("支付失败原因");// 支付失败原因
					$("#hebaoFailInfo").html(param.cxInfo.cxOrder.refuseReason);// 支付失败原因
					$("#orderStatus").html("支付失败");
				}else if(cxorderStatus=="09"){
					$("#orderStatus").html("承保成功");	
				}else if(cxorderStatus=="10"){
					$("#orderStatus").html("保障中");
				}else if(cxorderStatus=="02"){
					$("#orderStatus").html("已过期");				
				}else if(cxorderStatus=="99"){
					$("#orderStatus").html("已失效");
				}
				// 总保费
				$("#summoney").html("￥"+ $.formatNumOfTwo(param.cxInfo.cxOffer.totalpremium));// ￥7200.00

				// 商业险保费
				$("#busmoney").html($.formatNumOfTwo(param.cxInfo.cxOffer.businessPre)+"元");// 6000.00

				// 交强险保费
				$("#jqxmoney").html($.formatNumOfTwo(param.cxInfo.cxOffer.jqxPre)+"元");// 900.00

				// 车船税
				$("#vehiclemoney").html($.formatNumOfTwo(param.cxInfo.cxOffer.vehicletaxPre)+"元");// 300.00
			}
		} else {
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
