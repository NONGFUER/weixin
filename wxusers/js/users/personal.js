var parm;
var cheakRecognizeeFlag = true;
var openId = "";
var name = "";
var ID = "";
var phone = getUrlQueryString("mobile");
var customerId = getUrlQueryString("customerId");
var roletype = getUrlQueryString("roleType");//用户类型:01-普通用户      2-代理人  3-白名单:客户经理  4-黑名单：佰盈内勤
var shenhestate = "00";//审核步骤：01考试完成，02基础信息已提交，03影像已上传，04认证失败，05认证通过'
var headImgUrl = getUrlQueryString("headImgUrl");
var openId =  getUrlQueryString("openid");
var wxchannel = getUrlQueryString("wxchannel");

$(function() {	
	init();
	//点击切换账号，进入手机验证页面
	$(".change_account").unbind("tap").bind("tap",function(){
		window.location.href = "phoneValidate.html?openid="+openId+"&fromtype=1&wxchannel=" + wxchannel ;
	})
	
	//点击返回图标，关闭当前页面，即进入微信公众号页面
	$(".h_back").unbind("tap").bind("tap",function(){
		WeixinJSBridge.call('closeWindow');
	})
	
	//点击代理人信息，进入代理人信息页面
	$(".agentHead").unbind("tap").bind("tap",function(){
		if(roletype == "02" || roletype == "06"){//只有代理人才能进入代理人信息页面，白名单不能进
			var sendData={
					"openId":openId,
					"name":name,
					"ID":ID,
					"phone":phone,
					"customerId":customerId,
					"wxchannel":wxchannel
			}
			var jsonKey = UrlEncode(JSON.stringify(sendData));
			window.location.href = "agentInfo.html?jsonKey="+jsonKey;
		}		
	})
	
	/* 设置滑动区域 */
	setscroll();
})


//根据customerId向后台查询用户信息
function init(){	
	var url = base.url + "customerBasic/getCustomerBasicInfo.do";
	var reqData = {
			"head":{
				"userCode":"",
				"channel" :"02",
				"transTime":"",
				"transToken":""
			},"body":{
				"customerId": customerId
			}
		};
	$.reqAjaxs(url,reqData,$.infoCallBack);		
}

//
$.infoCallBack = function(data){	
		if(data.statusCode == "000000"){			
			var customerBasic = data.returns.customerBasic;
			var agentInfo	  = data.returns.agentInfo;								
			if(customerBasic != "" && customerBasic != null){
				name     = customerBasic.name;
				ID       = customerBasic.idNo;
				phone    = customerBasic.mobile;
				customerId = customerBasic.id+"";
				idAuth = customerBasic.idAuth;
				if( idAuth == "0" ){
					//mobile=17317957601&roleType=01&customerId=89149&openid=ohNt9vwoSa9L2X66vFoc-q7UItg8&wxchannel=02&idAuth=0
					window.location.href = "certification.html?customerId="+customerId+"&mobile="+phone+"&roleType="+roletype+"&openid="+openId+"&wxchannel="+wxchannel;
				}
				if(customerBasic.userImage == "" || customerBasic.userImage == null){
					headImgUrl = "../../image/morentouxiang.png";
				}else{
					headImgUrl = customerBasic.userImage;
				}			
				roletype = customerBasic.type;
				//console.log("用户类型："+roletype);
				//对手机号、身份证号进行中间隐藏，手机号前3后4，身份证号和银行卡号前4后4
				if(phone != null && ID != null){
					var mobile = phone.substr(0,3)+"****"+phone.substr(7,11);
					var idNo = ID.substr(0,4)+"**********"+ID.substr(14,18);
				}
			}else{
					modelAlert("获取客户信息失败！");
					return false;
			}
								
				if(agentInfo != null && agentInfo != ""){					
					//银行卡号关键信息隐藏处理
					if(agentInfo.certificateCode != null && agentInfo.certificateCode != ""){
						var bankCardNo = agentInfo.certificateCode.substr(0,4)+"********"+agentInfo.certificateCode.substr(agentInfo.certificateCode.length-4);
					}else{
						var bankCardNo = "";
					}
					//审核状态获取
					if(agentInfo.verfyState != "" && agentInfo.verfyState != null){
						shenhestate = agentInfo.verfyState;//审核状态
					}else{
						shenhestate = "00";//未申请
					}
					//console.log("审核状态："+shenhestate);
					//开户行处理
					//（若有（），则截取（左边的字符串，截取后若开户行少于12个字符，全显示，否则截取后12个，前面加...拼接）
					if(agentInfo.bankSubName != null && agentInfo.bankSubName != ""){
						var kaihuhang = agentInfo.bankSubName;
						var index = kaihuhang.indexOf("（");
						var index1 = kaihuhang.indexOf("(");
						if(index > 0){
							kaihuhang = kaihuhang.substring(0,index);
						}
						if(index1 > 0){
							kaihuhang = kaihuhang.substring(0,index1);
						}
						if(kaihuhang.length > 12){
							kaihuhang = "..."+kaihuhang.substring(kaihuhang.length-12,kaihuhang.length);
						}
					}
						
					//渲染页面数据（代理人、银行卡、审核失败原因）
					$(".falsereason").html(agentInfo.remark);//审核失败原因
					$("#practicingId_input").val(agentInfo.practiceCode);//执业证编号
					$("#salesmanNo_input").val(agentInfo.agentCode);//业务员代码
					$("#bankName_input").val(agentInfo.bankName);//开户银行
					$("#sheng_input").val(agentInfo.bankPrivinceName);//所属省
					$("#shi_input").val(agentInfo.bankCityName);//所属市
					$("#kaihuhang_input").val(kaihuhang);//银行开户行名称
					$("#bankCardNo_input").val(bankCardNo);//银行卡号
					$("#practicingId_input").val(agentInfo.practiceCode);//执业证编号
					$("#salesmanNo_input").val(agentInfo.agentCode);//业务员代码
				}
				
				$(".touxiangImg").attr("src",headImgUrl);
				$(".touxiang_name").html(name);//姓名	
				$("#id_input").val(idNo);//身份证
				$("#phone_input").val(mobile);//手机号
				
				
				//普通用户
				if(roletype == "01"){					
					$(".touxiang_job").html("普通用户");
					$(".baseInfo").show();
					if( wxchannel == "01" ){
						$("#load").show();
					}else {						
						
						//未申请
						if(shenhestate == "00"){						
								$(".confirmbtn").html("申请成为代理人");
								/*$(".confirmbtn").html("下载同道APP，申请成为代理人");*/
								$(".confirmbtn").show();
								$(".confirmbtn").unbind("tap").bind("tap",function(){
									var sendData = {
											"openId":openId,
											"name":name,
											"ID":ID,
											"phone":phone,
											"customerId":customerId,
											"wxchannel":wxchannel
									}
									var jsonStr = UrlEncode(JSON.stringify(sendData));
									window.location.href="agentapply.html?jsonKey=" + jsonStr;
								})												
						}else if(shenhestate == "01"){//考试完成
							$(".confirmbtn").html("填写代理人信息");
							$(".confirmbtn").show();
							$(".confirmbtn").unbind("tap").bind("tap",function(){
								var sendData = {
										"openId":openId,
										"name":name,
										"ID":ID,
										"phone":phone,
										"flag":"2",
										"customerId":customerId,
										"wxchannel":wxchannel
								}
								var jsonStr = UrlEncode(JSON.stringify(sendData));
								window.location.href="agentInfoRegister.html?jsonKey=" + jsonStr;
							})
						}else if(shenhestate == "02"){//基础信息已提交
							$(".confirmbtn").html("录入影像资料");
							$(".confirmbtn").show();
							$(".confirmbtn").unbind("tap").bind("tap",function(){
								var sendData = {
										"openId":openId,
										"name":name,
										"ID":ID,
										"phone":phone,
										"customerId":customerId,
										"wxchannel":wxchannel
								}
								var jsonStr = UrlEncode(JSON.stringify(sendData));
								window.location.href="addImage.html?jsonKey=" + jsonStr;
							})
						}
						else if(shenhestate == "03"){//影像资料已上传，审核中
							$(".kefuPhone").show();
							$(".confirmbtn").html("审核中");
							$(".confirmbtn").css("background-color","#ccc");
							$(".confirmbtn").show();
						}else if(shenhestate == "04"){//审核失败
							if(customerBasic.status != "0"){//0:离职，1：在职
								$(".reviewFalse").show();
							}
							$(".confirmbtn").html("重新提交审核资料");
							
							$(".confirmbtn").show();
							$(".confirmbtn").unbind("tap").bind("tap",function(){
								var sendData = {
										"openId":openId,
										"name":name,
										"ID":ID,
										"phone":phone,
										"flag":"1",
										"customerId":customerId,
										"wxchannel":wxchannel
								}
								var jsonStr = UrlEncode(JSON.stringify(sendData));
								window.location.href="agentInfoRegister.html?jsonKey=" + jsonStr;
							})
						}
				} 
				}
				if(roletype == "02" || roletype == "06" ){//代理人
					$(".touxiang_job").html("代理人");
					
					$(".baseInfo").show();
					$(".agentInfo").show();
					$(".bankCardInfo").show();
				}
				if(roletype == "03"){//白名单，客户经理
					$(".touxiang_job").html("客户经理");
					$(".baseInfo").show();
					$(".agentInfo").show();
					$(".practicingId").hide();
					$(".agentRightImg").hide();
				}
				if(roletype == "04"){//黑名单，内勤
					$(".touxiang_job").html("佰盈内勤");
					$(".baseInfo").show();
				}
				if(roletype == "05"){
					$(".touxiang_job").html("团队人员");
					$(".baseInfo").show();
				}
//			}else{
//				modelAlert("获取客户基本信息失败")
//			}			
		
	}else{
		modelAlert("获取客户信息失败！");
		return false;
	}
}

function setscroll() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#order_index").height(Scrollheight);
	mui("#order_index").scroll();
}

