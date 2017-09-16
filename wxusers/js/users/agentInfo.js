var parm = "";
var openId = "";
var name = "";
var ID = "";
var phone = "";
var customerId = "";

$(function(){	
	var str = getUrlQueryString("jsonKey");
	str = UrlDecode(str);
	parm = JSON.parse(str);
	
	/*var parm={
			"openId":"oVF3kw0wutUt7bD8p56usyqNuljQ",
			"name":"沙也",
			"ID":"123456789009876543",
			"phone":"18012020814",
			"customerId":"999"
	}*/
	openId = parm.openId;
	name = parm.name;
	ID = parm.ID;
	phone = parm.phone;
	customerId = parm.customerId;

	$.init();
	
	$(".h_back").unbind("tap").bind("tap",function(){
		window.location.href="personal.html?openid="+openId;
	})
	//我要离职
	$(".lizhi").unbind("tap").bind("tap",function(){
		window.location.href = "dimission.html?jsonKey="+getUrlQueryString("jsonKey");
	})
	
	$.setscroll();

})

$.init = function(){
	var url = base.url + "registerUser/agentQuery.do";
	
	var reqData = {
			"head":{
				
			},"body":{
				"mobile":phone,
				"customerId":customerId
			}
	}
	//console.log(reqData);
	$.reqAjaxs(url,reqData,$.InfocallBack);
}

$.InfocallBack = function(data){
	//console.log(data);
	parm = data.returns.bxWxAgent;
	if(data.statusCode == "000000"){
		if(parm != "" && parm != null){
			
			var mobile = phone.substr(0,3)+"****"+phone.substr(7,11);
			var idNo = ID.substr(0,4)+"**********"+ID.substr(14,18);
			var bankCardNo = parm.certificateCode.substr(0,4)+"********"+parm.certificateCode.substr(parm.certificateCode.length-4);
			
			//支行特殊处理
			//（若有（），则截取（左边的字符串，截取后若开户行少于12个字符，全显示，否则截取后12个，前面加...拼接）
			var kaihuhang = parm.bankSubName;
			if(kaihuhang != null && kaihuhang != ""){
				
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
			
			$("#name_input").val(name);//姓名
			$("#phone_input").val(mobile);//手机号	
			$("#id_input").val(idNo);//身份证
			$("#introducer_input").val(parm.recommendAgentCode);//推荐人工号
			$("#jobarea_input").val(parm.workProvinceName + parm.workCityName);//入职地区	
			$("#education_input").val(parm.education);//学历
			$("#nation_input").val(parm.nation);//民族
			$("#politics_input").val(parm.politicalLandscape);//政治面貌	
			$("#practicingId_input").val(parm.practiceCode);//执业证编号
			$("#salesmanNo_input").val(parm.agentCode);//业务员代码
			$("#bankname_input").val(parm.bankName);//开户银行
			
			$("#bankquyu_input").val(parm.bankPrivinceName+" "+parm.bankCityName);//开户行所属区域
			$("#zhihang_input").val(kaihuhang);//支行名称
			$("#bankcardNo_input").val(bankCardNo);//银行卡号
		}else{
			modelAlert("获取代理人信息失败！");
			return false;
		}
	}else{
		modelAlert("获取代理人信息失败！");
		return false;
	}
}


/* 设置滑动区域 */
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#order_index").height(Scrollheight + "px");
	mui("#order_index").scroll();
};