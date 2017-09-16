var zhuangtai="";//订单、保单状态
var chuxingWay="";//出行方式
$(function(){
	var str = getUrlQueryString("jsonKey");
	str = UrlDecode(str);	
	parm = JSON.parse(str);
	var orderNo = parm.orderNo; //订单号	
	var phone = parm.phone;
	$.init(orderNo);
	$.setscroll();
	//保险条款
	$("#riskTiaokuan").unbind("tap").bind("tap",function(){
		window.location.href="tiaokuan.html"+window.location.search;
	})
	$(".h_back").unbind("tap").bind("tap",function(){
		window.location.href="policyQuery.html?mobile="+phone+"&&type=2";
	})	
	$(".anniu").unbind("tap").bind("tap",function(){
		window.location.href="policyQuery.html?mobile="+phone+"&&type=2";
	})				
})
/**
 * @function  初始化请求 
 */
$.init = function(orderNo){
	var url = base.urlsxy + "order/getOrderInfo.do"	
    var reqData = {
			"head":{
				"channel":"01",
				"userCode":"2835",
				"transTime":""
			},"body":{
				"orderNo":orderNo
			}
    }
    $.reqAjaxs(url,reqData,$.getOrderDetail)
}
$.getOrderDetail = function(data) {
    if (data != null && data != "") {
		if (data.statusCode == "000000") {
			var parm=data.returns.bxOrder;
			zhuangtai=data.returns.policyStauts;
			chuxingWay=data.returns.bxSxyTraffic.trafficWay;
			if(zhuangtai=="6"){
				$(".zhuangtai").attr("src","../../images/yishixiao.png");
			}else if(zhuangtai=="2"){
				$(".zhuangtai").attr("src","../../images/baozhanging.png");
			}else if(zhuangtai=="11"){
				$(".zhuangtai").attr("src","../../images/daishengxiao.png");
			}
			//保单号
			$(".policyNo").html(parm.orderNo);
			//身份证关键信息隐藏
			var insureIdentitycard=parm.insureIdentitycard+"";				
				$("#TBRName").html(parm.insureName);
				$("#TBRIDType").html("身份证");
				$("#TBRID").html(insureIdentitycard);
				$("#TBRMobile").html(parm.insurePhone);
				var kaishi=/\d{4}-\d{1,2}-\d{1,2}/g.exec(parm.startTime);
				var jiezhi=/\d{4}-\d{1,2}-\d{1,2}/g.exec(parm.endTime);
				$("#qijian").html(kaishi+"至"+jiezhi);
				$("#TBRMail").html(parm.insureEmail);
				$("#TBRBirthday").html($.getBirthDay(parm.insureIdentitycard));	
				$("#baofei").html(parm.prem+"元");
				$("#agentCode").html(data.returns.code ? data.returns.code : '');
				$("#agentName").html(data.returns.name ? data.returns.name : '');
				var orderResource="";				
				//渲染出行方式表格
				setTable();
		} else {
			modelAlert(data.statusMessage);
			return false;
		}
	} else {
		modelAlert(data.statusMessage);
		return false;
	}
}; 
function setTable(){
	var reqData = {
			"head":{
				"userCode":"",
				"transTime":$.getTimeStr(),
				"channel":"2"
			},"body":{
			}
	};

	var url=base.urlsxy+"common/getTraffic.do";
	$.reqAjaxs(url, reqData,function(data){
		if(data.statusCode=="000000"){
			var listTraffic=data.returns.listTraffic;
		    var str="";
			for(var i in listTraffic){ 
				//9996  飞机   9997 公共汽车    9998 火车 地铁  9999客运轮船
				if(listTraffic[i].dicCode == 9996){
					str= "feiji";
				}else if(listTraffic[i].dicCode == 9997){
					str= "qiche";
				}else if(listTraffic[i].dicCode == 9998){
					str= "huoche";
				}else if(listTraffic[i].dicCode == 9999){
					str= "lunchuan";
				}
				var str1="";
				str1="<tr class="+str+"><td class='kongbai'></td>";
				str1+="<td class='fangshi border-1px-bottom'>"+listTraffic[i].dicValue+"</td>";
				str1+="<td class='fanwei border-1px-bottom'>"+listTraffic[i].dicExplain+"</td>";
				str1+="<td class='edu border-1px-bottom'>"+listTraffic[i].dicChannel+"</td>";
				str1+="<td class='dagou border-1px-bottom'><img class='gou' src='../../images/gouxuan.png'/></tr>";
				$(".choose_way").append(str1);	
			}
			//修改图片地址
			$(".gou").hide();
			if(chuxingWay == 9996){
				$(".feiji").css("background-color","#6ba3fd");
				$(".feiji").find(".gou").show();
			}else if(chuxingWay == 9997){
				$(".qiche").find(".gou").show();
				$(".qiche").css("background-color","#6ba3fd");
			}else if(chuxingWay == 9998){
				$(".huoche").find(".gou").show();
				$(".huoche").css("background-color","#6ba3fd");
			}else if(chuxingWay == 9999){
				$(".lunchuan").find(".gou").show();
				$(".lunchuan").css("background-color","#6ba3fd");
			}
		}else{
			modelAlert(data.statusMessage);
		}
	});
}
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#contentIndex").height(Scrollheight);
	mui("#contentIndex").scroll();
};

