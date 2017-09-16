var currentAddressId = "";// 当前页面的收件人地址 的 ID
var receiverInfo = ""; // 收件人信息
var bdpFlagg = "0"; // 是否为默认；2是0否
var cxDistribution = {};
var parm;
$(function() {
	var str = window.location.search;
	str = str.substr(9, str.length);
	str = UrlDecode(str);
	parm = JSON.parse(str);
	currentAddressId = parm.body.addressId;
	receiverInfo = parm.body.addressInfo;
	//默认地址选择操作
	$.deFlagSelect();
	//渲染数据
	fillBlanks(receiverInfo);
	// 返回操作
	$(".h_back").on("tap",function() {
		var jsonStr = JSON.stringify(parm);
		jsonStr = UrlEncode(jsonStr); // 加密过后的操作
		window.location.href = "policyDeliveryAddress.html?jsonStr=" + jsonStr;
	});
	// 手机号码校验
	$("#recipient_phone_input2").blur(function() {
		if ($.isNull($("#recipient_phone_input2").val())|| $("#recipient_phone_input2").val() == "请输入收件人手机号") {
			return false;
		} else if (tit.regExp.isMobile($("#recipient_phone_input2").val()) == false) {
			modelAlert("请输入正确的手机号码！");
			return false;
		}
	})
     
	
	// 姓名校验
	$("#recipient_name_input2").blur(function() {
		if ($.isNull($("#recipient_name_input2").val())|| $("#recipient_name_input2").val() == "请输入收件人姓名") {
			return false;
		} else if (tit.regExp.isChinese($("#recipient_name_input2").val()) == false) {
			modelAlert("收件人姓名必须为汉字！");
			return false;
		}
	});
});

//默认地址选择操作
$.deFlagSelect = function() { 
	  $(".switch_choose span").unbind("tap").bind("tap",function() { 
		  var index = $(".switch_choose span").index($(this)); 
		  if(index == 1){//选中默认
			  $(".switch_choose span").eq(index).removeClass( "policyholder_info_sex_unselected").addClass(
			  "policyholder_info_sex_selected").siblings().removeClass("policyholder_info_sex_selected").addClass("policyholder_info_sex_unselected");
			  $(".switch_choose").removeClass( "switch_choose_unselected").addClass(
			  "switch_choose_selected");
		  }else{
			  $(".switch_choose span").eq(index).removeClass( "policyholder_info_sex_unselected").addClass(
			  "policyholder_info_sex_selected").siblings().removeClass("policyholder_info_sex_selected").addClass("policyholder_info_sex_unselected");
			  $(".switch_choose").removeClass( "switch_choose_selected").addClass(
			  "switch_choose_unselected");
		  }
		  

    if ($(".switch_choose span:nth-of-type(1)") .attr("class") == "policyholder_info_sex_selected") { 
	      bdpFlagg = "0";// 不默认地址
    } else { 
	      bdpFlagg = "2";// 选择默认
    }; 
  }); 

};

// 显示数据
function fillBlanks(receiverInfo) {
	var policysid = receiverInfo.id;
	$("#policyid").val(policysid);
	$("#recipient_name_input2").val(receiverInfo.receivername);// 收件人
	$("#recipient_phone_input2").val(receiverInfo.receiverphoneno);// 收件人手机号
	$("#recipient_address_input2").val(receiverInfo.address);// 详细地址
	var cityInfo = receiverInfo.province;
	$("#recipient_city_input2").val(cityInfo);// 省
	// 若默认地址选中标志不为空，则渲染选中状态
	if(receiverInfo.defaultflag != null){
		bdpFlagg = receiverInfo.defaultflag;
		if(receiverInfo.defaultflag == "2"){// 是默认地址
			$(".switch_choose span").eq(1).removeClass( "policyholder_info_sex_unselected").addClass(
			  "policyholder_info_sex_selected").siblings().removeClass("policyholder_info_sex_selected").addClass("policyholder_info_sex_unselected");
			  $(".switch_choose").removeClass( "switch_choose_unselected").addClass(
			  "switch_choose_selected");
		}else{
			$(".switch_choose span").eq(0).removeClass( "policyholder_info_sex_unselected").addClass(
			  "policyholder_info_sex_selected").siblings().removeClass("policyholder_info_sex_selected").addClass("policyholder_info_sex_unselected");
			  $(".switch_choose").removeClass( "switch_choose_selected").addClass(
			  "switch_choose_unselected");
		}
	}

	$("#recipient_city_input2").bind("tap",function() {
		$.poppicker3("recipient_city_input2", cityData3, "input");
	});
		$("#h_next").show();
		// 保存事件
		$("#submitorder").on("tap",function() {
			updateData();
		});
	// 默认地址
	$("input").css("color", "#585858");
}

// 保存修改
function updateData() {
	$("#recipient_name_input2,#recipient_phone_input2").unbind("blur")
	// 对输入框进行校验
	var recipient_name_input = $("#recipient_name_input2").val(); // 收件人姓名
	var recipient_phone_input = $("#recipient_phone_input2").val(); // 收件人手机号
	var recipient_address_input = $("#recipient_address_input2").val(); // 具体收件地址
	var sheng = $("#recipient_city_input2").val();// 配送省份区

	// 判断非空
	if ($.isNull(recipient_name_input) || recipient_name_input == "请输入收件人姓名") {
		modelAlert("请输入收件人姓名！");
		return false;
	}else if (tit.regExp.isChinese(recipient_name_input) == false) {
		modelAlert("收件人姓名必须为汉字！");
		return false;
	};
	if ($.isNull(recipient_phone_input) || recipient_phone_input == "请输入收件人手机号") {
		modelAlert("请输入收件人手机号！");
		return false;
	}
	// 收件人手机号验证
	if (tit.regExp.isMobile(recipient_phone_input) == false) {
		modelAlert("请输入合法的手机号码！");
		return false;
	}
	if ($.isNull(sheng) || sheng == "请选择城市") {
		modelAlert("请选择城市！");
		return false;
	}
	if ($.isStringNull(recipient_address_input)
			|| recipient_address_input == "请输入具体收件地址") {
		modelAlert("请输入具体收件地址！");
		return false;
	}
	// 取值
	cxDistribution.id = $("#policyid").val();
	cxDistribution.username = parm.head.userName;
	cxDistribution.receivername = $("#recipient_name_input2").val(); // 收件人姓名
	cxDistribution.receiverphoneno = $("#recipient_phone_input2").val(); // 收件人手机号
	cxDistribution.address = $("#recipient_address_input2").val(); // 具体收件地址
	cxDistribution.province = $("#recipient_city_input2").val();// 配送省份
	// 默认地址取值
	if ($(".switch_choose span:nth-of-type(1)").attr("class") == "policyholder_info_sex_selected") {
		cxDistribution.defaultflag = "0"; // 非默认地址
	} else {
		cxDistribution.defaultflag = "2"; // 默认地址
	};
	var data = {
		"cxDistribution" : cxDistribution
	};
	var url = base.url + "distribution/UpDistribution.shtml";
	$.toAjaxs(url, data, $.updeletedataback);
}
// 编辑回调
$.updeletedataback = function(param) {
	// 跳转页面前提示保存成功
	var data = JSON.parse(param);
	if (data.status.statusCode == "000000") {
		// 跳转页面前提示保存成功
		modelAlert(data.status.statusMessage,"",updelePage);
	} else {
		modelAlert(data.status.statusMessage);
	}
};
//回调函数跳转页面
function updelePage(){
	var jsonStr = JSON.stringify(parm);
	jsonStr = UrlEncode(jsonStr); // 加密过后的操作
	window.location.href = "policyDeliveryAddress.html?jsonStr=" + jsonStr;
}


/* 设置滑动区域 */
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#insure_index").height(Scrollheight);
	mui("#insure_index").scroll();
};
