var pageNo = '1'; //当前页码
var str = '';
var totalpage = '1'; //后台返回总页数
var phone = getUrlQueryString('mobile');
var type = getUrlQueryString('type');
/*var phone = "15721114668";
var type = "2";
*/
var parm = {};
var orderNo = '';
var jsonStr = '';
var orderKind = 0;
var  norecord = '<div id="noRecord" class="noRecord" style="display:block"><div class="noRecordimg"><img src="../../images/gzpt_noRecord.png"></div><div class="noRecordfont">没有相关记录</div></div>';
$(function() {
	$.setscroll();
	$.pulluptoRefresmui();
	$.tabActive();
	setTimeout(function() {
		if(type == 2){
			backInit()
		}	
	}, 200);
});

$.setscroll = function() {
	var Scrollheight = window.innerHeight - 88;
	$('#pullrefresh').height(Scrollheight);
	mui('#pullrefresh').scroll();
};

/**
 * 页面只有一个上拉区域需要上拉加载 
 * 使用方法：$.pulluptoRefreshmui(id1, id2, pageNo,totalpage,method);
 * id1:所要上拉的区域；
 * id2:所要赋值的区域；
 * pageNo： 当前页数
 * totalpage： 总页数
 * method：上拉后执行的方法；
 * 此方法依赖组件
 * mui，请在页面中先引入 mui.min.css、mui.min.js
 * author: maweiwei
 */
$.pulluptoRefresmui = function() {
	//加载下一个页面
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			up: {
				height: 50, // 可选.默认50.触发上拉加载拖动距离
				callback: pullupRefresh,
				contentrefresh: '正在刷新...',
				auto: true
			}
		}
	});
	//上拉加载回调方法
	function pullupRefresh() {
		if(pageNo > totalpage) {
			mui.toast('没有更多数据了！');
		}
		setTimeout(function() {
			mui('#pullrefresh').pullRefresh().endPullupToRefresh();
			if(totalpage >= pageNo) {
				if(orderKind === 0){
					carorder()
				}else if(orderKind === 1){
					propertyorder()
				}
			}
		}, 100);
	}
}
/**
 * @function 请求
 * @parm null
 * 
 */
function carorder(){
	var url = base.url+'/bill/queryPolicy.do';	
		var reqData = {
				'head':{
					'userCode': '',
					'transTime':$.getTimeStr(),
					'channel':'1'
				},'body':{
					'pageNo' : pageNo+'',
					'pageSize' : '10',
					'userName' : phone,
				}
			};	
	$.reqAjaxsFalse(url,reqData,$.getCarorderList);
}
/**
 * @function 请求
 * @parm null
 * 
 */
function propertyorder(){
	var url = base.urlsxy+'order/policyQuery.do';
	var reqData = {
			'head':{
				'userCode': '',
				'transTime':$.getTimeStr(),
				'channel':'1'//1-App 2-微信
			},'body':{
				'pageNo' : pageNo+'',
				'pageSize' : '4',
				'phone' : phone				
			}
		};
	$.reqAjaxsFalse(url,reqData,$.getPropertyorderList);
}

/**
 * @function tab切换效果
 */
$.tabActive = function(){
	$(".order_tab").each(
			function(i){
				$(this).unbind("tap").bind("tap",function(){
					$(this).addClass("active");
					$(this).siblings().removeClass("active");
					//console.log(i);
					orderType(i);
					orderKind = i;
				});
			}
	);
}
/**
 * @function 根据所选的订单类型来切换数据
 */
function orderType(ordertype){
	$('.mui-scroll').html('');//每点击一tab,则清空原先的渲染	
	if(ordertype === 0){								
		pageNo = 1;//console.log("车险保单")
		totalpage = 1;
		carorder();		
	}else if(ordertype === 1){								
		pageNo = 1;//console.log("财险保单")		
		totalpage = 1;
		propertyorder();		
	}
	$('.mui-scroll').css('transform','translate3d(0px, 0px, 0px)');	
}
/**
 * @function 获取【短险出单】列表信息,渲染到页面上去
 * 
 */
$.getPropertyorderList = function(data){
	//console.log(data);
	pageNo++;
	totalpage = data.returns.pager.pageCount;
	if(data.statusCode == '000000') {
		var propertyorderList = data.returns.pager.entities;
		var propertyorderListDom = propertyorderListDomGenerator(propertyorderList);
		 $('.mui-scroll').append(propertyorderListDom);
		 toDuanDetail();
	}else{
		modelAlert(data.statusMessage);
		return false;
	}	
	//console.log(data)
}
/**
 * @function 【短险出单】dom结构
 */
function propertyorderListDomGenerator(parmList){
	 var listString = '';
	 if(parmList){
		 if(parmList.length != 0){
			 for(var i = 0; i < parmList.length ; i++){
					listString += '<div class="content-wrap duanxian" orderNo="'+parmList[i].orderNo+'" postu="'+parmList[i].policyStatus+'"  flagUrl="'+parmList[i].flagUrl+'">'
					listString +='<div class="policy-title"><div class="policy-title-wrap">'
					listString +=   '<span class="orderproductName blueColor">'+parmList[i].productName+'</span>'
					listString +='</div></div>'
					listString +='<div class="policy-body"><div class="policy-body-wrap clearfix">'			
					listString +=  '<div class="policy-split policy-split-1"><div class="info-up">'+parmList[i].insureName+'</div><div class="info-down">投保人</div></div>'
					if(parmList[i].flagUrl == 4){//驾乘险
						listString +=  '<div class="policy-split policy-split-2"><div class="info-up">赠险</div><div class="info-down">保费</div></div>'
					}else{
						listString +=  '<div class="policy-split policy-split-2"><div class="info-up">'+parmList[i].prem+'元</div><div class="info-down">保费</div></div>'
					}
					listString +=  '<div class="policy-split policy-split-3"><div class="info-up">'+getDuanStatus(parmList[i].policyStatus)+'</div><div class="info-down">订单状态</div></div>'
					listString +='</div></div>'
					if(parmList[i].flagUrl == 4){//驾乘险
						listString +='<div class="policy-footer">保障时间:30天'
					}else{
						listString +='<div class="policy-footer">保障时间:一年'
					}
					
					if(parmList[i].underWrite){
					        listString +='<div class="policy-date">承保日期:  <span>'+parmList[i].underWrite+'</span></div>'
					}	
					listString +='</div></div>';
				 }
		 }else{
			 listString = norecord;
		 }		 
	 }else{
		listString = norecord;
	 }
	 return listString;
}
/**
 * @function 获取【车险出单】列表信息,渲染到页面上去
 * 
 */
$.getCarorderList = function(data){
	pageNo++;
	totalpage = data.returns.pager.pageCount;
	if(data.statusCode == '000000') {
		var carorderList = data.returns.pager.entities;
		var carorderListDom = carorderListDomGenerator(carorderList);
		 $('.mui-scroll').append(carorderListDom);
		 toCarDetail();
	}else{
		modelAlert(data.statusMessage);
		return false;
	}	
}
/**
 * @function 【车险出单】dom结构
 */
function carorderListDomGenerator(parmList){
	 var listString = '';
	 if(parmList){
		 if(parmList.length != 0){
			 for(var i = 0; i < parmList.length ; i++){
					listString += '<div class="content-wrap chexian" shengCode="'+parmList[i].provinceCode+'" shengName="'+parmList[i].provinceName+'" cityCode="'+parmList[i].cityCode+'" cityName="'+parmList[i].cxCityName+'" cxSessionId="'+parmList[i].sessionid+'">'
					listString +='<div class="policy-title"><div class="policy-title-wrap">'
					listString +=   '<span class="orderproductName blueColor">天安车险</span><span class="orderDate blueColor">下单时间：'+parmList[i].insertTime+'</span>'
					listString +='</div></div>'
					listString +='<div class="policy-body"><div class="policy-body-wrap clearfix">'			
					listString +=  '<div class="policy-split policy-split-1"><div class="info-up">'+parmList[i].phname+'</div><div class="info-down">投保人</div></div>'
					listString +=  '<div class="policy-split policy-split-2"><div class="info-up">'+parmList[i].totalPre+'元</div><div class="info-down">保费</div></div>'
					listString +=  '<div class="policy-split policy-split-3"><div class="info-up" id="orderStatus" style="'+getOrderStatus(parmList[i].orderStatus).color+'">'+getOrderStatus(parmList[i].orderStatus).statusValue+'</div><div class="info-down">订单状态</div></div>'
					listString +='</div></div>'
					listString +='<div class="policy-footer">保障时间：一年'
					if(parmList[i].underwriteDate){
						var dateuw = (parmList[i].underwriteDate).split(" ");
						listString += '<div class="policy-date">承保日期:  <span>'+dateuw[0]+'</span></div>'
					}	
					listString +='</div></div>';
				 }
		 }else{
			 listString = norecord;
		 }		 
	 }else{
		listString = norecord;
	 }
	 return listString;
}
/*
 * @function 
 */
function toCarDetail(){
	$('.chexian').each(function(){
		$(this).unbind('tap').bind('tap', function() {
			var jsonKey={
				    "head": {
				        "loginflag": "1",
				        "userName": phone,
				        "source": "2",
				        "fgFlag": "",
				        "function": "03",
				    },
				    "body": {
				        "inforCar": {
				            "shengCode": $(this).attr("shengCode"),
				            "shengName": $(this).attr("shengName"),
				            "cityName": $(this).attr("cityName"),
				        },
				        "cxSessionId": $(this).attr("cxSessionId"),
				        "cityCode": $(this).attr("cityCode"),
				        "isShowBtn": "N",
				        "bxfromFlag":"2"
				    }
				}
			jsonKey = UrlEncode(JSON.stringify(jsonKey));
			window.location.href = 'orderDetail.html?jsonKey=' + jsonKey;			
		});
	})
	
}
/*
 * @function 
 */
function toDuanDetail(){
	$('.duanxian').each(function(){
		$(this).unbind('tap').bind('tap', function() {
			var channel=$(this).attr("flagUrl");
			
			var sendData={
					"phone":phone,
					"orderNo":$(this).attr("orderNo"),
					"postu":$(this).attr("postu"),
					"type":orderKind,
					"mobile":phone,
					"comeFlag":"3"
			};
			var jsonStr = UrlEncode(JSON.stringify(sendData));
			var orderNo = $(this).attr("orderNo");
			if(channel==4){//驾乘险
				window.location.href = base.url+"App/html/jiachengxian/jcxPolicyInfo.html?orderNo="+orderNo+"&wxFlag=1";
			}else if(channel==3){//3:随心易
				window.location.href = "policyInfo.html?jsonKey="+jsonStr;
			}else if(channel==5||channel==8){//5：防癌  8 邮储防癌
				window.location.href = "cancerPolicyInfo.html?jsonKey="+jsonStr;
			}
		});
	});
}
function getOrderStatus(orderStatus){
	var status = {};	
	if(orderStatus=="01"){
		status.color = 'color: #888888';
		status.statusValue="未提交核保";
	}
	else if(orderStatus=="05"){
		status.color = 'color: #1b6bb8';
		status.statusValue="待支付";
	}
	else if(orderStatus=="03"){
		status.color = 'color: #888888';
		status.statusValue="核保失败";
	}
	else if(orderStatus=="04"){
		status.color = 'color: #1b6bb8';
		status.statusValue="核保中";
	}
	else if(orderStatus=="07"){
		status.color = 'color: #f5692c';
		status.statusValue="支付成功";
	}
	else if(orderStatus=="06"){
		status.color = 'color: #888888';
		status.statusValue="支付失败";
	}
	else if(orderStatus=="10"){
		status.color = 'color: #f5692c';
		status.statusValue="承保成功";
	}
	else if(orderStatus=="02"){
		status.color = 'color: #888888';
		status.statusValue="已过期";
	}
	else if(orderStatus=="99"){
		status.color = 'color: #888888';
		status.statusValue="已失效";
	}
	return status;
}
function getDuanStatus(value){
	var status = '';
	if(value=="6"){		
		status="失效";
	}	
	else if(value=="11"){		
		status="待生效";
	}
	else if(value=="2"){	
		status="保障中";
	}	
	return status;
}
function backInit(){	
	$('.order_tab').eq(1).addClass("active");
	$('.order_tab').eq(1).siblings().removeClass("active");	
	orderType(1);
	orderKind = 1;
}
$.reqAjaxsFalse = function(url, requestData, callBack) {
	var requestJson = aesEncrypt(JSON.stringify(requestData), secretKey, secretKey);
	requestJson=URLencodeForBase64(requestJson);
	$.ajax({
		url : url,
		type : 'POST',
		data : "jsonKey=" + requestJson,
		dataType : "json",
		timeout : 60000,
		success : function(data) {
			$(".ajax_prevent").remove();// 去除遮罩
			if (!$.isNull(callBack)) {
				callBack(data);
			}
		},
		error : function(data) {
			$(".ajax_prevent").remove();// 去除遮罩
			modelAlert("网络好像开小差了呢，请设置给力一点儿网络吧！");
		},
		beforeSend : function(xhr) {
			$.ajaxPrevent();
		},
		async : false,
	});
};
