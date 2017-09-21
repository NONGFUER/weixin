var parm = "";
var openId = "";
var name = "";
var ID = "";
var phone = "";
$(function(){
	var str = getUrlQueryString("jsonKey");
	str = UrlDecode(str);
	parm = JSON.parse(str);
	
	/*parm={
			"openId":"1",
			"name":"沙也",
			"ID":"123456789009876543",
			"phone":"15721114668"
	}*/
	openId = parm.openId;
	name = parm.name;
	ID = parm.ID;
	phone = parm.phone;
	customerId = parm.customerId;
	wxchannel = parm.wxchannel;
	//从上一个页面取值，渲染页面
	$("#name_input").val(parm.name+"");
	$("#phone_input").val(parm.phone+"");
	
	//点击填写代理人信息，进入代理人信息填写页面
	$(".confirmbtn").unbind("tap").bind("tap",function(){
		//点击开始考试，进入代理人考试页面
		var sendData = {
				"openId":openId,
				"name":name,
				"ID":ID,
				"phone":phone,
				"customerId":customerId
			}
			var jsonKey = UrlEncode(JSON.stringify(sendData));
			window.location.href = "dati.html?jsonKey=" + jsonKey;
		
	})
		
	//点击返回图标，返回上一页面
	$(".backindex").unbind("tap").bind("tap",function(){
			window.history.back();
	})
	
	//点击切换账号，跳转到手机验证页面
	$(".change_account").unbind("tap").bind("tap",function(){
		window.location.href = "phoneValidate.html??mobile=" + phone + "&roleType=01&customerId=" + customerId + "&openid=" + openId + "&wxchannel="+wxchannel;
	})
})