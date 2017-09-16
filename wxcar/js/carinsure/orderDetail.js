var comparyCode = "";// 车险保险公司编号
var cxSessionId = "";// 车险投保唯一流水号"15061915143671823305";
var fromFlag = "";// 来自跳转页面标志
var isShowBtn = "";// N  从车险列表进入
var bxfromFlag="";//1-订单列表进入  2-保单列表进入
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
var times=0;
$(function() {
	/* 设置滑动区域 */
	$.setscroll();
	var str = window.location.search;
	str = str.substr(9, str.length);
	str = UrlDecode(str);
	parm = JSON.parse(str);
	console.log(parm)
	isShowBtn = parm.body.isShowBtn;
	cxSessionId = parm.body.cxSessionId;
	$("#order_index").css("height",($("body").height() - $("header").height() + "px"));
	$("#indexpart").css("padding-bottom", "10rem");
	$("#indexpart_scroll").css("padding-bottom", "10rem");
	/**---分享功能----*/
	var method=function(){
		wx.showMenuItems({
		    menuList: ['menuItem:share:appMessage'] // 要显示的菜单项
		});
		var shareStr={
				"body":{
					"cxSessionId":cxSessionId
				}
		}
		shareStr = JSON.stringify(shareStr);
		shareStr = UrlEncode(shareStr); // 加密过后的操作
		var shareurl=base.url+'cxweixin/html/carinsure/shareOrderDetail.html?jsonStr='+shareStr;// 分享链接
		var shareImgUrl=base.url+"cxweixin/img/carshare.png";
		//分享给朋友
		wx.onMenuShareAppMessage({
		    title: '同道出行', // 分享标题
		    desc: '专业车险在线展业平台', // 分享描述
		    link:shareurl , // 分享链接
		    imgUrl: shareImgUrl, // 分享图标
		    type: '', // 分享类型,music、video或link，不填默认为link
		    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		    success: function () { 
		        // 用户确认分享后执行的回调函数
		       // mui.alert("您已成功分享给好友！","温馨提示");
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		    	mui.alert("您取消了分享！","温馨提示");
		    }
		});
	}
	if(parm.head.fromtype!=null){
		$("#hebao,#pay").css("width","90%");
		$(".shareBtn").hide();
	}else{
		getConfig(method); 
	}

	
	if (!$.isNull(fromFlag) && fromFlag == "payhtml") {// 从支付页面过来
		$("#changeChar").show("fast");
		$("#backbtm").hide();
	} else {
		$("#changeChar").hide();
		$("#backbtm").show("fast");
	}
	
	//返回按钮
	$(".h_back").unbind("tap").bind("tap",function() {
		   if(isShowBtn=="N"){
			   bxfromFlag=parm.body.bxfromFlag;
			   if(bxfromFlag=="1"){
				   window.location.href = "PolicyManagement.html?mobile=" + parm.head.userName;
			   }else if(bxfromFlag=="2"){
				   window.location.href = "policyQuery.html?mobile=" + parm.head.userName+"&type=1";
			   }
		   }else{
			   var backParam={
				"agentId":parm.head.agentId,   
				"phone": parm.head.userName,
				"type":"1"
			   }
			   var jsonStr = JSON.stringify(backParam);
			   jsonStr = UrlEncode(jsonStr);
			   window.location.href = base.url+"tongdaoApp/page/html/users/policyManange.html?jsonKey=" + jsonStr;		
		   }
			
	});

	/**--返回列表----*/
	$("#btn_backHome").unbind("tap").bind("tap",function() {
		window.location.href = "PolicyManagement.html?mobile=" + parm.head.userName;
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
	// 取消遮罩
	$("#zhezhaoImg").on("tap",function(){
		$("#zhezhaoImg").hide();
	});
	// 确认并提交（进行核保）
	$("#hebao").unbind("tap").bind("tap",function() {
		++times;
		var url = base.url + "vi/orderConfirm.do";
		var data = {
			"sessionId" : cxSessionId,// 车险投保唯一流水号
			"source" : parm.head.source,  //调用微信的来源
			"tradeNo":tradeNo,
			"times":times,
			"transTime":$.getTimeStr(),
		};
		if(times==1){
			$.toAjaxs(url, data, $.hebaoBack);
		}
	
	});
	/**--确认并提交 分享按钮*/
	$("#btn_area .shareBtn").on("tap",function(){
		++times;
		var url = base.url + "vi/orderConfirm.do";
		var data = {
			"sessionId" : cxSessionId,// 车险投保唯一流水号
			"source" : parm.head.source,  //调用微信的来源
			"tradeNo":tradeNo,
			"times":times,
			"transTime":$.getTimeStr(),
		};
		if(times==1){
			$.toAjaxs(url, data, $.shareHebaoBack);
		}
    });
	/**--去支付 分享按钮*/
	$("#topay_btn_area .shareBtn").on("tap",function(){
		$("#zhezhaoImg").show();
	});
	// 去支付按钮
	$("#pay").unbind("tap").bind("tap",function() {
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
			// 退保
			if (param.returns.cxOrder.orderStatus == "9900") {
				modelAlert(param.returns.cxOrder.refuseReason);
				$("#btn_area").hide();
				$("#hebaoFail_reason_area").show();
				// 核保失败原因
				$("#failName").html("退保原因原因");// 核保失败原因
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
			// 支付成功
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
/**
 * 分享核保回调
 */
$.shareHebaoBack = function(param) {
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
			// 退保
			if (param.returns.cxOrder.orderStatus == "9900") {
				modelAlert(param.returns.cxOrder.refuseReason);
				$("#btn_area").hide();
				$("#hebaoFail_reason_area").show();
				// 核保失败原因
				$("#failName").html("退保原因原因");// 核保失败原因
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
			// 代支付
			if (param.returns.cxOrder.orderStatus == "05") {
				payUrl=param.returns.cxOrder.payUrl;
			    $("#btn_area").hide();
			    $("#topay_btn_area").show();
			    $("#zhezhaoImg").show();
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
      if (param != null || param != "") {
		orderPrams = JSON.stringify(param);// 传递参数到详情页面
		if (param.status.statusCode == "000000") {
			if (param.cxInfo != null) {
				tradeNo=param.cxInfo.cxOrder.tradeno;
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
//					$("#btn_area").hide();
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
				
				if(cxorderStatus=="05"){	
					$("#orderStatus").html("待支付");	
				}else if(cxorderStatus=="03"){	
					$("#orderStatus").html("核保失败");	
				}else if(cxorderStatus=="04"){	
					$("#orderStatus").html("核保中");
				}else if(cxorderStatus=="07"){	
					$("#orderStatus").html("支付成功");
				}else if(cxorderStatus=="06"){
					$("#orderStatus").html("支付失败");
				}else if(cxorderStatus=="10"){	
					$("#orderStatus").html("承保成功");
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

				// 投保人姓名
				phName = param.cxInfo.cxParty.phname;
				if (!$.isNull(param.cxInfo.cxOrder.businessAppno)) {
					proNo = param.cxInfo.cxOrder.businessAppno;// 投保单号
				} else {
					proNo = param.cxInfo.cxOrder.forceAppno;// 投保单号
				}
                
				//出单人员信息
				$("#cdArea").html(param.cxInfo.cxOrder.cdProvinceName+param.cxInfo.cxOrder.cdCityName);
				$("#cdName").html(param.cxInfo.cxOrder.cdName);
				$("#cdWorkno").html(param.cxInfo.cxOrder.cdWorkno);
				$("#hzCompanyName").html(param.cxInfo.cxOrder.hzCompanyName);
				if(param.cxInfo.cxOrder.hzProvinceName!=null){
				    $("#hzArea").html(param.cxInfo.cxOrder.hzProvinceName+param.cxInfo.cxOrder.hzCityName);
				}
				$("#hzWorkno").html(param.cxInfo.cxOrder.hzWorkno);
				$("#hzName").html(param.cxInfo.cxOrder.hzName);
				$("#hzPhone").html(param.cxInfo.cxOrder.hzPhone);
				$("#hzNote").html(param.cxInfo.cxOrder.hzNote);
				var channelCode=param.cxInfo.cxOrder.issueChannel;//出单渠道
				if(channelCode!=null&&channelCode!=""){
					$("#channel").html(changeChannel(channelCode));//通过渠道代码获取渠道名称
					if(channelCode!="01"){//非佰盈渠道（银行渠道） "备注"显示为"网点信息"
						$("#noteLabel").html("网点信息");
					}
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
