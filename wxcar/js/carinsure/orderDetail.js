var cxSessionId = "";// 车险投保唯一流水号"15061915143671823305";
var bxfromFlag="";//1-订单列表进入  2-保单列表进入
var orderPrams = "";// 页面传递订单信息
var proNo = "";// 投保单号 有商业用商业 没有商业用交强
var phName = "";// 投保人姓名
var cxorderStatus = "";// 订单状态
var orderNos = "";
var sessionId = "";
var payUrl = "";
var parm;
var tradeNo;
var times=0;
var cxflag;//1-订单  2-保单  3-出单
$(function() {
	/* 设置滑动区域 */
	$.setscroll();
	var str = window.location.search;
	str = str.substr(9, str.length);
	str = UrlDecode(str);
	parm = JSON.parse(str);
	console.log(parm)
	orderNo = parm.orderNo;
	cxflag=parm.cxflag;
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
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		    	mui.alert("您取消了分享！","温馨提示");
		    }
		});
	}
	getConfig(method); 

	
	//返回按钮
	$(".h_back,#btn_backHome").unbind("tap").bind("tap",function() {
          window.history.back();	
	});

	

	// 获取订单信息
	$.loadOrderInf();
	
	$(".ul_left img").attr("src",base.imagePath + "carinsure/moneybtn.png");
	// 查看详细投保信息
	$("#see_details").unbind("tap").bind("tap",function() {
		var body={
			"cxSessionId":cxSessionId,
			"orderNos":orderNos
		}
		parm.body=body;
		var jsonStr = JSON.stringify(parm);
		jsonStr = UrlEncode(jsonStr); // 加密过后的操作
		window.location.href = "insureMes.html?jsonStr=" + jsonStr;
	});
	// 取消遮罩
	$("#zhezhaoImg").on("tap",function(){
		$("#zhezhaoImg").hide();
	});

	/**--去支付 分享按钮*/
	$("#topay_btn_area .shareBtn").on("tap",function(){
		$("#zhezhaoImg").show();
	});
	// 去支付按钮
	$("#pay").unbind("tap").bind("tap",function() {
		window.location.href =payUrl;
	});
});


// 获取订单信息模块初始化
$.loadOrderInf = function() {
	var url = base.url + "cx/getCxAllInfo.do";
	var data = {
		"orderNo" : orderNo,// 车险订单号
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
				cxSessionId=param.cxInfo.cxOrder.sessionid;
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

				
				if (cxorderStatus == "03") {// “核保失败”状态，显示核保失败原因
					$("#hebaoFail_reason_area").show();
					// 核保失败原因
					$("#failName").html("核保失败原因");// 核保失败原因
					$("#hebaoFailInfo").html(param.cxInfo.cxOrder.refuseReason);// 核保失败原因
				} else if (cxorderStatus == "06") {// “支付失败”状态，显示支付失败原因
					$("#hebaoFail_reason_area").show();
					// 支付失败原因
					$("#failName").html("支付失败原因");// 支付失败原因
					$("#hebaoFailInfo").html(param.cxInfo.cxOrder.refuseReason);// 支付失败原因
				} else {
					$("#hebaoFail_reason_area").hide();
				}
				
			
				if (cxorderStatus == '05') {// 待支付
					payUrl = param.cxInfo.cxOrder.payUrl;
					sessionStorage.setItem("payUrl",payUrl);
					$("#topay_btn_area").show();
				}
				
				if(cxflag=="1"){//订单状态
					if(cxorderStatus == "05" ){//待生效
						$("#orderStatus").html("待支付");	
					}else if(cxorderStatus == "07" || cxorderStatus == "08" || cxorderStatus == "09" || cxorderStatus == "10" || cxorderStatus == "13"){//已支付
						$("#orderStatus").html("已支付");	
					}else if(cxorderStatus == "02" || cxorderStatus == "03" || cxorderStatus == "06" || cxorderStatus == "11" || cxorderStatus == "12" || cxorderStatus == "99" ){//已关闭
						$("#orderStatus").html("已关闭");	
					}
				}else{//保单状态
					if(cxorderStatus == "09" ){
						$("#orderStatus").html("待生效");	
					}else if(cxorderStatus == "10"  ){
						$("#orderStatus").html("保障中");	
					}else{
						$("#orderStatus").html("已过期");	
					}
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
