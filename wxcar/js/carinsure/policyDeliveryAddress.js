var receivername = "";// 收件人
var receiverphoneno = "";// 收件人手机号
var recprovince = "";// 收件人所在省
var reccity = "";// 收件人所在市
var rectown = "";// 收件人所在县/区
var recaddress = "";// 收件人所在详细地址
var defaultflag = 0;// 默认地址 1为是，0为否
var paramstrarr = "";// 所有的地址
var recAddressId = "";
var gfbDistribution = "";
var currentAddressId = ""; // 当前页面的收件人地址 的 ID
var gfbDistribution = {};
var pAddressId = "";
var userId = "";
var loginflag = "";
var source = "";
var parm;
var del_this;
$(function() {
	/* 设置滑动区域 */
	$.setscroll();
	var str = window.location.search;
	str = str.substr(9, str.length);
	str = UrlDecode(str);
	parm = JSON.parse(str);
	currentAddressId = parm.body.addressId;
	pAddressId = parm.body.policyKeys;
	// 进入页面立即加载已有地址
	loadAddressList();
	// 返回操作
	$(".h_back").unbind("tap").bind("tap",function() {
		var jsonStr = JSON.stringify(parm);
		jsonStr = UrlEncode(jsonStr); // 加密过后的操作
		window.location.href = "quote.html?jsonStr=" + jsonStr;
	});

	// 新建地址
	$("#submitorder").unbind("tap").bind("tap",function() {
		var addinfo = "b";
		parm.body.addinfo=addinfo;
		var jsonStr = JSON.stringify(parm);
		jsonStr = UrlEncode(jsonStr); // 加密过后的操作
		window.location.href = "createNewAddress.html?jsonStr=" + jsonStr;
	});
});
// 加载已有地址
function loadAddressList() {
	var data = {
		"userName" : parm.head.userName,
		"companycode" : "0004"
	};
	var url = base.url + "distribution/getDistribution.shtml";
	$.toAjaxs(url, data, $.loadAddress);
}

// 将数据渲染到页面
$.loadAddress = function(param) {
	param = eval("(" + param + ")");
	if (param.status.statusCode == "000000") {
		if (param != null || param != "") {
			paramstrarr = param.gfbDistributionList;
			var content = document.createElement("ul");
			var str = "";
			for ( var j = 0; j < paramstrarr.length; j++) {
				var paramstr = paramstrarr[j];

				if (paramstr != null) {
					recAddressId = paramstr.id; // 收件人地址 的 ID
					receivername = paramstr.receivername; // 收件人
					receiverphoneno = paramstr.receiverphoneno; // 收件人手机号
					recprovince = paramstr.province; // 配送地址 省
					var reccityInfo = recprovince.replace(new RegExp(" ","g"),"");
					recaddress = paramstr.address; // 配送地址 详细地址
					defaultflag = paramstr.defaultflag; // 是否是默认地址

					// 展示收件人信息
					str += "<li class='border-1px-bottom' style='display:block;'>";
					//第一行：状态与操作
					str += "<div class='policyAdress_opr border-1px-bottom'>";
					//是否设置为默认
					str += "<div class='policyAdress_status'>";
					 if( defaultflag == 2){
					 str += "<div class='chooseIcon'><img alt='chooseImage' src='../../images/gouxuan2.png'></div><div class='address_default'>默认地址</div>";
					 }else{
					 str += "<div class='address_default' style='display:none'>默认地址</div>";
					 }
					 str += "</div>";
					//操作
					str += "<div class='policyAdress_modify'>";
                    str += "<div class='policyAdress_option toDelete'><input type='hidden' value='"+ recAddressId +"'><div class='deleteIcon'><img src='../../images/delete.png'/></div><span></span></div>";
                    str += "<div class='policyAdress_option toEdit'><input type='hidden' id='toEdit' value='"+j+"'><div class='modifyimg'><img src='../../images/alter.png'/></div><span></span></div>";
                    str += "</div>"
                    str += "<div class='clear'></div>";
					str += "</div>";

					//第二行：姓名与手机号
					str += "<div class='policyAdress_info'>"
						str += "<div class='policy_li_left border-1px-bottom' onclick='selectedAddress("
								+ j + ")'; ><div class='policy_left_top'>";

						str += "<div class='div_receiver_name'><span id='receiverName"
								+ j
								+ "' class='receiverName'>"
								+ receivername
								+ "</span>"
								+ "<input type='hidden' class='currentId' value="
								+ recAddressId + "></div>";

						str += "<div class='div_receiver_phone'><span id='receiverPhone"
								+ j
								+ "' class='receiverPhone'>"
								+ receiverphoneno + "</span></div></div>";
	                    str += "<div class='clear'></div>";
						 //是否设置为默认
											
	                    str += "</div>";
					// onclick 就是这一条的事件
	                //第三行：地址
					str += "<div class='policyAdress_info'>"
					str += "<div class='policy_li_left' onclick='selectedAddress("
							+ j + ")'; >";

                    str += "<div class='clear'></div>";
                  
					str += "<div class=policy_left_bottom>";
					 //是否设置为默认
										
					str += "<span title='" + paramstr.province + "' title1='"
							+ paramstr.city + "' title2='" + paramstr.town
							+ "' title3='" + paramstr.address
							+ "' id='receiverAddress" + j
							+ "' class='receiverAddress'>" + reccityInfo + recaddress
							+ "</span></div></div>";
                    str += "</div>";
					str += "<div class='clear'></div>";
                    str += "</li>";
				}
			}
			$(content).html(str);
			$("#policy_info").append(content);
            //点击编辑
			toEdit();
			toDelete();
		} else {
			// 没有地址，报错
			modelAlert("查询数据库错误")
		}
	} else {
		modelAlert(param.status.statusMessage);
	}
};

// 编辑按钮
function toEdit() {
	$(".toEdit").unbind("tap").bind("tap",function() {
		var num = $(this).find("input").val();
		var addressInfo = paramstrarr[num];// 存放收件人信息
		parm.body.addressInfo=addressInfo;
		parm.body.addressId=currentAddressId;
		var jsonStr = JSON.stringify(parm);
		jsonStr = UrlEncode(jsonStr); // 加密过后的操作
		window.location.href = "editAddress.html?jsonStr=" + jsonStr;
	})
}

function toDelete(){
	$(".toDelete").unbind("tap").bind("tap",function() {
		del_this=this
		var num = $(this).find("input").val();
		gfbDistribution.id = num;
		var data = {
			"cxDistribution" : gfbDistribution
		};
		var url = base.url + "distribution/delDistribution.shtml";
		$.toAjaxs(url, data, $.updeletedataback);

	})
}

//删除回调
$.updeletedataback = function(param) {
	// 跳转页面前提示删除成功
	var data = JSON.parse(param);
	if (data.status.statusCode == "000000") {
		// 跳转页面前提示删除成功
		modelAlert("删除地址成功！","",function(){
			$(del_this).parents("li").remove()
		});
	} else {
		modelAlert(data.status.statusMessage);
	}
	
};

//回调函数跳转页面
function updelePage(){
	//刷新当前页面
	document.location.reload();
}

// 选择收件地址
function selectedAddress(num) {
	gfbDistribution = paramstrarr[num];
	
	parm.body.gfbDistribution = gfbDistribution;
	var jsonStr = JSON.stringify(parm);
	jsonStr = UrlEncode(jsonStr); // 加密过后的操作
	window.location.href = "quote.html?jsonStr=" + jsonStr;
}

$.callback = function() {
	parm.body.gfbDistribution = gfbDistribution;
	var jsonStr = JSON.stringify(parm);
	jsonStr = UrlEncode(jsonStr); // 加密过后的操作
	window.location.href = "quote.html?jsonStr=" + jsonStr;
};

/* 设置滑动区域 */
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height()-5-44;
	$("#insure_index").height(Scrollheight);
	mui("#insure_index").scroll();
};