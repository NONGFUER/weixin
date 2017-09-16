var pageflag = 0; // 0 车辆基本信息 1 车辆详细信息 2 品牌型号选择
var brand_model = "";// 品牌型号
var citynum = "";// 城市代码
var shengList = new Array();// 省级数据
var shiList = new Array();// 市级数据
var province = "0";// province值为上级的代码，province=0时取全部省
var rankFlag = 0;// 省市县级别标志 0-省 1-市 2-县
var comparyCode = "00004";// 101 天安保险公司编码
var cheakOwnerFlag = true;// 检验车主信息标志
var cheakCarinfoFlag = true;// 检验车辆详细信息标志
var carinfoCheakFlag = true; //校验品牌型号的标志
var seats = "";// 座位数
var chooseicon = 0;// 是否新车标志 1：新车，0：非新车
var specialCarFlag = 0;// 是否过户车 是：1；否：0
var shengName = "";
var vehicleModelData;
var cxCarMessage = {};// 车辆信息
var cxOrder = {};// 订单信息
var cxOffer = {};// 报价信息
var inforCar ={};  //向下一个页面传参数的实体
var parm;
var cxSessionId;
var fgFlag="";//费改地区  1：是费改地区   0：不是费改地区
var carPlate="";//车牌
var issueChannel="";
var gouxuan="1";//阅读条款已勾选
$(function() {
	issueChannel=getUrlQueryString("channel");//渠道
	if(issueChannel!=null){
		var userName=getUrlQueryString("randomno");//随机码
		$("#issueChannel").attr("channelCode",issueChannel)
		var backurl=getUrlQueryString("backurl");//返回路径
		sessionStorage.setItem("backurl", backurl);
		parm = {
			"head":{
				"userName":userName,
				"openId":"",
				"source":"1",//微信渠道
				"fgFlag":"1",
			},"body":{}
		};
	}else{
		var str = window.location.search;
		str = str.substr(9, str.length);
		str = UrlDecode(str);
		parm = JSON.parse(str)
		cxSessionId=parm.body.cxSessionId
	}
	/**首页banner跳转***/
	$(".banner").attr("href",base.url1+"html/carinsure/carInfo.html?jsonStr="+UrlEncode(JSON.stringify(parm)));
	
	
	if(!$.isNull(parm.body.inforCar) && parm.body.inforCar != undefined){
		addCarInfo();
		// 获取车辆信息
		$.loadCarInfoed();
	}else{
		var url = base.url + "vi/selectHistoryInfo.do";
		var resData = {
			"head":{
				"userCode":"",
				"transTime":$.getTimeStr(),
				"channel":"1"
			},"body":{
		        "userName" : parm.head.userName
			}
		};
		$.reqAjaxs(url, resData, function(data){
			if (data.statusCode == "000000") {
				if(data.returns.cxOrder != null){
					//出单人员是否匹配到省
					parm.body.cdPrivinceFlag=data.returns.cxProvince.flag;
					var cityName = data.returns.cxOrder.cityName;
					if(!$.isNull(cityName)){ //省份、城市
						var arr = cityName.split(/[-]/);
						$("#car_sheng").val(arr[0]);
						$("#car_shi").val(arr[1]);
					}
					if(!$.isNull(data.returns.cxOrder.provinceCode)){
						$("#car_sheng").attr("name",data.returns.cxOrder.provinceCode);
					}
					if(!$.isNull(data.returns.cxOrder.cityCode)){
						citynum=data.returns.cxOrder.cityCode;
						$("#car_shi").attr("name",data.returns.cxOrder.cityCode);
					}
					if (data.returns.cxOrder.newcarFlag == "1") {
						document.getElementById("chooseicon").src = base.ppStopImagePath+"gouxuankuang1.png";
						$("#plateNum").css("color","#f36f39");
						$("#plate_number_input").val("请输入车牌号码").css("color", "#888"); // 车牌号码
						$('#plate_number_input').attr("disabled", true);// 选中新车未上牌时车牌号码输入框元素设置为disabled
						chooseicon = 1;// 是否新车标志 1：新车，0：非新车
					} else {
						document.getElementById("chooseicon").src = base.ppStopImagePath + "gouxuankuang.png";
						$("#plateNum").css("color","#585858");
						$('#plate_number_input').removeAttr("disabled");// 去除input元素的readonly属性
						$("#plate_number_input").val(data.returns.cxOrder.plateno).css("color","#585858");
					}
					if(!$.isNull(data.returns.cxOrder.ownerName)){ //车主姓名
					    $("#owner_name").val(data.returns.cxOrder.ownerName).css("color","#585858");
					}
					if(!$.isNull(data.returns.cxOrder.ownerIdno)){ //身份证
					    $("#owner_idNo").val(data.returns.cxOrder.ownerIdno).css("color","#585858");
					}
					if(!$.isNull(data.returns.cxOrder.ownerMobile)){ //手机号码
					    $("#owner_mobile").val(data.returns.cxOrder.ownerMobile).css("color","#585858");
					}
					if(data.returns.cxOrder.cityCode=="3110000"){//新车北京地区
						if(data.returns.cxCarMessage != null){
							if(!$.isNull(data.returns.cxCarMessage.fuelType)){//能源种类
								$("#fuelType").attr("name",data.returns.cxCarMessage.fuelType).val(data.returns.cxCarMessage.fuelTypeName)
							}
						}
						if(!$.isNull(data.returns.cxOrder.certiStartdate)){//身份证起期
							$("#certiStartDate").val(data.returns.cxOrder.certiStartdate.split(" ")[0]);
						}
			            if(!$.isNull(data.returns.cxOrder.certiEnddate)){//身份证止期
			             	$("#certiEndDate").val(data.returns.cxOrder.certiEnddate.split(" ")[0]);
						}
			            if(!$.isNull(data.returns.cxOrder.nation)){//民族
			            	 $("#nation").val(data.returns.cxOrder.nation)
						}
			            if(!$.isNull(data.returns.cxOrder.issuerAuthority)){//签发机构
							$("#issuer").val(data.returns.cxOrder.issuerAuthority).css("color","#585858");
						}
						if (data.returns.cxOrder.newcarFlag == "1") {
							if(data.returns.cxCarMessage != null){
								if(!$.isNull(data.returns.cxCarMessage.certificateType)){//凭证种类
									$("#certificateType").attr("name",data.returns.cxCarMessage.certificateType).val(data.returns.cxCarMessage.certificateTypeName)
								}
								if(!$.isNull(data.returns.cxCarMessage.certificateNo)){//凭证编号
									$("#certificateNo").val(data.returns.cxCarMessage.certificateNo).css("color","#585858");
								}
								if(!$.isNull(data.returns.cxCarMessage.certificateDate)){//凭证日期
									$("#certificateDate").val(data.returns.cxCarMessage.certificateDate.split(" ")[0]);
								}
							}
						}
					}
					if(citynum=="3440300"){//深圳地区
						if(!$.isNull(data.returns.cxOrder.ownerEmail)){ //邮箱
						   $("#owner_email").val(data.returns.cxOrder.ownerEmail).css("color","#585858");
						}
					}
				}
				if(data.returns.cxCarMessage != null){
					if(!$.isNull(data.returns.cxCarMessage.rackNo)){//车辆识别代码/VIN
					    $("#vehicle_identification_input").val(data.returns.cxCarMessage.rackNo).css("color","#585858");
					}
					if(!$.isNull(data.returns.cxCarMessage.engineNo)){ //发动机号
					    $("#engine_number_input").val(data.returns.cxCarMessage.engineNo).css("color","#585858");
					}
					var registerDate = "";
					if(!$.isNull(data.returns.cxCarMessage.registerDate)){ //车辆注册日期
						registerDate = subTime(data.returns.cxCarMessage.registerDate);
					    $("#vehicle_registration_date").val(registerDate).css("color","#585858");
					}
					//是否过户
					if(data.returns.cxCarMessage.transferFlag == 1){
						document.getElementById("chooseIcons").src = base.ppStopImagePath + "dakai.png";
						$("#specialCarDate_select").show();
						var transferDate = subTime(data.returns.cxCarMessage.transferDate); //过户日期
					    $("#specialCarDate").val(transferDate).css("color","#585858");
					}else{
						document.getElementById("chooseIcons").src = base.ppStopImagePath + "guanbi.png";
						$("#specialCarDate_select").hide();
						$("#specialCarDate").val("请选择过户日期").css("color","#585858");
					}
					//是否外地车
					if(data.returns.cxCarMessage.ecdemicVehicleFlag == 1){
						$("#info_car_choose div").css("color","#f36f39");
						document.getElementById("choosecar").src = base.ppStopImagePath + "dakai.png";
					}else{
						$("#info_car_choose div").css("color","#585858");
						document.getElementById("choosecar").src = base.ppStopImagePath + "guanbi.png";
					}
				}
			}else{
				modelAlert(data.statusMessage);
			}
			$(".backload").hide();//背景图隐藏
		});
		
		$(".backload").hide();//背景图隐藏
	}
	$.setscrollarea("indexpart");
	//车辆提示遮罩显示
    $(".howInput").bind("tap",function() {
      	$("#cjh,.shadow").show();
    });
    //车辆提示遮罩隐藏
    $("#cjh").bind("tap",function() {
    	setTimeout(function(){
     	   $("#cjh,.shadow").hide();
     	},200);
    });
    //返回
	$(".h_back").unbind("tap").bind("tap",function() {
		$("#indexpart_scroll").css("transform","translate3d(0px, 0px, 0px)")
		if (pageflag == 0) {
			goBackDH();//返回融石方法
        } else if (pageflag == 1) {
        	$(".lastPart").hide();//车辆详细信息显示
        	$(".firstPart").show("fast");//车辆投保地区显示
			pageflag = 0;
		}else{
			$("#pageTitle").html("车辆信息");
			$(".vehicleInfo").hide();
			$(".carMes").show();
			pageflag = 1;
		}
	});

	/**--勾选条款*/
	$("#gouxuan").unbind("tap").bind("tap",function() {
		var gouxuanPicName = $("#gouxuan").attr("src").substring($("#gouxuan").attr("src").lastIndexOf("/") + 1);
		if(gouxuanPicName=="gouxuan2.png"){
			$("#gouxuan").attr("src",base.ppStopImagePath+"weigouxuan.png");
			$("#confirm1").css("background-color","#ccc");
			gouxuan="0";
		}else{
			$("#gouxuan").attr("src",base.ppStopImagePath+"gouxuan2.png");
			$("#confirm1").css("background-color","#f36f39");
			gouxuan="1";
		}
		
	});
	/****对iframe的操作*****/
	iframe();
	/** ************************车主信息********************************* */
	$("#issueChannel").val( "请选择渠道").css("color","#888");
	$("#car_sheng").val( "请选择省份").css("color","#888");
	$("#car_shi").val( "请选择城市").css("color","#888");
	$("#seat").val("请输入车辆座位数").css("color","#888");
	$("#checkNo").val("请输入验证码").css("color","#888");
	$.replacePlaceholder($("#plate_number_input"), "请输入车牌号码");
	$.replacePlaceholder($("#owner_name"), "请输入车主姓名");
	$.replacePlaceholder($("#owner_idNo"), "请输入车主身份证号");
	$.replacePlaceholder($("#owner_mobile"), "请输入车主手机号码");
	$.replacePlaceholder($("#checkNo"), "请输入验证码");
	$.replacePlaceholder($("#seat"), "请输入车辆座位数");
	$.replacePlaceholder($("#brand_model_input"), "请输入品牌型号");
	$.replacePlaceholder($("#vehicle_identification_input"),"请输入车辆识别代码");
	$.replacePlaceholder($("#engine_number_input"), "请输入发动机号");
	$.replacePlaceholder($("#vehicleInvoiceNo"), "请输入新车购置发票号");
	$.replacePlaceholder($("#certificateNo"), "请输入凭证编号");
	$.replacePlaceholder($("#issuer"), "请输入签发机构");
	$.replacePlaceholder($("#owner_email"), "请输入车主邮箱");
	$("#carselectChannel").unbind("tap").bind("tap",function() {
		selectChannel();
		$("#brand_model_input").val("请选择品牌型号");
	});
	$("#carselectSheng").unbind("tap").bind("tap",function() {
		selectSheng();
		$("#brand_model_input").val("请选择品牌型号");
	});
	$("#carselectshi").unbind("tap").bind("tap",function() {
		selectShi();
		$("#brand_model_input").val("请选择品牌型号");
	});
	// 勾选新车未上牌
	$("#plateNum").unbind("tap").bind("tap",function(){
		var picName = $("#chooseicon").attr("src").substring($("#chooseicon").attr("src").lastIndexOf("/") + 1);
		if (picName == "gouxuankuang.png") {
			document.getElementById("chooseicon").src = base.ppStopImagePath + "gouxuankuang1.png";
			$("#plateNum").css("color","#f36f39");
			$("#plate_number_input").val("请输入车牌号码").css("color", "#888"); // 车牌号码
			$('#plate_number_input').attr("disabled", true);// 选中新车未上牌时车牌号码输入框元素设置为disabled
			chooseicon = 1;// 是否新车标志 1：新车，0：非新车
			$("#brand_model_input").val("请选择品牌型号");
		} else {
			document.getElementById("chooseicon").src = base.ppStopImagePath + "gouxuankuang.png";
			$("#plateNum").css("color","#888");
			$('#plate_number_input').removeAttr("disabled");// 去除input元素的readonly属性
			$("#plate_number_input").val(carPlate).css("color","#585858");//牌照
			chooseicon = 0;// 是否新车标志 1：新车，0：非新车
		}
	})
	// 车辆注册日期调用日期控件
	$("#vehicle_registration_date_select").unbind("tap").bind("tap",function() {
		  var vehicle_registration_date = $("#vehicle_registration_date").val();
		  if (vehicle_registration_date == "请选择注册日期") {
			  vehicle_registration_date = "";
		  }
		  openDataNowDate("vehicle_registration_date");
		  $("#brand_model_input").val("请选择品牌型号");
		});
	
	// 过户日期调用日期控件
	$("#specialCarDate_select").unbind("tap").bind("tap",function() {
	    //注册日期
		if ($.isNull($("#vehicle_registration_date").val())|| $("#vehicle_registration_date").val() == "请选择注册日期") {
			modelAlert("请选择车辆注册日期！");
			return false;
		}
		var specialCarDate = $("#specialCarDate").val();
		if (specialCarDate == "请选择过户日期") {
			specialCarDate = "";
		}
		openDataNowDate("specialCarDate");
		$("#brand_model_input").val("请选择品牌型号");
	});
	$("#specialCarDate_select").hide();
	//能源种类
	openDicMuiList("fuelType", "bx_fuel_type", " ", true);
	//车辆来历凭证种类
	openDicMuiList("certificateType", "bx_certificate_type", " ", true);
	//开具车辆来历凭证所载日期
	var date=new Date();
	var year2 = date.getFullYear();
	var month2 = date.getMonth() + 1;
	var day2 = date.getDate();
	$("#certificateDate").attr("data-options",'{"type":"date","beginYear":1980,"endYear":'+year2+',"endMonth":'+month2+',"endDay":'+day2+'}');
	openDataCustomized("certificateDate");
	/*身份证有效起期*/
	var now=new Date();
	now.setDate(now.getDate()-1);
	var year1 = now.getFullYear();
	var month1 = now.getMonth() + 1;
	var day1 = now.getDate();
	$("#certiStartDate").attr("data-options",'{"type":"date","beginYear":2003,"endYear":'+year1+',"endMonth":'+month1+',"endDay":'+day1+'}');
	/*身份证有效止期*/
	var current = new Date();
	current.setDate(current.getDate() + 1);
    var year = current.getFullYear();
    var month = current.getMonth() + 1;
    var day = current.getDate();
    var defaultTime=$.getTimeStr2();
	$("#certiEndDate").attr("data-options",'{"type":"date","beginYear":'+year+',"beginMonth":'+month+',"beginDay":'+day+',"endYear":2070}');
	
	//身份证有效起期
	openDataCustomized("certiStartDate");
	//身份证有效止期
	openDataCustomized("certiEndDate");
	//民族
	openDicMuiList("nation", "bx_nation", " ", true);

	// 点击是否选择
	selectCarFlag();

	$(".confirmsection").unbind("tap").bind("tap",function() {
		$(".unfindarea").hide();
		$(".shadow").hide();
	});

	// 实时检查车主信息
	blurCheackOwner();

	// 车辆基本信息确认按钮
	$("#confirm1").unbind("tap").bind("tap",function() {
       $("#plate_number_input").val($("#plate_number_input").val().toUpperCase());//车牌小写转大写
       if(gouxuan=="0"){
    	   return false;
	   }
//	   if(issueChannel=="10"){
//		   modelAlert("系统升级中，投保功能暂时关闭");
//		   return false;
//	   }
       // 解绑实时检查车主信息
		unBindblurCheackOwner();
		// 校验车主信息
		cheackOwner();
	
		// 若校验车主信息通过则显示下一页内容
		if (cheakOwnerFlag == true) {
			    cxOrder.companyCode = comparyCode;
			    cxOrder.issueChannel=$("#issueChannel").attr("channelCode");
				cxOrder.cityCode = citynum;// 车辆行驶城市
				
				var pName = $("#chooseicon").attr("src").substring($("#chooseicon").attr("src").lastIndexOf("/") + 1);
				if (pName == "gouxuankuang.png") {
					chooseicon = 0;
					cxOrder.plateno = $("#plate_number_input").val();// 车牌号
				} else {
					chooseicon = 1;
					cxOrder.plateno = "";// 车牌号
				}
				cxOrder.newcarFlag = chooseicon;// 是否新车
				cxOrder.cityName = $("#car_sheng").val()+"-"+$("#car_shi").val();
				cxOrder.provinceName=$("#car_sheng").val();
				cxOrder.provinceCode=$("#car_sheng").attr("name");
				var cxInfoDTO = {
					"productId" : "", // 产品编号
					"sessionId" : "", // 唯一流水号
					"agentCode" : parm.head.userName,
					"openId":parm.head.openId,
					"comparyCode" : comparyCode,
					"cxOrder" : cxOrder,
					"orderChannel":parm.head.source//渠道
				};
				var url = base.url + "vi/saveCxInfoOne.do";
				var data = {
					"cxInfoDTO" : cxInfoDTO
				};
				$.toAjaxs(url, data, function(respData){
					var paramList = eval("(" + respData + ")");
					if (paramList.status.statusCode == "000000") {
						$("#indexpart_scroll").css("transform","translate3d(0px, 0px, 0px)");
						// 唯一流水号
						parm.body.cxSessionId = paramList.sessionId;
						if(citynum=="3110000"){//北京地区
							$("#fuelTypeTable,#cardTable").show();
							if(chooseicon==1){
								$("#lailiTable").show();
							}else{
								$("#lailiTable").hide();
							}
						}else{
							$("#fuelTypeTable,#cardTable,#lailiTable").hide();
						}
						if(citynum=="3440300"){//深圳地区
							$("#plateEmail").show();
						}else{
							$("#plateEmail").hide();
						}
						setTimeout(function() {
							$(".firstPart").hide();//车辆投保地区隐藏
							$(".lastPart").show();//车辆详细信息显示
						}, 200);
					}else{
						modelAlert(paramList.status.statusMessage);
					}
				});
				  
				
		  
		}

		pageflag = 1;
		$.replacePlaceholder($("#brand_model_input"), "请输入品牌型号");
		$.replacePlaceholder($("#vehicle_identification_input"),"请输入车辆识别代码");
		$.replacePlaceholder($("#engine_number_input"), "请输入发动机号");
		$.replacePlaceholder($("#vehicleInvoiceNo"), "请输入新车购置发票号");
		$.replacePlaceholder($("#seat"), "请输入车辆座位数");

		// 实时检查车辆详细信息
		blurCheackCarinfo();
	});

	// 点击跳转到品牌型号选择页面
	$("#carTypeSelect").unbind("tap").bind("tap", function() {
		//校验品牌型号查询的所有字段
		carinfoCheack();
		if (carinfoCheakFlag == true){
			$("#pageTitle").html("品牌型号选择");
			$(".carMes").hide();
			$("#maindiv").hide();
			$(".vehicleInfo").show();
	        $("#searchcustomer").empty();
	        $("#searchtext").val("请输入关键字点击查询").css("color", "#cccccc");
			mui('#wrapper').scroll().scrollTo(0,0,0);//100毫秒滚动到顶
	        pageflag = 2;
	    }
	});

	// 车辆详细信息确认按钮
	$("#confirm2").unbind("tap").bind("tap",function() {
		 $("#vehicle_identification_input").val($("#vehicle_identification_input").val().toUpperCase());//车辆识别代码小写转大
		 $("#owner_idNo").val($("#owner_idNo").val().toUpperCase());//身份证小写转大写
			// 解绑实时检查车辆详细信息
			unBindblurCheackCarinfo();
			// 校验车辆详细信息
			cheackCarinfo();
			// 若校验车辆详细信息通过则往下执行
			if (cheakCarinfoFlag == false) {
				return;
			}

          if (vehicleModelData == null) {
                    modelAlert("请先选择品牌型号！");
                    return false;
			}
           if(sessionStorage.getItem("checkFlag")=="0"){
        	   if($("#checkNo").val()=="请输入验证码"){
        		   if($("#yanzhengmaImg").css("display")!="none"){
					    modelAlert("请输入验证码！");
					    return false;
	               }
        	   }else{
        		   sessionStorage.setItem("checkCode", $("#checkNo").val());
        	   }
           }
           cxCarMessage.sessionid=parm.body.cxSessionId;
           cxCarMessage.citycode = citynum;// 车辆行驶城市
			// 车辆基本信息
			var infochoose = $("#chooseIcons").attr("src").substring(
					$("#chooseIcons").attr("src").lastIndexOf("/") + 1);
			if (infochoose == "guanbi.png") {
				specialCarFlag = 0;
				cxCarMessage.transferDate ='2000-01-01'
			} else {
				specialCarFlag = 1;
				cxCarMessage.transferDate = $("#specialCarDate").val();// 过户日期
			}
			cxCarMessage.vehicleid = vehicleModelData.rbcode;// 车辆Id
			cxCarMessage.transferFlag = specialCarFlag;// 是否过户车
			cxCarMessage.engineNo = $("#engine_number_input").val();// 发动机号
			cxCarMessage.rackNo = $("#vehicle_identification_input").val();// 车辆识别代码
			cxCarMessage.vehicleBrand = vehicleModelData.brandName;// 品牌型号
			cxCarMessage.registerDate = $("#vehicle_registration_date").val();// 车辆注册日期
			cxCarMessage.seats = $("#seat").val()+".0";//车辆
			cxCarMessage.vehicleValue = vehicleModelData.purchasePrice;//购车价
			cxOrder.ownerName = $("#owner_name").val();// 车主姓名
			cxOrder.ownerMobile = $("#owner_mobile").val();// 手机号码;
			cxOrder.ownerIdno = $("#owner_idNo").val();// 车主身份证号
			cxOrder.ownerEmail = "";// 车主邮箱
			var ecdemicFlag = "";// 外地车标识
			var infocarchoose = $("#choosecar").attr("src").substring(
					$("#choosecar").attr("src").lastIndexOf("/") + 1);
			if (infocarchoose == "guanbi.png") {
			    ecdemicFlag = 0;
			} else {
				ecdemicFlag = 1;
			}
			cxCarMessage.ecdemicVehicleFlag = ecdemicFlag;
			var drivearea = "0";// 出单地省内【0】 中国境内【3】 这里约定的是出单地点 默认为0
			cxCarMessage.drivearea = drivearea;
			cxCarMessage.vehicleinvoicedate = $("#vehicle_registration_date").val();// 车辆购车日期
			cxCarMessage.runMileRate = "3000";
			cxCarMessage.isHaveGps = 0;
			cxCarMessage.familyCarCount = "0";
			cxCarMessage.currentvalue = vehicleModelData.actualValue;// 实际价值
			cxCarMessage.enginecapacity = vehicleModelData.exhaustCapacity;// 排量
			cxCarMessage.producingarea = vehicleModelData.importFlag;// 车型产地
			cxCarMessage.carName = vehicleModelData.carName;
			cxCarMessage.jingyouVehicleCode = vehicleModelData.vehicleJingyouDto.vehicleCode;
			cxCarMessage.jingyouVehicleName = vehicleModelData.vehicleJingyouDto.vehicleName;
			cxCarMessage.jingyouPrice = vehicleModelData.vehicleJingyouDto.price;
			cxCarMessage.jingyouFamilyname = vehicleModelData.vehicleJingyouDto.familyName;
			cxCarMessage.noticeType = vehicleModelData.noticeType;
			cxCarMessage.vehiclehycode = vehicleModelData.hyModelCode;
			cxCarMessage.wholeWeight = vehicleModelData.vehicleWeight;
			
			cxOffer.sessionid=parm.body.cxSessionId;
			cxOffer.businessBegindate=$.getDateStr("0","",1);//起保日期 T+1天
			if(citynum=="3110000"){//北京地区
				cxCarMessage.fuelType=$("#fuelType").attr("name");
				cxCarMessage.fuelTypeName=$.trim($("#fuelType").val());
				cxOrder.certiStartdate=$("#certiStartDate").val();
				cxOrder.certiEnddate=$("#certiEndDate").val();
				cxOrder.nation=$("#nation").val();
				cxOrder.issuerAuthority=$("#issuer").val();
				if(chooseicon==1){
					cxCarMessage.certificateType=$("#certificateType").attr("name");
					cxCarMessage.certificateTypeName=$.trim($("#certificateType").val());
					cxCarMessage.certificateNo=$.trim($("#certificateNo").val())
					cxCarMessage.certificateDate=$.trim($("#certificateDate").val())
				}
			}
			if(citynum=="3440300"){//深圳地区
			    cxOrder.ownerEmail = $("#owner_email").val();// 车主邮箱
			}
			var carinfoMes={
				"vehicleModelData":vehicleModelData,
			}
			carinfoMes=UrlEncode(JSON.stringify(carinfoMes));
			var cxInfoDTO = {
				"productId" : "", // 产品编号
				"sessionId" : parm.body.cxSessionId, // 唯一流水号
				"agentCode" : parm.head.userName,
				"openId":parm.head.openId,
				"comparyCode" : comparyCode,
				"cxCarMessage" : cxCarMessage,
				"cxOffer":cxOffer,
				"cxOrder" : cxOrder,
				"tradeNO":sessionStorage.getItem("tradeNo"),
				"checkNo":sessionStorage.getItem("checkNo"),
				"checkCode":sessionStorage.getItem("checkCode"),
				"vehicleModelData":carinfoMes
			};
			var url = base.url + "vi/saveCxInfoTwo.do";
			var data = {
				"cxInfoDTO" : cxInfoDTO
			};
			sessionStorage.setItem("cxInfoDTO",JSON.stringify(cxInfoDTO))
		    $.toAjaxs(url, data, $.submitCallBack);
		});

	// 提交保存回调
	$.submitCallBack = function(param) {
		if (param != "") {
			var paramList = eval("(" + param + ")");
			if (paramList.status.statusCode == "000000") {
				// 唯一流水号

				parm.body.cxSessionId = paramList.sessionId;
				parm.body.businessBegindate = $("#startDate").val();
				parm.body.forceBeginDate = $("#startDate").val();
				//费改标识
				parm.head.fgFlag=fgFlag;
				inforCar.issueChannel = $("#issueChannel").attr("channelcode");
				inforCar.shengCode = $("#car_sheng").attr("name");
				inforCar.shengName = $("#car_sheng").val();
				inforCar.cityName = $("#car_shi").val();
				inforCar.vehicleModelData = vehicleModelData;
				parm.body.inforCar = inforCar;
				parm.body.cityCode = citynum;
				parm.body.pagesflag = "carinfo"; //标记是回到车辆详情
				parm.body.comparyCode=comparyCode;
				parm.body.producingarea=cxCarMessage.producingarea;//车型产地  进口车、合资车、国产车
				var jsonStr = JSON.stringify(parm);
				jsonStr = UrlEncode(jsonStr);
				var nextPageUrl = base.url1+"html/carinsure/insuranceCoverage.html?jsonStr="+ jsonStr;
				window.location.href = nextPageUrl;
			} else {
				modelAlert("提交失败！" + paramList.status.statusMessage);
			}
		} else {
			modelAlert("提交异常！");
		}
	};

	
	

});
// 勾选是否
function selectCarFlag() {
	// 是否过户车
	$("#info_choose").unbind("tap").bind("tap",function(){
		var picName = $("#chooseIcons").attr("src").substring($("#chooseIcons").attr("src").lastIndexOf("/") + 1);
		if (picName == "guanbi.png") {
			document.getElementById("chooseIcons").src = base.ppStopImagePath + "dakai.png";
			$("#info_choose div").css("color","red");
			$("#specialCarDate_select").show("fast");
		} else {
			document.getElementById("chooseIcons").src = base.ppStopImagePath + "guanbi.png";
			$("#info_choose div").css("color","#585858");
			$("#specialCarDate_select").hide();
		}
	});
	// 是否外地车
	$("#info_car_choose").unbind("tap").bind("tap",function(){
		var picName = $("#choosecar").attr("src").substring($("#choosecar").attr("src").lastIndexOf("/") + 1);
		if (picName == "guanbi.png") {
			document.getElementById("choosecar").src = base.ppStopImagePath + "dakai.png";
			$("#info_car_choose div").css("color","#f36f39");
		} else {
			document.getElementById("choosecar").src = base.ppStopImagePath + "guanbi.png";
			$("#info_car_choose div").css("color","#585858");
		}
	});
}

// 品牌类型子页面消失时执行的回调
function loadCarContent(param) {
	if (param != "goBack") {
		// 显示摘要
		var itemValue = param.brandName;
		vehicleModelData = param; // 车型数据 保存车主 车辆信息的时候 需要用到
		$("#brand_model_input").val(itemValue).css("width", "85%"); // 品牌型号
		$("#seat").val(parseInt(param.seatCount).toFixed(0)).css("color","#585858"); // 座位数
		/*验证码图片*/
		if(sessionStorage.getItem("checkFlag")=="0"){
			$("#yanzhengmaImg").show();
			var str="/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcU FhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgo KCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAYAFQDASIA AhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQA AAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3 ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWm p6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEA AwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSEx BhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElK U1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3 uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD16ZdN 0nwxpV5daNpjW4sYbmSYpCHl2oTKrGQKi8bCHL4JLZ2hcnodSsdDi083enaPol3CkrxSuI0+QruQ gAKdzCUBWUlcfNzldpytCtUtY/CwDSiJrSJw8rNLlmyxUFicDLYA6KCAAAABz/x68Uah4Z8P32r2 cNs1xpuz7OkkzyRSrJJCpMsQ2gMDuA5bA5yN7LQB0+n6fo4hsjHpej3Ni1rHdi6VY5TKG3FgCE2l QuHVlZiwUjAABMvijS9Etns4V0rTl3SB5CsKqdo4wcDODk8+1cd8N/Fmq6p4p8TaNq8Fst3ps1qR dQyOVLTRb44zuyx2lXQuNu4P91cYrqfHFrE1xHafOkJtRF+7kZGC5YcMCGBx3ByPWgCxrfh7w5eW aWy6TpyxtAz+cbKF2jVkKbl8xGBbaztgg5CEEEE1S8Q6ToSeILUDTrWJYF2sYogqjeyklkxtfCqM ZBIycHkg+d/s8v8AYpPGFnEzbT4lu0iaV2dg67NhZjljnlSSckMcmu08ZaVcG8ktrbUb2w2sHSaB Y2YpjAT96jjA6Zxn5evUUAb1zpmiXV3plta6Xp4d3Erv9jEYZAM8AryDz+VVvEWn6PBdwfZNDsLm VJB+5tRHvk29YyrbUBJOAWYDjkgVwXwI1zXde0PQ9c17WNTllu4ZLXY0NosRVZmVXjCR7gBtCnec 5DnGNpqf9qe3mn+H+trAkszfZ4JNqrkqqzqWPA6AKWJPQZ7UAdvDZaU2uSxWui6RMJnVAjqm1VUj c6kIQPk3EL3YAEqDkaGt6XptmYPsfh3TZyGEkoaGJF8kHEhB2k7lBDAY5IAyMkjxTwF4hv8AxF8Q Licw2/8AxKzfW8MsIO1YGls3t5WJJH7wBirHCsASBxmvXdTne5vpGe1h3uEQq0ThlOAwU+5+7nuF 7CgDzf4haaNK1Kyg+y2VrI1sZZEtLZYELNNKclVJBbGMtn5jk4XO0FafxiaN/EVg0GPKNhGUwMDb vfHFFAHY6bd6XLpXhyRdR09Zra3gE4M+XQKq8EDIUA5yTjHHNZfjCz0HxZHqGl6pe2t5plxJGZ2F x5aDDBlyytjC7cdVJJxzRRQBNaaL4Vtdd1rV7PWNNtdQ1GaJ5JlulO5Y1IQBd+FxuxwB93PerniS 80nVbi1aTULd4ZIdl0ltdfNEmfmO+Ntw4Y/MMEYyDRRQBjeEdC8H6RPe6loWtR2i6lumYXWozu0h kKSea6SzZWXIUEsA3y89TWtf31vqV/JNZSwRtDglkuUcE7A+V2Mf4t65O0lgeMEMxRQBgfCTRtO8 MeB7TSb3xRYeZbxzw20oWCKaENKziTBklQtuZmUkD5SoZQQwrR1h9I8QXl5BqF9FdWV48kNzbM8a iK34jOHiblWXL7i24b+duAqlFAEekeHPB/hm9a78OT2Eks7QxTwx3PnM8ESBI1Cs7Z2oCMgZOcnp mtS8u7Se6lnF7paNulMZh1DfwHyrAkDDHO5gPlXJ54DkooA86+MFppmqeIbCS1u5ZY4rFIv9D1GX YpDyHGUcAkZ784x7UUUUAf/Z"
			$("#checkImg").attr("src","data:image/png;base64,"+sessionStorage.getItem("checkCode"));
			$("#checkNo").val("请输入验证码").css("#888");
		}else{
			$("#yanzhengmaImg").hide();
			$("#checkNo").val("请输入验证码").css("#888");
		}
	}

};


// 实时检查车主信息
function blurCheackOwner() {
	// 车牌号码
	$("#plate_number_input").change(function() {
		if ($("#plate_number_input").val().length == 7||$("#plate_number_input").val().length == 8) {
			$("#plate_number_input").val($("#plate_number_input").val().toUpperCase());
		}
		if ($.isNull($("#plate_number_input").val())
				|| $("#plate_number_input").val() == "请输入车牌号码") {
			return false;
		}else if(!checkCarNo($.trim( $("#plate_number_input").val()))){
			modelAlert("车牌号码格式不正确！");
			return false;
		}else if ($("#plate_number_input").val().length != 7&&$("#plate_number_input").val().length != 8) {
			modelAlert("车牌号码长度不正确！");
			return false;
		}
		$("#brand_model_input").val("请选择品牌型号");
	});
	
}
// 解绑实时检查车主信息
function unBindblurCheackOwner() {
	$('#plate_number_input').unbind('change');// 车牌号码取消事件
}

// 提交时检查车主信息
function cheackOwner() {
	// 车辆基本信息
	var car_shengshi = $("#car_sheng").val(); // 车辆行驶省份
	var car_city = $("#car_shi").val();// 车辆行驶城市
	var plate_number_input = "";// 车牌号码
	// var chooseicon = 0;//是否新车标志 1：新车，0：非新车
	var pName = $("#chooseicon").attr("src").substring($("#chooseicon").attr("src").lastIndexOf("/") + 1);
	if (pName == "gouxuankuang.png") {
		chooseicon = 0;
		plate_number_input = $("#plate_number_input").val();
	} else {
		chooseicon = 1;
	}

	// 判断非空
	if ($.isStringNull(car_shengshi) || car_shengshi == "请选择省份") {
		cheakOwnerFlag = false;
		modelAlert("请选择省份！");
		return false;
	}
	if ($.isStringNull(car_city) || car_city == "请选择城市") {
		cheakOwnerFlag = false;
		modelAlert("请选择城市！");
		return false;
	}
	if ($.isNull(plate_number_input) && chooseicon == 0) {
		cheakOwnerFlag = false;
		modelAlert("请输入车牌号码，或者选择新车未上牌！");
		return false;
	}
	if (plate_number_input == "请输入车牌号码" && chooseicon == 0) {
		cheakOwnerFlag = false;
		modelAlert("请输入车牌号码，或者选择新车未上牌！");
		return false;
	}
	if (!($.isNull(plate_number_input)) && plate_number_input != "请输入车牌号码"&& chooseicon == 0) {
		if(!checkCarNo($.trim( $("#plate_number_input").val()))){
			cheakOwnerFlag = false;
			modelAlert("车牌号码格式不正确！");
			return false;
		}else if (plate_number_input.length != 7&&plate_number_input.length != 8) {
			cheakOwnerFlag = false;
			modelAlert("车牌号码长度不正确！");
			return false;
		}
	}
	cheakOwnerFlag = true;
}

// 实时检查车辆详细信息
function blurCheackCarinfo() {
	// 车辆识别代码验证
	$("#vehicle_identification_input").change(function() {
        $("#vehicle_identification_input").val($("#vehicle_identification_input").val().toUpperCase());
		if ($("#vehicle_identification_input").val().length == 17) {
			$("#vehicle_identification_input").val($("#vehicle_identification_input").val().toUpperCase());
		}
		if ($.isNull($("#vehicle_identification_input").val())|| $("#vehicle_identification_input").val() == "请输入车辆识别代码") {
			return false;
		} else if ($("#vehicle_identification_input").val().length != 17) {
			modelAlert("车辆识别代码长度不正确，须是17位！");
			return false;
		} else if (tit.regExp.isVehicleIdentification($("#vehicle_identification_input").val()) == false) {
			modelAlert("车辆识别代码必须由17位的数字或大写字母组成！");
			return false;
		}
		$("#brand_model_input").val("请选择品牌型号");
	});

	// 发动机号验证
	$("#engine_number_input").change(function() {
		if ($("#engine_number_input").val().length == 19) {
			$("#engine_number_input").val($("#engine_number_input").val().toUpperCase());
		}
		if ($.isNull($("#engine_number_input").val())|| $("#engine_number_input").val() == "请输入发动机号") {
			return false;
		} else if ($("#engine_number_input").val().length > 19) {
			modelAlert("发动机号长度不正确！");
			return false;
		} else if(!checkChinese($.trim( $("#engine_number_input").val()))){
			modelAlert("发动机号是由数字和字母组成！");
			return false;
		}
		$("#brand_model_input").val("请选择品牌型号");
	});
	//车主姓名
	$("#owner_name").change(function() {
		if ($.isNull($("#owner_name").val())|| $("#owner_name").val() == "请输入车主姓名") {
			return false;
		} else if (tit.regExp.isChinese($("#owner_name").val()) == false) {
			modelAlert("车主姓名必须为汉字！");
			return false;
		}
	});
	//车主身份证号
	$("#owner_idNo").change(function() {
		if ($("#owner_idNo").val().length == 18) {
			$("#owner_idNo").val($("#owner_idNo").val().toUpperCase());
		}
		if ($.isNull($("#owner_idNo").val())|| $("#owner_idNo").val() == "请输入车主身份证号") {
			return false;
		} else if ($.checkIdCard($("#owner_idNo").val().toLocaleUpperCase()) != 0) {
			modelAlert("请输入合法的身份证号！");
			return false;
		}
	});

	// 车主手机号码校验
	$("#owner_mobile").change(function() {
		if ($.isNull($("#owner_mobile").val())|| $("#owner_mobile").val() == "请输入车主手机号码") {
			return false;
		} else if (tit.regExp.isMobile($("#owner_mobile").val()) == false) {
			modelAlert("请输入正确的手机号码！");
			return false;
		}
	});

}
// 解绑实时检查车辆详细信息
function unBindblurCheackCarinfo() {
	$('#vehicle_identification_input').unbind('change');// 车辆识别代码取消事件
	$('#engine_number_input').unbind('change');// 发动机号取消事件
	$('#owner_name').unbind('change');// 车主姓名取消事件
	$('#owner_idNo').unbind('change');// 车主身份证号取消事件
	$('#owner_mobile').unbind('change');// 车主手机号取消事件
}

// 提交时检查车辆详细信息
function cheackCarinfo() {
	var currentTime = new Date().getTime();// 当前时间
	// 获得上一年在这一天的日期
	var lastYearDate = getLastYeardate();
	var car_shengshi = $("#car_sheng").val();// 车辆行驶省份
	var car_city = $("#car_shi").val();// 车辆行驶城市
	var owner_name = $("#owner_name").val();// 车主姓名
	// 车辆详细信息
	var brand_model_input = $("#brand_model_input").val();// 品牌型号
	var vehicle_identification_input = $("#vehicle_identification_input").val();// 车辆识别代码
	var engine_number_input = $("#engine_number_input").val();// 发动机号
	var vehicle_registration_date = $("#vehicle_registration_date").val();// 车辆注册日期
	var startDate = $("#startDate").val();// 起保日期
	var purchaseDate = $("#vehicle_registration_date").val();//购车日期

	// var specialCarFlag = 0;//是否过户车 是：1；否：0
	var pName = $("#chooseIcons").attr("src").substring($("#chooseIcons").attr("src").lastIndexOf("/") + 1);
	if (pName == "guanbi.png") {
		specialCarFlag = 0;
	} else {
		specialCarFlag = 1;
	};
	var specialCarDate = $("#specialCarDate").val();// 过户日期
	var vehicleInvoiceNo = $("#vehicleInvoiceNo").val();// 新车购置发票号
	var vehicleInvoiceDate = $("#vehicleInvoiceDate").val();// 发票开具日期
	
	var owner_name = $("#owner_name").val();// 车主姓名
	var owner_idNo = $("#owner_idNo").val();// 车主身份证号
	var owner_mobile = $("#owner_mobile").val();// 手机号码
	
	var fuelType=$("#fuelType").val();//能源种类
	var certificateTypeName=$.trim($("#certificateType").val());//凭证种类
	var certificateNo=$.trim($("#certificateNo").val())//凭证编号
	var certificateDate=$.trim($("#certificateDate").val())//凭证日期
	var certiStartDate=$("#certiStartDate").val();//身份证起期
	var certiEndDate=$("#certiEndDate").val();//身份证止期
	var nation=$("#nation").val();//名族
	var issuer=$("#issuer").val();//签发机构
	var owner_email=$("#owner_email").val();//邮箱

	// 判断非空
	if ($.isNull(car_shengshi) ||  car_shengshi == "请选择省份") {
		cheakCarinfoFlag = false;
		modelAlert("请选择省份！");
		return false;
	};
	if ($.isNull(car_city) ||  car_city == "请选择城市") {
		cheakCarinfoFlag = false;
		modelAlert("请选择城市！");
		return false;
	};
	if ($.isNull(vehicle_identification_input)|| vehicle_identification_input == "请输入车辆识别代码") {
		cheakCarinfoFlag = false;
		modelAlert("请输入车辆识别代码/VIN！");
		return false;
	} else if (vehicle_identification_input.length != 17) {
		cheakCarinfoFlag = false;
		modelAlert("车辆识别代码长度不正确，须是17位！");
		return false;
	};
	if ($.isNull(engine_number_input) || engine_number_input == "请输入发动机号") {
		cheakCarinfoFlag = false;
		modelAlert("请输入发动机号！");
		return false;
	} else if (engine_number_input.length > 19) {
		cheakCarinfoFlag = false;
		modelAlert("发动机号长度不正确！");
		return false;
	}else if(!checkChinese($.trim(engine_number_input))){
		modelAlert("发动机号不能输入汉字！");
		return false;
	}
	;
	if ($.isNull(vehicle_registration_date)|| vehicle_registration_date == "请选择注册日期") {
		cheakCarinfoFlag = false;
		modelAlert("请选择注册日期！");
		return false;
	} else {
		if (new Date(vehicle_registration_date).getTime() > currentTime) {
			cheakCarinfoFlag = false;
			modelAlert("车辆注册日期不能大于当前日期！");
			return false;
		}
		// 如果是新车 车辆注册日期不能小于当前日期一年
		else if (chooseicon == 1&& (new Date(vehicle_registration_date).getTime() < new Date(lastYearDate).getTime())) {
			cheakCarinfoFlag = false;
			modelAlert("新车，车辆注册日期不能小于当前日期一年！");
			return false; 
		}
	}
	if (specialCarFlag == 1) {
		if ($.isNull(specialCarDate) || specialCarDate == "请选择过户日期") {
			cheakCarinfoFlag = false;
			modelAlert("请选择过户日期！");
			return false;
		} else {
			if (new Date(specialCarDate).getTime() > currentTime) {
				cheakCarinfoFlag = false;
				modelAlert("过户日期不能大于当前日期！");
				return false;
			} else if (new Date(specialCarDate).getTime() < new Date(
					vehicle_registration_date).getTime()) {
				cheakCarinfoFlag = false;
				modelAlert("过户日期不能小于车辆注册日期！");
				return false;
			}
		}
	}
	
	if ($.isNull(brand_model_input) || brand_model_input == "请选择品牌型号") {
		cheakCarinfoFlag = false;
		modelAlert("请选择品牌型号！");
		return false;
	}
	if ($.trim($("#seat").val())=="") {
		cheakCarinfoFlag = false;
		modelAlert("请输入车辆座位数！");
		return false;
	}else{
		if(!/^[1-9]{1}$/.test($.trim($("#seat").val()))){
			cheakCarinfoFlag = false;
			modelAlert("车辆座位数为数字1~9！");
			return false;
		}
	}
	
	if ($.isNull(owner_name) || owner_name == "请输入车主姓名") {
		modelAlert("请输入车主姓名！");
		cheakCarinfoFlag = false;
		return false;
	}
	if (tit.regExp.isChinese(owner_name) == false) {
		modelAlert("车主姓名必须为汉字！");
		cheakCarinfoFlag = false;
		return false;
	}
	if ($.isNull(owner_idNo) || owner_idNo == "请输入车主身份证号") {
		modelAlert("请输入车主身份证号！");
		cheakCarinfoFlag = false;
		return false;
	} else if ($.checkIdCard(owner_idNo.toLocaleUpperCase()) != 0) {
		modelAlert("请输入合法的身份证号！");
		cheakCarinfoFlag = false;
		return false;
	}
	if ($.isNull(owner_mobile) || owner_mobile == "请输入车主手机号码") {
		modelAlert("请输入车主手机号码！");
		cheakCarinfoFlag = false;
		return false;
	}
	// 车主手机号码验证
	if (tit.regExp.isMobile(owner_mobile) == false) {
		modelAlert("请输入合法的手机号码！");
		cheakCarinfoFlag = false;
		return false;
	}

	
	
	
	if(citynum=="3110000"){//北京地区
		if ($.isNull(fuelType) || fuelType == "请选择能源种类") {
			modelAlert("请选择能源种类！");
			cheakCarinfoFlag = false;
			return false;
		}
		if ($.isNull(certiStartDate) || certiStartDate == "请选择身份证有效起期") {
			modelAlert("请选择身份证有效起期！");
			cheakCarinfoFlag = false;
			return false;
		}
		if ($.isNull(certiEndDate) || certiEndDate == "请选择身份证有效止期") {
			modelAlert("请选择身份证有效止期！");
			cheakCarinfoFlag = false;
			return false;
		}
		if ($.isNull(nation) || nation == "请选择民族") {
			modelAlert("请选择民族！");
			cheakCarinfoFlag = false;
			return false;
		}
		if ($.isNull(issuer) || issuer == "请输入签发机构") {
			modelAlert("请输入签发机构！");
			cheakCarinfoFlag = false;
			return false;
		}
		if(chooseicon==1){
			if ($.isNull(certificateTypeName) || certificateTypeName == "请选择凭证种类") {
				modelAlert("请选择凭证种类！");
				cheakCarinfoFlag = false;
				return false;
			}
			if ($.isNull(certificateNo) || certificateNo == "请输入凭证编号") {
				modelAlert("请输入凭证编号！");
				cheakCarinfoFlag = false;
				return false;
			}
			if ($.isNull(certiEndDate) || certiEndDate == "请选择凭证所载日期") {
				modelAlert("请选择凭证所载日期！");
				cheakCarinfoFlag = false;
				return false;
			}
		}
	}
	if(citynum=="3440300"){//深圳地区
		if ($.isNull(owner_email) || owner_email == "请输入车主邮箱") {
			modelAlert("请输入车主邮箱！");
			cheakCarinfoFlag = false;
			return false;
		}
		// 电子邮箱验证
		if (tit.regExp.isEmail(owner_email) == false) {
			modelAlert("请输入合法的电子邮箱！");
			cheakCarinfoFlag = false;
			return false;
		}
	}
	
	cheakCarinfoFlag = true;
}

//品牌型号查询前校验
function carinfoCheack() {
	var currentTime = new Date().getTime();// 当前时间
	// 获得上一年在这一天的日期
	var lastYearDate = getLastYeardate();
	var car_shengshi = $("#car_sheng").val();// 车辆行驶省份
	var car_city = $("#car_shi").val();// 车辆行驶城市
	var owner_name = $("#owner_name").val();// 车主姓名
	// 车辆详细信息
	var vehicle_identification_input = $("#vehicle_identification_input").val();// 车辆识别代码
	var engine_number_input = $("#engine_number_input").val();// 发动机号
	var vehicle_registration_date = $("#vehicle_registration_date").val();// 车辆注册日期
	//var startDate = $("#startDate").val();// 起保日期
	var purchaseDate = $("#purchaseDate").val();  //购车日期

	// var specialCarFlag = 0;//是否过户车 是：1；否：0
	var pName = $("#chooseIcons").attr("src").substring($("#chooseIcons").attr("src").lastIndexOf("/") + 1);
	if (pName == "guanbi.png") {
		specialCarFlag = 0;
	} else {
		specialCarFlag = 1;
	};
	var specialCarDate = $("#specialCarDate").val();// 过户日期

	// 判断非空
	if ($.isNull(car_shengshi) ||  car_shengshi == "请选择省份") {
		carinfoCheakFlag = false;
		modelAlert("请选择省份！");
		return false;
	}
	if ($.isNull(car_city) ||  car_city == "请选择城市") {
		carinfoCheakFlag = false;
		modelAlert("请选择城市！");
		return false;
	}
	if ($.isNull(vehicle_identification_input)|| vehicle_identification_input == "请输入车辆识别代码") {
		carinfoCheakFlag = false;
		modelAlert("请输入车辆识别代码！");
		return false;
	} else if (vehicle_identification_input.length != 17) {
		carinfoCheakFlag = false;
		modelAlert("车辆识别代码长度不正确，须是17位！");
		return false;
	}
	if ($.isNull(engine_number_input) || engine_number_input == "请输入发动机号") {
		carinfoCheakFlag = false;
		modelAlert("请输入发动机号！");
		return false;
	} else if (engine_number_input.length > 19) {
		carinfoCheakFlag = false;
		modelAlert("发动机号长度不正确！");
		return false;
	}else if(!checkChinese($.trim(engine_number_input))){
		modelAlert("发动机号不能输入汉字！");
		return false;
	}
	if ($.isNull(vehicle_registration_date)
			|| vehicle_registration_date == "请选择注册日期") {
		carinfoCheakFlag = false;
		modelAlert("请选择车辆注册日期！");
		return false;
	} else {
		if (new Date(vehicle_registration_date).getTime() > currentTime) {
			carinfoCheakFlag = false;
			modelAlert("车辆注册日期不能大于当前日期！");
			return false;
		}
		// 如果是新车 车辆注册日期不能小于当前日期一年
		else if (chooseicon == 1&& (new Date(vehicle_registration_date).getTime() < new Date(lastYearDate).getTime())) {
			carinfoCheakFlag = false;
			modelAlert("新车，车辆注册日期不能小于当前日期一年！");
			return false; 
		}
	}
	if (specialCarFlag == 1) {
		if ($.isNull(specialCarDate) || specialCarDate == "请选择过户日期") {
			carinfoCheakFlag = false;
			modelAlert("请选择过户日期！");
			return false;
		} else {
			if (new Date(specialCarDate).getTime() > currentTime) {
				carinfoCheakFlag = false;
				modelAlert("过户日期不能大于当前日期！");
				return false;
			} else if (new Date(specialCarDate).getTime() < new Date(
					vehicle_registration_date).getTime()) {
				carinfoCheakFlag = false;
				modelAlert("过户日期不能小于车辆注册日期！");
				return false;
			}
		}
	}
	carinfoCheakFlag = true;
}


//省份选择模块初始化  通过映射表查询
$.loadDisAddress = function(t, y) {
	if(t==2){//查询省
		var url = base.url + "gzhcx/queryProvinceInfo.do";
		var reqData = {
				"head":{
					"userCode":"",
					"transTime":$.getTimeStr(),
					"channel":"1",
					"issueChannel":$("#issueChannel").attr("channelCode")
				},"body":{}
			
		};
		$.reqAjaxs(url, reqData, $.loadData);
	}else if(t==3){//查询市
		var url = base.url + "gzhcx/queryCityInfo.do";
		var reqData = {
				"head":{
					"userCode":"",
					"transTime":$.getTimeStr(),
					"channel":"1",
				    "cxProvinceId":y,
				    "issueChannel":$("#issueChannel").attr("channelCode")
				},"body":{}
			
		};
		$.reqAjaxs(url, reqData, $.loadData);
	}
}

/**
 * 数据库加载数据
 */
$.loadData = function(param) {
	param = eval("(" + param + ")");

	if (param.status.statusCode == "000000") {
		if (param != null || param != "") {
			var customerlist = new Array();
			function ProcessSheng(text, value) {
				this.text = text;
				this.value = value;
			}
			if (param.cityinfo.rows != null) {
				for ( var j = 0; j < param.cityinfo.rows.length; j++) {
					var customerinfo = new ProcessSheng(param.cityinfo.rows[j].contName, j);
					customerlist.push(customerinfo);
				}
			}
			if (rankFlag == 0) {
				shengList = param.cityinfo.rows;
				// 省份选择
				(function($, doc) {
					// 一级联动
					var selectPicker = new $.PopPicker();
					selectPicker.setData(customerlist);
					var selectResult = doc.getElementById("car_sheng");
					selectPicker.show(function(items) {
						var num = items[0].value;
						selectResult.value = items[0].text;
						selectResult.style.color = "#585858";
						selectResult.name = shengList[num].id;
						doc.getElementById("car_shi").value = "请选择城市";
						doc.getElementById("car_shi").style.color = "#888";
						doc.getElementById("car_shi").name = "";
						doc.getElementById("plate_number_input").value = "请输入车牌号码";
						doc.getElementById("plate_number_input").style.color = "#888";
						doc.getElementById("plate_number_input").name = "";
						citynum = "";
						selectPicker.dispose();// 释放组件资源
					});
				})(mui, document);
			} else if (rankFlag == 1) {

				shiList = param.cityinfo.rows;
				// 城市选择
				(function($, doc) {
					// 一级联动
					var selectPicker = new $.PopPicker();
					selectPicker.setData(customerlist);
					var selectResult = doc.getElementById("car_shi");
					selectPicker.show(function(items) {
						var num = items[0].value;
						selectResult.value = items[0].text;
						selectResult.style.color = "#585858";
						selectResult.name = shiList[num].id;
						if (chooseicon == 0) {
							doc.getElementById("plate_number_input").value = shiList[num].cityPlate;
							doc.getElementById("plate_number_input").style.color = "#585858";
							doc.getElementById("plate_number_input").name = "";
							fgFlag= shiList[num].fgFlag;
						}
						carPlate=shiList[num].cityPlate;
						citynum = shiList[num].id;
						//出单人员是否匹配到省
						parm.body.cdPrivinceFlag=shiList[num].flag;
						selectPicker.dispose();// 释放组件资源
					});
				})(mui, document);
			}
		}
	} else {
		modelAlert(param.status.statusMessage);
	}
};

// 查询省份
function selectSheng() {
	if ($("#issueChannel").attr("channelCode") == null|| $("#issueChannel").attr("channelCode") == "") {
		modelAlert("请先选择渠道！");
	} else {
		rankFlag = 0;
		$.loadDisAddress(2, "");// 省份选择
	}
	
}
// 查询市区
function selectShi() {
	rankFlag = 1;
	if ($("#car_sheng").attr("name") == null|| $("#car_sheng").attr("name") == "") {
		modelAlert("请先选择省份！");
	} else {
		province = $("#car_sheng").attr("name");// province值为上级的代码，province=0时取全部省
		rankFlag = 1;// 省市县级别标志 0-省 1-市 2-县
		$.loadDisAddress(3, province);
	}
}

// 获得上一年在这一天的日期
function getLastYeardate() {
	var currentdate = new Date();
	var strYear = currentdate.getFullYear() - 1;
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

// 获取订单信息模块初始化
$.loadCarInfoed = function() {
	var url = base.url + "cx/getAllInfo.do";
	var data = {
		"sessionId" : cxSessionId,// 车险投保唯一流水号
	};
	$.toAjaxs(url, data, $.addInfo);
};

$.addInfo = function(param){
	param = eval("(" + param + ")");
	if (param != null || param != "") {
		orderPrams = JSON.stringify(param);// 传递参数到详情页面
		if (param.status.statusCode == "000000") {
			if (param.cxInfo != null) {
				if(param.cxInfo.cxOrder != null){
					var channelCode=param.cxInfo.cxOrder.issueChannel;
					var channelName=changeChannel(channelCode);
					$("#issueChannel").attr("channelCode",channelCode).val(channelName);
					var cityName = param.cxInfo.cxOrder.cityName;
					if(!$.isNull(cityName)){ //省份、城市
						var arr = cityName.split(/[-]/);
						$("#car_sheng").val(arr[0]);
						$("#car_shi").val(arr[1]);
					}
					if(!$.isNull(param.cxInfo.cxOrder.cityCode)){
						citynum=param.cxInfo.cxOrder.cityCode;
						$("#car_shi").attr("name",param.cxInfo.cxOrder.cityCode);
						if(citynum=="3110000"){//新车北京地区
                            if(!$.isNull(param.cxInfo.cxCarMessage.fuelType)){//能源种类
								$("#fuelType").attr("name",param.cxInfo.cxCarMessage.fuelType).val(param.cxInfo.cxCarMessage.fuelTypeName)
							}
                            if(!$.isNull(param.cxInfo.cxOrder.certiStartdate)){//身份证起期
								$("#certiStartDate").val(timeFormatDate(param.cxInfo.cxOrder.certiStartdate.time,'yyyy-MM-dd'));
							}
                            if(!$.isNull(param.cxInfo.cxOrder.certiEnddate)){//身份证止期
                            	$("#certiEndDate").val(timeFormatDate(param.cxInfo.cxOrder.certiEnddate.time,'yyyy-MM-dd'));
							}
                            if(!$.isNull(param.cxInfo.cxOrder.nation)){//民族
								$("#nation").val(param.cxInfo.cxOrder.nation)
							}
                            if(!$.isNull(param.cxInfo.cxOrder.issuerAuthority)){//签发机构
								$("#issuer").val(param.cxInfo.cxOrder.issuerAuthority).css("color","#585858");
							}
                            $("#fuelTypeTable,#cardTable").show();
						}
						if(citynum=="3440300"){//深圳地区
							if(!$.isNull(data.returns.cxOrder.ownerEmail)){ //邮箱
							   $("#owner_email").val(param.cxInfo.cxOrder.ownerEmail).css("color","#585858");
							   $("#plateEmail").show();
							}
						}
					}
					if (param.cxInfo.cxOrder.newcarFlag == "1") {
						document.getElementById("chooseicon").src = base.ppStopImagePath+"gouxuankuang1.png";
						$("#plateNum").css("color","#f36f39");
						$("#plate_number_input").val("请输入车牌号码").css("color", "#888"); // 车牌号码
						$('#plate_number_input').attr("disabled", true);// 选中新车未上牌时车牌号码输入框元素设置为disabled
						chooseicon=1;
						if(citynum=="3110000"){//新车北京地区
							if(!$.isNull(param.cxInfo.cxCarMessage.certificateType)){//凭证种类
								$("#certificateType").attr("name",param.cxInfo.cxCarMessage.certificateType).val(param.cxInfo.cxCarMessage.certificateTypeName)
							}
							if(!$.isNull(param.cxInfo.cxCarMessage.certificateNo)){//凭证编号
								$("#certificateNo").val(param.cxInfo.cxCarMessage.certificateNo).css("color","#585858");
							}
							if(!$.isNull(param.cxInfo.cxCarMessage.certificateDate)){//凭证日期
								$("#certificateDate").val(timeFormatDate(param.cxInfo.cxCarMessage.certificateDate.time,'yyyy-MM-dd'));
							}
							$("#lailiTable").show();
						}
					} else {
						document.getElementById("chooseicon").src = base.ppStopImagePath + "gouxuankuang.png";
						$("#plateNum").css("color","#585858");
						$('#plate_number_input').removeAttr("disabled");// 去除input元素的readonly属性
						$("#plate_number_input").val(param.cxInfo.cxOrder.plateno).css("color","#585858");
						chooseicon=0;
					}
					if(!$.isNull(param.cxInfo.cxOrder.ownerName)){ //车主姓名
					    $("#owner_name").val(param.cxInfo.cxOrder.ownerName).css("color","#585858");
					}
					if(!$.isNull(param.cxInfo.cxOrder.ownerIdno)){ //身份证
					    $("#owner_idNo").val(param.cxInfo.cxOrder.ownerIdno).css("color","#585858");
					}
					if(!$.isNull(param.cxInfo.cxOrder.ownerMobile)){ //手机号码
					    $("#owner_mobile").val(param.cxInfo.cxOrder.ownerMobile).css("color","#585858");
					}
				}
				if(param.cxInfo.cxCarMessage != null){
					if(!$.isNull(param.cxInfo.cxCarMessage.rackNo)){//车辆识别代码/VIN
					    $("#vehicle_identification_input").val(param.cxInfo.cxCarMessage.rackNo).css("color","#585858");
					}
					if(!$.isNull(param.cxInfo.cxCarMessage.engineNo)){ //发动机号
					    $("#engine_number_input").val(param.cxInfo.cxCarMessage.engineNo).css("color","#585858");
					}
					var registerDate = "";
					if(!$.isNull(param.cxInfo.cxCarMessage.registerDate)){ //车辆注册日期
						registerDate = timeFormatDate(param.cxInfo.cxCarMessage.registerDate.time,'yyyy-MM-dd');
					    $("#vehicle_registration_date").val(registerDate).css("color","#585858");
					}
					//是否过户
					if(param.cxInfo.cxCarMessage.transferFlag == 1){
						document.getElementById("chooseIcons").src = base.ppStopImagePath + "dakai.png";
						$("#specialCarDate_select").show();
						var transferDate = timeFormatDate(param.cxInfo.cxCarMessage.transferDate.time,'yyyy-MM-dd'); //过户日期
					    $("#specialCarDate").val(transferDate).css("color","#585858");
					}else{
						document.getElementById("chooseIcons").src = base.ppStopImagePath + "guanbi.png";
						$("#specialCarDate_select").hide();
						$("#specialCarDate").val("请选择过户日期").css("color","#585858");
					}
					var vehicleinvoicedate = "";
					if(!$.isNull(parm.body.businessBegindate)){ //起保日期
					    $("#startDate").val(parm.body.businessBegindate).css("color","#585858");
					}
					//是否外地车
					if(param.cxInfo.cxCarMessage.ecdemicVehicleFlag == 1){
						$("#info_car_choose div").css("color","#f36f39");
						document.getElementById("choosecar").src = base.ppStopImagePath + "dakai.png";
					}else{
						$("#info_car_choose div").css("color","#585858");
						document.getElementById("choosecar").src = base.ppStopImagePath + "guanbi.png";
					}
					if(!$.isNull(param.cxInfo.cxCarMessage.vehicleBrand)){ //品牌型号jingyouVehicleName
					    $("#brand_model_input").val(param.cxInfo.cxCarMessage.vehicleBrand).css("color","#585858");
					}
					if(!$.isNull(param.cxInfo.cxCarMessage.seats)){ //座位数
					    $("#seat").val(parseInt(param.cxInfo.cxCarMessage.seats).toFixed(0)).css("color","#585858");
					}
					if(parm.body.pagesflag == "carinfo" ){
						$(".firstPart").hide();
						$(".lastPart").show("fast");//车辆详细信息显示
						$(".backload").hide();//背景图隐藏
						pageflag = 1;
					}else{
						$(".backload").hide();//背景图隐藏
						pageflag = 0;
					}
				}
			}
		}
	}
}

//从下个页面传的参数
function addCarInfo(){
	var paramList = parm.body.inforCar;
	var shengCode = null;
	var cityName = null;
	var shengName = null;
	vehicleModelData = null;
	if(!$.isNull(paramList) && !$.isNull(paramList.vehicleModelData)){
		vehicleModelData = paramList.vehicleModelData
	}
	if(!$.isNull(paramList.shengCode)){
		shengCode = paramList.shengCode;
		$("#car_sheng").attr("name",shengCode);
	}
	if(!$.isNull(paramList.shengName)){
		shengName = paramList.shengName;
	}
	if(!$.isNull(paramList.cityName)){
		cityName = paramList.shengCode;
		$("#car_shi").attr("name",cityName);
	}
}
/**
 * 数字Check
 * 
 * @param String
 * @returns false-不通过
 */
function checkNo(param) {
	reg = /^[0-9]*$/;
	return reg.test(param);
}

//输入一个汉字一个字母和5个数字
function checkCarNo(param) {
	reg = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5,6}$/;
	return reg.test(param);
}

//汉字正则表达式
function checkChinese(str){
	reg = /^[A-Za-z0-9-_]+$/;
	return reg.test(str);
}

//开始必须是一个或者多个单词字符或者是-，加上@，然后又是一个或者多个单词字符或者是-。然后是点“.”和单词字符和-的组合，可以有一个或者多个组合,邮箱不能以
//.以及其它特殊字符开头和结束,邮箱域名结尾为2~5个字母，比如cn、com、name
function checkEmail(str){
	var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*[A-Za-z0-9_]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}[a-z0-9]+$/;
    return reg.test(str);
}
//选择渠道
function selectChannel(){
	var url = base.url + "bill/queryIssueChannel.do";
	var reqData = {
			"head":{
				"userCode":"",
				"transTime":$.getTimeStr(),
				"channel":"1"
			},"body":{}
	};
	$.reqAjaxs(url, reqData, function(data){
		var userPicker = new mui.PopPicker();
		userPicker.setData(data.returns.bxCxChannel);
		userPicker.show(function(items) {
			document.getElementById("issueChannel").value=items[0].text;
			document.getElementById("issueChannel").setAttribute("channelCode", items[0].value)
			document.getElementById("car_sheng").value = "请选择省份";
			document.getElementById("car_sheng").style.color = "#888";
			document.getElementById("car_sheng").name = "";
			document.getElementById("car_shi").value = "请选择城市";
			document.getElementById("car_shi").style.color = "#888";
			document.getElementById("car_shi").name = "";
			document.getElementById("plate_number_input").value = "请输入车牌号码";
			document.getElementById("plate_number_input").style.color = "#888";
			document.getElementById("plate_number_input").name = "";
			citynum = "";
		});
	});
}


/**--返回东航--*/
function goBackDH(){
	window.location.href=sessionStorage.getItem("backurl");
}



/****对iframe的操作*****/
function iframe(){
	/**--保险条款跳转---*/
	$("#insurance_statement").on("tap",function(){
		$("#quoteIframe").attr("src",base.url1+"html/carinsure/insuranceTerms.html").show();
		$("#order_index,header").hide();
	});
	/**--投保须知跳转---*/
	$("#insurance_declaration").on("tap",function(){
		$("#quoteIframe").attr("src",base.url1+"html/carinsure/notice.html").show();
		$("#order_index,header").hide();
	});
}

//关闭iframe
function ifremhide() {
	$("#quoteIframe").attr("src", " ");
	$("#order_index,header").show();
	$("#quoteIframe").hide();
}