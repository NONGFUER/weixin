var parm = "";
var openId = "";
var name = "";
var ID = "";
var phone = "";
var flag = ""; //1:审核失败,信息带入，2：重新填写，无信息带入
var customerId = "";
var proviceName = "";
var cityName = "";
var proviceCode = "";
var cityCode = "";
var teamName = "";
var teamCode = "";
var agentId = "";//机构代码
var bankCode = "";
var bankshengCode = "";
var bankshiCode = "";
var zhihangCode = "";
var shengshi = {};//从后台获取的省市信息
var recommendAgentName = '';
var recommendAgentMobile = '';
var recommendAgentIdNo = '';
$(function(){
	var str = getUrlQueryString("jsonKey");
	str = UrlDecode(str);
	parm = JSON.parse(str);
	
	/*parm={
			"openId":"1",
			"name":"沙也",
			"ID":"123456789009876543",
			"phone":"15721114668",
			"flag":"1",
			"customerId":"787"
	}*/
	openId = parm.openId;
	name = parm.name;
	ID = parm.ID;
	phone = parm.phone;
	flag = parm.flag;
	customerId = parm.customerId;

	$.init();
	
	//点击出来可选下拉框
	openDicMuiList("education_input", "bx_education", "", true);//学历
	
	openDicMuiList("nation_input", "bx_nation", "", true);//民族
		
	openDicMuiList("politics_input", "bx_politics", "", true);//政治面貌
		
	/*openDicMuiList("bankname_input", "bx_gzh_bank", "", true);//开户银行*/
	
	//入职地区填写提示（入职地区是根据推荐人工号带出来的）一期先不上
	/*$("#jobarea_input").unbind("tap").bind("tap",function(){
		if($("#introducer_input").val() == "" || $("#introducer_input").val() == null ||  $("#introducer_input").val() == "请选择"){
			modelAlert("请先输入推荐人工号，入职地区会自动带出");
		}else{
			modelAlert("请重新输入推荐人工号，入职地区会自动带出");
		}
	})*/
	
	//获取开户银行名称列表信息
	$.getbanknameList();
	
	//开户行不为空或改变时，获取省市信息
	if($("#bankname_input").attr("name") != "" && $("#bankname_input").attr("name") != null){
		getbankquyuList();
	}
	$("#bankname_input").change(function(){
		if($("#bankname_input").attr("name") != "" && $("#bankname_input").attr("name") != null){
			getbankquyuList();
		}
	})
	
	//银行所属区域不为空或改变时，获取开户支行
	if($("#bankquyu_input").attr("name") != "" && $("#bankquyu_input").attr("name") != null){
		getzhihangList();
	}
	$("#bankquyu_input").change(function(){
		if($("#bankquyu_input").attr("name") != "" && $("#bankquyu_input").attr("name") != null){
			getzhihangList();
		}
	})
	
	//控制先选银行、区域、支行顺序
	$("#bankquyu_input").unbind("tap").bind("tap",function(){
		var bankCode=$("#bankname_input").attr("name");
		if(bankCode == "" || bankCode == null){
			modelAlert("请先选择开户银行");
		}
	})
	$("#zhihang_input").unbind("tap").bind("tap",function(){
		var shengCode=$("#bankquyu_input").attr("bankPrivinceCode");
		if(shengCode == "" || shengCode == null){
			modelAlert("请先选择开户行所属区域");
		}
	})
	$("bankcardNo_input").unbind("tap").bind("tap",function(){
		var zhihangName=$("#zhihang_input").attr("name");
		if(zhihangName == "" || zhihangName == null){
			modelAlert("请先选择支行名称");
		}
	})
	
	
	//返回换为关闭按钮，不进行返回操作，点击后直接回到微信首页面
	$(".h_back").unbind("tap").bind("tap",function(){
		/*var sendData = {
				"openId":openId,
				"name":name,
				"ID":ID,
				"phone":phone,
				"fromFlag":"3",//1代表是从代理人信息填写返回到答题引导页的
				"flag":flag
		}
		console.log(sendData);
		var jsonKey = UrlEncode(JSON.stringify(sendData));
		window.location.href = "agentapply.html?jsonKey=" + jsonKey;*/
		//返回微信首页面
		WeixinJSBridge.call('closeWindow');
	})
	
	$(".confirmbtn").unbind("tap").bind("tap",function(){
		if($.checkInfo() == true){
			$.saveAgentInfo();
		}		
	})
	
	$.setscroll();
})

$.init = function(){
	if(flag != "1"){//2：首次填写，无信息带入
		$("#name_input").val(name);
		$("#phone_input").val(phone);
		$("#id_input").val(ID);
		$("#introducer_input").val("请填写").css("color", "#ccc");
		$("#jobarea_input").val("请选择").css("color", "#ccc");
		$("#education_input").val("请选择").css("color", "#ccc");
		$("#right_value").val("请选择").css("color", "#ccc");
		$("#nation_input").val("请选择").css("color", "#ccc");
		$("#politics_input").val("请选择").css("color", "#ccc");
		$("#bankname_input").val("请选择").css("color", "#ccc");
		
		$("#bankquyu_input").val("请选择").css("color", "#ccc");
		//$("#shi_input").val("请选择").css("color", "#ccc");
		$("#zhihang_input").val("请选择").css("color", "#ccc");
		
		$("#bankcardNo_input").val("请输入银行卡号").css("color", "#ccc");
		
		$.replacePlaceholder($("#introducer_input"),"请填写");
		$.replacePlaceholder($("#bankcardNo_input"),"请输入银行卡号");
	}else{//1:审核失败,影像录入返回，信息带入
		var url = base.url + "registerUser/agentQuery.do";
		var reqData = {
				"head":{
					
				},"body":{
					"mobile":phone,
					"type":"1",
					"customerId":customerId
				}
		}
		$.reqAjaxs(url,reqData,$.InfocallBack);
	}
}

$.InfocallBack = function(data){
	//console.log(data);
	var param = data.returns.bxWxAgent;
	agentId = param.agentId;
	var educationCode = param.education.split(",")[0];
	var educationName = param.education.split(",")[1];
	var nationCode = param.nation.split(",")[0];
	var nationName = param.nation.split(",")[1];
	var politicalLandscapeCode = param.politicalLandscape.split(",")[0];
	var politicalLandscapeName = param.politicalLandscape.split(",")[1];
	proviceName = param.workProvinceName;
	proviceCode = param.workProvinceCode;
	cityName = param.workCityName;
	cityCode = param.workCityCode;
	teamName = param.teanName;
	teamCode = param.teamCode;
	/*bankCode = param.bankCode;
	bankshengCode = param.bankPrivinceName;
	bankshiCode = param.bankCityName;
	zhihangCode = param.bankSubName;*/
	zhihangCode = param.bankSubCode
	if(data.statusCode == "000000"){
		$("#name_input").val(name);//姓名
		$("#phone_input").val(phone);//手机号	
		$("#id_input").val(ID);//身份证
		$("#introducer_input").val(param.recommendAgentCode);//推荐人工号
		var url = base.url + "wxBatch/wxWhite.do";
		var introducerCode = $("#introducer_input").val();
		if(introducerCode != null && introducerCode != ""){
			var reqData = {
					"head":{
						"channel":"01",
						"userCode":phone,
						"transTime":""
					},"body":{
						"recommendId":introducerCode
					}
			}						
			$.reqAjaxs(url,reqData,function(data){
				if(data.statusCode == "000000"){
					if(data.returns != null && data.returns != ""){
						recommendAgentName = data.returns.searchCoreReposeDto.recommendAgentName;
			            recommendAgentMobile = data.returns.searchCoreReposeDto.recommendAgentMobile;
			            recommendAgentIdNo = data.returns.searchCoreReposeDto.recommendAgentIdNo;
					}
				}else if(data.statusCode == "000001"){
					modelAlert("该推荐人非佰盈客户经理，请重新输入！");
					$("#jobarea_input").val(' ');
					return false;
				}else{
					modelAlert("根据推荐人工号获取入职地区错误！");
					$("#jobarea_input").val(' ');
					return false;
				}	
			});
		}	
		$("#jobarea_input").val(param.workProvinceName + param.workCityName);//入职地区	
		$("#education_input").val(educationName);//学历
		$("#education_input").attr("name",educationCode);//学历代码
		$("#nation_input").val(nationName);//民族
		$("#nation_input").attr("name",nationCode);//民族代码
		$("#politics_input").val(politicalLandscapeName);//政治面貌
		$("#politics_input").attr("name",politicalLandscapeCode);//政治面貌代码
		$("#bankname_input").val(param.bankName);//开户银行名称
		$("#bankname_input").attr("name",param.bankCode);
		if(param.bankCode != null && param.bankCode != ""){
			getbankquyuList();
		}
		$("#bankquyu_input").val(param.bankPrivinceName+" "+param.bankCityName);//所属区域
		$("#bankquyu_input").attr("bankPrivinceName",param.bankPrivinceName);//所属省
		$("#bankquyu_input").attr("bankPrivinceCode",param.bankPrivinceCode);
		$("#bankquyu_input").attr("bankCityName",param.bankCityName);//所属市
		$("#bankquyu_input").attr("bankCityCode",param.bankCityCode);
		if(param.bankCode != null && param.bankCode != "" && param.bankPrivinceCode != null && param.bankPrivinceCode != ""&& param.bankCityCode != null && param.bankCityCode != ""){
			getzhihangList();
		}
		$("#zhihang_input").val(param.bankSubName);//支行名称
		$("#zhihang_input").attr("name",zhihangCode);
		$("#bankcardNo_input").val(param.certificateCode);//银行卡号
	}
}

function getJobarea(){
	//每次调用根据推荐人工号获取入职地区接口前，进行初始化
	proviceName = "";
	proviceCode = "";
	cityName = "";
	cityCode = "";
	teamName = "";
	teamCode = "";
	$("#jobarea_input").val("");
	
	var url = base.url + "wxBatch/wxWhite.do";
	var introducer = $("#introducer_input").val();
	if(introducer != null && introducer != ""){
		var reqData = {
				"head":{
					"channel":"01",
					"userCode":"2835",
					"transTime":""
				},"body":{
					"recommendId":introducer
				}
		}
		
		//$("#jobarea_input").val("江苏邳州");
		
		$.reqAjaxs(url,reqData,$.getJobareaCallback);
	}	
}
$.getJobareaCallback = function(data){
	if(data.statusCode == "000000"){
		if(data.returns != null && data.returns != ""){
		    recommendAgentName = data.returns.searchCoreReposeDto.recommendAgentName;
            recommendAgentMobile = data.returns.searchCoreReposeDto.recommendAgentMobile;
            recommendAgentIdNo = data.returns.searchCoreReposeDto.recommendAgentIdNo;
			proviceName = data.returns.searchCoreReposeDto.proviceName;
			proviceCode = data.returns.searchCoreReposeDto.proviceId;
			cityName = data.returns.searchCoreReposeDto.cityName;
			cityCode = data.returns.searchCoreReposeDto.cityCode;
			teamName = data.returns.searchCoreReposeDto.TeamName;
			teamCode = data.returns.searchCoreReposeDto.TeamCode;
			agentId = data.returns.searchCoreReposeDto.ComCode;//机构代码
			if(cityName == "" || cityName == null){
				$("#jobarea_input").val(proviceName);
			}else{
				$("#jobarea_input").val(proviceName+cityName);
			}
		}else{
			modelAlert("根据推荐人工号获取入职地区错误！");
			return false;
		}
	}else if(data.statusCode == "000001"){
		modelAlert("该推荐人非佰盈客户经理，请重新输入！");
		return false;
	}else{
		modelAlert("根据推荐人工号获取入职地区错误！");
		return false;
	}	
}

//获取开户行名称列表
$.getbanknameList = function(){
	var url = base.url+"bank/bankList.do";
	var sendData = {
			"head":{
				"userCode":"",
				"transTime":$.getTimeStr(),
				"channel":"1"	
			},"body":{
					
			}
	}
	$.reqAjaxs(url,sendData,$.banknameBack);
}
$.banknameBack = function(data){
	//console.log(data);
	if(data.statusCode == "000000"){
		$("#bankname_input").unbind("tap").bind("tap",function(){
			var paramlist = data.returns.bankList;
			var selectPicker = new mui.PopPicker();
			
			selectPicker.setData(paramlist);
			var selectResult = document.getElementById("bankname_input");
			selectPicker.show(function(items) {
				selectResult.value = items[0].text;
				selectResult.style.color = "#585858";
				selectResult.name = items[0].value;
				getbankquyuList();
			})
		})
		
		
	}else{
		modelAlert("获取开户行列表失败");
	}
	
}


//获取开户行所属区域信息
function getbankquyuList(){
	var url = base.url + "bank/provinceCitys.do";
	bankCode = $("#bankname_input").attr("name");
	var sendData = {
			"head":{
				"userCode":"",
				"transTime":$.getTimeStr(),
				"channel":"1"
			},"body":{
				"bankCode":bankCode
			}
	}
	//console.log(sendData);
	$.reqAjaxs(url,sendData,$.bankquyuBack);
	
}
$.bankquyuBack = function(data){
	//console.log(data);
	if(data.statusCode == "000000"){
		if(data.returns.provinceCitys != "" && data.returns.provinceCitys != null){
			$("#bankquyu_input").unbind("tap").bind("tap",function(){
				var bankCode=$("#bankname_input").attr("name");
				if(bankCode == "" || bankCode == null){
					modelAlert("请先选择开户银行");
					return false;
				}
				
				var bankquyuPicker = new mui.PopPicker({layer:2});
				bankquyuPicker.setData(data.returns.provinceCitys);
				bankquyuPicker.show(function(items) {
					$("#bankquyu_input").attr("bankPrivinceCode",items[0].value).attr("bankPrivinceName",items[0].text).attr("bankCityCode",items[1].value).attr("bankCityName",items[1].text).val(items[0].text+" "+items[1].text).css("color","#585858");
					getzhihangList();
				});
			})
		}else{
			modelAlert("获取省市列表失败,为空");
		}	
	}else{
		modelAlert("获取省市列表失败");
	}
}

//获取支行信息
function getzhihangList(){
	var url = base.url+"bank/bankSubs.do";
	bankCode = $("#bankname_input").attr("name");
	bankshengCode = $("#bankquyu_input").attr("bankPrivinceCode");
	bankshiCode = $("#bankquyu_input").attr("bankCityCode");
	var sendData = {
			"head":{
				"userCode":"",
				"transTime":$.getTimeStr(),
				"channel":"1"
			},"body":{
				"bankCode":bankCode,
				"bankProvinceCode":bankshengCode,
				"bankCityCode":bankshiCode
			}
	}
	//console.log(sendData);
	$.reqAjaxs(url,sendData,$.zhihangBack);
}
$.zhihangBack = function(data){
	//console.log(data);
	if(data.statusCode == "000000"){
		if(data.returns.bankSubs != "" && data.returns.bankSubs != null){
			$("#zhihang_input").unbind("tap").bind("tap",function(){
				var paramlist = data.returns.bankSubs;
				var selectPicker = new mui.PopPicker();
				
				selectPicker.setData(paramlist);
				var selectResult = document.getElementById("zhihang_input");
				selectPicker.show(function(items) {
					selectResult.value = items[0].text;
					selectResult.style.color = "#585858";
					selectResult.name = items[0].value;
				})
			})
		}else{
			modelAlert("获取支行列表失败！为空");
		}
		
	}else{
		modelAlert("获取支行列表失败！");
	}
}


$.saveAgentInfo = function(){
	url = base.url + "identificationControl/saveWxAgent.do";
	//url = "http://192.168.0.103:80/tongdaoPlatform/identificationControl/saveWxAgent.do";
	bankCode = $("#bankname_input").attr("name");
	bankshengCode = $("#bankquyu_input").attr("bankPrivinceCode");
	bankshiCode = $("#bankquyu_input").attr("bankCityCode");
	zhihangCode = $("#zhihang_input").attr("name");
	var bankName = $("#bankname_input").attr("value");
	var bankshengName=$("#bankquyu_input").attr("bankPrivinceName");
	var bankshiName=$("#bankquyu_input").attr("bankCityName");
	var zhihangName=$("#zhihang_input").attr("value");
	var introduceCode = $("#introducer_input").val();
		introduceCode = introduceCode.toLocaleUpperCase();
	reqData = {
			"head":{
				"channel": "01",
		        "userCode": phone,
		        "transTime": ""
			},"body":{
				"mobile":$("#phone_input").val(),
				"recommendAgentCode":introduceCode,//推荐人工号
				"workProvinceCode":proviceCode,
				"workProvinceName":proviceName,
				"workCityCode":cityCode,
				"workCityName":cityName,
				"agentId":agentId,//机构编码				
				"teamCode":teamCode,//归属团队代码
				"teamName":teamName,//归属团队名称
				"nation":$("#nation_input").attr("name"),//民族
				"education":$("#education_input").attr("name"),//学历
				"politicalLandscape":$("#politics_input").attr("name"),//政治面貌
				
				"bankCode":bankCode,
				"bankName":bankName,
				"bankPrivinceCode":bankshengCode,//开户银行所在省代码
				"bankPrivinceName":bankshengName, //开户银行所在省名称
				"bankCityCode":bankshiCode, //开户银行所在市代码
				"bankCityName":bankshiName, //开户银行所在市名称
				"bankSubCode":zhihangCode, //开户行代码
				"bankSubName":zhihangName, //开户行名称
				"certificateCode":$("#bankcardNo_input").val(),
				"recommendAgentIdNo":recommendAgentIdNo,
				"recommendAgentName":recommendAgentName,
				"recommendAgentMobile":recommendAgentMobile
			} 
	}
	//console.log(reqData);
	$.reqAjaxs(url,reqData,function(data){
		if(data.statusCode == "000000"){
		window.location.href="addImage.html?jsonKey="+getUrlQueryString("jsonKey");
		}
	})
}
//提交前验证
$.checkInfo = function(){
	if($("#jobarea_input").val() == "请选择" || $("#jobarea_input").val() == "" || $("#introducer_input").val() == "请填写" ||$("#introducer_input").val() == ""){
		modelAlert("请输入推荐人工号，如有疑问可联系客服4006895505");
		return false;
	}
	if($("#education_input").val() == "请选择" || $("#education_input").val() == ""){
		modelAlert("请选择学历");
		return false;
	}
	if($("#nation_input").val() == "请选择" || $("#nation_input").val() == ""){
		modelAlert("请选择民族");
		return false;
	}
	if($("#politics_input").val() == "请选择" || $("#politics_input").val() == ""){
		modelAlert("请选择政治面貌");
		return false;
	}
	if($("#bankname_input").attr("name") == null || $("#bankname_input").attr("name") == ""){
		modelAlert("请选择开户行信息");
		return false;
	}
	if($("#bankquyu_input").attr("bankPrivinceCode") == null || $("#bankquyu_input").attr("bankPrivinceCode") == ""){
		modelAlert("请选择开户行所属区域");
		return false;
	}
	if($("#zhihang_input").attr("name") == "请选择" || $("#zhihang_input").attr("name") == ""){
		modelAlert("请选择支行名称");
		return false;
	}
	if($("#bankcardNo_input").val() == "请输入银行卡号" || $("#bankcardNo_input").val() == ""){
		modelAlert("请输入银行卡号");
		return false;
	}
	return true;
}

//设置页面显示的option内容为选中状态
function xuanzhong(id,value){
	var select = document.getElementById(id);  
	var value = value;  
	for(var i=0; i<select.options.length; i++){  
	    if(select.options[i].innerHTML == value){  
	        select.options[i].selected = true;  
	        break;  
	    }  
	}
}


/* 设置滑动区域 */
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#order_index").height(Scrollheight + "px");
	mui("#order_index").scroll();
};
