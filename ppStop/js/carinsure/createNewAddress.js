var province = "0";// province值为上级的代码，province=0时取全部省
var bdpFlagg = "0"; // 是否为默认；2是0否
var addressId = "";
var daifuFlag = "";
var currentAddressId = ""; // 当前页面的收件人地址 的 ID
// 取值
var cxDistribution = {};
var parm;
$(function() {
	/* 设置滑动区域 */
	$.setscroll();
	var str = window.location.search;
	str = str.substr(9, str.length);
	str = UrlDecode(str);
	parm = JSON.parse(str);
	daifuFlag = parm.body.addinfo;
	currentAddressId = parm.body.addressId;
	$("#recognizee_city_input").val(parm.body.inforCar.shengName+" "+parm.body.inforCar.cityName);
	// 保單配送地址的操作
	 $.loadDisAddress();
	//默认地址选择操作
	  $.deFlagSelect();
	// 返回按钮的操作
	$(".h_back").unbind("tap").bind("tap", function() {
			var jsonStr = JSON.stringify(parm);
			jsonStr = UrlEncode(jsonStr); // 加密过后的操作
			window.location.href = "policyDeliveryAddress.html?jsonStr=" + jsonStr;
	});

	// 输入框获得焦点时，清空提示内容
	$.replacePlaceholder($("#recipient_name_input"), "请输入收件人姓名");
	$.replacePlaceholder($("#recipient_phone_input"), "请输入收件人手机号");
	$.replacePlaceholder($("#recipient_address_input"), "详细地址(如门牌号等)");

	// 手机号码校验
	$("#recipient_phone_input").blur(function() {
		if ($.isNull($("#recipient_phone_input").val())
				|| $("#recipient_phone_input").val() == "请输入收件人手机号") {
			return false;
		} else if (tit.regExp.isMobile($("#recipient_phone_input").val()) == false) {
			modelAlert("请输入正确的手机号码！");
			return false;
		}
	});

	
	// 姓名校验
	$("#recipient_name_input").blur(function() {
		if ($.isNull($("#recipient_name_input").val())|| $("#recipient_name_input").val() == "请输入收件人姓名") {
			return false;
		} else if (tit.regExp.isChinese($("#recipient_name_input").val()) == false) {
			modelAlert("收件人姓名必须为汉字！");
			return false;
		}
	});
	// 确定按钮点击事件
	$("#confirm").unbind("tap").bind("tap",function() {
		$('#recipient_phone_input').unbind('blur');// 取消一个事件
		$('#recipient_name_input').unbind('blur');// 取消一个事件
		$('#recipient_address_input').unbind('blur');// 取消一个事件
		// 校验保单配送信息
		var recipient_name_input = $("#recipient_name_input").val(); // 收件人姓名
		var recipient_phone_input = $("#recipient_phone_input").val(); // 收件人手机号
		var recipient_address_input = $("#recipient_address_input").val(); // 具体收件地址
		var sheng = $("#recognizee_city_input").val();// 配送省份
		var shi = $("#shi").attr("name");// 配送城市
		var xian = $("#xian").attr("name");// 配送县区

		// 判断非空
		if ($.isNull(recipient_name_input)|| recipient_name_input == "请输入收件人姓名") {
			modelAlert("请输入收件人姓名！");
			return false;
		}else if (tit.regExp.isChinese(recipient_name_input) == false) {
			modelAlert("收件人姓名必须为汉字！");
			return false;
		};
		if ($.isNull(recipient_phone_input)|| recipient_phone_input == "请输入收件人手机号") {
			modelAlert("请输入收件人手机号！");
			return false;
		};
		// 收件人手机号验证
		if (tit.regExp.isMobile(recipient_phone_input) == false) {
			modelAlert("请输入合法的手机号码！");
			return false;
		};
		if ($.isNull(sheng) || sheng == "请选择城市") {
			modelAlert("请选择所在城市！");
			return false;
		};
		if ($.isStringNull(recipient_address_input)|| recipient_address_input == "详细地址(如门牌号等)") {
			modelAlert("请输入详细地址！");
			return false;
		};
		// 保存数据
		saveInfo();
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
 

// 保单配送地址选择模块初始化
$.loadDisAddress = function() {
	$("#recognizee_city_input").bind("tap",function() {
		$.poppicker3("recognizee_city_input", cityData3, "input");
	});
};


function saveInfo() {
	cxDistribution.id = addressId;
	cxDistribution.companycode = "000";
	cxDistribution.username = parm.head.userName;
	cxDistribution.receivername = $("#recipient_name_input").val(); // 收件人姓名
	cxDistribution.receiverphoneno = $("#recipient_phone_input").val(); // 收件人手机号
	cxDistribution.address = $("#recipient_address_input").val(); // 具体收件地址
	cxDistribution.province = $("#recognizee_city_input").val();// 配送省份
	cxDistribution.defaultflag = bdpFlagg; // 是否设置为默认值
	var data = {
		"cxDistribution" : cxDistribution
	};
	var url = base.url + "distribution/saveDistribution.shtml";
	$.toAjaxs(url, data, $.newCreateback);
}

// 跳转到“保单配送地址页面”
$.newCreateback = function(param) {
	var data = JSON.parse(param);
	if (data.status.statusCode == "000000") {
		// 跳转页面前提示保存成功
		daifuFlag='a';
		modelAlert(data.status.statusMessage,"",newCreateAdress);
	} else {
		modelAlert(data.status.statusMessage);
	}
};
//回调跳转到下一个页面
function newCreateAdress(){
	var backUrl = "policyDeliveryAddress.html";
	var jsonStr = JSON.stringify(parm);
	jsonStr = UrlEncode(jsonStr); // 加密过后的操作
	window.location.href = backUrl + "?" + "jsonStr=" + jsonStr;
}

/* 设置滑动区域 */
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#insure_index").height(Scrollheight);
	mui("#insure_index").scroll();
};
