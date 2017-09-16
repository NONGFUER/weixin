/**
 * @maweiwei
 * 日期：2016-03-02
 * 描述：搭伙项目所用的一些基本方法和数据
 */
var userId = "";//登录用户id
var userName = "";//登录用户名
var loginflag = "";//是否登录标记
var source = "";//用户登录来源
var systemsource = "";//判断系统类型 
var request;
$(function(){
	/*判断系统类型 */
	issystemsource();
	closePage();
});
/*判断系统类型 */
function issystemsource(){
	var browser={ 
			versions:function(){ 
			var u = navigator.userAgent, app = navigator.appVersion; 
			return {//移动终端浏览器版本信息 
				webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核 
				mobile: !!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/), //是否为移动终端 
				ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端 
				android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器 
//				trident: u.indexOf('Trident') > -1, //IE内核 
//				presto: u.indexOf('Presto') > -1, //opera内核 
//				gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核 
//				iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQ HD浏览器 
//				iPad: u.indexOf('iPad') > -1, //是否iPad 
//				webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部 
			}; 
		}(), 
			language:(navigator.browserLanguage || navigator.language).toLowerCase() 
		} 
	
	if( browser.versions.ios){
		systemsource = "ios";
	}else if(browser.versions.android){
		systemsource = "android";
	}
}
/*与当前时间比较大小
 * @param date格式为2015-12-25 12:25:25
 * */
function comparetime(date){
	var arr = date.split(/[- :]/);
    var oDate1 = new Date();
    var oDate2 = new  Date(arr[0],arr[1]-1,arr[2],arr[3],arr[4],arr[5]);
    if(oDate1.getTime() > oDate2.getTime()){
         return true;//当前时间大
    } else {
    	return false;//当前时间小
    };
}
/*比较两个时间的大小
 *@param date格式为2015-12-25 12:25:25
 * */
function comparetime1(date1,date2){
    var oDate1 = new Date(date1);
    var oDate2 = new Date(date2);
    if(oDate1.getTime() > oDate2.getTime()){
    	return true;//第一个大
    } else {
    	return false;//第二个大
    }
}

/*数组去重方法*/
function unique(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
}
/*************************
* 获取年份，月份
* @param ：dicType(字典表类型代码)years 年  months 月
* @param ：yearsFlag(开始或结束年份标志。0:开始年份; 1:结束年份)，
*          如果要获取月份则传""。
*  @param ：callBack回调函数
* @return：
**************************
*/
$.loadYearsOrMonths = function(dicType, yearsFlag,callBack) {
	var data = {
			"dicType" : dicType,
			"yearsFlag" : yearsFlag
		};
	// 请求url
	var url = base.url + "independntAgent/loadYearsOrMonths.do";
	// ajaxs提交
	var requestData = {};
	requestData.request = data;
	var requestJson = aesEncrypt(JSON.stringify(requestData), secretKey, secretKey);
	requestJson=URLencodeForBase64(requestJson);
	$.ajax({
		url : url,
		type : 'POST',
		data : "jsonKey=" + requestJson,
		dataType : "json",
		timeout : 60000,
		success : function(data) {
			//$(".ajax_prevent").remove();// 去除遮罩
			if ($.isNull(callBack)) {

			} else {
				callBack(data);
			}
		},
		error : function(data) {
			$(".ajax_prevent").remove();// 去除遮罩
			modelAlert("请求失败");
		},
		complete : function(data) {
		},
//		beforeSend : function(xhr) {
//			$.ajaxPrevent();
//		},
		async : true,
	});
};

/*************************
* 获取一段时间后的日期
* @param ：addDaytype 时间段类型 3年 2月 1日
* @param ：time 基数时间
*  @param ：AddDayCount 时间段
* @return：
**************************
*/
$.getspellDate = function(time,AddDayCount,addDaytype) {
	if (time == "") {
		var current = new Date(); // 当前时间
	} else {
		var current = new Date(time); // 某天
	}
	if(addDaytype == "3"){
		current.setFullYear(current.getFullYear() + parseInt(AddDayCount));// 获取AddDayCount年后的日期
	}else if(addDaytype == "2"){
		current.setMonth(current.getMonth() + parseInt(AddDayCount));// 获取AddDayCount月后的日期
	}else if(addDaytype == "1"){
		current.setDate(current.getDate() + parseInt(AddDayCount));// 获取AddDayCount天后的日期
	}
	
	var year = current.getFullYear();
	var month = current.getMonth() + 1;
	if (month < 10) {
		month = "0" + month;
	}
	var day = current.getDate();
	if (day < 10) {
		day = "0" + day;
	}
	return year + "-" + month + "-" + day;
};

function closePage(){
	var str = getUrlQueryString("jsonStr");
	if(str!=null){
		str = UrlDecode(str);
		parm = JSON.parse(str);
		var fromtype = parm.body.inforCar.issueChannel;//第三方销售渠道接入同道车险
		if(fromtype!=null&&fromtype!=""){//第三方销售渠道接入同道车险
		    if(fromtype=="08"){
				$(".h_next").html('<img style="width:25%;float:right;margin-right:10px;margin-top:15px;" src="../../images/close.png">')
				$(".h_next").on("tap",function(){
					  window.location.href="http://wap.maquee.cn/MyInformation/Index";
				});
		    }
		}
	}
	var fromtype1 = getUrlQueryString("issueChannel");
	if(fromtype1!=null&&fromtype1!=""){//第三方销售渠道接入同道车险
		if(fromtype1=="08"){
			$(".h_next").html('<img style="width:25%;float:right;margin-right:10px;margin-top:15px;" src="../../images/close.png">')
			$(".h_next").on("tap",function(){
				window.location.href="http://wap.maquee.cn/MyInformation/Index"
			});
		}
	}
}