var invMobie="";//推荐人手机号
var riskSupportAbility = "";
var customerId = "";
if(getUrlQueryString("jsonKey")){
	var parm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
}
$(function() {
	var name;
	var idNo;
	var openid = getUrlQueryString("openid");
	var mobile = getUrlQueryString("mobile");
	var fromtype = getUrlQueryString("fromtype");
	customerId = getUrlQueryString("cusId");
	invMobie = getUrlQueryString("invMobie");
	
	/* 设置滑动区域 */
	$.setscroll();
	/* 格式校验 */
	$.infoCheck();

	$("#nextstep").bind("tap",function (){
		name = $("#phone_input").val();
		idNo = $("#id_input").val();
		if(name == ""||name =="请输入您的真实姓名"){
			modelAlert('请输入您的真实姓名');
			return false;
		}
		if(idNo == ""||idNo =="请输入您的身份证号"){
			modelAlert('请输入您的身份证号');
			return false;
		}
		if($.checkIdCard($("#id_input").val().toLocaleUpperCase()) != 0) {
				modelAlert("身份证号输入有误，请重新输入！");
				return false;
		}
		if(isChineseorspot($("#phone_input").val()) == false) {
				modelAlert("姓名输入有误，请重新输入！");
				//				$("#policyholder_name_input").val("请输入姓名").css("color",
				//					"#ccc");
				return false;
		}
		
		
		var url = base.url+"register/realInfo.do";
		var reqData = {
						"head":{
							"userCode":"",
							"transTime":$.getTimeStr(),
							"channel":"1"
						},"body":{
							"mobile":mobile,
							"name":name,
							"idNo":idNo
							
						}
				};
				
		$.reqAjaxs(url, reqData, function(data){
//					console.log(data);
					
					if(data.statusCode=="000000"){
							
							if(fromtype == "3"){
								window.location.href = "personal.html?openid="+openid;
							}else if(fromtype == "1"){
								window.location.href = base.url+"/weixin/wxcar/html/carinsure/carMes.html?openid="+openid+"&mobile="+mobile;
							}else if(fromtype == "2"){
								window.location.href = base.url+"/weixin/wxcar/html/carinsure/PolicyManagement.html?openid="+openid+"&mobile="+mobile;
							}else if(fromtype == "4"){//保单车询
								window.location.href = base.url+"/weixin/wxcar/html/carinsure/policyQuery.html?openid="+openid+"&mobile="+mobile;
							}else if(fromtype == "5"){//随心易,进入投保信息填写页面
								window.location.href = suixinyi.url+"/weixin/suixinyi/html/suixinyiShare/customerInfoFillShare.html?openid="+openid+"&fromtype="+fromtype+"&mobile="+mobile+"&flag=1&invMobie="+invMobie;
							}else if(fromtype == "6"){
								getFP(mobile);
								if(riskSupportAbility){
									var sendData = {
											"head":{
												"riskSupportAbility":riskSupportAbility
											},
											"body":{
												"customerId":customerId,
												"mobile":mobile,
												"productCode":parm.body.productCode
											}
									}
									var jsonKey = UrlEncode(JSON.stringify(sendData));
									window.location.href = base.url+"tongdaoApp/page/html/hongkang/purchase.html?jsonKey="+jsonKey;
								}else{									
									riskTest(mobile,parm.body.productCode,customerId);
								}
							}						
					}else{
						modelAlert(data.statusMessage);
					}
				});						
	});
});
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#order_index").height(Scrollheight);
	mui("#order_index").scroll();
};
$.infoCheck = function() {
	//提示语隐藏
	$.replacePlaceholder($("#phone_input"), "请输入您的真实姓名");
	$.replacePlaceholder($("#id_input"), "请输入您的身份证号");
};

 function isChineseorspot(str) {
			var reg = /^[\u4E00-\u9FFF|·]+$/;
			return reg.test(str);
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