var samebeibao="1" //1-被保人与车主一致  0-不一致
var sametoubao="1" //1-投保人与车主一致  0-不一致
var cheakInsuredInfoFlag=true;//true-投被保人输入校验通过
var cxSessionId = "";// 车险投保唯一流水号"15061915143671823305";
var addressInfo={};
var cxOrder;
var businessBegindate;//起保时间
var payUrl;//支付页面
var tradeNo;//核保请求天安接口交易流水号
var orderStatus;//订单状态
var checkFlag="";//校验类别 0:交强，1:商业
var querySequenceNo="";//商业险投保查询码
var queryCheckCode="";//商业险投保 验证码图片的base64字符串
var syStartDate;
var jqStartDate;
$(function() {
	/**页面滑动设置*/
	$.setscrollarea("indexpart");
	var str = window.location.search;
	str = str.substr(9, str.length);
	str = UrlDecode(str);
	parm = JSON.parse(str);
	console.log(parm)
	cxSessionId = parm.body.cxSessionId;
	//获取订单信息模块初始化
	$.loadOrderInf();
	if(parm.body.cityCode=="3110000"){//北京地区
		  $("#toubaoCardUl,#beibaoCardUl").show("fast");
	}
	if(parm.body.cityCode=="3440300"){//深圳地区
		  $(".emailUl").show("fast");
	}
	 /**给商业险、交强险定义起始时间*/
	var current = new Date();
	current.setDate(current.getDate() + 1);
    var year = current.getFullYear();
    var month = current.getMonth() + 1;
    var day = current.getDate();
    var defaultTime=$.getTimeStr2();
    $("#businessBdate,#jqxBdate").attr("data-options",'{"type":"date","value":"'+defaultTime+'","beginYear":'+year+',"beginMonth":'+month+',"beginDay":'+day+',"endYear":2030}');
	changeDate("businessBdate");//商业险时间控件
	changeDate("jqxBdate");//交强险时间控件
	/*起期*/
	var now=new Date();
	now.setDate(now.getDate()-1);
	var year1 = now.getFullYear();
	var month1 = now.getMonth() + 1;
	var day1 = now.getDate();
	$("#recognizee_startDate_input,#policyholder_startDate_input").attr("data-options",'{"type":"date","beginYear":2003,"endYear":'+year1+',"endMonth":'+month1+',"endDay":'+day1+'}');
	/*止期*/
	$("#recognizee_endDate_input,#policyholder_endDate_input").attr("data-options",'{"type":"date","beginYear":'+year+',"beginMonth":'+month+',"beginDay":'+day+',"endYear":2070}');
	$.replacePlaceholder($("#recognizee_name_input"), "请输入姓名");
	$.replacePlaceholder($("#recognizee_idnumber_input"), "请输入证件号码");
	$.replacePlaceholder($("#recognizee_phone_input"), "请输入手机号码");
	$.replacePlaceholder($("#policyholder_name_input"), "请输入姓名");
	$.replacePlaceholder($("#policyholder_idnumber_input"), "请输入证件号码");
	$.replacePlaceholder($("#policyholder_phone_input"), "请输入手机号码");
	$.replacePlaceholder($("#recognizee_issuer_input"), "请输入签发机构");
	$.replacePlaceholder($("#policyholder_issuer_input"), "请输入签发机构");
	$.replacePlaceholder($("#recognizee_email_input"), "请输入邮箱");
	$.replacePlaceholder($("#policyholder_email_input"), "请输入邮箱");
	/**------被保人信息----*/
	//身份证有效起期
	openDataCustomized("recognizee_startDate_input");
	//身份证有效止期
	openDataCustomized("recognizee_endDate_input");
	//民族
	openDicMuiList("recognizee_nation_input", "bx_nation", " ", true);
	/**------投保人信息----*/
	//身份证有效起期
	openDataCustomized("policyholder_startDate_input");
	//身份证有效止期
	openDataCustomized("policyholder_endDate_input");
	//民族
	openDicMuiList("policyholder_nation_input", "bx_nation", " ", true);
	/**--返回--*/
	$(".h_back").unbind("tap").bind("tap",function() {
		if(parm.body.fromBaojia!="quote"){
			window.location.href="insuranceCoverage.html"+window.location.search;
		}else{//返回重新报价页面
			window.location.href="quotationDetail.html"+window.location.search;
		}
		
	});
	
	/**----被保人信息与车主一致切换事件-------*/
	document.getElementById("beibaoSwitch").addEventListener("toggle",function(event){
		  if(event.detail.isActive){//被保人信息与车主一致
			  $(".beibaoCell").hide();
			  samebeibao="1";
		  }else{
			  $(".beibaoCell").show("fast");
			  samebeibao="0";
		  }
	});
	/**----投保人信息与车主一致切换事件-------*/
	document.getElementById("toubaoSwitch").addEventListener("toggle",function(event){
	  if(event.detail.isActive){//投保人信息与车主
		  $(".toubaoCell").hide();
		  sametoubao="1"
	  }else{
		  $(".toubaoCell").show("fast");
		  sametoubao="0"
	  }
	});
	/***实时校验投被保人信息*****/
	blurCheackInsuredInfo();
	
	
	
	/**-------查看报价详情---------*/
	$(".priceTable").on("tap",function(){
		window.location.href="baojiaInfo.html"+window.location.search;
	});
	/**-------查看配送地址---------*/
	$("#addressHead").on("tap",function(){
		window.location.href="policyDeliveryAddress.html"+window.location.search;
	});
	
	
	/**--点击"下一步"邮寄地址与投被保人信息入库 并进行核保******/
	$("#submitorder").on("tap",function(){
		if(orderStatus=="05"){//待支付状态
		   window.location.href =payUrl;
		}else{
			hebao();//核保
		}
	});
	
	/**-----重新报价-------------*/
	$("#restartbj").on("tap",function(){
		$("#dialog,.baojiaDialog").hide();
		baojia();
	});
	//转保车，输完验证码，点击确定进行重新报价
	$("#quote").unbind("tap").bind("tap",function() {
		var yzm=$.trim($("#querySequenceNo").val());//验证码
		if($.isNull(yzm)){
			modelAlert("请输入验证码！");
			return false;
		}else{
			queryCheckCode=yzm;
			baojia();
			$(".baojiaDialog,#quoteDialog").hide();
		}
	});
	/**--关闭重新报价弹窗-----*/
	$(".closeDialog").on("tap",function(){
		$("#businessBdate").val(syStartDate);
		$("#jqxBdate").val(jqStartDate);
		$("#dialog,.baojiaDialog").hide();
	})
	
	//核保失败返回
	$("#backBtn").on("tap",function(){
		//返回pp停车微信公众号方法
		goBackPPStop(parm.body.inforCar.issueChannel);
	})
});
function baojia(){
	var url = base.url+'/tdcx/saveTwoOffer.do';
	var data = {
		'head':{
			'userCode': '',
			'transTime':$.getTimeStr(),
			'channel':'1'
		},'body':{
			"quoteInfo":{
				"sessionId":cxSessionId,
			}
			
		}
	};
	if(checkFlag!=""){
		data.body.quoteInfo.checkFlag=checkFlag;//校验类别0:交强，1:商业
		data.body.quoteInfo.querySequenceNo=querySequenceNo;//商业险投保查询码
		data.body.quoteInfo.queryCheckCode=queryCheckCode;// 验证码图片的base64字符串
	}
	if($("#jqxmoney").html()=="￥0.00"){
		data.body.quoteInfo.jqxBegindate=$.getDateStr("0","",1);
		data.body.quoteInfo.businessBegindate=$("#jqxBdate").val();
	}else if($("#busmoney").html()=="￥0.00"){
		data.body.quoteInfo.businessBegindate=$.getDateStr("0","",1);
		data.body.quoteInfo.jqxBegindate=$("#jqxBdate").val();
	}else{
		data.body.quoteInfo.businessBegindate=$("#businessBdate").val();
		data.body.quoteInfo.jqxBegindate=$("#jqxBdate").val();
	}
	$.reqAjaxs(url, data,function(respData){
		if(respData.statusCode == "888888"){
			var yzmImg=respData.returns.checkDto.checkCode; 
			querySequenceNo=respData.returns.checkDto.querySequenceNo; 
			checkFlag=respData.returns.checkDto.checkFlag;
			if(checkFlag=="0"){
				$(".zhuanbao").html("请录入交强险转保验证码")
			}else if(checkFlag=="1"){
				$(".zhuanbao").html("请录入商业险转保验证码")
			}
			$(".zhuanbaoImg").attr("src","data:image/png;base64,"+yzmImg);
			$("#querySequenceNo").val("");
			$(".baojiaDialog,#quoteDialog").show();
		}else if(respData.statusCode=="000000"){
			if(respData.returns.isBefore=="1"){//重复投保  脱保
				modelAlert("您好，您的爱车上一年车险将于"+respData.returns.yesterday+"到期，为了避免重复投保，我们将您的车险生效日期更新为"+respData.returns.today+"。",null,function(){
					window.location.reload();
				});
			}else if(respData.returns.isBefore=="2"){
				modelAlert("您好，您的爱车无上一保单结束时间记录，请仔细核实起保时间，防止发生车辆脱保。",null,function(){
					window.location.reload();
				});
			}else{
				window.location.reload();
			}
		}else{
			checkFlag="";//校验类别0:交强，1:商业
			querySequenceNo="";//商业险投保查询码
			queryCheckCode="";//商业险投保 验证码图片的base64字符串
			modelAlert(respData.statusMessage);
		}
	});
}
/**----重新报价---*/
function changeDate(id){
	var result = document.getElementById(id);
	result.addEventListener('tap', function() {
		var optionsJson = this.getAttribute('data-options') || '{}';
		var options = JSON.parse(optionsJson);
		var id = this.getAttribute('id');
		var picker = new mui.DtPicker(options);
		picker.show(function(rs) {
			if(result.value != rs.text){
				result.value=rs.text;
				$(".baojiaDialog,#dialog").show();
			}
			
			picker.dispose();
		});		
	});	
}
/****--邮寄地址 投被保人总校验------*/
function cheackInsuredInfo() {
	if($("#sjrName").html()==""){
		modelAlert("请录入保单邮寄地址！");
		cheakInsuredInfoFlag = false;
		return false;
	}
	// 解绑实时检查被保人信息
	unBindblurCheackRecognizee();
	/**--被保人校验-----*/
	if(samebeibao=="0"){
		var recognizee_name_input = $("#recognizee_name_input").val(); // 被保人姓名
		var recognizee_idnumber_input = $("#recognizee_idnumber_input").val(); // 被保人证件号码
		var recognizee_phone_input = $("#recognizee_phone_input").val(); // 被保人手机号码
		// 判断非空
		if ($.isNull(recognizee_name_input) || recognizee_name_input == "请输入姓名") {
			modelAlert("请输入被保人姓名！");
			cheakInsuredInfoFlag = false;
			return false;
		}
		// 被保人姓名校验
		if (tit.regExp.isChinese(recognizee_name_input) == false) {
			modelAlert("被保人姓名必须为汉字！");
			cheakInsuredInfoFlag = false;
			return false;
		}
		if ($.isNull(recognizee_idnumber_input)|| recognizee_idnumber_input == "请输入证件号码") {
			modelAlert("请输入被保人证件号码！");
			cheakInsuredInfoFlag = false;
			return false;
		}
		// 被保人身份证验证
		if ($("#recognizee_idtype").val() == "身份证") {
			if ($.checkIdCard(recognizee_idnumber_input.toLocaleUpperCase()) != 0) {
				modelAlert("请输入合法的身份证号！");
				cheakInsuredInfoFlag = false;
				return false;
			}
		}

		if ($.isNull(recognizee_phone_input) || recognizee_phone_input == "请输入手机号码") {
			modelAlert("请输入被保人手机号码！");
			cheakInsuredInfoFlag = false;
			return false;
		}
		
		// 被保人手机号码验证
		if (tit.regExp.isMobile(recognizee_phone_input) == false) {
			modelAlert("请输入合法的手机号码！");
			cheakInsuredInfoFlag = false;
			return false;
		}
		
		if(parm.body.cityCode=="3110000"){//北京地区
			var recognizee_startDate_input=$("#recognizee_startDate_input").val(); // 被保人身份证起期
			var recognizee_endDate_input=$("#recognizee_endDate_input").val(); // 被保人身份证止期
			var recognizee_nation_input=$("#recognizee_nation_input").val(); // 被保人民族
			var recognizee_issuer_input=$("#recognizee_issuer_input").val(); // 被保人签发机构
			if ($.isNull(recognizee_startDate_input) || recognizee_startDate_input == "请选择身份证有效起期") {
				modelAlert("请选择身份证有效起期！");
				cheakInsuredInfoFlag = false;
				return false;
			}
			if ($.isNull(recognizee_endDate_input) || recognizee_endDate_input == "请选择身份证有效止期") {
				modelAlert("请选择身份证有效止期！");
				cheakInsuredInfoFlag = false;
				return false;
			}
			if ($.isNull(recognizee_nation_input) || recognizee_nation_input == "请选择民族") {
				modelAlert("请选择民族！");
				cheakInsuredInfoFlag = false;
				return false;
			}
			if ($.isNull(recognizee_issuer_input) || recognizee_issuer_input == "请输入签发机构") {
				modelAlert("请输入签发机构！");
				cheakInsuredInfoFlag = false;
				return false;
			}
		}
		if(parm.body.cityCode=="3440300"){//深圳地区
			// 被保人邮箱验证
			var recognizee_email_input=$("#recognizee_email_input").val(); // 被保人邮箱
			if ($.isNull(recognizee_email_input) || recognizee_email_input == "请输入邮箱") {
				modelAlert("请输入被保人邮箱！");
				cheakInsuredInfoFlag = false;
				return false;
			}
			
			if (tit.regExp.isEmail(recognizee_email_input) == false) {
				modelAlert("请输入合法的被保人邮箱！");
				cheakInsuredInfoFlag = false;
				return false;
			}
		}
	}
	if(sametoubao=="0"){
		var policyholder_name_input = $("#policyholder_name_input").val(); // 投保人姓名
		var policyholder_idnumber_input = $("#policyholder_idnumber_input").val(); // 投保人证件号码
		var policyholder_phone_input = $("#policyholder_phone_input").val(); // 投保人手机号码

		// 判断非空
		if ($.isNull(policyholder_name_input) || policyholder_name_input == "请输入姓名") {
			modelAlert("请输入投保人姓名！");
			cheakInsuredInfoFlag = false;
			return false;
		}
		// 投保人姓名校验
		if (tit.regExp.isChinese(policyholder_name_input) == false) {
			modelAlert("投保人姓名必须为汉字！");
			cheakInsuredInfoFlag = false;
			return false;
		}
		if ($.isNull(policyholder_idnumber_input)|| policyholder_idnumber_input == "请输入证件号码") {
			modelAlert("请输入投保人证件号码！");
			cheakInsuredInfoFlag = false;
			return false;
		}
		// 投保人身份证验证
		if ($("#policyholder_idtype").val() == "身份证") {
			if ($.checkIdCard(policyholder_idnumber_input.toLocaleUpperCase()) != 0) {
				modelAlert("请输入合法的身份证号！");
				cheakInsuredInfoFlag = false;
				return false;
			}
		}

		if ($.isNull(policyholder_phone_input)|| policyholder_phone_input == "请输入手机号码") {
			modelAlert("请输入投保人手机号码！");
			cheakInsuredInfoFlag = false;
			return false;
		}
		// 投保人手机号码验证
		if (tit.regExp.isMobile(policyholder_phone_input) == false) {
			modelAlert("请输入合法的手机号码！");
			cheakInsuredInfoFlag = false;
			return false;
		}
		if(parm.body.cityCode=="3110000"){//北京地区
			var policyholder_startDate_input=$("#policyholder_startDate_input").val(); // 投保人身份证起期
			var policyholder_endDate_input=$("#policyholder_endDate_input").val(); // 投保人身份证止期
			var policyholder_nation_input=$("#policyholder_nation_input").val(); // 投保人民族
			var policyholder_issuer_input=$("#policyholder_issuer_input").val(); // 投保人签发机构
			if ($.isNull(policyholder_startDate_input) || policyholder_startDate_input == "请选择身份证有效起期") {
				modelAlert("请选择身份证有效起期！");
				cheakInsuredInfoFlag = false;
				return false;
			}
			if ($.isNull(policyholder_endDate_input) || policyholder_endDate_input == "请选择身份证有效止期") {
				modelAlert("请选择身份证有效止期！");
				cheakInsuredInfoFlag = false;
				return false;
			}
			if ($.isNull(policyholder_nation_input) || policyholder_nation_input == "请选择民族") {
				modelAlert("请选择民族！");
				cheakInsuredInfoFlag = false;
				return false;
			}
			if ($.isNull(policyholder_issuer_input) || policyholder_issuer_input == "请输入签发机构") {
				modelAlert("请输入签发机构！");
				cheakInsuredInfoFlag = false;
				return false;
			}
		}
		if(parm.body.cityCode=="3440300"){//深圳地区
			// 投保人邮箱验证
			var policyholder_email_input=$("#policyholder_email_input").val(); // 投保人邮箱
			if ($.isNull(policyholder_email_input) || policyholder_email_input == "请输入邮箱") {
				modelAlert("请输入投保人邮箱！");
				cheakInsuredInfoFlag = false;
				return false;
			}
			
			if (tit.regExp.isEmail(policyholder_email_input) == false) {
				modelAlert("请输入合法的投保人邮箱！");
				cheakInsuredInfoFlag = false;
				return false;
			}
		}
	}
	cheakInsuredInfoFlag=true;
}
/**--实时校验投被保人信息---*/
function blurCheackInsuredInfo() {
	// 被保人姓名校验
	$("#recognizee_name_input").change(function() {
		if ($.isNull($("#recognizee_name_input").val())|| $("#recognizee_name_input").val() == "请输入姓名") {
			return false;
		} else if (tit.regExp.isChinese($("#recognizee_name_input").val()) == false) {
			modelAlert("被保人姓名必须为汉字！");
			return false;
		}
	});

	// 校验被保人身份证号
	$("#recognizee_idnumber_input").change(function() {
		if ($("#recognizee_idnumber_input").val().length == 18) {
			$("#recognizee_idnumber_input").val($("#recognizee_idnumber_input").val().toUpperCase());
		}
		if ($.isNull($("#recognizee_idnumber_input").val())||$("#recognizee_idnumber_input").val() == "请输入证件号码") {
			return false;
		} else if ($.checkIdCard($("#recognizee_idnumber_input").val().toLocaleUpperCase()) != 0) {
			modelAlert("请输入合法的证件号码！");
			return false;
		}
	});

	// 被保人手机号码校验
	$("#recognizee_phone_input").change(function() {
		if ($.isNull($("#recognizee_phone_input").val())|| $("#recognizee_phone_input").val() == "请输入手机号码") {
			return false;
		} else if (tit.regExp.isMobile($("#recognizee_phone_input").val()) == false) {
			modelAlert("请输入正确的手机号码！");
			return false;
		}
	});


	// 投保人姓名校验
	$("#policyholder_name_input").change(function() {
		if ($.isNull($("#policyholder_name_input").val())|| $("#policyholder_name_input").val() == "请输入姓名") {
			return false;
		} else if (tit.regExp.isChinese($("#policyholder_name_input").val()) == false) {
			modelAlert("投保人姓名必须为汉字！");
			return false;
		}
	});

	// 校验 投保人身份证号
	$("#policyholder_idnumber_input").change(function() {
		if ($("#policyholder_idnumber_input").val().length == 18) {
			$("#policyholder_idnumber_input").val($("#policyholder_idnumber_input").val().toUpperCase());
		}
		if ($.isNull($("#policyholder_idnumber_input").val())|| $("#policyholder_idnumber_input").val() == "请输入证件号码") {
			return false;
		} else if ($.checkIdCard($("#policyholder_idnumber_input").val().toLocaleUpperCase()) != 0) {
			modelAlert("请输入合法的身份证号！");
			return false;
		}
	});

	// 投保人手机号码校验
	$("#policyholder_phone_input").change(function() {
		if ($.isNull($("#policyholder_phone_input").val())|| $("#policyholder_phone_input").val() == "请输入手机号码") {
			return false;
		} else if (tit.regExp.isMobile($("#policyholder_phone_input").val()) == false) {
			modelAlert("请输入正确的手机号码！");
			return false;
		}
	});
}
// 解绑实时检查被保人信息
function unBindblurCheackRecognizee() {
	$('#recognizee_name_input').unbind('change');// 被保人姓名取消事件
	$('#recognizee_idnumber_input').unbind('change');// 被保人身份证号取消事件
	$('#recognizee_phone_input').unbind('change');// 被保人手机号取消事件
	$('#policyholder_name_input').unbind('change');//投保人姓名取消事件
	$('#policyholder_idnumber_input').unbind('change');// 投保人身份证号取消事件
	$('#policyholder_phone_input').unbind('change');// 投保人手机号取消事件

}






//获取订单信息模块初始化
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
				//车牌
				var plateno="";
				if(param.cxInfo.cxOrder.newcarFlag=="1"){
					plateno="新车未上牌";
				}else{
					plateno=param.cxInfo.cxOrder.plateno;
				}
				$(".plateNo").html(plateno);
				tradeNo=param.cxInfo.cxOrder.tradeno;//请求天安核保接口交易流水号
				//商业险起保时间
				if(param.cxInfo.cxOffer.businessPre==0){
					$("#businessBdate").val($.getDateStr("0","",1));//起保日期 T+1天
					$(".BusquoteTable").hide();
				}else{
					$("#businessBdate").val(timeFormatDate(param.cxInfo.cxOffer.businessBegindate.time, 'yyyy-MM-dd'))
				}
				
				//交强险起保时间
				if(param.cxInfo.cxOffer.jqxPre==0){
					$("#jqxBdate").val(timeFormatDate(param.cxInfo.cxOffer.businessBegindate.time, 'yyyy-MM-dd'))
					$(".BusquoteTable").hide();
					$(".tabel").html("商业险起保时间")
				}else{
					$("#jqxBdate").val(timeFormatDate(param.cxInfo.cxOffer.jqxBegindate.time, 'yyyy-MM-dd'))
				}
				
				syStartDate=$("#businessBdate").val();
				jqStartDate=$("#jqxBdate").val();
				// 总保费
				$("#premium").html("￥"+ $.formatNumOfTwo(param.cxInfo.cxOffer.totalpremium));// ￥7200.00

				// 商业险保费
				$("#busmoney").html("￥"+$.formatNumOfTwo(param.cxInfo.cxOffer.businessPre));// 6000.00

				// 交强险保费
				$("#jqxmoney").html("￥"+$.formatNumOfTwo(param.cxInfo.cxOffer.jqxPre));// 900.00
				// 车船税
				$("#vehicletaxPre").html("￥"+$.formatNumOfTwo(param.cxInfo.cxOffer.vehicletaxPre));// 900.00
//				//交强险风险等级
//				$("#jqpj").html(changeLevel(param.cxInfo.cxOrder.elrLevelCtp));
//				//商业险风险等级
//				$("#sypj").html(changeLevel(param.cxInfo.cxOrder.elrLevelCom));
				
				cxOrder=param.cxInfo.cxOrder;//获取订单信息
				orderStatus=cxOrder.orderStatus;//车险订单状态
				var gfbDistribution=parm.body.gfbDistribution;
				if(gfbDistribution!=null){//从配送地址列表页返回
					addressInfo.province = gfbDistribution.province;
					addressInfo.address = gfbDistribution.address;
					$("#sjrName").html(gfbDistribution.receivername);
					$("#sjrPhone").html(gfbDistribution.receiverphoneno);
					$("#addresseeprovince").html(gfbDistribution.province.replace(new RegExp(" ","g"),""));
					$("#psAddress").html(gfbDistribution.address);
					$(".addressInfo").show();
				}else{
					if(param.cxInfo.cxOrder.sjrName==""){//该订单未录入邮寄信息
						// 查询默认地址
						var data = {
							"userName" : parm.head.userName,
							"companycode" : "000"
						};
						var url = base.url + "distribution/getDistributionOne.do";
						$.toAjaxs(url, data, function(param){
							param = eval("(" + param + ")");
							if (param.status.statusCode == "000000") {
								if(param.gfbDistribution!=""){
									addressInfo.province = param.cxDistribution.province;
									addressInfo.address = param.cxDistribution.address;
									if (addressInfo != "" && addressInfo != null) {//该用户有默认地址
										$("#sjrName").html(param.cxDistribution.receivername);
										$("#sjrPhone").html(param.cxDistribution.receiverphoneno);
										$("#addresseeprovince").html(addressInfo.province.replace(new RegExp(" ","g"),""));
										$("#psAddress").html(addressInfo.address);
										$(".addressInfo").show();
									}
								}
							}	
						});
					}else{//该订单已录入邮寄信息
						addressInfo.province = cxOrder.addresseeprovince;
						addressInfo.address = cxOrder.psAddress;
						$("#sjrName").html(cxOrder.sjrName);
						$("#sjrPhone").html(cxOrder.sjrMobile);
						$("#addresseeprovince").html(cxOrder.addresseeprovince.replace(new RegExp(" ","g"),""));
						$("#psAddress").html(cxOrder.psAddress);
						$(".addressInfo").show();
					}
				}
				/*车船税为0时提示*/
				if(param.cxInfo.cxOffer.vehicletaxPre==0){
					modelAlert("您当前购买的车险保单无法代缴车船税，如需了解详情，可拨打客服热线 4006895505 进行咨询");
				}
				
				if(parm.body.samebeibao!=null){//被保人信息与车主不一致
					samebeibao=parm.body.samebeibao;
					if(samebeibao=="0"){
						$("#beibaoSwitch").removeClass("mui-active");
						if(param.cxInfo.cxParty!=null){
						    $("#recognizee_name_input").val(param.cxInfo.cxParty.insuredname);// 被保人姓名
						    $("#recognizee_idnumber_input").val(param.cxInfo.cxParty.insuredidno);// 被保人证件号码
						    $("#recognizee_phone_input").val(param.cxInfo.cxParty.insuredmobile);// 被保人手机
						    if(!$.isNull(param.cxInfo.cxParty.insuredstartdate)){
						    	$("#recognizee_startDate_input").val(timeFormatDate(param.cxInfo.cxParty.insuredstartdate.time,'yyyy-MM-dd'));// 被保人起期
						    }
						    if(!$.isNull(param.cxInfo.cxParty.insuredenddate)){
						        $("#recognizee_endDate_input").val(timeFormatDate(param.cxInfo.cxParty.insuredenddate.time,'yyyy-MM-dd'));// 被保人止期
						    }
						    $("#recognizee_nation_input").val(param.cxInfo.cxParty.insurednation);// 被保人名族
						    $("#recognizee_issuer_input").val(param.cxInfo.cxParty.insuredissuer);// 被保人机构
						    $("#recognizee_email_input").val(param.cxInfo.cxParty.insuredemail);// 被保人邮箱
						}
						$(".beibaoCell").show();
					}
				}
				if(parm.body.sametoubao!=null){//投保人信息与车主不一致
					sametoubao=parm.body.sametoubao;
					if(sametoubao=="0"){
						$("#toubaoSwitch").removeClass("mui-active");
						if(param.cxInfo.cxParty!=null){
						    $("#policyholder_name_input").val(param.cxInfo.cxParty.phname);// 投保人姓名
						    $("#policyholder_idnumber_input").val(param.cxInfo.cxParty.phidno);// 投保人证件号码
						    $("#policyholder_phone_input").val(param.cxInfo.cxParty.phtelephone);// 投保人手机
						    if(!$.isNull(param.cxInfo.cxParty.phstartdate)){
						    	$("#policyholder_startDate_input").val(timeFormatDate(param.cxInfo.cxParty.phstartdate.time,'yyyy-MM-dd'));// 投保人起期
						    }
						    if(!$.isNull(param.cxInfo.cxParty.phenddate)){
						        $("#policyholder_endDate_input").val(timeFormatDate(param.cxInfo.cxParty.phenddate.time,'yyyy-MM-dd'));// 投保人止期
						    }
						    $("#policyholder_nation_input").val(param.cxInfo.cxParty.phnation);// 投保人名族
						    $("#policyholder_issuer_input").val(param.cxInfo.cxParty.phissuer);// 投保人机构
						    $("#policyholder_email_input").val(param.cxInfo.cxParty.phemail);// 投保人邮箱
						}
						$(".toubaoCell").show();
					}
				}
				
				
				// 核保失败
				if (orderStatus == "03") {
					modelAlert(cxOrder.refuseReason);
					$(".detailcomfrim").hide();
					$("#hebaoFail_reason_area").show();
					// 核保失败原因
					$("#failName").html("核保失败原因");// 核保失败原因
					$("#hebaoFailInfo").html(cxOrder.refuseReason);// 核保失败原因
				}
				// 退保
				if (orderStatus == "9900") {
					modelAlert(cxOrder.refuseReason);
					$(".detailcomfrim").hide();
					$("#hebaoFail_reason_area").show();
					// 退保原因
					$("#failName").html("退保原因");// 核保失败原因
					$("#hebaoFailInfo").html(cxOrder.refuseReason);// 核保失败原因
				}
				// 待支付
				if (orderStatus == "05") {
					payUrl=cxOrder.payUrl;
				}
				// 审核中
				if (orderStatus == "04") {
					modelAlert(cxOrder.refuseReason);
					$(".detailcomfrim").hide();
					$("#hebaoFail_reason_area").show();
					// 审核中
					$("#failName").html("审核中");// 审核中
					$("#hebaoFailInfo").html(cxOrder.refuseReason);// 审核中
				}
			}
		} else {
			modelAlert(param.status.statusMessage);
		}
	} else {
		modelAlert("查询订单信息异常！");
	}
};

/**---核保-----*/
function hebao(){

	//邮寄地址 投被保人总校验
	cheackInsuredInfo();
	if(cheakInsuredInfoFlag){//总校验通过
		var sjrMobile=$.trim($("#sjrPhone").html());//收件人手机号
	    var sjrName=$.trim($("#sjrName").html());//收件人姓名
		var addresseeprovince=$.trim($("#addresseeprovince").html());//收件人省市
		var psAddress=$.trim($("#psAddress").html());//收件人详细地址
	    var phname=sametoubao=="1"?cxOrder.ownerName:$("#policyholder_name_input").val();// 投保人姓名
	    var phidtype="01";// 投保人证件类型 身份证
	    var phidno=sametoubao=="1"?cxOrder.ownerIdno:$("#policyholder_idnumber_input").val();// 投保人证件号码
	    var gender=$.getSex(phidno);// 投保人性别
	    var phbirthdate=$.getBirthDay(phidno);// 投保人出生日期
	    var phtelephone=sametoubao=="1"?cxOrder.ownerMobile:$("#policyholder_phone_input").val();// 投保人手机
	    var phaddress=addressInfo.province+" "+addressInfo.address;//投保人地址
	    
	    var insuredname=samebeibao=="1"?cxOrder.ownerName:$("#recognizee_name_input").val();// 被保人姓名
	    var insuredidno=samebeibao=="1"?cxOrder.ownerIdno:$("#recognizee_idnumber_input").val();// 被保人证件号码
	    var insuredgender=$.getSex(insuredidno);// 被保人性别
	    var insuredidtype="01";// 被保人证件类型 身份证
	    var insuredbirthdate=$.getBirthDay(insuredidno);// 被保人出生日期
	    var insuredmobile=samebeibao=="1"?cxOrder.ownerMobile:$("#recognizee_phone_input").val();// 被保人手机
	    var insuredadress=addressInfo.province+" "+addressInfo.address;//被保人地址
	    
	    if(parm.body.cityCode=="3110000"){//北京地区
	    	  var insuredStartDate=samebeibao=="1"?timeFormatDate(cxOrder.certiStartdate.time, 'yyyy-MM-dd'):$("#recognizee_startDate_input").val();// 被保人起期
	    	  var insuredEndDate=samebeibao=="1"?timeFormatDate(cxOrder.certiEnddate.time, 'yyyy-MM-dd'):$("#recognizee_endDate_input").val();// 被保人止期
	    	  var insurednation=samebeibao=="1"?cxOrder.nation:$("#recognizee_nation_input").val();//被保人民族
	    	  var insuredissuer=samebeibao=="1"?cxOrder.issuerAuthority:$("#recognizee_issuer_input").val();// 被保人签发机构
	    	  var phStartDate=sametoubao=="1"?timeFormatDate(cxOrder.certiStartdate.time, 'yyyy-MM-dd'):$("#policyholder_startDate_input").val();// 投保人起期
	    	  var phEndDate=sametoubao=="1"?timeFormatDate(cxOrder.certiEnddate.time, 'yyyy-MM-dd'):$("#policyholder_endDate_input").val();// 投保人止期
	    	  var phnation=sametoubao=="1"?cxOrder.nation:$("#policyholder_nation_input").val();// 投保人民族
	    	  var phissuer=sametoubao=="1"?cxOrder.issuerAuthority:$("#policyholder_issuer_input").val();// 投保人签发机构
	    }
	    if(parm.body.cityCode=="3440300"){//深圳地区
	    	var insuredemail=samebeibao=="1"?cxOrder.ownerEmail:$("#recognizee_email_input").val();// 被保人邮箱
	    	var phemail=sametoubao=="1"?cxOrder.ownerEmail:$("#policyholder_email_input").val();// 投保人邮箱
	    }
	    var url = base.url+'/tdcx/saveAddressInsured.do';
		var data = {
			'head':{
				'userCode': '',
				'transTime':$.getTimeStr(),
				'channel':'1'
			},'body':{
				"addressInsuredDto":{
					"sessionid":cxSessionId,
					"orderNo":cxOrder.orderNo,
					"sjrMobile":sjrMobile,//收件人手机号
				    "sjrName":sjrName,//收件人姓名
					"addresseeprovince":addresseeprovince,//收件人省市
					"psAddress":psAddress,//收件人详细地址
				    "phname":phname,// 投保人姓名
				    "phidtype":phidtype,// 投保人证件类型 身份证
				    "phidno":phidno,// 投保人证件号码
				    "gender":gender,// 投保人性别
				    "phbirthdate":phbirthdate,// 投保人出生日期
				    "phtelephone":phtelephone,// 投保人手机
				    "phaddress":phaddress,//投保人地址
				    "insuredname":insuredname,// 被保人姓名
				    "insuredidno":insuredidno,// 被保人证件号码
				    "insuredgender":insuredgender,// 被保人性别
				    "insuredidtype":insuredidtype,// 被保人证件类型 身份证
				    "insuredbirthdate":insuredbirthdate,// 被保人出生日期
				    "insuredmobile":insuredmobile,// 被保人手机
				    "insuredadress":insuredadress//被保人地址
				}
				
			}
		};
		if(parm.body.cityCode=="3110000"){//北京地区
			data.body.addressInsuredDto.phStartDate=phStartDate;
			data.body.addressInsuredDto.phEndDate=phEndDate;
			data.body.addressInsuredDto.phnation=phnation;
			data.body.addressInsuredDto.phissuer=phissuer;
			data.body.addressInsuredDto.insuredStartDate=insuredStartDate;
			data.body.addressInsuredDto.insuredEndDate=insuredEndDate;
			data.body.addressInsuredDto.insurednation=insurednation;
			data.body.addressInsuredDto.insuredissuer=insuredissuer;
		}
		 if(parm.body.cityCode=="3440300"){//深圳地区
			data.body.addressInsuredDto.insuredemail=insuredemail;// 被保人邮箱
			data.body.addressInsuredDto.phemail=phemail;// 投保人邮箱
	    }
		$.reqAjaxs(url, data,function(respData){
			if(respData.statusCode=="000000"){
				parm.body.samebeibao = samebeibao;//1-被保人与车主一致  0-不一致
				parm.body.sametoubao = sametoubao;//1-投保人与车主一致  0-不一致
				var url = base.url + "vi/orderConfirm.do";
				var data = {
					"sessionId" : cxSessionId,// 车险投保唯一流水号
					"source" : parm.head.source,  //调用微信的来源
					"tradeNo":tradeNo,
					"transTime":$.getTimeStr(),
				};
				$.toAjaxs(url, data,function(param){
					if (param.statusCode == "000000") {
						orderStatus=param.returns.cxOrder.orderStatus;//订单状态
						// 核保失败
						if (orderStatus == "03") {
							modelAlert(param.returns.cxOrder.refuseReason);
							$(".detailcomfrim").hide();
							$("#hebaoFail_reason_area").show();
							// 核保失败原因
							$("#failName").html("核保失败原因");// 核保失败原因
							$("#hebaoFailInfo").html(param.returns.cxOrder.refuseReason);// 核保失败原因
						}
						// 待支付
						if (orderStatus == "05") {
							payUrl=param.returns.cxOrder.payUrl;
						    window.location.href =payUrl;
						}
						// 审核中
						if (orderStatus == "04") {
							modelAlert(param.returns.cxOrder.refuseReason);
							$(".detailcomfrim").hide();
							$("#hebaoFail_reason_area").show();
							// 审核中
							$("#failName").html("审核中");// 审核中
							$("#hebaoFailInfo").html(param.returns.cxOrder.refuseReason);// 审核中
						}
						if (orderStatus == "01") {
							modelAlert("确认投保成功！提交核保失败!");
						}
					} else {
						modelAlert(param.statusMessage);
						$(".detailcomfrim").hide();
						$("#hebaoFail_reason_area").show();
						// 核保失败原因
						$("#failName").html("核保失败原因");// 核保失败原因
						$("#hebaoFailInfo").html(param.statusMessage);// 核保失败原因
					}
				});	
			}else{
				modelAlert(respData.statusMessage);
			}
		});
	}

}