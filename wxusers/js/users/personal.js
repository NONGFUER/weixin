var parm;
var cheakRecognizeeFlag = true;
var openId = "";
var name = "";
var ID = "";
var phone = "";
var customerId = "";
var roletype;//用户类型:1-普通用户      2-代理人  3-白名单:客户经理  4-黑名单：佰盈内勤
var shenhestate = "00";//审核步骤：01考试完成，02基础信息已提交，03影像已上传，04认证失败，05认证通过'
var headImgUrl = "";
$(function() {
	openId = getUrlQueryString("openid");
	/*openId = "oVF3kw0wutUt7bD8p56usyqNuljQ";*/
	
	init();
	//点击切换账号，进入手机验证页面
	$(".change_account").unbind("tap").bind("tap",function(){
		window.location.href = "phoneValidate.html?openid="+openId+"&fromtype=3";
	})
	
	//点击返回图标，关闭当前页面，即进入微信公众号页面
	$(".h_back").unbind("tap").bind("tap",function(){
		WeixinJSBridge.call('closeWindow');
	})
	
	//点击代理人信息，进入代理人信息页面
	$(".agentHead").unbind("tap").bind("tap",function(){
		if(roletype == "2"){//只有代理人才能进入代理人信息页面，白名单不能进
			var sendData={
					"openId":openId,
					"name":name,
					"ID":ID,
					"phone":phone,
					"customerId":customerId
			}
			var jsonKey = UrlEncode(JSON.stringify(sendData));
			window.location.href = "agentInfo.html?jsonKey="+jsonKey;
		}		
	})
	
	/* 设置滑动区域 */
	setscroll();
})

function init(){
	//根据openId向后台查询用户信息
	var url = base.url + "registerUser/personalQuery.do";
	var reqData = {
			"head":{
				
			},"body":{
				"openId": openId
			}
		};
	$.reqAjaxs(url,reqData,$.infoCallBack);
	//$.infoCallBack();
		
}
$.infoCallBack = function(data){
	if(data != null && data != ""){
		if(data.statusCode == "000000"){
			
			parm = data.returns.allUserInforDto;
			
			/*parm = {
					"bxTdCustomerBasic":{
						"authTime": "2016-12-09 19:51:21",
						"createdDate": "2016-06-18 14:11:23",
						"customerSourceComment": "2",
						"email": "",
						"id": 2,
						"idAuth": "1",
						"idNo": "310109198001010086",
						"idType": "01",
						"igentState1": null,
						"igentState2": null,
						"inviterId": null,
						"leaveDate": null,
						"mobile": "13781911719",
						"modifiedDate": null,
						"name": "五月",
						"password": "62c8ad0a15d9d1ca38d5dee762a16e01",
						"sex": "2",
						"status": "1",
						"systemChannel": "06",
						"tjIdAuth": "1",
						"type": "2",
						"userImage": "http://wx.qlogo.cn/mmopen/gwYgia2fvOFZvZ4VRFH3JL13fGzuy6QB6YiayHs5nhcjWaD0waMMViaibPj80icp99dxUBnj57icWsqtzHWn9uqLzjvficOub4LiavuI/0",
						"userName": "13781911719"
					},
					"bxWxAgent":{
						"agentCode": "012030B0145",
						"agentId": "BY012030",
						"authTime": null,
						"bankCode": null,
						"bankName": "招商银行",
						"certificateCode": "6226096555840043",
						"bankPrivinceName": "江苏省",
						"bankCityName": "徐州市",
						"bankSubName":"草甸子草甸子草甸子草甸子支行（哈哈）",
						"createTime": "2016-12-15 10:15:06",
						"customerId": "323",
						"education": null,
						"entryTime": "2016-12-14 12:00:00",
						"id": 131,
						"mobile": "13781911719",
						"nation": "",
						"politicalLandscape": "",
						"practiceCode": null,
						"recommendAgentCode": "012030B0113",
						"remark": null,
						"teamCode": "BY012030T0111",
						"teamName": "深圳分公司营业部营销1区营销11部",
						"verfyAuth": "03",
						"verfyDescribe": "",
						"verfyState": "05",
						"workCityCode": "280023",
						"workCityName": "深圳",
						"workProvinceCode": "280000",
						"workProvinceName": "广东"
					}
			}*/
			
			
			if(parm.bxTdCustomerBasic != "" && parm.bxTdCustomerBasic != null){
				name = parm.bxTdCustomerBasic.name;
				ID = parm.bxTdCustomerBasic.idNo;
				phone = parm.bxTdCustomerBasic.mobile;
				customerId = parm.bxTdCustomerBasic.id+"";
				
				if(parm.bxTdCustomerBasic.userImage == "" || parm.bxTdCustomerBasic.userImage == null){
					headImgUrl = "../../image/morentouxiang.png";
				}else{
					headImgUrl = parm.bxTdCustomerBasic.userImage;
				}			
				roletype = parm.bxTdCustomerBasic.type;
				//console.log("用户类型："+roletype);
				//对手机号、身份证号进行中间隐藏，手机号前3后4，身份证号和银行卡号前4后4
				if(phone != null && ID != null){
					var mobile = phone.substr(0,3)+"****"+phone.substr(7,11);
					var idNo = ID.substr(0,4)+"**********"+ID.substr(14,18);
				}else{
					modelAlert("获取客户信息失败！");
					return false;
				}
				
				
				if(parm.bxWxAgent != null && parm.bxWxAgent != ""){
					
					//银行卡号关键信息隐藏处理
					if(parm.bxWxAgent.certificateCode != null && parm.bxWxAgent.certificateCode != ""){
						var bankCardNo = parm.bxWxAgent.certificateCode.substr(0,4)+"********"+parm.bxWxAgent.certificateCode.substr(parm.bxWxAgent.certificateCode.length-4);
					}else{
						var bankCardNo = "";
					}
					//审核状态获取
					if(parm.bxWxAgent.verfyState != "" && parm.bxWxAgent.verfyState != null){
						shenhestate = parm.bxWxAgent.verfyState;//审核状态
					}else{
						shenhestate = "00";//未申请
					}
					//console.log("审核状态："+shenhestate);
					//开户行处理
					//（若有（），则截取（左边的字符串，截取后若开户行少于12个字符，全显示，否则截取后12个，前面加...拼接）
					if(parm.bxWxAgent.bankSubName != null && parm.bxWxAgent.bankSubName != ""){
						var kaihuhang = parm.bxWxAgent.bankSubName;
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
					$(".falsereason").html(parm.bxWxAgent.remark);//审核失败原因
					$("#practicingId_input").val(parm.bxWxAgent.practiceCode);//执业证编号
					$("#salesmanNo_input").val(parm.bxWxAgent.agentCode);//业务员代码
					$("#bankName_input").val(parm.bxWxAgent.bankName);//开户银行
					$("#sheng_input").val(parm.bxWxAgent.bankPrivinceName);//所属省
					$("#shi_input").val(parm.bxWxAgent.bankCityName);//所属市
					$("#kaihuhang_input").val(kaihuhang);//银行开户行名称
					$("#bankCardNo_input").val(bankCardNo);//银行卡号
					$("#practicingId_input").val(parm.bxWxAgent.practiceCode);//执业证编号
					$("#salesmanNo_input").val(parm.bxWxAgent.agentCode);//业务员代码
				}
				
				$(".touxiangImg").attr("src",headImgUrl);
				$(".touxiang_name").html(name);//姓名	
				$("#id_input").val(idNo);//身份证
				$("#phone_input").val(mobile);//手机号
				
				
				//普通用户
				if(roletype == "1"){
					$(".touxiang_job").html("普通用户");
					$(".baseInfo").show();
					//未申请
					if(shenhestate == "00"){
						$("#load").show();
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
									"customerId":customerId
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
									"customerId":customerId
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
						if(parm.bxTdCustomerBasic.status != "0"){//0:离职，1：在职
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
									"customerId":customerId
							}
							var jsonStr = UrlEncode(JSON.stringify(sendData));
							window.location.href="agentInfoRegister.html?jsonKey=" + jsonStr;
						})
					}
				}else if(roletype == "2"){//代理人
					$(".touxiang_job").html("代理人");
					
					$(".baseInfo").show();
					$(".agentInfo").show();
					$(".bankCardInfo").show();
				}else if(roletype == "3"){//白名单，客户经理
					$(".touxiang_job").html("客户经理");
					$(".baseInfo").show();
					$(".agentInfo").show();
					$(".practicingId").hide();
					$(".agentRightImg").hide();
				}else if(roletype == "4"){//黑名单，内勤
					$(".touxiang_job").html("佰盈内勤");
					$(".baseInfo").show();
				}
			}else{
				modelAlert("获取客户基本信息失败")
			}			
		}else{
			modelAlert("获取客户信息失败！");
			return false;
		}
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

