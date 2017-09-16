var comparyCode = ""; // 车险保险公司编号
var cxSessionId = ""; //车险投保唯一流水号"15061915143671823305""15090209241414063000";//;
var cxProductId = "01102050001"; //车险产品编号
var isShowBtn = ""; //操作显示标志  1-未提交  3-核保通过  7-已承保（显示商业险保单号和交强险保单号）
var myScroll;
var orderPrams = "";
var producingarea;//车型产地  进口车、合资车、国产车 
$(function() {

	/*设置滑动区域*/
	$.setscroll();

	var str = window.location.search;
	str = str.substr(9, str.length);
	str = UrlDecode(str);
	parm = JSON.parse(str);
	orderPrams = parm.body.orderNos;
	isShowBtn = parm.body.isShowBtn;
	cxSessionId = parm.body.cxSessionId;
	// 加载页面数据
	$.loadOrderInfo();


	// 被保人信息的隐藏与展示
	unfoldMes("#insurantarea", "#insurant");

	// 投保人信息的隐藏与展示
	unfoldMes("#policyholderarea", "#policyholder");

	// 车辆信息的隐藏与展示
	unfoldMes("#carMesarea", "#carMes");
	//专属服务的隐藏和展示
	unfoldMes("#zsfw", "#chunk");

	$(".h_back").unbind("tap").bind("tap", function() {
		window.history.back();
	});

});
//渲染数据
$.loadOrderInfo = function() {
	var url = base.url + "cx/getAllInfo.do";
	var data = {
		"sessionId": cxSessionId, // 车险投保唯一流水号
	};
	$.toAjaxs(url, data, $.addPriceContent);
};
$.addPriceContent = function(param) {
	// 获取从上一个页面传递过来的参数
	param = eval("(" + param + ")");

	if(param != null || param != "") {
		var orderP = param;
		var str = "";
		if(orderP.cxRiskInfoList.cxPriservices.length == "0"){
			$("#zsfw").hide();
			$("#zs-info").hide();
		}
		for(i in orderP.cxRiskInfoList.cxPriservices) {
			str += "<div class='lump' id = 'a" + orderP.cxRiskInfoList.cxPriservices[i].id + "' name='" + orderP.cxRiskInfoList.cxPriservices[i].serviceTitle + "' data-txt = '" + orderP.cxRiskInfoList.cxPriservices[i].serviceInfo + "'>";
			str += orderP.cxRiskInfoList.cxPriservices[i].serviceTitle;
			str += "</div>";
		}
		$("#chunk").html(str);
		var hgt = Math.ceil(orderP.cxRiskInfoList.cxPriservices.length / 3);
		hgt = hgt * 50;
		hgt = hgt.toString();
		$("#chunk").css("height", hgt + "px");
		$(".lump").unbind("tap").bind("tap", function() {
			$(".lump").css("background-color", "#fff");
			$(".lump").css("color", "#000");
			$(this).css("background-color", "#f36f39");
			$(this).css("color", "#fff");
			$("#policyholder").hide();
			$("#policyholderarea").hide();
			$("#insurant").hide();
			$("#insurantarea").hide();
			$("#carMes").hide();
			$("#carMesarea").hide();
			$("#ccsui").hide();
			$("#im_jqxDateArea").hide();
			$("#jqxPolnoArea").hide();
			$("#TCIarea").hide();
			$("#policycontent").hide();
			$("#vci").hide();
			$("#busPolnoArea").hide();
			$("#VCIarea").hide();
			$("#ib").hide();
			$("#zsfw").hide();
			$("#zs-info").hide();
			$("#original").hide();
			$("#indexarea").hide();

			$.showzs($(this).attr("name"), $(this).data('txt'));

		});
		//车型产地  进口车、合资车、国产车
		producingarea=param.cxInfo.cxCarMessage.producingarea;
		// 总保费
		$("#summoney").html("￥"+ $.formatNumOfTwo(param.cxInfo.cxOffer.totalpremium));// ￥7200.00

		
		var businessPre=param.cxInfo.cxOffer.businessPre;
		var jqxPre=param.cxInfo.cxOffer.jqxPre;//交强险
		var vehicletaxPre=param.cxInfo.cxOffer.vehicletaxPre;//车船税
		// 商业险保费
		$("#busmoney").html("￥"+$.formatNumOfTwo(businessPre));// 6000.00
		if(businessPre!=0){
			//起保时间
			$("#bus_start_date").val(timeFormatDate(param.cxInfo.cxOffer.businessBegindate.time, 'yyyy-MM-dd'))
			//起保时间
			$("#businessBegindate").html(timeFormatDate(param.cxInfo.cxOffer.businessBegindate.time, 'yyyy-MM-dd'))
			//终保时间时间
			$("#businessEnddate").html(timeFormatDate(param.cxInfo.cxOffer.businessEnddate.time, 'yyyy-MM-dd'))
		    $("#busTime,#syDate").show();
		}
		// 交强险总保费
		$("#jqxmoney").html("￥"+$.formatNumOfTwo(jqxPre+vehicletaxPre));// 900.00
		if(jqxPre!=0){
			//起保时间
			$("#start_date").val(timeFormatDate(param.cxInfo.cxOffer.jqxBegindate.time, 'yyyy-MM-dd'))
			// 交强险保费
			$("#jqxPre").html("￥"+$.formatNumOfTwo(jqxPre));// 900.00
			//起保时间
			$("#jqxBegindate").html(timeFormatDate(param.cxInfo.cxOffer.jqxBegindate.time, 'yyyy-MM-dd'))
			//终保时间时间
			$("#jqxEnddate").html(timeFormatDate(param.cxInfo.cxOffer.jqxEnddate.time, 'yyyy-MM-dd'))
			$("#jqxTr,#jqxTime,#jqDate").show();
		}
		if(vehicletaxPre!=0){
			//车船税
			$("#vehicletaxPre").html("￥"+$.formatNumOfTwo(vehicletaxPre));// 900.00
			$("#vehicletaxTr").show();
		}
		
		// 被保人信息
		// 姓名
		$("#im_insuredname").html(orderP.cxInfo.cxParty.insuredname);
		// 证件类型
		$("#im_insuredidtype").html(_.findWhere(certificatearray, {
			code: orderP.cxInfo.cxParty.insuredidtype
		}).name);
		// 证件号码
		$("#im_insuredidno").html(orderP.cxInfo.cxParty.insuredidno);
		// 手机号码
		$("#im_insuredmobile").html(orderP.cxInfo.cxParty.insuredmobile);
		// 电子邮箱
		$("#im_insuredemail").html(orderP.cxInfo.cxParty.insuredemail);
		// 投保人信息
		// 姓名
		$("#im_phname").html(orderP.cxInfo.cxParty.phname);
		// 证件类型
		$("#im_phidtype").html(_.findWhere(certificatearray, {
			code: orderP.cxInfo.cxParty.phidtype
		}).name);
		// 证件号码
		$("#im_phidno").html(orderP.cxInfo.cxParty.phidno);
		// 手机号码
		$("#im_phtelephone").html(orderP.cxInfo.cxParty.phtelephone);

		// 车辆信息
		// 车辆号码
		if(orderP.cxInfo.cxOrder.newcarFlag == "1") {
			$("#im_plateno").html("新车未上牌");
		} else {
			$("#im_plateno").html(orderP.cxInfo.cxOrder.plateno);
		}

		// 车主姓名
		$("#im_ownerName").html(orderP.cxInfo.cxOrder.ownerName);
		// 品牌型号
		$("#im_vehicleBrand").html(orderP.cxInfo.cxCarMessage.vehicleBrand);
		// 车辆识别代码
		$("#im_rackNo").html(orderP.cxInfo.cxCarMessage.rackNo);
		// 发动机号
		$("#im_engineNo").html(orderP.cxInfo.cxCarMessage.engineNo);
		// 注册日期
		$("#im_registerDate").html(timeFormatDate(orderP.cxInfo.cxCarMessage.registerDate.time, 'yyyy-MM-dd'));

		function PriceMes(policyTypeFlag, policyname, price, baoeName, coverage) {
			this.policyTypeFlag = policyTypeFlag;
			this.policyname = policyname;
			this.price = price;
			this.baoeName = baoeName;
			this.coverage = coverage;
		}

		var policyarray = new Array();

		var cxRiskInfoList = orderP.cxRiskInfoList; // 车险险种报价信息
		if(cxRiskInfoList != null || cxRiskInfoList != "") {
			// 主险报价
			for(var i = 0; i < cxRiskInfoList.main.length; i++) {
				var priceMes = new PriceMes("01", cxRiskInfoList.main[i].name,
					cxRiskInfoList.main[i].pre, cxRiskInfoList.main[i].flag, cxRiskInfoList.main[i].coverage);
				policyarray.push(priceMes);
			}
			// 附加险报价
			for(var i = 0; i < cxRiskInfoList.add.length; i++) {
				var priceMes = new PriceMes("02", cxRiskInfoList.add[i].name,
					cxRiskInfoList.add[i].pre, cxRiskInfoList.add[i].flag, cxRiskInfoList.add[i].coverage);
				policyarray.push(priceMes);
			}
			// 不计免赔报价
			for(var i = 0; i < cxRiskInfoList.all.length; i++) {
				var priceMes = new PriceMes("03", cxRiskInfoList.all[i].name,
					cxRiskInfoList.all[i].pre, cxRiskInfoList.all[i].flag, cxRiskInfoList.all[i].coverage);
				policyarray.push(priceMes);
			}
		}
		var str='';
		for ( var i = 0; i < policyarray.length; i++) {
			str+='<tr>';
			var duty_name=policyarray[i].policyname;
			var producingarea=producingarea;//车型产地  进口车、合资车、国产车
			if(duty_name=="玻璃单独破碎险"){
				if(producingarea=="进口车") {
					duty_name=duty_name+" （进口）";
				}else{
					duty_name=duty_name+" （国产）";
				}
			}
			str+='<td class="jqxLittleTitle">'+duty_name+'</td>';
			str+='<td class="jqxBotton">';
			if (policyarray[i].policyTypeFlag !="03") {//主险 附加险
				if (policyarray[i].coverage.length > 1) {
					str+='<div class="jqxBotton2">保额：';
					if((policyarray[i].coverage).indexOf("元/座") >=0){
						str += "" + policyarray[i].coverage + "</div></td>";
					}else{
						str += "" + policyarray[i].coverage + "元</div></td>";
					}
				} else {
					str+='<div class="jqxBotton2">投保';
				}
			}else{
				str+='<div class="jqxBotton3">投保';
			}
			str+='</div>';
			str+='</td>';
			str+='<td class="jqxLittleFee">￥'+policyarray[i].price+'</td>';
			str+='</tr>';
		}
		$("#cxRisk").append(str);
	}
}

function unfoldMes(idarea, idmes, mes2, mes3) {
	$(idarea).unbind("tap").bind("tap",function() {
		var foldIcon = $(idarea).find("img");
		var picName = foldIcon.attr("src").substring(
			foldIcon.attr("src").lastIndexOf("/") + 1);

		if(picName == "index_bottom.png") {
			$(idmes).hide();
			$(mes2).hide();
			$(mes3).hide();
			foldIcon.attr("src", base.imagePath + "index_top.png");
		} else {
			$(idmes).show();
			$(mes2).show();
			$(mes3).show();
			foldIcon.attr("src", base.imagePath + "index_bottom.png");
		}
	});
};

/*设置滑动区域*/
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#indexarea").height(Scrollheight);
	mui("#indexarea").scroll();
};
$.showzs = function(x, y) {
	var st = "";
	st += "<header id = 'titHead' class = 'titHead'> ";
	st += "<div class='h_back backShow'>";
	st += "<div class='backindex'><img src='../../images/back.png' /></div>";
	st += "</div>";
	st += "<div class='h_title' id='pageTitle'>专属服务</div>";
	st += "</header>";
	st += "<div id='order_index' class='mui-scroll-wrapper order_index'>";
	st += "<div id='insure_iscroll' class='mui-scroll'>";
	st += "<div id='title'>";
	st += "" + x + "";
	st += "</div>";
	st += "<div id='inner'>";
	st += "" + y + "";
	st += "</div>";
	st += "</div>";
	st += "</div>";

	$("body").append(st);
	bk();
	$.setscroll2();
}

function bk() {
	$(".backShow").bind("tap", function() {
		$(".titHead").hide();
		$(".order_index").hide();

		$("#policyholder").show();
		$("#policyholderarea").show();
		$("#insurant").show();
		$("#insurantarea").show();
		$("#carMes").show();
		$("#carMesarea").show();
		$("#ccsui").show();
		$("#im_jqxDateArea").show();
		$("#jqxPolnoArea").show();
		$("#TCIarea").show();
		$("#policycontent").show();
		$("#vci").show();
		$("#busPolnoArea").show();
		$("#VCIarea").show();
		$("#zsfw").show();
		$("#zs-info").show();
		$("#original").show();
		$("#indexarea").show();

	});
}
$.setscroll2 = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#order_index").height(Scrollheight);
	mui("#order_index").scroll();
};