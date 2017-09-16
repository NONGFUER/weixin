var flag="2";//0-合作机构公司名称不为其他  1-合作机构公司名称为其他 2-不填 
var hzCompanyName="";//合作机构公司名称
var issueChannel;//出单渠道
var channelType;//出单渠道（01保险，02银行，03佰盈其他）
var tradeNo;
var cxSessionId;
var times=0;
var hzWorkNo=true;
var refuseReason;
var orderStatus;
$(function(){
	var str = window.location.search;
	str = str.substr(9, str.length);
	str = UrlDecode(str);
	parm = JSON.parse(str);
	console.log(parm)
	cxSessionId = parm.body.cxSessionId;
	/**-----返回----*/
	$(".h_back").unbind("tap").bind("tap",function(){
		window.location.href = "quote.html" + window.location.search;
	})
	
	/* 设置滑动区域 */
	$.setscroll();
	
	init();//页面初始化
	// 取消遮罩
	$("#zhezhaoImg").on("tap",function(){
		$("#zhezhaoImg").hide();
	});
	
	/**--天安人寿输入营销员代码查询营销员信息--*/
	$("#hzWorkno").unbind("blur").bind("blur",function(){
		if(issueChannel=="07"){
			getHzInfo(0);
		}
		
	});
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
		var shareurl=base.url+'weixin/wxcar/html/carinsure/shareOrderDetail.html?jsonKey='+shareStr;// 分享链接
		var shareImgUrl=base.url+"weixin/wxcar/images/carshare.png";
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
		    	mui.alert("您取消了分享！","温馨提示");
		    }
		});
	}
	if(parm.head.fromtype!=null){
		$("#confirm").css("width","92%");
		$(".shareBtn").hide();
	}else{
		getConfig(method); 
	}
	
	/**-公司区域选择器---*/
	select();
	/**--业务员不填按钮---*/
	$("#baiyingButian").unbind("tap").bind("tap",function(){ 
		if($("#baiyingChoose").attr("src")=="../../images/weigouxuan3.png"){
			 $("#cdCheckBox").css("color","#f36f39");
			  $("#baiyingTableContent").hide();
			  $("#cdCheckBox").parent().next().hide();
			  $(this).find("img").attr("src","../../images/gouxuan3.png");
		}else{
			  $("#cdCheckBox").css("color","#888");
			  $("#baiyingTableContent").show();
			  $("#cdCheckBox").parent().next().show();
			  $(this).find("img").attr("src","../../images/weigouxuan3.png");
		}
	});
	/**--合作机构不填按钮---*/
	$("#hezuoButian").unbind("tap").bind("tap",function(){
		if($("#hezuoChoose").attr("src")=="../../images/weigouxuan3.png"){
			  $("#hzCheckBox").css("color","#f36f39");
			  $("#hezuoTableContent").hide();
			  $("#hzCheckBox").parent().next().hide();
			  $(this).find("img").attr("src","../../images/gouxuan3.png");
			  
		}else{
			  $("#hzCheckBox").css("color","#888");
			  $("#hezuoTableContent").show();
			  $("#hzCheckBox").parent().next().show();
			  $(this).find("img").attr("src","../../images/weigouxuan3.png");
			  
		}
	});
		/**----点击立即投保----*/
	$("#confirm").unbind("tap").bind("tap",function(){
		if(issueChannel=="07"){//天安人寿渠道
			$("#hzWorkno").unbind("blur");
			getHzInfo(1);
		}else{
			totalcheck($.saveBack);
		}
		
	})
	
	/**----点击分享----*/
	$("#share").unbind("tap").bind("tap",function(){
		if(issueChannel=="07"){//天安人寿渠道
			$("#hzWorkno").unbind("blur");
			getHzInfo(2);
		}else{
			totalcheck($.shareSaveBack);
		}
	});
});




/**--页面初始化---*/
function init(){
	var url = base.url + "bill/getCxOrgAddByUserName.do";
	var reqData = {
			"head":{
				"userCode":"",
				"transTime":$.getTimeStr(),
				"channel":"1"
			},"body":{
				"userName":parm.head.userName,
				"cityCode":parm.body.cityCode,
				"cxSessionId":parm.body.cxSessionId
			}
		
	};
	$.reqAjaxs(url, reqData,function(data){
		if(data.statusCode=="000000"){
			var cxOrderOrgadd=data.returns.cxOrderOrgadd;
			var cxOrder=data.returns.cxOrder;
			console.log(data)
			tradeNo=cxOrder.tradeno;
			issueChannel=data.returns.issueChannel;//出单渠道
			channelType=data.returns.bxCxChannel.channelType;//出单渠道（01保险，02银行，03佰盈其他）
			if(channelType=="01"){//保险渠道
				$(".hzTitle").html("保险机构人员信息");
				$(".insureImg").attr("src","../../images/baoxian2.png");
			}else if(channelType=="02"){//银行渠道
				$(".hzTitle").html("银行人员信息");
				$(".insureImg").attr("src","../../images/bank.png");
			}
			if(issueChannel=="07"){//天安人寿渠道
				$(".hzWorknoLabel").html("营销员代码");
				$(".hzNameLabel").html("营销员姓名");
				$("#hzWorkno").attr("placeholder","请填写营销员代码");
				$("#hzName").attr("placeholder","").attr("readonly","readonly");
				$("#hzPhone").attr("placeholder","请填写手机号码(选填)");
				$("#hzNote").attr("placeholder","").attr("readonly","readonly");
			}
			if(channelType!="03"){//非佰盈渠道
				$("#noteLabel").html("网点信息");
				$("#hezuoChoose").attr("src","../../images/weigouxuan3.png");//合作信息设置为不勾选
				$("#hzCheckBox").css("color","#888");
				$("#hezuoButian").hide();
				$("#hezuoTableContent").show();
			}
			if(cxOrder.cdName!=""&&cxOrder.cdName!=null){//该订单已录入出单人员信息
				 $("#cdName").val(cxOrder.cdName);
				 $("#cdWorkno").val(cxOrder.cdWorkno);
			}else{
				 if(cxOrderOrgadd!=null){
					  if(cxOrderOrgadd.cdName!=null){
						  $("#cdName").val(cxOrderOrgadd.cdName);
					  }
					  if(cxOrderOrgadd.cdWorkno!=null){
						  $("#cdWorkno").val(cxOrderOrgadd.cdWorkno);
					  }
				 }	  
			}
			$("#cdArea").attr("cdProvinceCode",parm.body.inforCar.shengCode).attr("cdProvinceName",parm.body.inforCar.shengName).attr("cdCityCode",parm.body.cityCode).attr("cdCityName",parm.body.inforCar.cityName);
			if(parm.body.cdPrivinceFlag!="1"){
				$("#cdArea").val(parm.body.inforCar.shengName+parm.body.inforCar.cityName);
			}else{
				$("#cdArea").val(parm.body.inforCar.shengName);
			}
			if(issueChannel=="01"){//佰盈渠道
				$("#hezuoChoose").attr("src","../../images/gouxuan3.png");
				$("#hzCheckBox").css("color","#f36f39");
				$("#hezuoTableContent").hide();
			}
			if(issueChannel=="07"){//天安人寿出单员信息默认不填
				$("#baiyingChoose").attr("src","../../images/gouxuan3.png");
				$("#cdCheckBox").css("color","#f36f39");
				$("#baiyingTableContent").hide();
			}
		 
		  if(cxOrderOrgadd!=null){
			  if(cxOrderOrgadd.hzCompanyCode!=null&&cxOrderOrgadd.hzCompanyCode!=""){
				  hzCompanyName=cxOrderOrgadd.hzCompanyName;
				  $("#company").attr("hzCompanyCode",cxOrderOrgadd.hzCompanyCode).val(cxOrderOrgadd.hzCompanyName);
				  $("#hzArea").attr("hzProvinceCode",cxOrderOrgadd.hzProvinceCode).attr("hzProvinceName",cxOrderOrgadd.hzProvinceName).attr("hzCityCode",cxOrderOrgadd.hzCityCode).attr("hzCityName",cxOrderOrgadd.hzCityName).val(" "+cxOrderOrgadd.hzProvinceName+cxOrderOrgadd.hzCityName); 
			  }else{
				  var hzarea='';
				  if(cxOrderOrgadd.hzCityCod!=null){
					  hzarea=cxOrderOrgadd.hzProvinceName+cxOrderOrgadd.hzCityName;
				  }
				  $("#hzArea").attr("hzProvinceCode",cxOrderOrgadd.hzProvinceCode).attr("hzProvinceName",cxOrderOrgadd.hzProvinceName).attr("hzCityCode",cxOrderOrgadd.hzCityCode).attr("hzCityName",cxOrderOrgadd.hzCityName).val(hzarea); 
			  }
			  if(cxOrderOrgadd.hzWorkno!=null){
				  $("#hzWorkno").val(cxOrderOrgadd.hzWorkno);
			  }
			  if(cxOrderOrgadd.hzName!=null){
				  $("#hzName").val(cxOrderOrgadd.hzName);
			  }
			  if(cxOrderOrgadd.hzPhone!=null){
				  $("#hzPhone").val(cxOrderOrgadd.hzPhone);
			  }
			  if(cxOrderOrgadd.hzNote!=null){
				  $("#hzNote").val(cxOrderOrgadd.hzNote);
			  }
			  
			  if(issueChannel!="01"){//其他合作渠道出单
				  hzCompanyName=data.returns.bxCxChannel.channelName;
				  $("#company").attr("hzCompanyCode",data.returns.bxCxChannel.channelCode).attr("disabled","disabled").val(data.returns.bxCxChannel.channelName);
				  $("#hzArea").attr("hzProvinceCode",parm.body.inforCar.shengCode).attr("hzProvinceName",parm.body.inforCar.shengName).attr("hzCityCode","").attr("hzCityName","").attr("disabled","disabled").val(parm.body.inforCar.shengName); 
			      $(".linkicon").hide();
			  }
		  }
		 
		}else{
			mui.alert(data.statusMessage,"温馨提示");
		}
	});
}
/**-公司区域选择器---*/
function  select(){
	/**-----选择公司----*/
	$("#company").unbind("tap").bind("tap",function(){
		var url = base.url + "bill/selectCompany.do";
		var reqData = {
				"head":{
					"userCode":"",
					"transTime":$.getTimeStr(),
					"channel":"1"
				},"body":{}
			 
		};
		$.reqAjaxs(url, reqData, $.respBack);
	})
	/**-----选择公司所在区域----*/
	$("#hzArea").unbind("tap").bind("tap",function(){
		selectHzCity();
	});
}

/**----合作机构公司list 回调----*/
$.respBack=function(data){
	if(data.statusCode=="000000"){
		var userPicker = new mui.PopPicker();
		userPicker.setData(data.returns.gfbCxPartner);
		userPicker.show(function(items) {
			$("#company").val(items[0].text);
			$("#company").attr("hzCompanyCode",items[0].value);
			if(items[0].value==""){//请选择
				flag="2";
				hzCompanyName="";
				$("#companyNameTr").hide();
				$("#hzArea").attr("hzProvinceCode","").attr("hzProvinceName","").attr("hzCityCode","").attr("hzCityName","").val("");//分公司选择其他
				
			}else{
				/**--查询合作机构省市---*/
				selectHzCity();
				flag="0";
				$("#companyNameTr").hide();
				
			}
		});
	}else{
		mui.alert(data.statusMessage,"温馨提示");
	}
	
}
/**--点击下一步ajax回调-------*/
$.saveBack=function(data){
	if(data.statusCode=="000000"){
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
			$.toAjaxs(url, data,function(param){
				if (param.statusCode == "000000") {
					refuseReason=param.returns.cxOrder.refuseReason;
					if(refuseReason==null){//微信核保接口重复提交
						refuseReason="确认投保成功！提交核保失败!";
					}
					orderStatus=param.returns.cxOrder.orderStatus;
					// 核保失败
					if (param.returns.cxOrder.orderStatus == "03") {
						modelAlert(param.returns.cxOrder.refuseReason);
						$("#btn_area").hide();
						$("#hebaoFail_reason_area").show();
						// 核保失败原因
						$("#failName").html("核保失败原因");// 核保失败原因
						$("#hebaoFailInfo").html(param.returns.cxOrder.refuseReason);// 核保失败原因
					}
					// 退保
					if (param.returns.cxOrder.orderStatus == "9900") {
						modelAlert(param.returns.cxOrder.refuseReason);
						$("#btn_area").hide();
						$("#hebaoFail_reason_area").show();
						// 核保失败原因
						$("#failName").html("退保原因原因");// 核保失败原因
						$("#hebaoFailInfo").html(param.returns.cxOrder.refuseReason);// 核保失败原因
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
					}
					if (param.returns.cxOrder.orderStatus == "01") {	
						modelAlert(refuseReason);
					}
				} else {
					refuseReason=param.statusMessage;
					modelAlert(param.statusMessage);
				}
			});
		}else{
			if (orderStatus == "05") {
			    window.location.href =payUrl;
			}else{
				modelAlert(refuseReason);
			}
		}
				
	}else{
		modelAlert(data.statusMessage);
	}
}


/**--点击分享回调-------*/
$.shareSaveBack=function(data){
	if(data.statusCode=="000000"){
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
			$.toAjaxs(url, data,function(param){
				if (param.statusCode == "000000") {
					refuseReason=param.returns.cxOrder.refuseReason;
					if(refuseReason==null){//微信核保接口重复提交
						refuseReason="确认投保成功！提交核保失败!";
					}
					orderStatus=param.returns.cxOrder.orderStatus;
					// 核保失败
					if (param.returns.cxOrder.orderStatus == "03") {
						modelAlert(param.returns.cxOrder.refuseReason);
						$("#btn_area").hide();
						$("#hebaoFail_reason_area").show();
						// 核保失败原因
						$("#failName").html("核保失败原因");// 核保失败原因
						$("#hebaoFailInfo").html(param.returns.cxOrder.refuseReason);// 核保失败原因
					}
					
					//  核保成功
					if (param.returns.cxOrder.orderStatus == "05") {
						payUrl=param.returns.cxOrder.payUrl;
						$("#btn_area").hide();
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
					}
					if (param.returns.cxOrder.orderStatus == "01") {	
						modelAlert(refuseReason);
					}
				} else {
					refuseReason=param.statusMessage;
					modelAlert(param.statusMessage);
				}
			});
		}else{
			if (orderStatus == "05") {
				$("#btn_area").hide();
			    $("#zhezhaoImg").show();
			}else{
				modelAlert(refuseReason);
			}
		}	
	}else{
		modelAlert(data.statusMessage);
	}
}
/**--查询合作机构省市---*/
function selectHzCity(){
	var url = base.url + "bill/selectCity.do";
	var reqData = {
			"head":{
				"userCode":"",
				"transTime":$.getTimeStr(),
				"channel":"1"
			},"body":{
				 "cdProvinceCode":parm.body.inforCar.shengCode,
			     "cdCityCode":parm.body.cityCode,
                 "hzCompanyCode":$("#company").attr("hzCompanyCode")

			}
		
	};
	$.reqAjaxs(url, reqData, function(data){
		if(data.statusCode=="000000"){
			  if(data.returns.resultStatus=="0"){
				  mui.alert(data.statusMessage,"温馨提示");
				  $("#hzArea").attr("hzProvinceCode","").attr("hzProvinceName","").attr("hzCityCode","").attr("hzCityName","").val(" ");
			  }else if(data.returns.resultStatus=="1"){
				  $("#hzArea").attr("hzProvinceCode",data.returns.cityList[0].hzProvinceCode).attr("hzProvinceName",data.returns.cityList[0].hzProvinceName).attr("hzCityCode",data.returns.cityList[0].value).attr("hzCityName",data.returns.cityList[0].text).val(data.returns.cityList[0].hzProvinceName+data.returns.cityList[0].text);
			  }else if(data.returns.resultStatus=="2"){
				  var userPicker = new mui.PopPicker();
					userPicker.setData(data.returns.cityList);
					userPicker.show(function(items) {
						$("#hzArea").attr("hzProvinceCode",data.returns.cityList[0].hzProvinceCode).attr("hzProvinceName",data.returns.cityList[0].hzProvinceName).attr("hzCityCode",items[0].value).attr("hzCityName",items[0].text).val($("#cdArea").attr("cdProvinceName")+items[0].text);
					});
			  }
			 
		}else{
			mui.alert(data.statusMessage,"温馨提示");
		}
	});
}




/**
 * 天安人寿渠道通过销售员工号获取信息
 */
function getHzInfo(tareFlag){
	hzWorkNo=false;
	if($("#hzWorkno").val()!=""){
		var url = base.url + "bill/queryTarsInfo.do";
		var reqData = {
				"head":{
					"userCode":"",
					"transTime":$.getTimeStr(),
					"channel":"1"
				},"body":{
					"hzWorkno":$.trim($("#hzWorkno").val()),
				}
			
		};
		$.reqAjaxs(url, reqData,function(data){
			if(data.statusCode=="000000"){
				if(data.returns.bxChannelUser.cxProvinceCode== parm.body.inforCar.shengCode){
					$("#hzName").val(data.returns.bxChannelUser.salesUserName);//销售员姓名
					$("#hzNote").val(data.returns.bxChannelUser.branchName+data.returns.bxChannelUser.salesAreaName+data.returns.bxChannelUser.salesGroupName);//网点信息
					hzWorkNo=true;
					if(tareFlag==1){//立即投保
						totalcheck($.saveBack);
					}else if(tareFlag==2){//分享操作
						totalcheck($.shareSaveBack);
					}
				}else{
					mui.alert("该保险机构人员不属于出单区域!","温馨提示",function(){
						$("#hzName,#hzNote").val("");
						/**--天安人寿输入营销员代码查询营销员信息--*/
						$("#hzWorkno").unbind("blur").bind("blur",function(){
							if(issueChannel=="07"){
								getHzInfo(0);
							}
							
						});
					});
				}
			}else{
				mui.alert(data.statusMessage,"温馨提示",function(){
					$("#hzName,#hzNote").val("");
					/**--天安人寿输入营销员代码查询营销员信息--*/
					$("#hzWorkno").unbind("blur").bind("blur",function(){
						if(issueChannel=="07"){
							getHzInfo(0);
						}
					});
				});
			}
	   });
	}else{
		mui.alert("请填写营销员代码!","温馨提示",function(){
			$("#hzName,#hzNote").val("");
			/**--天安人寿输入营销员代码查询营销员信息--*/
			$("#hzWorkno").unbind("blur").bind("blur",function(){
				if(issueChannel=="07"){
					getHzInfo(0);
				}
			});
		});
	}
	
}

$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#indexpart").height(Scrollheight);
	mui("#indexpart").scroll();
};
/**
 * 点击立即投保
 */
function totalcheck(func){
	if( $("#baiyingChoose").attr("src")=="../../images/weigouxuan3.png"){
		if($("#cdWorkno").val()!=""){
			if(/^[A-Za-z0-9]+$/.test($("#cdWorkno").val().trim())){
				if($("#cdName").val()!=""){
					if(!tit.regExp.isChinese($("#cdName").val().trim())){
						mui.alert("业务员姓名为汉字，请重新填写该信息！","温馨提示");
						return false;
					}
				}else{
					mui.alert("业务员姓名为必填项，请填写该信息！","温馨提示");
					return false;
				}
			}else{
				mui.alert("业务员代码为数字或字母，请重新填写该信息！","温馨提示");
				return false;
			}
			
		}else{
			mui.alert("业务员代码为必填项，请填写该信息！","温馨提示");
			return false;
		}	
				
	}
	if( $("#hezuoChoose").attr("src")=="../../images/weigouxuan3.png"){
		if($("#company").attr("hzCompanyCode")==""){
			mui.alert("公司名称不能为空，请填写该信息！","温馨提示");
			return false;
		}
		if($("#hzWorkno").val()!=""){
			if(!/^[A-Za-z0-9]+$/.test($("#hzWorkno").val().trim())){
				mui.alert("工号为数字或字母，请重新填写该信息！","温馨提示");
				return false;
			}
		}else{
			mui.alert("工号为必填项，请填写该信息！","温馨提示");
			return false;
		}	
		if($("#hzName").val()!=""){
			if(!tit.regExp.isChinese($("#hzName").val().trim())){
				mui.alert("姓名为汉字，请重新填写该信息！","温馨提示");
				return false;
			}
		}else{
			mui.alert("姓名不能为空，请填写该信息！","温馨提示");
			return false;
		}
		if($("#hzPhone").val()!=""){
			if(!tit.regExp.isMobile($("#hzPhone").val().trim())){
				mui.alert("手机号输入错误，请重新输入！","温馨提示");
				return false;
			}
		}else{
			if(issueChannel!="07"){//天安人寿渠道手机号选填
				mui.alert("手机号不能为空，请填写该信息！","温馨提示");
				return false;
			}
		}
		
	}
	var url = base.url + "bill/selectPartner.do";
	hzCompanyName=$("#company").val();
	var reqData = {
			"head":{
				"userCode":"",
				"transTime":$.getTimeStr(),
				"channel":"1"
			},"body":{
				 "userName":parm.head.userName,
                 "openId":parm.head.openId,
			     "cdName":"",
			     "cdCustomerNo":"",
			     "cdProvinceCode":"",
			     "cdProvinceName":"",
			     "cdCityCode":"",
			     "cdCityName":"",
			     "hzWorkno":"",
			     "hzName":"",
			     "hzPhone":"",
			     "hzCompanyCode":"",
			     "hzCompanyName":"",
			     "hzProvinceCode":"",
			     "hzProvinceName":"",
			     "hzCityCode":"",
			     "hzCityName":"",
			     "hzNote":"",
			     "sessionid":parm.body.cxSessionId,//订单流水号
			     "channelCode":issueChannel//出单渠道
			}
		
	};
	if($("#baiyingChoose").attr("src")=="../../images/weigouxuan3.png"){
		reqData.body.cdName=$("#cdName").val().trim();
		reqData.body.cdCustomerNo=$("#cdWorkno").val().trim();
		reqData.body.cdProvinceCode=$("#cdArea").attr("cdProvinceCode").trim();
		reqData.body.cdProvinceName=$("#cdArea").attr("cdProvinceName").trim();     
		reqData.body.cdCityCode=$("#cdArea").attr("cdCityCode").trim();   
		reqData.body.cdCityName=$("#cdArea").attr("cdCityName").trim();   
	}
	if($("#hezuoChoose").attr("src")=="../../images/weigouxuan3.png"){
		reqData.body.hzCompanyCode=$("#company").attr("hzCompanyCode").trim();
		reqData.body.hzCompanyName=hzCompanyName;
		reqData.body.hzWorkno=$("#hzWorkno").val().trim();
		reqData.body.hzName=$("#hzName").val().trim();
		reqData.body.hzPhone=$("#hzPhone").val().trim();
		reqData.body.hzProvinceCode=$("#hzArea").attr("hzProvinceCode").trim();
		reqData.body.hzProvinceName=$("#hzArea").attr("hzProvinceName").trim();     
		reqData.body.hzCityCode=$("#hzArea").attr("hzCityCode").trim();   
		reqData.body.hzCityName=$("#hzArea").attr("hzCityName").trim();
		reqData.body.hzNote=$("#hzNote").val().trim(); 
	}
	$.reqAjaxs(url, reqData, func);
}
