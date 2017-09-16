var parm;
var cxSessionId;
var product_id = "";// 产品id
var comparyCode = "00004";// 车险保险公司编号

var add_risklist = new Array();// 存储页面附加险数
var bxCxPriserviceArr = null;//
var jqxFlagg = "1"; // 交强险投保标志 投保:1;不投保:0
var cxOffer = {};// 报价信息
var forceBeginDate;// 交强险起始日期
var bizBeginDate;// 商业险起始日期

var commodityNo = "";//套餐编号
var cheakOfferinfoFlag = true;// 校验险种责任信息标志
var jiaoqiangBdate = "";
var sytoubaoFlag=true;
var checkFlag="";//校验类别 0:交强，1:商业
var querySequenceNo="";//商业险投保查询码
var queryCheckCode="";//商业险投保 验证码图片的base64字符串
$(function(){
	var str = window.location.search;
	str = str.substr(9, str.length);
	str = UrlDecode(str);
	parm = JSON.parse(str);
	console.log(parm);
	cxSessionId = parm.body.cxSessionId;
	$("#businessBdate").val(parm.body.businessBegindate);
	$("#jiaoqiangBdate").val(parm.body.forceBeginDate);
	//点问号，进入指南页
	$("#wenhao").unbind("tap").bind("tap",function(){
		window.location.href="zhinanPage.html"+window.location.search;
	})
	
		//头部返回
	$(".h_back").unbind("tap").bind("tap",function() {
		if(parm.body.fromBaojia!="Y"){
			parm.body.cxSessionId = cxSessionId;
			var jsonStr = JSON.stringify(parm);
			jsonStr = UrlEncode(jsonStr);
			window.location.href = "carMes.html?jsonStr=" + jsonStr;
		}else{
			window.location.href = "quotationDetail.html"+window.location.search;
		}
	});
	
	
	$(".zsfuTitle").unbind("tap").bind("tap",function(){
		var imgName=$(".zsfwxiala").attr("src").substring(
				$(".zsfwxiala").attr("src").lastIndexOf("/") + 1);
		if(imgName == "xiala1.png"){
			$(".services").show();
			$(".zsfwxiala").attr("src","../../images/xiala.png");
			$(".zsfwxiala").css("width","10px");
			$(".zsfwxiala").css("height","14px");
		}else{
			$(".services").hide();
			$(".zsfwxiala").attr("src","../../images/xiala1.png");
			$(".zsfwxiala").css("width","14px");
			$(".zsfwxiala").css("height","10px");
		}
	});
	
	//加载图片
	$(".vehicleArea_img img").attr("src","../../images/moneybtn.png");
	$(".policyArea_img img").attr("src","../../images/accurate_icon.png");
	
	/* 给选项卡加当前选项属性active */
	$(".tab_titles .tab_title_a").unbind("tap").bind("tap",function(){
		$(".active").removeClass("active");
		$(this).addClass("active");
	})
	
	/* 自由组合版 */
	$("#ziyou").unbind("tap").bind("tap",function(){
		$("#zunxiang img").attr("src","../../images/renqi1.png");
		$("#jizhi img").attr("src","../../images/youhui1.png");
		$("#ziyou img").attr("src","../../images/siji2.png");
		$(".sytoubao").show();//商业险投保按钮显示
		//交强险默认选中
		jqxFlagg = "1";
		$(".toubao").css("color","#f36f39");
		$(".toubao").css("border-color","#f36f39");
		// 添加主附险内容
		addMainInsureContent("0419900103");
	})
	$("#ziyou").trigger("tap");
	/* 尊享服务版 */
	$("#zunxiang").unbind("tap").bind("tap",function(){
		$("#zunxiang img").attr("src","../../images/renqi2.png");
		$("#jizhi img").attr("src","../../images/youhui1.png");
		$("#ziyou img").attr("src","../../images/siji1.png");
		$(".sytoubao").hide();//商业险投保按钮隐藏
		//交强险默认不选中
		jqxFlagg = "0";
		$(".toubao").css("color","#aeb2b7");
		$(".toubao").css("border-color","#aeb2b7");
		$("#mainInsurecontent,#additionInsurecontent").show();//显示商业险险种信息
		sytoubaoFlag = true;
		$(".sytoubao").css("color","#f36f39");
		$(".sytoubao").css("border-color","#f36f39");
		// 添加主附险内容
		addMainInsureContent("0419900101");
	})
	/* 极致优惠版 */
	$("#jizhi").unbind("tap").bind("tap",function(){
		$("#zunxiang img").attr("src","../../images/renqi1.png");
		$("#jizhi img").attr("src","../../images/youhui2.png");
		$("#ziyou img").attr("src","../../images/siji1.png");
		$(".sytoubao").hide();//商业险投保按钮隐藏
		//交强险默认不选中
		jqxFlagg = "0";
		$(".toubao").css("color","#aeb2b7");
		$(".toubao").css("border-color","#aeb2b7");
		$("#mainInsurecontent,#additionInsurecontent").show();//显示商业险险种信息
		sytoubaoFlag = true;
		$(".sytoubao").css("color","#f36f39");
		$(".sytoubao").css("border-color","#f36f39");
		// 添加主附险内容
		addMainInsureContent("0419900102");
	})
	
	
	
	// 商业险的隐藏与展示
	unfoldMes("#VCIprice", ".VCIdate", "#policycontent");
	

	// 交强保险费的隐藏与展示
	unfoldMes("#TCIprice", ".TCIdate");
	//交强险点击事件
	$(".toubao").unbind("tap").bind("tap",function(){
		var color = "";
		color = $(".toubao").css("color");
		if(color == "rgb(174, 178, 183)"){
			$(".toubao").css("color","#f36f39");
			$(".toubao").css("border-color","#f36f39");
		}
		if(color == "rgb(243, 111, 57)"){
			$(".toubao").css("color","#aeb2b7");
			$(".toubao").css("border-color","#aeb2b7");
		}
		//获取是否投保交强险标志
		var picColor = $(".toubao").css("color");
		if(picColor == "rgb(243, 111, 57)"){
			jqxFlagg = "1";
		}else{
			jqxFlagg = "0";
		}
	})
	//商业险点击事件
	$(".sytoubao").unbind("tap").bind("tap",function(){
		var color = "";
		color = $(".sytoubao").css("color");
		if(color == "rgb(174, 178, 183)"){
			$(".sytoubao").css("color","#f36f39");
			$(".sytoubao").css("border-color","#f36f39");
		}
		if(color == "rgb(243, 111, 57)"){
			$(".sytoubao").css("color","#aeb2b7");
			$(".sytoubao").css("border-color","#aeb2b7");
		}
		//获取是否投商业险标志
		var picColor = $(".sytoubao").css("color");
		if(picColor == "rgb(243, 111, 57)"){
			$("#mainInsurecontent,#additionInsurecontent").show();//显示商业险险种信息
			sytoubaoFlag = true;
		}else{
			$("#mainInsurecontent,#additionInsurecontent").hide();//隐藏商业险险种信息
			sytoubaoFlag = false;
		}
	})
	//点击下一步，进行报价请求
	$(".confirmbutton").unbind("tap").bind("tap",function() {
		baojia();
	});
	
	//转保车，输完验证码，点击确定进行重新报价
	$("#restartbj").unbind("tap").bind("tap",function() {
		var yzm=$.trim($("#querySequenceNo").val());//验证码
		if($.isNull(yzm)){
			modelAlert("请输入验证码！");
			return false;
		}else{
			queryCheckCode=yzm;
			baojia();
			$(".baojiaDialog,#dialog").hide();
		}
		
		
	});

	
});
//报价接口
function baojia(){
	var fujia4choose2 = 0;
	cxOffer = {};
	
	// 获取数值
	cxOffer.businessBegindate = $.getDateStr("0","yyyy-mm-dd",1);//商业险起保日期 取当前日期后一天

	cxOffer.companyCode = comparyCode; // 所属保险公司
	if (jqxFlagg == "1") {// jqxFlagg; 交强险投保标志 投保:1;不投保:0
		cxOffer.jqxFlag = "投保"; // 交强险投保标志 投保:1;不投保:0
		cxOffer.jqxPre = "1"; // 交强险保费
	} else {
		cxOffer.jqxFlag = "不投保"; // 交强险投保标志 投保:1;不投保:0
		cxOffer.jqxPre = "0"; // 交强险保费
	}
	cxOffer.jqxBegindate = $.getDateStr("0","yyyy-mm-dd",1);//交强险起保日期 取当前日期后一天
	cxOffer.sessionid = cxSessionId; // 唯一流水号"15061713313116515688";
	cxOffer.productId = product_id; // 产品编号 (待定)
    if(sytoubaoFlag){//商业险是否投保
		/**
		* 获取主险参数数据
		*/
		for ( var i = 0; i < main_risklist.length; i++) {
			var mainRiskCode = $("#chooseMpolicy" + i).attr("name");// 主险险种代码
			//picName2 1：投保；2：不投保
			var picName2 = 1;
			if ($("#mpolicy" + i).css("color") == "rgb(174, 178, 183)") {
				picName2 = 0;
			}
			/**
			* 机动车损失险
			*/
			if (mainRiskCode == "CarLossCoverage") {
				cxOffer.carlossFlag = $("#mainEnuContent" + i).val(); // 车辆损失险标志
				cxOffer.carlossCoverage = $("#mainEnuContent" + i).attr("name"); // 车辆损失险保费
				if (picName2 == 1) {
					cxOffer.carlossMpFlag = "投保"; // 车损不计免赔标志
					// 1-勾选不计免赔
					// 0-未勾选不计免赔
					cxOffer.carlossMpCoverage = "1";
				} else {
					cxOffer.carlossMpFlag = "不投保";
					cxOffer.carlossMpCoverage = "0";
				}
			}

			/**
			* 司机座位责任险
			*/
			if (mainRiskCode == "DriverCoverage") {
				cxOffer.driverFlag = $("#mainEnuContent" + i).val(); // 司机座位险标志
				cxOffer.driverCoverage = $("#mainEnuContent" + i).attr("name"); // 司机座位险保费

				if (picName2 == 1) {
					cxOffer.driverMpFlag = "投保"; // 司机座位险不计免赔标志
					// 1-勾选不计免赔
					// 0-未勾选不计免赔
					cxOffer.driverMpCoverage = "1";
				} else {
					cxOffer.driverMpFlag = "不投保";
					cxOffer.driverMpCoverage = "0";
				}
			}

			/**
			* 乘客座位责任险
			*/
			if (mainRiskCode == "PassengerCoverage") {
				cxOffer.passengerFlag = $("#mainEnuContent" + i).val(); // 乘客座位责任险标志
				cxOffer.passengerCoverage = $("#mainEnuContent" + i).attr("name"); // 乘客座位责任险保费
				if (picName2 == 1) {
					cxOffer.passengerMpFlag = "投保"; // 乘客座位责任险不计免赔标志
					cxOffer.passengerMpCoverage = "1";
				} else {
					cxOffer.passengerMpFlag = "不投保";
					cxOffer.passengerMpCoverage = "0";
				}
			}

			/**
			* 全车盗抢险
			*/
			if (mainRiskCode == "TheftCoverage") {
				cxOffer.theftFlag = $("#mainEnuContent" + i).val(); // 全车盗抢险标志
				cxOffer.theftCoverage = $("#mainEnuContent" + i).attr("name"); // 全车盗抢险保费
				if (picName2 == 1) {
					cxOffer.theftMpFlag = "投保"; // 全车盗抢险不计免赔标志
					// 1-勾选不计免赔
					// 0-未勾选不计免赔
					cxOffer.theftMpCoverage = "1";
				} else {
					cxOffer.theftMpFlag = "不投保";
					cxOffer.theftMpCoverage = "0";
				}
			}

			/**
			* 商业第三者责任险
			*/
			if (mainRiskCode == "ThirdPartyCoverage") {
				cxOffer.thirdpartyFlag = $("#mainEnuContent" + i).val(); // 商业第三者责任险标志
				cxOffer.thirdpartyCoverage = $("#mainEnuContent" + i).attr("name"); // 商业第三者责任险保费
				if (picName2 == 1) {
					cxOffer.thirdpartyMpFlag = "投保"; // 商业第三者责任险不计免赔标志
					// 1-勾选不计免赔
					// 0-未勾选不计免赔
					cxOffer.thirdpartyMpCoverage = "1";
				} else {
					cxOffer.thirdpartyMpFlag = "不投保";
					cxOffer.thirdpartyMpCoverage = "0";
				}
			}
		}

		/**
		* 获取附加险参数数据
		*/
		for ( var i = 0; i < add_risklist.length; i++) {
			
			var addRiskCode = $("#choosepolicy" + i).attr("name");// 附加险险种代码
			//picName2 1：投保；0：不投保
			var picName2 = 1;
			if ($("#deductible" + i).css("color") == "rgb(174, 178, 183)") {
				picName2 = 0;
			}
			/**
			 * 玻璃单独破碎险
			 */
			if (addRiskCode == "GlassBrokenCoverage") {
				cxOffer.glassFlag = $("#addEnuContent" + i).val(); // 玻璃破碎险标志
				cxOffer.glassCoverage = $("#addEnuContent" + i).attr("name"); // 玻璃破碎险保费
			}
	
			/**
			 * 自燃损失险
			 */
			if (addRiskCode == "SelfIgniteCoverage") {
				cxOffer.selfigniteFlag = $("#addEnuContent" + i).val(); // 自燃损失险标志
				cxOffer.selfigniteCoverage = $("#addEnuContent" + i).attr("name"); // 自燃损失险保费
				if (picName2 == 1) {
					cxOffer.selfigniteMpFlag = "投保"; // 划痕险不计免赔标志
					// 1-勾选不计免赔
					// 0-未勾选不计免赔
					cxOffer.selfigniteMpCoverage = "1";
				} else {
					cxOffer.selfigniteMpFlag = "不投保";
					cxOffer.selfigniteMpCoverage = "0";
				}
			}
			
			
			/**
			* 新增加设备损失险
			*/
			if (addRiskCode == "NewEquipmentCoverage") {
				cxOffer.newEquipmentFlag = $("#addEnuContent" + i).val(); // 新增加设备损失险标志
				cxOffer.newEquipmentCoverage = $("#addEnuContent" + i).attr("name"); // 新增加设备损失险保费
				if (picName2 == 1) {
					cxOffer.newEquipmentMpFlag = "投保"; // 新增加设备损失险不计免赔标志
					// 1-勾选不计免赔
					// 0-未勾选不计免赔
					cxOffer.newEquipmentMpCoverage = "1";
				} else {
					cxOffer.newEquipmentMpFlag = "不投保";
					cxOffer.newEquipmentMpCoverage = "0";
				}
				
				if(commodityNo=="0419900101"){
					if(cxOffer.newEquipmentCoverage != "0"){
						fujia4choose2 += 1;
					}else{
						fujia4choose2 -= 1;
					}
				}
			}
			
			/**
			* 指定专修厂险
			*/
			if (addRiskCode == "AppointRepairCoverage") {
				cxOffer.appointrepairFlag = $("#addEnuContent" + i).val(); // 指定专修厂险标志
				cxOffer.appointrepairCoverage = $("#addEnuContent" + i).attr("name"); // 指定专修厂险保费
				
				if(commodityNo=="0419900101"){
					if(cxOffer.appointrepairCoverage != "0"){
						fujia4choose2 += 1;
					}else{
						fujia4choose2 -= 1;
					}
				}
			}

			/**
			 * 发动机涉水损失险
			 */
			if (addRiskCode == "EngineWadingCoverage") {
				cxOffer.wadingFlag = $("#addEnuContent" + i).val(); // 涉水险标志
				cxOffer.wadingCoverage = $("#addEnuContent" + i).attr("name"); // 涉水险保费
				
				if(commodityNo=="0419900101"){
					if(cxOffer.wadingCoverage != "0"){
						fujia4choose2 += 1;
					}else{
						fujia4choose2 -= 1;
					}
				}
				if (picName2 == 1) {
					cxOffer.wadingMpFlag = "投保"; // 划痕险不计免赔标志
					// 1-勾选不计免赔
					// 0-未勾选不计免赔
					cxOffer.wadingMpCoverage = "1";
				} else {
					cxOffer.wadingMpFlag = "不投保";
					cxOffer.wadingMpCoverage = "0";
				}
			}
	
			/**
			 * 精神损害抚慰金责任险
			 */
			if (addRiskCode == "MentalDistressCoverage") {
				cxOffer.mentaldistressFlag = $("#addEnuContent" + i).val(); // 精神损害抚慰金责任险标志
				cxOffer.mentaldistressCoverage = $("#addEnuContent" + i).attr("name"); // 精神损害抚慰金责任险保费
				
				if(commodityNo=="0419900101"){
					if(cxOffer.mentaldistressCoverage != "0"){
						fujia4choose2 += 1;
					}else{
						fujia4choose2 -= 1;
					}
				}
				if (picName2 == 1) {
					cxOffer.mentaldistressMpFlag = "投保"; // 划痕险不计免赔标志
					// 1-勾选不计免赔
					// 0-未勾选不计免赔
					cxOffer.mentaldistressMpCoverage = "1";
				} else {
					cxOffer.mentaldistressMpFlag = "不投保";
					cxOffer.mentaldistressMpCoverage = "0";
				}
			}
			
			/**
			 * 无法找到第三方特约险
			 */
			if (addRiskCode == "NoThirdPartyCoverage") {
				cxOffer.nothirdpartyFlag = $("#addEnuContent" + i).val(); // 无法找到第三方特约险
				cxOffer.nothirdpartyCoverage = $("#addEnuContent" + i).attr("name"); // 无法找到第三方特约险
			}

			/**
			* 车辆划痕损失险
			*/
			if (addRiskCode == "CarScrachCoverage") {
				cxOffer.carscrachFlag = $("#addEnuContent" + i).val(); // 车身划痕险标志
				cxOffer.carscrachCoverage = $("#addEnuContent" + i).attr("name"); // 车身划痕险保费
				if (picName2 == 1) {
					cxOffer.carscrachMpFlag = "投保"; // 划痕险不计免赔标志
					// 1-勾选不计免赔
					// 0-未勾选不计免赔
					cxOffer.carscrachMpCoverage = "1";
				} else {
					cxOffer.carscrachMpFlag = "不投保";
					cxOffer.carscrachMpCoverage = "0";
				}
			}
			/**
			* 车损险绝对免赔额
			*/
			if (addRiskCode == "CarDamagerCoverage") {
				cxOffer.carDamagerFlag = $("#addEnuContent" + i).val(); // 车身划痕险标志
				cxOffer.carDamagerCoverage = $("#addEnuContent" + i).attr("name"); // 车身划痕险保费
			}
			
		}
		//判断尊享版4选2附加险是否>=2个
		if(commodityNo == "0419900101"){
			if(fujia4choose2 < 0){
				cheakOfferinfoFlag = false;
				modelAlert("请在附加险4选2部分至少选择2款产品！");
				fujia4choose2 = 0;
				return false;
			}else{
				fujia4choose2 = 0;
			}
		}
    }else{
    	if(cxOffer.jqxPre == "0"){//交强险、商业险都未投保
    		modelAlert("交强险、商业险至少选择一种进行投保！");
			return false;
    	}
    }
	var cxInfoDTO = {
		"fgFlag" : parm.head.fgFlag,// 是否费改地区
		"productId" : product_id, // 产品编号
		"sessionId" : cxSessionId, // 唯一流水号
		"agentCode" : parm.head.userName,
		"comparyCode" : comparyCode,
		"cxOffer" : cxOffer,
		"commodityNo" : commodityNo
		
	};
	var url = base.url + "gzhcx/saveCxRiskInfo.do";
	var data = {
		"cxInfoDTO" : cxInfoDTO,
		"checkNo":sessionStorage.getItem("checkNo"),
		"checkCode":sessionStorage.getItem("checkCode"),
		"tradeNo":sessionStorage.getItem("tradeNo"),
		"provinceCode":parm.body.inforCar.shengCode,
	};
	var list = new Array();
	function CheckDto(checkFlag, querySequenceNo,checkCode) {
		this.checkFlag = checkFlag;//0:交强，1:商业
		this.querySequenceNo = querySequenceNo;
		this.checkCode = checkCode;
	}
	if(checkFlag!=""){
		list.push(new CheckDto(checkFlag,querySequenceNo,queryCheckCode));
		data.checkDtoList=list;
	}
	// 校验投保信息
	cheackRiskinfo();
	// 若校验投保信息通过则往下执行
	if (cheakOfferinfoFlag == true) {
		$.toAjaxs(url, data, $.submitCallBack);
	}
}
// 校验投保信息
function cheackRiskinfo() {
	var currentTime = new Date().getTime();// 当前时间
	// 获得下一年在这一天的日期
	var nextYearDate = getNextYeardate();
    // 判断主险是不是全部未选，全部未选则校验标志为不通过
	var toubaoFlag = false;
	for ( var i = 0; i < main_risklist.length; i++) {
		var mainEnuContent = $("#mainEnuContent" + i).val();// 险责项名称
		if (mainEnuContent != "不投保" && mainEnuContent != "不可投保") {
			toubaoFlag = true;
		}
	}
	if (toubaoFlag == false) {
		cheakOfferinfoFlag = false;
		modelAlert("请至少选择一条主险险种数据进行操作！");
		return false;
	}
	cheakOfferinfoFlag = true;
}
// 点击进入精确报价预览模块回调
$.submitCallBack = function(paramList) {
	if(paramList.statusCode == "888888"){
		var yzmImg=paramList.returns.checkDto.checkCode; 
		querySequenceNo=paramList.returns.checkDto.querySequenceNo; 
		checkFlag=paramList.returns.checkDto.checkFlag;
		if(checkFlag=="0"){
			$(".zhuanbao").html("请录入交强险转保验证码")
		}else if(checkFlag=="1"){
			$(".zhuanbao").html("请录入商业险转保验证码")
		}
		$(".zhuanbaoImg").attr("src","data:image/png;base64,"+yzmImg);
		$("#querySequenceNo").val("");
		$(".baojiaDialog,#dialog").show();
	}else if(paramList.statusCode == "000000"||paramList.statusCode == "999999") {
		if(paramList.statusCode == "999999"){//变更套餐提示
			modelAlert(paramList.statusMessage,null,function(){
				if(paramList.returns.isBefore=="1"){//重复投保  脱保
					modelAlert("您好，您的爱车上一年车险将于"+paramList.returns.yesterday+"到期，为了避免重复投保，我们将您的车险生效日期更新为"+paramList.returns.today+"。",null,function(){
						parm.body.fromFlag = "1";
						var jsonStr = JSON.stringify(parm);
						jsonStr = UrlEncode(jsonStr); // 加密过后的操作
						window.location.href = "quote.html?jsonStr=" + jsonStr;
					});
				}else if(paramList.returns.isBefore=="2"){
					modelAlert("您好，您的爱车无上一保单结束时间记录，请仔细核实起保时间，防止发生车辆脱保。",null,function(){
						parm.body.fromFlag = "1";
						var jsonStr = JSON.stringify(parm);
						jsonStr = UrlEncode(jsonStr); // 加密过后的操作
						window.location.href = "quote.html?jsonStr=" + jsonStr;
					});
				}else{
					parm.body.fromFlag = "1";
					var jsonStr = JSON.stringify(parm);
					jsonStr = UrlEncode(jsonStr); // 加密过后的操作
					window.location.href = "quote.html?jsonStr=" + jsonStr;
				}
			});
			
		}else{
			if(paramList.returns.isBefore=="1"){//重复投保  脱保
				modelAlert("您好，您的爱车上一年车险将于"+paramList.returns.yesterday+"到期，为了避免重复投保，我们将您的车险生效日期更新为"+paramList.returns.today+"。",null,function(){
					parm.body.fromFlag = "1";
					var jsonStr = JSON.stringify(parm);
					jsonStr = UrlEncode(jsonStr); // 加密过后的操作
					window.location.href = "quote.html?jsonStr=" + jsonStr;
				});
			}else if(paramList.returns.isBefore=="2"){
				modelAlert("您好，您的爱车无上一保单结束时间记录，请仔细核实起保时间，防止发生车辆脱保。",null,function(){
					parm.body.fromFlag = "1";
					var jsonStr = JSON.stringify(parm);
					jsonStr = UrlEncode(jsonStr); // 加密过后的操作
					window.location.href = "quote.html?jsonStr=" + jsonStr;
				});
			}else{
				parm.body.fromFlag = "1";
				var jsonStr = JSON.stringify(parm);
				jsonStr = UrlEncode(jsonStr); // 加密过后的操作
				window.location.href = "quote.html?jsonStr=" + jsonStr;
			}
		}
	} else {
		checkFlag="";//校验类别0:交强，1:商业
		querySequenceNo="";//商业险投保查询码
		queryCheckCode="";//商业险投保 验证码图片的base64字符串
		modelAlert(paramList.statusMessage);
	}
};

// 添加主附险内容
function addMainInsureContent(n) {
	cxSessionId = parm.body.cxSessionId;
	var url = base.url + "gzhcx/queryCxCommodityInfo.do";
	var data = {
		"companyCode" : comparyCode,
		"commodityNo" : n
	}
	$.toAjaxs(url, data, $.addMainInsureContentBack);	
}
//主附险
$.addMainInsureContentBack = function(dataParam) {
	var zdutyparamList = new Array(); // 主险责任项字符串，供安卓使用
	var fdutyparamList = new Array(); // 附加险责任项字符串，供安卓使用
	var zdutylist = new Array();// 存储页面主险责任项数据
	var fdutylist = new Array();// 存储页面附加险责任项数据
	if (dataParam != "" &&dataParam != null) {
		dataParam = eval("(" + dataParam + ")");
		if(dataParam.status.statusCode == "000000"){
			var param = dataParam.cxProduct;

			var product_id = param.base.product_id;// 产品id
			commodityNo = param.base.commodityNo;//套餐编号

			// 加载主险
			if (param.main_risk != null && param.main_risk != "") {
				main_risklist = param.main_risk;
				var policyMes = document.createElement("table");
				var str = "";
				for ( var i = 0; i < param.main_risk.length; i++) {
					var stringq = param.main_risk[i].duty_default;
					var sdate = stringq.split(":");
					var dutyAmount = "";
					if (param.main_risk[i].dutyDetails != null) {
						for ( var j = 0; j < param.main_risk[i].dutyDetails.length; j++) {
							if (param.main_risk[i].dutyDetails[j].enuContent == sdate[1]) {
								dutyAmount = param.main_risk[i].dutyDetails[j].dutyAmount;
							}
						}
					}
					str += "<tr>";
					str += "<td id='chooseMpolicy" + i + "' name='"
							+ param.main_risk[i].duty_code
							+ "' class=''>"
							+ param.main_risk[i].duty_name + "</td>";
					str += "<td id='chooseMduty" + i
							+ "' class='selectMduty'><span class='number'>"+ i +"</span>" +
							"<input id='mainEnuContent" + i + "'class='chooserisk'  name='"
							+ dutyAmount + "' value='" + sdate[1]
							+ "' readonly='readonly'/></td>";
					// 不计免赔标志 01包含 02 不包含
					if (param.main_risk[i].deductible_flag == "01") {
						//尊享版和极致版的主险可选的险种都为必选
						if(param.base.commodityNo != "0419900103"){
								str += "<td id='chooseMpolicydeductible" + i + "' class='selectMItdeductible'>" +
								"<div type='hidden' id='mpolicy"+i+"' class='mpolicy choosebjmp' value='"+ i +"'>" + "不计免赔" + "</div></td>";
						}else{
							if (sdate[1] != "不投保" && sdate[1] != "不可投保") {//投保时，不计免赔显示
								// 不计免赔默认值 01 勾选 02 不勾选
								if (param.main_risk[i].deductible_default == "01") {//默认选择不计免赔（现在都是这种情况）
									str += "<td id='chooseMpolicydeductible" + i + "' class='selectMItdeductible' style='color:#5bb5e7;'>" +
										"<div type='hidden' id='mpolicy"+i+"' class='mpolicy choosebjmp' value='"+ i +"'>" + "不计免赔" + "</div></td>";
								} else {//默认不选择不计免赔（现在没有这种情况）
									str += "<td id='chooseMpolicydeductible" + i + "' class='selectMItdeductible'>" +
										"<div type='hidden' id='mpolicy"+i+"' class='mpolicy nochoosebjmp' value='"+ i +"'>" + "不计免赔" + "</div></td>";
								}
							} else {//不投保时，不计免赔显示（现在初始化都是投保，老司机版后面可以选择不投保）
								str += "<td id='chooseMpolicydeductible" + i + "' class='selectMItdeductible'>" +
										"<div type='hidden' id='mpolicy"+i+"' class='mpolicy nochoosebjmp' value='"+ i +"'>" + "不计免赔" + "</div></td>";
							}
						}
						
					} else {
						str += "<td id='chooseMpolicydeductible" + i + "' class=''>" +
								"<img style='display: none;' src=''></td>";
					}
					str += "</tr>";
					zdutylist.push(param.main_risk[i].dutyDetails);// 主险责任项列表
					
					
					if (param.main_risk[i].dutyDetails != null) {
						var dutyMparam = new Array();
						function ProcessSheng(text, value) {
							this.text = text;
							this.value = value;
						}
						for ( var j = 0; j < param.main_risk[i].dutyDetails.length; j++) {
							var customerinfo = new ProcessSheng(
									param.main_risk[i].dutyDetails[j].enuContent, j);
							dutyMparam.push(customerinfo);
						}
						zdutyparamList.push(dutyMparam);
					}
				}
				$(policyMes).html(str);
				$("#mainInsurecontent").html(policyMes);
				$("#mainInsurecontent table tr:last-child td").removeClass("border-1px-bottom");
				//主险责任项选择
				//尊享版和极致版，主险为必选，所以默认为投保的状态不允许用户更改
				var k = 0;
				$(".selectMduty").unbind("tap").bind("tap",function(){
					var i = $(this).find("span").html();
					var toubaoState = $(this).find("input").val();
					if((param.base.commodityNo == "0419900101" || param.base.commodityNo == "0419900102") && toubaoState == "投保"){
						
					}else{//自由版
						k = i ;
						var idstr = "mainEnuContent" + k;
						(function($, doc) {
							/*console.log(doc);代表整个html文档*/
							// 一级联动
							var selectPicker = new $.PopPicker();
							selectPicker.setData(zdutyparamList[i]);
							var selectResult = doc.getElementById(idstr);
							selectPicker.show(function(items) {
										var num = items[0].value;
										selectResult.value = items[0].text;
										selectResult.name = zdutylist[k][num].dutyAmount;
										// 如果选择不投保则去除不计免赔勾选
										if (items[0].text == "不投保" || items[0].text == "不可投保") {
											doc.getElementById("mainEnuContent" + k).className="nochooserisk";
											doc.getElementById("mpolicy" + k).className="nochoosebjmp";
										}else{
											doc.getElementById("mainEnuContent" + k).className="chooserisk";
											doc.getElementById("mpolicy" + k).className="choosebjmp";
										}
										selectPicker.dispose();// 释放组件资源
							});
						})(mui, document);
					}
						
				});
				
				// 主险险种是否免赔(目前是否免赔是根据是否投保决定，不计免赔不可单独修改)
				if(param.base.commodityNo == "0419900103"){
					$(".selectMItdeductible").unbind("tap").bind("tap",function(){
						var i = $(this).find("div").attr("value");
						var mainEnuContent = $("#mainEnuContent" + i).val();// 险责项名称
						if (mainEnuContent != "不投保" && mainEnuContent != "不可投保") {
							if ($("#mpolicy" + i).css("color") == "rgb(174, 178, 183)") {
								$("#mpolicy" + i).removeClass("nochoosebjmp");
								$("#mpolicy" + i).addClass("choosebjmp");
							} else {
								$("#mpolicy" + i).removeClass("choosebjmp");
								$("#mpolicy" + i).addClass("nochoosebjmp");
							}
						}
						
					});
				}
				
			}
			// 加载附加险
			if (param.add_risk != null && param.add_risk != "") {
				add_risklist = param.add_risk;
				var policyMes2 = document.createElement("table");
				var str ="";//附加险全部内容
				var str2 = "";
				var str4 = "";
				for ( var i = 0; i < param.add_risk.length; i++) {
					var stringf = param.add_risk[i].duty_default;
					var fdate = stringf.split(":");
					var dutyAmount = "";
					if (param.add_risk[i].dutyDetails != null) {
						for ( var j = 0; j < param.add_risk[i].dutyDetails.length; j++) {
							if (param.add_risk[i].dutyDetails[j].enuContent == fdate[1]) {
								dutyAmount = param.add_risk[i].dutyDetails[j].dutyAmount;
							}
						}
					}
					//附加险尊享版
					if(commodityNo == "0419900101"){
						//非4选2部分附加险渲染(写死为投保，所以name值要改成投保的状态1)
						if(param.add_risk[i].need_select == "1"){
							str2 += "<tr>";
							str2 += "<td id='choosepolicy" + i + "' name='"
									+ param.add_risk[i].duty_code
									+ "' class=''>";
							var duty_name=param.add_risk[i].duty_name;
							var producingarea=parm.body.producingarea;//车型产地  进口车、合资车、国产车
							if(duty_name=="玻璃单独破碎险"){
								if(producingarea=="进口车") {
									duty_name=duty_name+" （进口）";
								}else{
									duty_name=duty_name+" （国产）";
								}
							}
							str2 += duty_name ;
							str2 +="</td>";
							
							
							str2 += "<td id='chooseFduty" + i
									+ "' class='selectFduty'><span class='number'>"+ i +"</span>" +
									" <input class='chooserisk' id='addEnuContent" + i + "' name='1' value='投保' readonly='readonly'/></td>";
							// 不计免赔标志 01包含 02 不包含
							if (param.add_risk[i].deductible_flag == "01") {
								// 不计免赔默认值 01 勾选 02 不勾选
								str2 += "<td id='choosepolicydeductible"+ i +"' class='selectItdeductible'>" +
										"<div type='hidden' id='deductible"+i+"' class='deductible choosebjmp' value='"+ i +"'>" + "不计免赔" + "</div></td>";
							} else {
								str2 += "<td id='choosepolicydeductible"
										+ i
										+ "' class=''><img style='display: none;' src=''></td>";
							}
							str2 += "</tr>";
						}else if(param.add_risk[i].need_select == "2"){//4选2部分附加险渲染(初始默认不投保)
							str4 += "<tr class='choose2'>";
							str4 += "<td id='choosepolicy" + i + "' name='"
									+ param.add_risk[i].duty_code
									+ "' class=''>"
									+ param.add_risk[i].duty_name + "</td>";
							str4 += "<td id='chooseFduty" + i
									+ "' class='selectFduty'><span class='number'>"+ i +"</span>" +
									" <input class='nochooserisk' id='addEnuContent" + i + "' name='"
									+ dutyAmount + "' value='" + fdate[1]
									+ "'readonly='readonly'/></td>";
							// 不计免赔标志 01包含 02 不包含
							if (param.add_risk[i].deductible_flag == "01") {
								// 不计免赔默认值 01 勾选 02 不勾选
								if (param.add_risk[i].deductible_default == "01") {
									str4 += "<td id='choosepolicydeductible"+ i +"' class='selectItdeductible' style='color:#5bb5e7;'>" +
											"<div type='hidden' id='deductible"+i+"' class='deductible choosebjmp' value='"+ i +"'>" + "不计免赔" + "</div></td>";
								} else {
									str4 += "<td id='choosepolicydeductible"+ i +"' class='selectItdeductible'>" +
											"<div type='hidden' id='deductible"+i+"' class='deductible nochoosebjmp' value='"+ i +"'>" + "不计免赔" + "</div></td>";
								}
							} else {
								str4 += "<td id='choosepolicydeductible"
										+ i
										+ "' class=''><img style='display: none;' src=''></td>";
							}
							str4 += "</tr>";
						}
					}else if(commodityNo == "0419900102"){//极致版
						str2 += "<tr>";
						str2 += "<td id='choosepolicy" + i + "' name='"
								+ param.add_risk[i].duty_code
								+ "' class='border-1px-bottom'>"
								+ param.add_risk[i].duty_name + "</td>";
						str2 += "<td id='chooseFduty" + i
								+ "' class='selectFduty border-1px-bottom'><span class='number'>"+ i +"</span>" +
								" <input class='chooserisk' id='addEnuContent" + i + "' name='500' value='500' readonly='readonly'/></td>";
						// 不计免赔标志 01包含 02 不包含
						if (param.add_risk[i].deductible_flag == "01") {
							// 不计免赔默认值 01 勾选 02 不勾选
							if (param.add_risk[i].deductible_default == "01") {
								str2 += "<td id='choosepolicydeductible"+ i +"' class='selectItdeductible border-1px-bottom' style='color:#5bb5e7;'>" +
										"<div type='hidden' id='deductible"+i+"' class='deductible choosebjmp' value='"+ i +"'>" + "不计免赔" + "</div></td>";
							} else {
								str2 += "<td id='choosepolicydeductible"+ i +"' class='selectItdeductible border-1px-bottom'>" +
										"<div type='hidden' id='deductible"+i+"' class='deductible nochoosebjmp' value='"+ i +"'>" + "不计免赔" + "</div></td>";
							}
						} else {
							str2 += "<td id='choosepolicydeductible"
									+ i
									+ "' class=''><img style='display: none;' src=''></td>";
						}
						str2 += "</tr>";
					
					}else{//老司机套餐
						str2 += "<tr>";
						str2 += "<td id='choosepolicy" + i + "' name='"+ param.add_risk[i].duty_code+ "' class=''>";
						var duty_name=param.add_risk[i].duty_name;
						var producingarea=parm.body.producingarea;//车型产地  进口车、合资车、国产车
						if(duty_name=="玻璃单独破碎险"){
							if(producingarea=="进口车") {
								duty_name=duty_name+" （进口）";
							}else{
								duty_name=duty_name+" （国产）";
							}
						}
						str2 += duty_name ;
						str2 +="</td>";
								
						str2 += "<td id='chooseFduty" + i
								+ "' class='selectFduty'><span class='number'>"+ i +"</span>" +
								" <input class='nochooserisk' id='addEnuContent" + i + "' name='"
								+ dutyAmount + "' value='" + fdate[1]
								+ "' readonly='readonly'/></td>";
						// 不计免赔标志 01包含 02 不包含
						if (param.add_risk[i].deductible_flag == "01") {
							// 不计免赔默认值 01 勾选 02 不勾选
							if (param.add_risk[i].deductible_default == "01") {
								str2 += "<td id='choosepolicydeductible"+ i +"' class='selectItdeductible' style='color:#5bb5e7;'>" +
										"<div type='hidden' id='deductible"+i+"' class='deductible choosebjmp' value='"+ i +"'>" + "不计免赔" + "</div></td>";
							} else {
								str2 += "<td id='choosepolicydeductible"+ i +"' class='selectItdeductible'>" +
										"<div type='hidden' id='deductible"+i+"' class='deductible nochoosebjmp' value='"+ i +"'>" + "不计免赔" + "</div></td>";
							}
						} else {
							str2 += "<td id='choosepolicydeductible"
									+ i
									+ "' class=''><img style='display: none;' src=''></td>";
						}
						str2 += "</tr>";
					}
					
					fdutylist.push(param.add_risk[i].dutyDetails);// 附加险责任项列表
					if (param.add_risk[i].dutyDetails != null) {
						var dutyFparam = new Array();
						function ProcessSheng(text, value) {
							this.text = text;
							this.value = value;
						}
						for ( var j = 0; j < param.add_risk[i].dutyDetails.length; j++) {
							var customerinfo = new ProcessSheng(
									param.add_risk[i].dutyDetails[j].enuContent, j);
							dutyFparam.push(customerinfo);
						}
						fdutyparamList.push(dutyFparam);

					}
					
					
					
				}
				str = str2;
				//尊享版，附加险有4选2
				if(commodityNo == "0419900101"){
					var str3 = "";
					str3 += "<tr class='choose2'>";
					str3 += "<td class='border-1px-bottom' colspan='3'><img src='../../images/tishi.png' style='width:14px;height:14px;'>以下4项保险需任选2项或2项以上</td>"
					str3 += "</tr>";
					str += str3;
					str += str4;
				}
				$(policyMes2).html(str);
				$("#additionInsurecontent").html(policyMes2);
				$("#additionInsurecontent table tr:last-child td").removeClass(
						"border-1px-bottom");
			}else{
				$("#additionInsurecontent").html("");
			}
			
			// 附加险责任项选择
			if(commodityNo != "0419900102"){//极致版 
				var w = 0;
				$(".selectFduty").unbind("tap").bind("tap",function(){
					var i = $(this).find("span").html();
					w = i;
					var idfstr = "addEnuContent" + w;
					if(commodityNo == "0419900101" && (i==0||i==1)){
						
					}else{
						(function($, doc) {
							// 一级联动
							var selectPicker = new $.PopPicker();
							selectPicker.setData(fdutyparamList[i]);
							var selectResult = doc.getElementById(idfstr);
							selectPicker.show(function(items) {
										var num = items[0].value;
										selectResult.value = items[0].text;
										selectResult.name = fdutylist[w][num].dutyAmount;
										// 如果选择不投保则去除不计免赔勾选
										//尊享版和极致版和自由版，若附加险为投保状态，则免赔，为非投保状态，则不免赔,所以都是一样
										if(commodityNo == "0419900103"){//自由版
											if(doc.getElementById("deductible" + w)){
												if (items[0].text == "不投保" || items[0].text == "不可投保") {
													doc.getElementById("addEnuContent" + w).className="nochooserisk";
													doc.getElementById("deductible" + w).className="nochoosebjmp";
												}else{
													doc.getElementById("addEnuContent" + w).className="chooserisk";
													doc.getElementById("deductible" + w).className="choosebjmp";
												}
											}else{
												if (items[0].text == "不投保" || items[0].text == "不可投保") {
													doc.getElementById("addEnuContent" + w).className="nochooserisk";
												}else{
													doc.getElementById("addEnuContent" + w).className="chooserisk";
												}
											}
										}else{//尊享版
											if(doc.getElementById("deductible" + w)){
												if (items[0].text == "不投保" || items[0].text == "不可投保") {
													doc.getElementById("addEnuContent" + w).className="nochooserisk";
													doc.getElementById("deductible" + w).className="nochoosebjmp";
												}else{
													doc.getElementById("addEnuContent" + w).className="chooserisk";
													doc.getElementById("deductible" + w).className="choosebjmp";
												}
											}else{
												if (items[0].text == "不投保" || items[0].text == "不可投保") {
													doc.getElementById("addEnuContent" + w).className="nochooserisk";
												}else{
													doc.getElementById("addEnuContent" + w).className="chooserisk";
												}
											}
											
										}
										
										selectPicker.dispose();// 释放组件资源
									});
						})(mui, document);
					}
					
				});
			}
			
			// 附加险是否选择不计免赔
			//尊享版和极致版，若附加险为投保状态，则免赔，为非投保状态，则不免赔，自由版由用户选择是否免赔
			if(commodityNo == "0419900103"){
				$(".selectItdeductible").unbind("tap").bind("tap",function(){
					var k = $(this).find("div").attr("value");
					var addEnuContent = $("#addEnuContent" + k).val();// 险责项名称
					if (addEnuContent != "不投保" && addEnuContent != "不可投保") {
						if ($("#deductible" + k).css("color") == "rgb(174, 178, 183)") {//灰色
							$("#deductible" + k).removeClass("nochoosebjmp");
							$("#deductible" + k).addClass("choosebjmp");
						} else {
							$("#deductible" + k).removeClass("choosebjmp");
							$("#deductible" + k).addClass("nochoosebjmp");
						}
					}
				})
			}
			
			//加载专属服务
			if(param.cxPriservice != null && param.cxPriservice != ""){
				bxCxPriserviceArr = param.cxPriservice;
				var zsfwTitleStr="";
				var zsfuContentStr="";
				$(".services").html("");
				for ( var i = 0; i < param.cxPriservice.length; i++){
					zsfwTitleStr += '<div class="zsfwtitle" onclick="intoServicePage('+i+')">'+param.cxPriservice[i].serviceTitle+'</div>';
				}
				zsfwTitleStr += '<div class="clear"></div>';
			}
			$(".services").append(zsfwTitleStr);
			$(".services .zsfwtitle").eq(0).addClass("zsfwactive");
			/* 给专属服务加当前选项属性zsfwactive */
			$(".zsfwtitle").unbind("tap").bind("tap",function(){
				$(".zsfwactive").removeClass("zsfwactive");
				$(this).addClass("zsfwactive");
			})
		}else{
			modelAlert("获取产品信息异常");
		}
    }
	/* 设置滑动区域 */
	$.setscroll();
}
function intoServicePage(n){
	var serviceStr = "";
	$("#title").html(bxCxPriserviceArr[n].serviceTitle);
	$("#inner").html(bxCxPriserviceArr[n].serviceInfo);
	$(".h_title").html("专属服务");
	$(".servicePage").show();
	$(".h_back").unbind("tap").bind("tap",function(){
		$(".h_title").html("保障范围");
		$(".mainPage").show();
		$(".servicePage").hide();
		$(".h_back").unbind("tap").bind("tap",function(){
			parm.body.cxSessionId = cxSessionId;
			var jsonStr = JSON.stringify(parm);
			jsonStr = UrlEncode(jsonStr);
			window.location.href = "carMes.html?jsonStr=" + jsonStr;
		});
	});
	$(".mainPage").hide();
}
//获得下一年在这一天的日期
function getNextYeardate() {
	var currentdate = new Date();
	var strYear = currentdate.getFullYear() + 1;
	var strDay = currentdate.getDate();
	var strMonth = currentdate.getMonth() + 1;
	if (strMonth < 10) {
		strMonth = "0" + strMonth;
	}
	if (strDay < 10) {
		strDay = "0" + strDay;
	}
	datastr = strYear + "-" + strMonth + "-" + strDay;
	return datastr;
}
//险种的隐藏与展示,第一个参数是点击的区域，后面的参数是需要展示和隐藏的元素
function unfoldMes(idarea, idmes, mes2, mes3) {
	$(idarea).unbind("tap").bind("tap",
			function() {
				var foldIcon = $(idarea).find(".linkicon2 img");
				var picName = foldIcon.attr("src").substring(
						foldIcon.attr("src").lastIndexOf("/") + 1);

				if (picName == "beneficiaryUp.png") {
					$(idmes).hide();
					$(mes2).hide();
					$(mes3).hide();
					foldIcon.attr("src", "../../imgs/carinsure/beneficiaryDown.png");
				} else {
					$(idmes).show();
					$(mes2).show();
					$(mes3).show();
					foldIcon.attr("src", "../../imgs/carinsure/beneficiaryUp.png");
				}
			});
}
/* 设置滑动区域 */
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$(".mainPage").height(Scrollheight);
	mui(".mainPage").scroll();
	$("#accprice_index").height(Scrollheight);
	mui("#accprice_index").scroll();
	$("#order_index").height(Scrollheight);
	mui("#order_index").scroll();
};
