var pageNo = '1'; //当前页码
var str = '';
var totalpage = '1'; //后台返回总页数
var phone = getUrlQueryString('userId');
var issueChannel=getUrlQueryString("issueChannel");
var parm = {};
var orderNo = '';
var jsonStr = '';

$(function() {
	$.setscroll();
	$.pulluptoRefresmui();
	/**--返回--*/
	$(".h_back").bind("tap",function() {
		goBackPPStop(issueChannel);//返回pp停车微信公众号方法
	});
});

$.setscroll = function() {
	var Scrollheight = window.innerHeight - $('header').height();
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
				method();
			}
		}, 100);
	}
}

function method() {
	var url = base.url+'/gzhcx/wxQueryCxByPageAndDto.do';
	var data = {
		'head':{
			'userCode': '',
			'transTime':$.getTimeStr(),
			'channel':'1'
		},'body':{
			'pageNo' : pageNo+'',
			'pageSize' : '10',
			'agentNo' : phone,
			'orderStatus' : '',
			'issueChannel':	issueChannel
		}
	};
	$.reqAjaxs(url, data, $.questionListCallBack);
}
$.questionListCallBack = function(param) {
	console.log(param);
	//获取后台返回总页数
	totalpage = param.returns.pager.pageCount;
	pageNo++;
	if(param.statusCode == '000000') {
		var str = '';
		var paramlist = param.returns.pager.entities;
		if(!$.isNull(paramlist) && paramlist.length > 0) {
			
			for(var i = 0; i < paramlist.length; i++) {
				var param = paramlist;
				var orderStatus=param[i].orderStatus;
				var color;
				if(orderStatus=="01"){
					color = 'color: #888888';
					orderStatus="未提交核保";
				}
				else if(orderStatus=="05"){
					color = 'color: #1b6bb8';
					orderStatus="待支付";
				}
				else if(orderStatus=="03"){
					color = 'color: #888888';
					orderStatus="核保失败";
				}
				else if(orderStatus=="04"){
					color = 'color: #1b6bb8';
					orderStatus="核保中";
				}
				else if(orderStatus=="07"){
					color = 'color: #f5692c';
					orderStatus="支付成功";
				}
				else if(orderStatus=="06"){
					color = 'color: #888888';
					orderStatus="支付失败";
				}
				else if(orderStatus=="10"){
					color = 'color: #f5692c';
					orderStatus="承保成功";
				}
				else if(orderStatus=="02"){
					color = 'color: #888888';
					orderStatus="已过期";
				}
				else if(orderStatus=="99"){
					color = 'color: #888888';
					orderStatus="已失效";
				}
				var orderNo = param[i].orderNo;
				str += "<div  class='baodan' shengCode='"+param[i].provinceCode+"' shengName='"+param[i].provinceName+"' cityCode='"+param[i].cityCode+"' cityName='"+param[i].cityName+"' cxSessionId='"+param[i].sessionid+"'><div id='' class='head'><span id='' class='blue'>天安车险</span><span id='' class='status blue'>"+param[i].insertTime+"</span></div><div id='' class='policyinfo '><div id='' class=' wid_33 fl wht'><div id='' class='policyname f_14 tc'>"+param[i].vehicleusage1+"</div><div id='' class='toubaor f_12 tc mt ab'>投保金额</div></div><div id='' class='wid_33 fl wht bord'><div id='' class=' f_14 tc'>车险</div><div id='' class=' f_12 tc mt ab'>保险类别</div></div><div id='' class='wid_33 fl wht'><div id='orderStatus' class=' f_14 tc' style='"+color+"'>"+orderStatus+"</div><div id='' class=' f_12 tc mt ab' style='display:block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;'>投保人："+param[i].insuredidaddress+"</div></div></div><div id='' class='blank'></div></div>";
			}
			$('.mui-scroll').append(str);
		}else{
			str += "<div style='position:absolute;width:40%;height:100px;top:200px;left:30%;'><img src='"+base.url1+"images/dh_norecord.png'><P style='text-align:center'>没有相关数据</p></div>";
			$('#pullrefresh').html(str);
		} 
	} else {
		modelAlert(param.statusMessage);
	}
	
	$('.baodan').unbind('tap').bind('tap', function() {
		var jsonKey={
		    "head": {
		        "userName": phone,
		        "source": "2",
		        "fgFlag": "",
		        "issueChannel":issueChannel
		    },
		    "body": {
		        "inforCar": {
		            "shengCode": $(this).attr("shengCode"),
		            "shengName": $(this).attr("shengName"),
		            "cityName": $(this).attr("cityName"),
		            "issueChannel":issueChannel,
		        },
		        "cxSessionId": $(this).attr("cxSessionId"),
		        "cityCode": $(this).attr("cityCode"),
		        "productCode":""
		    }
		}
		jsonKey = UrlEncode(JSON.stringify(jsonKey));
		if($(this).find("#orderStatus").html()=="未提交核保"){
			window.location.href = base.url1+'html/carinsure/quotationDetail.html?jsonStr=' + jsonKey;
		}else{
			window.location.href = base.url1+'html/carinsure/orderDetail.html?jsonStr=' + jsonKey;
		}
		
	});
}
