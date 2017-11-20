var pageIndex = 1;// 页码
var totalPageNum = "";// 总页数
var cxCarMessage = {};// 车辆信息
var cxOrder={};
$(function() {
	var str = window.location.search;
	str = str.substr(9, str.length);
	str = UrlDecode(str);
	parm = JSON.parse(str);
	console.log(parm);
	sessionid = parm.body.cxSessionId;
	// 计算页面高度
	$.setscroll();
	$("#searchtext").val(sessionStorage.getItem("brandKey"));
	
	/***返回***/
	$(".h_back").unbind("tap").bind("tap",function() {
		window.history.back();
	});
	//查询品牌型号事件
	$("#selectbtn").unbind("tap").bind("tap",function() {
		$("#searchtext").blur();
		var searchText = $("#searchtext").val().toUpperCase();
		if ($.isNull(searchText)) {
			modelAlert("请输入查询关键字！");
		}else {
			$("#customManageWrapper").css("transform","translate3d(0px, 0px, 0px)");
			$("#searchcustomer").empty();
			vehicleModelList = new Array();
			pageIndex = 1;
			var url = base.url + "vi/selectVehicleQuery.do";
			// 天安 车型查询
			var data = {
				"sessionid" : sessionid,
				"brandName" : searchText,// SGM7180
				"page" : pageIndex,
				"rows" : "20",
				"callback" : 'jsonp1045'
			};
			$.toAjaxs(url, data, $.addData);
		}
	})
	
	
	/***验证码提交****/
	$("#submit").unbind("tap").bind("tap",function() {
		var yan = $("#yan").val();
		if ($.isNull(yan)) {
			modelAlert("请输入验证码！");
		}else {
			sessionStorage.setItem("checkCode", $("#yan").val());
			cxOrder.checkno=sessionStorage.getItem("checkNo");
			cxOrder.checkcode=sessionStorage.getItem("checkCode");
			$(".note-div,.dialog").hide();
			quotedPrice();
		}
	})
});

/**
 * 远程数据库加载数据
 */
$.addData = function(param) {
	param = eval("(" + param + ")");
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
					cxCarMessage.sessionid=sessionid;
					cxCarMessage.vehicleid = list.rbcode;// 车辆Id
					cxCarMessage.vehicleBrand = list.brandName;// 品牌型号
					cxCarMessage.seats = list.seatCount+".0";//车辆
					cxCarMessage.vehicleValue = list.purchasePrice;//购车价
					cxCarMessage.currentvalue = list.actualValue;// 实际价值
					cxCarMessage.enginecapacity = list.exhaustCapacity;// 排量
					cxCarMessage.producingarea = list.importFlag;// 车型产地
					cxCarMessage.carName = list.carName;
					cxCarMessage.jingyouVehicleCode = list.vehicleJingyouDto.vehicleCode;
					cxCarMessage.jingyouVehicleName = list.vehicleJingyouDto.vehicleName;
					cxCarMessage.jingyouPrice = list.vehicleJingyouDto.price;
					cxCarMessage.jingyouFamilyname = list.vehicleJingyouDto.familyName;
					cxCarMessage.noticeType = list.noticeType;
					cxCarMessage.vehiclehycode = list.hyModelCode;
					cxCarMessage.wholeWeight = list.vehicleWeight;
					
					cxOrder.sessionid=sessionid;
					if(sessionStorage.getItem("checkFlag")=="0"){
						$("#yan").val("");
						$("#checkImg").attr("src","data:image/png;base64,"+sessionStorage.getItem("checkCode"));
						$(".note-div,.dialog").show();
		            }else{
		            	quotedPrice();//保存车辆信息
		            }
					
				} else {
					modelAlert("获取车牌类型信息异常！");
				}
			});
		}
	} else {
		modelAlert(param.status.statusMessage);
	}

};

/**
 * 加载更多品牌型号事件
 */
function selectMore() {
	var searchText = $("#searchtext").val();
	if ($.isNull(searchText)) {
		modelAlert("请输入查询关键字！");
	} else {
		vehicleModelList = new Array();
		var url = base.url + "vi/selectVehicleQuery.do";
		// 天安 车型查询
		var data = {
			"sessionid" : sessionid,
			"brandName" : searchText,// SGM7180
			"page" : pageIndex,
			"rows" : "20",
			"callback" : 'jsonp1045'
		};

		$.toAjaxs(url, data, $.addData);
	}
}



function quotedPrice(){
	var url = base.url + "vi/quotedPrice.do";
	// 天安 车型查询
	var data = {
		"cxCarMessage" : cxCarMessage,
		"cxOrder" : cxOrder,
	};
	$.toAjaxs(url, data, function(data){
		data = eval("(" + data + ")");
		if (data.status.statusCode == "000000") {
			window.history.back();
		}else {
			modelAlert(data.status.statusMessage);
		}
	});
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
	var Scrollheight = window.innerHeight- $("header").height()- 144;
	$("#wrapper").height(Scrollheight + "px");
	mui("#wrapper").scroll();
};