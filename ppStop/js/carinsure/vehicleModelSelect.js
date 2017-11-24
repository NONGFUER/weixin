var customerInfo = {};
var vehicleModelList = new Array();// 存储页面数据
var pageIndex = 1;// 页码
var totalPageNum = "";// 总页数
var cityCode;
var frameNo;
var enginNo;
var licenseNo;
var enrollDate;
var purchaseDate;
var startDate;
$(function() {
	// 计算页面高度
	$.setscroll();
	$.replacePlaceholder($("#searchtext"), "请输入关键字点击查询");
	// 搜索框获得焦点
	$("#searchtext").focus(function() {
		if ($("#searchtext").val() == "请输入关键字点击查询") {
			$("#searchtext").val("");
		}
	});
	$("#searchtext").blur(function() {
		if ($("#searchtext").val() == "") {
			$("#searchtext").val("请输入关键字点击查询").css("color", "#ccc");
		}
	});
	
	/***品牌填写示例***/
	$(".noticediv").unbind("tap").bind("tap",function() {
		$("#licenseshadow").show();
	});
	$("#licenseshadow").unbind("tap").bind("tap",function() {
		$("#licenseshadow").hide();
	});
	
	//查询品牌型号事件
	$("#selectbtn").unbind("tap").bind("tap",function() {
		// 获取父页面 值
		$("#searchtext").blur();
		cityCode = $("#car_shi").attr('name');
		frameNo = $("#vehicle_identification_input").val();
		enginNo = $("#engine_number_input").val();
		if(chooseicon == 1 ){
			licenseNo = "";
		}else{
			licenseNo = $("#plate_number_input").val();
		}
		enrollDate = $("#vehicle_registration_date").val();
		purchaseDate = $("#vehicle_registration_date").val();
		startDate=showTime(1);//当前日期后一天作投保日期
		/*startDate = $("#startDate").val();*/
		var searchText = $("#searchtext").val().toUpperCase();
		if ($.isNull(searchText) || searchText == "请输入关键字点击查询") {
			modelAlert("请输入查询关键字！");
		} else {
			$("#customManageWrapper").css("transform","translate3d(0px, 0px, 0px)");
			$("#searchcustomer").empty();
			vehicleModelList = new Array();
			pageIndex = 1;
			var url = base.url + "vi/selectCarTypeInfo.do";
			// 天安 车型查询
			var data = {
				"issueChannel":$("#issueChannel").attr("channelCode"),//渠道
				"cityCode" : cityCode,
				"brandName" : searchText,// SGM7180
				"enginNo" : enginNo,
				"enrollDate" : enrollDate,// 注册日期 -初次登记日期 必须
				"purchaseDate" : purchaseDate,// 购车日期 必须
				"startDate" : startDate,// 起保日期 必须
				"frameNo" : frameNo,
				"licenseNo" : licenseNo,// 牌照信息
				"page" : pageIndex,
				"rows" : "20",
				"callback" : 'jsonp1045'
			};
			$.toAjaxs(url, data, $.addData);
		}
	})
});

/**
 * 远程数据库加载数据
 */
$.addData = function(param) {
	param = eval("(" + param + ")");
	console.log(param);
	carsinfoDate = param;
	if (param.status.statusCode == "000000") {
		sessionStorage.setItem("tradeNo", param.status.returns.tradeNoDto.tradeNo);
		sessionStorage.setItem("checkNo", param.status.returns.tradeNoDto.checkNo);
		sessionStorage.setItem("checkFlag", param.carsinfo.checkFlag);
		sessionStorage.setItem("checkCode", param.status.returns.tradeNoDto.checkCode);
		sessionStorage.setItem("checkImg", param.status.returns.tradeNoDto.checkCode);//验证码图片
		sessionStorage.setItem("brandKey", $("#searchtext").val().toUpperCase());//搜索关键字
		if (!$.isNull(param.carsinfo.total) && param.carsinfo.total > 0) {
			if (param.carsinfo.total % 20 == 0) {
				totalPageNum = param.carsinfo.total / 20;//总页数
			} else {
				totalPageNum = (param.carsinfo.total - param.carsinfo.total % 20) / 20 + 1;//总页数
			}
		}
		if (param == null || param == "" || param.carsinfo.total <= 0) {
			$("#searchcustomer").empty();
			$("#searchcustomer").hide();
			$("#maindiv").show();
		} else {
			$("#maindiv").hide();
			$("#searchcustomer").show();
			vehicleModelList = param.carsinfo.vehicleModelList;
			var content = document.createElement("ul");
			var str = "";
			if (vehicleModelList != "") {
				str += "<li><ul class='cusMesCont1'>";
				for ( var K = 0; K < vehicleModelList.length; K++) {
					var brandName = "";
					if($.isNull(vehicleModelList[K].brandName)){
						brandName = "";
					}else{
						brandName = vehicleModelList[K].brandName;
					}
					var vehicleStyleDesc = "";
					if($.isNull(vehicleModelList[K].vehicleStyleDesc)){
						vehicleStyleDesc = "";
					}else{
						vehicleStyleDesc = vehicleModelList[K].vehicleStyleDesc;
					}
					var purchasePrice = "";
					if($.isNull(vehicleModelList[K].purchasePrice)){
						purchasePrice = "";
					}else{
						purchasePrice = vehicleModelList[K].purchasePrice;
					}
					var itemValue = brandName + " " + vehicleStyleDesc + " " + purchasePrice;
					if (K % 2 != 0) {
						str += "<li class='getCarInfo'> <input type='hidden' value='"+ JSON.stringify(vehicleModelList[K]) +"'>"
								+ itemValue + "  </li>";
					} else {
						str += "<li style='background-color:#fafafa;' class='getCarInfo'> <input type='hidden' value= '"
								+ JSON.stringify(vehicleModelList[K]) + "'> " + itemValue + "  </li>";
					}
				}
			}
			str += "</ul></li>";
			$(content).html(str);
			$("#searchcustomer").append(content);
			pageIndex++;
			if(totalPageNum > 1){
				pullupRefreshlist();
			}
			// 获取被点击的车牌类型信息
			$(".getCarInfo").unbind("tap").bind("tap",function(){
				var list = $(this).find("input").val();
				if (list != "") {
					list=JSON.parse(list);
					loadCarContent(list);
					$(".vehicleInfo").hide();
					$(".carMes").show();
					$(".litterhelp").hide();
					$("#pageTitle").html("车辆信息");
					pageflag = 1;
				} else {
					modelAlert("获取车牌类型信息异常！");
				}
			});
		}
	} else {
		modelAlert(param.status.statusMessage);
	}

};

// 点击叉号图片清空文本框
function quxiaocheck() {
	if ($("#searchtext").val() != "" || $("#searchtext").val() != "请输入关键字点击查询") {
		$("#searchtext").val("");
	}
}

/**
 * 加载更多品牌型号事件
 */
function selectMore() {
	var searchText = $("#searchtext").val();
	if ($.isNull(searchText) || searchText == "请输入关键字点击查询") {
		modelAlert("请输入查询关键字！");
	} else {
		vehicleModelList = new Array();
		var url = base.url + "vi/selectCarTypeInfo.do";
		// 天安 车型查询
		var data = {
			"issueChannel":$("#issueChannel").attr("channelCode"),//渠道	
			"cityCode" : cityCode,
			"brandName" : searchText,// SGM7180
			"enginNo" : enginNo,
			"enrollDate" : enrollDate,// 注册日期 -初次登记日期 必须
			"purchaseDate" : purchaseDate,// 购车日期 必须
			"startDate" : startDate,// 起保日期 必须
			"frameNo" : frameNo,
			"licenseNo" : licenseNo,// 牌照信息
			"page" : pageIndex,
			"rows" : "20",
			"callback" : 'jsonp1045'
		}

		$.toAjaxs(url, data, $.addData);
	}
}

/*上拉加载*/
function pullupRefreshlist(){
	mui.init({
		pullRefresh: {
			container: '#wrapper',
			up: {
				contentrefresh: '上拉加载显示更多',
				callback: pullupRefresh
			}
		}
	});

	//上拉加载回调方法
	function pullupRefresh(){
		$(".mui-pull-bottom-pocket .mui-pull").find(".mui-pull-loading").removeClass("mui-spinner");
		if(pageIndex > totalPageNum){
			if($("#searchcustomer").find(".tipclear").length < 1){
				$("#searchcustomer").append("<div style='clear:both' class='tipclear'></div><p style='text-align:center;margin-bottom:0;margin-top:0.5rem;'class='tips'>没有更多数据了！</p>");
			}
		}
		setTimeout(function() {
			mui('#wrapper').pullRefresh().endPullupToRefresh(); 
			if(totalPageNum >= pageIndex){
				selectMore();
			}
		}, 100);
	}
}
/*设置滑动区域*/
$.setscroll = function(){
	var Scrollheight = window.innerHeight- 170;
	$("#wrapper").height(Scrollheight + "px");
	$("#wrapper").css("top","170px");
	mui("#wrapper").scroll();
};

/*获取当前日期、前一天、后一天*/
function addByTransDate(dateParameter, num) {
    var translateDate = "", dateString = "", monthString = "", dayString = "";
    translateDate = dateParameter.replace("-", "/").replace("-", "/"); 
    var newDate = new Date(translateDate);
    newDate = newDate.valueOf();
    newDate = newDate + num * 24 * 60 * 60 * 1000;
    newDate = new Date(newDate);
    //如果月份长度少于2，则前加 0 补位   
    if ((newDate.getMonth() + 1).toString().length == 1) {
monthString = 0 + "" + (newDate.getMonth() + 1).toString();
    } else {
monthString = (newDate.getMonth() + 1).toString();
    }
    //如果天数长度少于2，则前加 0 补位   
    if (newDate.getDate().toString().length == 1) {
dayString = 0 + "" + newDate.getDate().toString();
    } else {
dayString = newDate.getDate().toString();
    }
    dateString = newDate.getFullYear() + "-" + monthString + "-" + dayString;
    return dateString;
}
 
function reduceByTransDate(dateParameter, num) {
    var translateDate = "", dateString = "", monthString = "", dayString = "";
    translateDate = dateParameter.replace("-", "/").replace("-", "/"); 
    var newDate = new Date(translateDate);
    newDate = newDate.valueOf();
    newDate = newDate - num * 24 * 60 * 60 * 1000;
    newDate = new Date(newDate);
    //如果月份长度少于2，则前加 0 补位   
    if ((newDate.getMonth() + 1).toString().length == 1) {
monthString = 0 + "" + (newDate.getMonth() + 1).toString();
    } else {
monthString = (newDate.getMonth() + 1).toString();
    }
    //如果天数长度少于2，则前加 0 补位   
    if (newDate.getDate().toString().length == 1) {
dayString = 0 + "" + newDate.getDate().toString();
    } else {
dayString = newDate.getDate().toString();
    }
    dateString = newDate.getFullYear() + "-" + monthString + "-" + dayString;
    return dateString;
} 
 
//得到日期  主方法
function showTime(pdVal) {
    var trans_day = "";
    var cur_date = new Date();
   /* var cur_year = new Date().format("yyyy");*/
    var cur_year = cur_date.getFullYear(); 
    var cur_month = cur_date.getMonth() + 1;
    var real_date = cur_date.getDate();
    cur_month = cur_month > 9 ? cur_month : ("0" + cur_month);
    real_date = real_date > 9 ? real_date : ("0" + real_date);
    eT = cur_year + "-" + cur_month + "-" + real_date;
    if (pdVal == 1) {
trans_day = addByTransDate(eT, 1);
    }
    else if (pdVal == -1) {
trans_day = reduceByTransDate(eT, 1);
    }
    else {
trans_day = eT;
    }
   //处理
    return trans_day;
}
 