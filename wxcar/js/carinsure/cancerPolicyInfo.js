var zhuangtai="";//订单、保单状态
var phone = '';
var temp = "";
var str11="";
var cancerDesc = "";
var cancerTitle = " ";
var postus = "";
$(function(){
	var str = getUrlQueryString("jsonKey");
	str = UrlDecode(str);	
	parm = JSON.parse(str);
	var orderNo = parm.orderNo; //订单号	
	phone = parm.phone;
	postus = parm.postu;
	$.init(orderNo);
	$.setscroll();
	
	/**---分享功能----*/
	var method=function(){
		wx.showMenuItems({
		    menuList: ['menuItem:share:appMessage','menuItem:share:timeline'] // 要显示的菜单项
		});
		var shareStr=temp;
		shareStr = JSON.stringify(shareStr);
		shareStr = UrlEncode(shareStr); // 加密过后的操作
		var shareurl= base.url+"tongdaoApp/page/html/cancerRisk/resultshare.html?jsonKey="+jsonStr;		// 分享链接
		var shareImgUrl= base.url+"App/images/tongdaoic.png";
		//分享给朋友
		wx.onMenuShareAppMessage({
		    title: cancerTitle, // 分享标题
		    desc: cancerDesc, // 分享描述
		    link:shareurl, // 分享链接
		    imgUrl: shareImgUrl, // 分享图标
		    type: '', // 分享类型,music、video或link，不填默认为link
		    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		    success: function () { 
		        // 用户确认分享后执行的回调函数
		       // mui.alert("您已成功分享给好友！","温馨提示");
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		    	mui.alert("您取消了分享！","温馨提示");
		    }
		});
		//分享到朋友圈
		wx.onMenuShareTimeline({  
		    title: cancerTitle, // 分享标题  
		    link: shareurl, // 分享链接  
		    imgUrl: shareImgUrl, // 分享图标  
		    success: function () {   
		        // 用户确认分享后执行的回调函数  
		    },  
		    cancel: function () {   
		        // 用户取消分享后执行的回调函数  
		    	mui.alert("您取消了分享！","温馨提示");
		    }  
		});

	}	
	getConfig(method);
	$(".h_back").unbind("tap").bind("tap",function(){		
		window.location.href="policyQuery.html?mobile="+phone+"&&type=2";
	})	
	$(".anniu1").unbind("tap").bind("tap",function(){		
		$("#zhezhaoImg").show();
	})	
	$(".anniu2").unbind("tap").bind("tap",function(){		
		window.location.href="policyQuery.html?mobile="+phone+"&&type=2";
	})	
	$("#zhezhaoImg").on("tap",function(){
		$("#zhezhaoImg").hide();
	});
})
/**
 * @function  初始化请求 
 */
$.init = function(orderNo){
	var url = base.url + "cancerRiskOrder/queryOrderByOrderNo.do"	
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
              temp ={
            		  "head":{
      	    			"customreId":"",
      	    			"mobile":data.returns.bxOrder.inviterPhone,
      	    			"name":""
      	    		},"body":{
      	    			"policyNo":data.returns.bxOrder.policyNo,
      	    			"orderNo":data.returns.bxOrder.orderNo,
      	    			"yuyueId":data.returns.bxOrder.yuyueId,
      	    			"coverage":data.returns.bxOrder.coverage,
      	    			"insuredname":data.returns.bxInsured.insuredname,
      	    			"productName":data.returns.bxProductMain.productName,
      	    		}		
              }			
			var parm=data.returns.bxOrder;
			var insureparm = data.returns.bxInsured;
			zhuangtai=parm.policyStatus;
			/*产品代码判断保险条款*/
			var pro = data.returns.bxProductMain;
			var cust = data.returns.bxTdCustomerBasic;
			productId = pro.productId;
			if(postus=="6"){		
				str11="已失效";
			}else if(postus=="11"){		
				str11="待生效";
			}else if(postus=="2"){	
				str11="保障中";
			}				 
			cancerDesc="您有一份保单"+str11+"。"+cust.name+"向您推荐了保单信息，点击查看";
			cancerTitle = pro.productName;
			if(productId=="004199002"||productId=="004199004"){//男
				$(".riskTiaokuan").bind("tap",function(){
					window.location.href = base.url+"tongdaoApp/page/html/tiaokuan/manTK.html";
				});				
			}else if(productId=="004199003"||productId=="004199005"){//女
				$(".riskTiaokuan").bind("tap",function(){
					window.location.href = base.url+"tongdaoApp/page/html/tiaokuan/womanTK.html";
				});
			}else if(productId=="004199006"||productId=="004199007"){
				$(".riskTiaokuan").bind("tap",function(){
					window.location.href = base.url+"tongdaoApp/page/html/tiaokuan/babyTK.html";
				});
			}					
			if(postus=="6"){
				$(".zhuangtai").attr("src","../../images/yishixiao.png");
			}else if(postus=="11"){
				$(".zhuangtai").attr("src","../../images/daishengxiao.png");
			}else if(postus=="2"){
				$(".zhuangtai").attr("src","../../images/baozhanging.png");
			}
			$(".riskName").html(data.returns.bxProductMain.productName);
			//订单号
			$(".policyNo").html(parm.policyNo);
			//身份证关键信息隐藏
			var insureIdentitycard=parm.insureIdentitycard+"";				
				$("#TBRName").html(parm.insureName);
				$("#TBRIDType").html("身份证");
				$("#TBRID").html(insureIdentitycard);
				$("#BBRName").html(insureparm.insuredname);
				$("#BBRIDType").html("身份证");
				$("#BBRID").html(insureparm.insuredidno);
				if(insureIdentitycard == insureparm.insuredidno){
					$(".tong").show();
					$(".BBR").hide();
				}
				/*$("#TBRMobile").html(parm.insurePhone);*/
				var kaishi=/\d{4}-\d{1,2}-\d{1,2}/g.exec(parm.startTime);
				var jiezhi=/\d{4}-\d{1,2}-\d{1,2}/g.exec(parm.endTime);
				$("#qijian").html(kaishi+"至"+jiezhi);
				/*$("#TBRMail").html(parm.insureEmail);
				$("#TBRBirthday").html($.getBirthDay(parm.insureIdentitycard));	*/
				$("#baofei").html(parm.prem+"元");
				/*$("#agentCode").html(data.returns.code ? data.returns.code : '');
				$("#agentName").html(data.returns.name ? data.returns.name : '');*/
				var orderResource="";				
				//渲染出行方式表格
				/*setTable();*/
				var str1="";
				str1="<div class='bar clearfix'>";
				str1+="<div>"+fangan(data.returns.bxProductMain.productcode)+"</div >";
				str1+="<div >"+data.returns.bxProductMain.productName+"</div >";
				str1+="<div >"+data.returns.bxOrder.coverage/10000+"万</div ></div >";
				$(".choose_way").append(str1);	
		} else {
			modelAlert(data.statusMessage);
			return false;
		}
	} else {
		modelAlert(data.statusMessage);
		return false;
	}
}; 
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#contentIndex").height(Scrollheight);
	mui("#contentIndex").scroll();
};
function statuFlag(value){
	var staflag = '';
	if(value == ''){
		staflag = 0;
	}else if(value == '1'){
		staflag = 1;
	}else if(value == '2'){
		staflag = 2;
	}else if(value == '3'){
		staflag = 3;
	}else if(value == '4'){
		staflag = 4;
	}
	return staflag;
}

function fangan(code){
	var str = "";
	if(code=="1014"||code=="1015"||code=="1017"){
		str = "基础版";
	}else if(code=="1016"){
		str = "升级版";
	}
	return str;
}

