var comparyCode = "";// 车险保险公司编号
var cxSessionId = "";// 车险投保唯一流水号"15061915143671823305";
var fromFlag = "";// 来自跳转页面标志
var isShowBtn = "";// N  从车险列表进入
var orderPrams = "";// 页面传递订单信息
var proNo = "";// 投保单号 有商业用商业 没有商业用交强
var phName = "";// 投保人姓名
var interveneFlag = "00";// 人工干预标志 00-直接提交 01-人工干预
var cxorderStatus = "";// 订单状态
var myScroll;
var orderNos = "";
var sessionId = "";
var payUrl = "";
var parm;
var tradeNo;
$(function() {
	/* 设置滑动区域 */
	$.setscroll();
	var str = getUrlQueryString("jsonKey");
	str = UrlDecode(str);
	parm = JSON.parse(str);
	console.log(parm)
	cxSessionId = parm.body.cxSessionId;
	$("#order_index").css("height",($("body").height() - $("header").height() + "px"));
	$("#indexpart").css("padding-bottom", "10rem");
	$("#indexpart_scroll").css("padding-bottom", "10rem");


	

	

	//返回按钮
	$(".h_back,#btn_backHome").unbind("tap").bind("tap",function() {
		WeixinJSBridge.call('closeWindow');
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

	// 确认并提交（进行核保）
	$("#btn_area").unbind("tap").bind("tap",function() {
		var url = base.url + "vi/orderConfirm.do";
		console.log(cxSessionId)
		var data = {
			"sessionId" : cxSessionId,// 车险投保唯一流水号
			"source" : "2",  //调用微信的来源
			"tradeNo":tradeNo
		};
		$.toAjaxs(url, data, $.hebaoBack);
	});

	// 去支付按钮
	$("#topay_btn_area").unbind("tap").bind("tap",function() {
		window.open(payUrl);
	});
});

/**
 * 核保回调
 */
$.hebaoBack = function(param) {
   if (param != null || param != "") {
		if (param.statusCode == "000000") {
			// 核保失败
			if (param.returns.cxOrder.orderStatus == "03") {
				modelAlert(param.returns.cxOrder.refuseReason);
				$("#btn_area").hide();
				$("#hebaoFail_reason_area").show();
				// 核保失败原因
				$("#failName").html("核保失败原因");// 核保失败原因
				$("#hebaoFailInfo").html(param.returns.cxOrder.refuseReason);// 核保失败原因
				if (!$.isNull(param.returns.cxOrder.businessAppno)) {
					$("#businessAppnoArea").show("fast");
					// 商业险投保单号
					$("#businessAppno").html(param.returns.cxOrder.businessAppno);// 商业险投保单号
				}
				if (!$.isNull(param.returns.cxOrder.forceAppno)) {
					$("#forceAppnoArea").show("fast");
					// 交强险保单号
					$("#forceAppno").html(param.returns.cxOrder.forceAppno);// 交强险投保单号
				}
			}
		
			// 待支付
			if (param.returns.cxOrder.orderStatus == "05") {
				payUrl=param.returns.cxOrder.payUrl;
			    window.location.href =payUrl;
			}
			// 审核中
			if (param.returns.cxOrder.orderStatus == "04") {
				modelAlert(param.returns.cxOrder.refuseReason);
				$("#btn_area").hide();
				$("#hebaoFail_reason_area").show();
				// 审核中
				$("#failName").html("审核中");// 审核中
				$("#hebaoFailInfo").html(param.returns.cxOrder.refuseReason);// 审核中
				
				if (!$.isNull(param.returns.cxOrder.businessAppno)) {
					$("#businessAppnoArea").show("fast");
					// 商业险投保单号
					$("#businessAppno").html(param.returns.cxOrder.businessAppno);// 商业险投保单号
				}
				if (!$.isNull(param.returns.cxOrder.forceAppno)) {
					$("#forceAppnoArea").show("fast");
					// 交强险保单号
					$("#forceAppno").html(param.returns.cxOrder.forceAppno);// 交强险投保单号
				}
			}
		} else {
			modelAlert(param.statusMessage);
		}
	}
};

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
      console.log(param)
      if (param != null || param != "") {
		orderPrams = JSON.stringify(param);// 传递参数到详情页面
		if (param.status.statusCode == "000000") {
			if (param.cxInfo != null) {
				tradeNo=param.cxInfo.cxOrder.tradeno;
				cxorderStatus = param.cxInfo.cxOrder.orderStatus;// 订单状态
				// 订单号
				orderNos = param.cxInfo.cxOrder.orderNo;
				$("#orderno").html(orderNos);// A123456789012345657
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

				if (!$.isNull(fromFlag) && fromFlag == "policyDistribution"&& cxorderStatus == "03") {// 从保单配送页面过来
					$("#changeChar").show();
					$("#backbtm").hide();
				}
				
				if (cxorderStatus == "03") {// “核保失败”状态，显示核保失败原因
					$("#hebaoFail_reason_area").show();
					// 核保失败原因
					$("#failName").html("核保失败原因");// 核保失败原因
					$("#hebaoFailInfo").html(
							param.cxInfo.cxOrder.refuseReason);// 核保失败原因
				} else if (cxorderStatus == "06") {// “支付失败”状态，显示支付失败原因
					$("#hebaoFail_reason_area").show();
					// 支付失败原因
					$("#failName").html("支付失败原因");// 支付失败原因
					$("#hebaoFailInfo").html(
							param.cxInfo.cxOrder.refuseReason);// 支付失败原因
				} else {
					$("#hebaoFail_reason_area").hide();
				}
				if (cxorderStatus == '10') {//已承保，不显示操作按钮
					$("#btn_area").hide();
					$("#topay_btn_area").hide();
				}else if (cxorderStatus == '05') {// “核保通过”状态，“去支付”按钮显示
					payUrl = param.cxInfo.cxOrder.payUrl;
					sessionStorage.setItem("payUrl",payUrl);
					$("#btn_area").hide();
					$("#topay_btn_area").show();
				}else if(cxorderStatus == '01'){  //“未提交”状态
					$("#btn_area").show();
					$("#topay_btn_area").hide();
				}else if(cxorderStatus == '04'){ //核保中
					$("#btn_area").hide();
					$("#topay_btn_area").hide();
				}else{
					$("#btn_area").hide();
					$("#topay_btn_area").hide();
				}


				// 总保费
				$("#summoney").html("￥"+ $.formatNumOfTwo(param.cxInfo.cxOffer.totalpremium));// ￥7200.00

				// 商业险保费
				$("#busmoney").html($.formatNumOfTwo(param.cxInfo.cxOffer.businessPre)+"元");// 6000.00

				// 交强险保费
				$("#jqxmoney").html($.formatNumOfTwo(param.cxInfo.cxOffer.jqxPre)+"元");// 900.00

				// 车船税
				$("#vehiclemoney").html($.formatNumOfTwo(param.cxInfo.cxOffer.vehicletaxPre)+"元");// 300.00

				// 投保人姓名
				phName = param.cxInfo.cxParty.phname;
				if (!$.isNull(param.cxInfo.cxOrder.businessAppno)) {
					proNo = param.cxInfo.cxOrder.businessAppno;// 投保单号
				} else {
					proNo = param.cxInfo.cxOrder.forceAppno;// 投保单号
				}
                
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
