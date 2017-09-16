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
/*调用壳方法，打开新页面 */
function openUrl(url){
	if(systemsource == "ios"){
		var data={"function":"openProductUrl","requestObject":{"params":url}};
		var str= JSON.stringify(data);
		objcObject.OpenUrl(str);
	}else if(systemsource == "android"){
		android.OpenUrl(url);
	}
}
/*调用壳方法，打开新页面  不关闭tab页*/
function openManInfo(url){
	if(systemsource == "ios"){
		var data={"function":"openManInfo","requestObject":{"params":url}};
		var str= JSON.stringify(data);
		objcObject.OpenUrl(str);
	}else if(systemsource == "android"){
		android.OpenUrl(url);
	}
}
/*调用壳方法，返回上一页
 * 系统为ios时：
 * 使用方法：sysgoback(dmlife://tab/3/myInfo/otype=1)
 * @param dmlife://协议Scheme
 * @param tab代表根控制器是UITabBarController
 * @param (枚举值，0代表搭伙，1代表产品中心，2代表俱乐部，3代表我的页面)
 * @param myinfo是枚举值3下面的子界面(我的信息，myinfo是ios端定义的，调用前需约定)
 * @param otype跳转方式(枚举值0和1)，push和model两种方式
 * */
function sysgoback(num,page,otype){
	if(systemsource == "ios"){
		var urlstr = 'dmlife://tab/';
		if(num != ""&&page != ""&&otype!==""){
			urlstr = 'dmlife://tab/'+num+'/'+page+'/otype='+otype;
		}else if(num != ""&&page != ""){
			urlstr = 'dmlife://tab/'+num+'/'+page;
		}else{
			urlstr = 'dmlife://tab/'+num;
		}
		var data={"function":"back","requestObject":{"params":urlstr}};
		var str= JSON.stringify(data);
		objcObject.OpenUrl(str);
	}else if(systemsource == "android"){
		android.GoBack();
	}
}

/*调用壳方法，返回保险产品列表
 * 系统为ios时：
 * 使用方法：sysbackList();
 * */
function sysbackList(){
	if(systemsource == "ios"){
		var data={"function":"back","requestObject":{"params":"1"}};
		var str= JSON.stringify(data);
		objcObject.OpenUrl(str);
	}else if(systemsource == "android"){
		android.GoBack();
	}
}

/*调用壳方法，跳登录页
 * 使用方法 needLogin();
 * */
function needLogin(){
	if(systemsource == "ios"){
		var data={"function":"needLogin","requestObject":{}};
		var str= JSON.stringify(data);
		objcObject.OpenUrl(str);
	}else if(systemsource == "android"){
		android.needLogin();
	}
}

/*调用壳方法，上传图片*/
function uploadImg(){
	if(systemsource == "ios"){
		var data={"function":"takephoto","requestObject":{"params":""}};
		var str= JSON.stringify(data);
		objcObject.OpenUrl(str);
	}else if(systemsource == "android"){
		android.uploadIcon();
	}
}
/*调用壳方法，拨打客服电话 */
function callService(){
	if(systemsource == "ios"){
		var data={"function":"callService","requestObject":{"params":""}};
		var str= JSON.stringify(data);
		objcObject.OpenUrl(str);
	}else if(systemsource == "android"){
		android.callTelephone();
	}
}
/*调用壳方法，分享
 * 使用方法 
 * @param url 分享的url
 * @param iconurl 分享的图标
 * @param title 分享的标题
 * @param content 分享的描述内容
 *@param flag 分享标识 1  微信 2 微信朋友圈 3 新浪微博
 * */
function shareFlag(flag,iconurl,url,title,content){
	if(systemsource == "ios"){
			var data={
					"function":"shareProduct",
					"requestObject":{
							"url" : url,
							"title" : title,
							"content" : content,
							"flag" : flag,
							"iconurl" : iconurl
					}
			};
			var str= JSON.stringify(data);
			objcObject.OpenUrl(str);
		}else if(systemsource == "android"){
			android.shareBy(flag,iconurl,url,title,content);
	}
}
/*调用壳方法，跳转修改支付密码*/
function modifyPwd(){
	if(systemsource == "ios"){
		var data={"function":"ModifyPayPwd","requestObject":{}};
		var str= JSON.stringify(data);
		objcObject.OpenUrl(str);
	}else if(systemsource == "android"){
		android.modifyPwd();
	}
}
/*调用壳方法，关闭壳上的 遮罩*/
function closeSyspop(){
	if(systemsource == "ios"){
		var data={"function":"closeHud","requestObject":{}};
		var str= JSON.stringify(data);
		objcObject.OpenUrl(str);
	}else if(systemsource == "android"){
		android.dismiss();
	}
}
/*调用壳方法，返回到壳的上一页面*/
function returnPage(){
	if(systemsource == "ios"){
		var data={"function":"back","requestObject":{}};
		var str= JSON.stringify(data);
		objcObject.OpenUrl(str);
	}else if(systemsource == "android"){
		android.GoBack();
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
//	var requestJson = JSON.stringify(requestData);
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

/* 跳转页面，空白页控制 */
function createRequest() {
	  try {
	    request = new XMLHttpRequest();
	  } catch (trymicrosoft) {
	    try {
	      request = new ActiveXObject("Msxml2.XMLHTTP");
	    } catch (othermicrosoft) {
	      try {
	        request = new ActiveXObject("Microsoft.XMLHTTP");
	      } catch (failed) {
	        request = false;
	      }
	    }
	  }
	  if (!request)
	    alert("Error initializing XMLHttpRequest!");
}
/* 跳转页面，空白页控制 */
function getCustomerInfo(posturl) {
	  createRequest();
	  request.open("post", posturl, true);
	  request.onreadystatechange = function(){
		  if (request.readyState == 4 && request.status == 200){
			  window.location.href = posturl;
		  }
	  };
	  request.send(null);
	  // Do something with the request variable
	}

