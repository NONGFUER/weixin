var validateCode="";
var phoneNo="";
var openid;
var fromtype;
var mobile;
var flag="";//实名标志（1：已实名，null：未实名）
var invMobie="";//推荐人手机号
var parm = "";
var riskSupportAbility = "";
$(function(){
	flag = getUrlQueryString("flag");
	openid = getUrlQueryString("openid");
	fromtype = getUrlQueryString("fromtype");
	invMobie = getUrlQueryString("invMobie");
	if(getUrlQueryString("jsonKey")){
		parm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
	}
	
	$("#zc").bind("tap",function(){
		$(".first").hide();
		$(".second").show();
	});
	/* 设置滑动区域 */
	$.setscroll();
	/* 格式校验 */
	$.infoCheck();
	//协议勾选
	$(".dagou").on("tap",function(){
			var picName = $(".dagou").attr("src").substring($(".dagou").attr("src").lastIndexOf("/") + 1);
			if(picName == "17.png") {
				$(".dagou").attr("src", "../../image/16.png");
				$("#nextstep").css("background-color","#C0C0C0");
				$("#nextstep").attr("disabled","disabled");
			} else {
				$(".dagou").attr("src", "../../image/17.png");
				$("#nextstep").css("background-color","#1B6BB8");
				$("#nextstep").removeAttr("disabled");
			}
	});
	$(".h_back").bind("tap",function(){
		
		
		$(".first").show();
		$(".second").hide();
		
		
		
	});
	$("#getPIN").on("tap",function(){
		if($("#phone_input").val() == "请输入手机号码" ||$("#phone_input").val() == "" ){
			modelAlert("请输入手机号！");
			return false;
			
		}
		if(tit.regExp.isMobile($("#phone_input").val())){
				phoneNo = $("#phone_input").val();
				countdown = 60;
				settime();
				var url = base.url+"/customer/GetRegCode.do";
				var reqData = {
						"head":{
							"userCode":"",
							"transTime":$.getTimeStr(),
							"channel":"1"
						},"body":{
							"userName":$("#phone_input").val(),
							"type":"103"
						}
				};
				$.reqAjaxs(url, reqData, function(data){
					console.log(data);
					if(data.statusCode=="000000"){
						validateCode=data.returns.validateCode;
						
						
					}else{
						modelAlert(data.statusMessage);
					}
				});
			}else{
				modelAlert('手机号校验错误，请重新输入！');
			}
	});
	$("#nextstep").bind("tap",function (){
		if($("#phone_input").val() == ""||$("#phone_input").val() =="请输入手机号码"){
			modelAlert('请输入手机号!');
			return false;
		}
		if(tit.regExp.isMobile($("#phone_input").val()) == false) {
				modelAlert("手机号校验错误，请重新输入！");
				return false;
		}
		if($("#valificationCode_input").val() == ""||$("#valificationCode_input").val() =="请输入验证码"){
			modelAlert('请输入验证码!');
			return false;
		}
		var picName = $(".dagou").attr("src").substring($(".dagou").attr("src").lastIndexOf("/") + 1);
				if(phoneNo ==  $("#phone_input").val()){
					if($("#valificationCode_input").val()==validateCode&&$("#valificationCode_input").val()!=""){
						validate(phoneNo);
					}else{
							modelAlert('验证码有误，请重新输入！');
						}	
					}else{
						modelAlert('验证码有误，请重新输入！');
					}
	});
	

	
});
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#order_index").height(Scrollheight);
	mui("#order_index").scroll();
};
$.infoCheck = function() {
	//提示语隐藏
	$.replacePlaceholder($("#phone_input"), "请输入手机号码");
	$.replacePlaceholder($("#valificationCode_input"), "请输入验证码");
};
function settime() {
	if (countdown == 0) {
		document.getElementById("getPIN").removeAttribute("disabled"); 
		$("#getPIN").css("background-color","#1B6BB8");
		$("#getPIN").val("获取验证码");
		countdown = 60; 
		return false;
	} else {
		document.getElementById("getPIN").setAttribute("disabled", "disabled"); 
		$("#getPIN").css("background-color","#C0C0C0");
		$("#getPIN").css("color","rgb(255,255,255)");
		$("#getPIN").css("opacity","1 !important");
		$("#getPIN").val(countdown+"秒");
	countdown--;
	}
	setTimeout(function() {
	   settime()
	},1000)
}
function validate(phoneNo) {
	var url = base.url+"/register/quickRegister.do";
	var reqData = {
						"head":{
							"userCode":"",
							"transTime":$.getTimeStr(),
							"channel":"1"
						},"body":{
							"openId":openid,
							"userName":phoneNo,
							"flag":"10",
							"customerSource":"2"//用户来源(1app注册，2微信注册（同道出行），3微信注册（微信代理人）)
							
						}
				};
	$.reqAjaxs(url, reqData, function(data){
					if(data.statusCode=="000000"){
							$("#phone_input").val("请输入手机号码");
							$("#valificationCode_input").val("请输入验证码");
							$("#getPIN").val("获取验证码");
						if(data.returns.idAuth == "0"){//登录成功进入实名页面							
							if(fromtype == "6"){
								getFP(phoneNo);
								var sendData1 = {
										"head":{
											"riskSupportAbility":riskSupportAbility
										},
										"body":{
											"customerId":data.returns.bxTdCustomer.id+'',
											"mobile":phoneNo,
											"productCode":parm.body.productCode
										}
								}
								var jsonStr = UrlEncode(JSON.stringify(sendData1));
								window.location.href="certificationShare.html?mobile="+phoneNo+"&fromtype="+fromtype+"&openid="+openid+"&invMobie="+invMobie+"&jsonKey="+jsonStr;
							}else{
								window.location.href="certificationShare.html?mobile="+phoneNo+"&fromtype="+fromtype+"&openid="+openid+"&invMobie="+invMobie;
							}
						}else{//影像已上传状态||用户离职
							if(fromtype == "3"){//个人中心
								window.location.href = "personal.html?openid="+openid;
							}else if(fromtype == "1"){//购买车险
								window.location.href = base.url+"/weixin/wxcar/html/carinsure/carMes.html?openid="+openid+"&mobile="+phoneNo;
							}else if(fromtype == "2"){//车险订单查询
								window.location.href = base.url+"/weixin/wxcar/html/carinsure/PolicyManagement.html?openid="+openid+"&mobile="+phoneNo;
							}else if(fromtype == "4"){//保单车询
								window.location.href = base.url+"/weixin/wxcar/html/carinsure/policyQuery.html?openid="+openid+"&mobile="+phoneNo;
							}else if(fromtype == "5"){
								/*if(flag!=1){//随心易未实名，去实名
									window.location.href=base.usersurl+"weixin/wxusers/html/certificationShare.html?openid="+openid+"&fromtype="+fromtype+"&mobile="+phoneNo+"&invMobie="+invMobie;
								}else{//已实名
*/									suixinyiPage();
								/*}*/
							}else if(fromtype == "6"){
								getFP(phoneNo);
								if(riskSupportAbility){
									var sendData = {
											"head":{
												"riskSupportAbility":riskSupportAbility
											},
											"body":{
												"customerId":data.returns.bxTdCustomer.id+'',
												"mobile":phoneNo,
												"productCode":parm.body.productCode
											}
									}
									var jsonKey = UrlEncode(JSON.stringify(sendData));
									window.location.href = base.url+"tongdaoApp/page/html/hongkang/purchase.html?jsonKey="+jsonKey;
								}else{
									var cusId = data.returns.bxTdCustomer.id+'';
									riskTest(phoneNo,parm.body.productCode,cusId);
								}
								
							}	
						}
					}else{
						modelAlert(data.statusMessage);
						
					}
				});	
};
//随心易，查询订单状态，根据订单状态跳页面
function suixinyiPage(){
	var url=suixinyi.url+"common/getTrafficTime.do";
	var reqData = {
			"head":{
				"channel":"01",
				"userCode":"2835",
				"transTime":""
			},"body":{
				"phone":phoneNo
			}
	}
	$.reqAjaxs(url, reqData,function(data){
		if(data.statusCode=="000000"){
			var policyStatus=data.returns.bxOrder.policyStatus;//订单状态
			if(policyStatus=="00"){//失效，跳到首页
				window.location.href = suixinyi.url+"/weixin/suixinyi/html/suixinyiShare/shouyeShare.html?mobile="+phoneNo+"&fromtype="+fromtype+"openid="+openid+"&flag=1&invMobie="+invMobie;
			}else if(policyStatus=="01" || policyStatus=="02"){//支付失败、核保成功(未支付)跳到投保信息填写页面
				window.location.href = suixinyi.url+"/weixin/suixinyi/html/suixinyiShare/customerInfoFillShare.html?mobile="+phoneNo+"&fromtype="+fromtype+"openid="+openid+"&flag=1&invMobie="+invMobie;
			}else if(policyStatus=="03" || policyStatus=="04" || policyStatus=="99"){//待生效、已生效、已过期，跳到出行方式选择页面
				window.location.href = suixinyi.url+"/weixin/suixinyi/html/suixinyiShare/chooseChuxingWayShare.html?mobile="+phoneNo+"&invMobie="+invMobie+"&flag=1&orderFlag=1";
			}else if(policyStatus=="05"){//支付中（后台未接收到易安支付回调）
				window.location.href = suixinyi.url+"/weixin/suixinyi/html/suixinyiShare/payResoltWXShare.html?mobile="+phoneNo+"&orderCode=0&invMobie="+invMobie;
			}
		}else if(data.statusCode=="000002"){//无订单
			window.location.href = suixinyi.url+"/weixin/suixinyi/html/suixinyiShare/customerInfoFillShare.html?openid="+openid+"&fromtype="+fromtype+"&mobile="+phoneNo+"&flag=1&invMobie="+invMobie;
		}
	})
	
}
$.reqAjaxsFalse = function(url, requestData, callBack) {
	var requestJson = aesEncrypt(JSON.stringify(requestData), secretKey, secretKey);
	requestJson=URLencodeForBase64(requestJson);
	$.ajax({
		url : url,
		type : 'POST',
		data : "jsonKey=" + requestJson,
		dataType : "json",
		timeout : 60000,
		success : function(data) {
			$(".ajax_prevent").remove();// 去除遮罩
			if (!$.isNull(callBack)) {
				callBack(data);
			}
		},
		error : function(data) {
			$(".ajax_prevent").remove();// 去除遮罩
			modelAlert("网络好像开小差了呢，请设置给力一点儿网络吧！");
		},
		beforeSend : function(xhr) {
			$.ajaxPrevent();
		},
		async : false,
	});
};	
function getFP(phone){
	var url = base.url + "common/commonRequest.do";
	var data = {
			//"customerId" : parm.head.userId,
			//"tes.tScore" : testScore
			"head":{
				
			},
			"body":{
				"requestUrl":"/customerCenter/quickQuery.do",
				"userName":phone				
			}
	};
	$.reqAjaxsFalse(url,data,function(data){
		riskSupportAbility = data.returns.customerBasic.riskSupportAbility;
	});
}

//页面跳转到风险评测页面
function riskTest(phone,riskCode,customerId){
	var sendData = {
		"head":{
			"riskSupportAbility":riskSupportAbility
		},
		"body":{
	        "returnflag":"",
			"testType":"",
			"mobile":mobile,
			"productCode":riskCode,
			"customerId":customerId
		}	
	}
	var jsonKey = UrlEncode(JSON.stringify(sendData));
	window.location.href = base.url+"tongdaoApp/page/html/hongkang/riskQuestion.html?jsonKey="+jsonKey;
}