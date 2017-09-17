$(function(){
    $.setscroll( "bodyMuiScroll" );
    //给弹窗赋值
    $("#mobile").val(mobile);
    $("#name").val(name);
    //点击预约出单
    yuyueClickBind();	
    //点击弹框里的确定按钮
    yuyueSubmit( customerId, ccId);		   
    sendLiveProductInfoRequest(ccId, provinceCode, cityCode, roleType )	//APP产品模块线下产品详情查询
    if( roleType == "02" ){					//如果是代理人    	
    	$(".single-footer").removeClass("yincang");    	
    }   
    if( roleType != "00" ){   	
    	sendCusInsConsultantRequest();
    }
    $(".info-content").unbind("tap").bind("tap",function(){
    	toInsuranceConsultant();
    });
    showRightIcon();
   
});
//点击预约出单
function yuyueClickBind(){
    $("#chudan").unbind("tap").bind("tap",function(){
    	sendCustomerAndAgentInfoRequest(customerId);
        $(".popup-shadow").css({"opacity":"1","display":"block"});
    });
}
//关闭弹窗
function closeShadow(){
    $(".popup-shadow").css({"opacity":"0","display":"none"});
    $("#name").val(name);
    $("#mobile").val(mobile);
}
//点击提交预约
function yuyueSubmit( cusId, ccId){
    $("#yuyue").unbind("tap").bind("tap",function(){
        var phone = $("#mobile").val();
        var name = $("#name").val();
        if( $.isNull(name) ){
            modelAlert( message.nameNull );
        }else if( tit.regExp.isChinese(name) == false ){
            modelAlert( message.nameError );
        }else if( $.isNull(phone) ){
            modelAlert( message.phoneNull );
        }else if( tit.regExp.isMobile(phone) == false ){
            modelAlert( message.phoneError );
        }else{
            sendAddYuyueInfoRequest(cusId,ccId,phone,name);
        }
        
    });
}
//APP用户及客户经理信息查询
function sendCustomerAndAgentInfoRequest(cusId){
    var url = requestUrl.cusAndAgenInfoUrl;
    var sendJson = {
        "head" : {
            "channel" : "01",
            "userCode" : mobile,
            "transTime" : $.getTimeStr(),
            "transToken" :transToken
        },
        "body" : {
            "customerId": cusId
        }
    }
    $.reqAjaxs( url, sendJson, cusAndAgenInfoRender ); 
}
// 获取线下产品请求方法
function sendLiveProductInfoRequest(ccId,provinceCode,cityCode,roleType){
    var url = requestUrl.liveProductInfoUrl;
    var sendJson = {
        "head" : {
            "channel" : "01",
            "userCode" : mobile,
            "transTime" : $.getTimeStr(),
            "transToken": transToken
        },
        "body" : {
        	"provinceCode"			 : provinceCode,
        	"cityCode"				 : cityCode,
            "commodityCombinationId" : ccId,
            "roleType"				 : roleType
        }
    }
    $.reqAjaxs( url, sendJson, liveProductInfoRender );
}
// 获取保险顾问信息
function sendCusInsConsultantRequest(){
	var url = requestUrl.cusInsConsultantUrl;
	var sendJson = {
        "head" : {
            "channel" : "01",
            "userCode" : mobile,
            "transTime" : $.getTimeStr(),
            "transToken" :transToken
        },
        "body" : {
            "customerId" : customerId
        }
    }
    $.reqAjaxs( url, sendJson, cusInsConsultantRender );
}
// APP产品模块线下产品预约新增
function sendAddYuyueInfoRequest( cusId, ccId, phone, name){
	var url = requestUrl.addYuyueInfoUrl;
	var sendJson = {
        "head" : {
            "channel" : "01",
            "userCode" : mobile,
            "transTime" : $.getTimeStr(),
            "transToken": transToken
        },
        "body" : {
            "customerId": cusId,
            "commodityCombinationId": ccId,
            "yuyuePhone": phone,
            "yuyueName": name
        }
    }
    $.reqAjaxs( url, sendJson, addYuyueInfoRender );
}
/**
 * @function 请求响应的产品预约新增数据处理
 * @param {*} data 
 */
function cusAndAgenInfoRender(data){
    console.log(data);
    if( data.statusCode == ajaxStatus.success ){
        var body = data.returns;
        var customerBasic = body.customerBasic;
        var agent         = body.agent;
        $("#name").val(customerBasic.name);
        $("#mobile").val(customerBasic.userName);
        $("#kehuName").text(agent.recommendAgentName);
        $("#kehuPhone").text(agent.recommendAgentMobile);
    }else if( data.statusCode == ajaxStatus.relogin ){
        modelAlert( data.statusMessage, "", toLogin ); 
    }else{
    	modelAlert( data.statusMessage );
    }
}
function toLogin(){
	loginControl();	
}
/**
 * @function 请求响应的产品预约新增数据处理
 * @param {*} data 
 */
function addYuyueInfoRender(data){
    console.log(data);
    if( data.statusCode == ajaxStatus.success ){
        var body = data.returns;
        var yuyueNo  = body.yuyueNo;//获取预约号
        //alert(yuyueNo);
        closeShadow();
        modelAlert("恭喜您，预约提交成功！请保持电话畅通，客户经理会与您电话联系，谢谢！","",toYuyueList);
       
    }else if( data.statusCode == ajaxStatus.relogin ){
        modelAlert( data.statusMessage, "", toLogin ); 
    }else{
    	modelAlert( data.statusMessage );
    }
}
/**
 * @function 请求响应的线下产品详情数据处理
 * @param {*} data 
 */
 function cusInsConsultantRender(data){
    console.log(data);
    if( data.statusCode == ajaxStatus.success ){    	
        var cusInfo = data.returns.customerBasic;
        var mobile1  = cusInfo.mobile;//获取姓名
        var name1    = cusInfo.name;//获取手机号
        getTouxiang(mobile1);
        //var userImg = cusInfo.userImage;//获取用户头像
        $("#bigname").text(name1);
        $("#bigphone").text(mobile1);
        $(".phone-button").bind("tap",function(){
        	callService(mobile1,".phone-button");
        });
        $(".message-button").unbind("tap").bind("tap",function(){
        	callSendMessage(mobile1);
        });
        if( cusInfo.cityCode == cityCode ){
        	$(".insurance-customer").removeClass("none");
        }
        
    }else if( data.statusCode == ajaxStatus.relogin ){
        modelAlert( data.statusMessage, "", toLogin ); 
    }else{
    	//modelAlert( data.statusMessage );
    }
    
 }
/**
 * @function 请求响应的线下产品详情数据处理
 * @param {*} data 
 */
function liveProductInfoRender( data ){
    console.log( data );
    if( data.statusCode == ajaxStatus.success ){
        var body = data.returns;
        var companyInfo          = body.companyInfo;          //保险公司信息
        var calculationInfos     = body.calculationInfos;     //保费试算展示项信息     
        var commodityInfoList    = body.commodityInfoList;    //商品列表
        var commodityClauseList  = body.commodityClauseList;  //所有产品条款列表       
        var commodityModuleList  = body.commodityModuleList;  //商品组合模块配置信息列表
        var commodityCombination = body.commodityCombination; //商品组合详情 
        shareDesc = commodityCombination.insuredInfo;
        shareTitle = commodityCombination.commodityCombinationName;
        for( var i = 0; i < commodityModuleList.length; i++ ){
            //拼接一个模块
            moduleStr(commodityModuleList[i]);
        }
        clauseModuleStr(commodityClauseList);   //添加保险条款列表

    }else if( data.statusCode == ajaxStatus.relogin ){
        modelAlert( data.statusMessage, "", toLogin ); 
    }else{
    	modelAlert( data.statusMessage );
    }
}
/**
 * @function 试算条件展示 
 */
function calChoice( calList ){
    var calName = calList.calName;
    var calDetails = calList.calDetails;
    var calDetailsStr = detailsRender(calDetails);
    var str = "";
    str += '<div class="d1">';
    str += '<div class="label">'+calName+'：</div>';
    str += '<div class="conter">';
    str += calDetailsStr;
    str += '</div></div>';
    $("#insurance-choice").append(str);
}
function detailsRender(calDetails){
    var str = "";
    var detailLength = calDetails.length;
    if(detailLength == 1){
        str += calDetails[0].enuContent;
    }else{
        str += '<ul class="radio">';
        for(var i = 0; i < detailLength; i++ ){
            if( i == 0 ){
                str += '<li class="on">'+calDetails[i].enuContent+'</li>'
            }else{
                str += '<li>'+calDetails[i].enuContent+'</li>'
            }           
        }
        str += '</ul>';
    }   
    return str;
}
/**
 * @function 商品组合模块配置信息列表
*/
function moduleStr( moduleList ){
	var modueInfo = moduleList.modueInfo;			//显示内容
	var subModuleName = moduleList.subModuleName;
	if( moduleList.moduleName == "banner" ){
		$("#banner").attr("src",modueInfo);
	}
	if( moduleList.moduleName == "商品名称" ){
		$("#commodityCombinationName").text(modueInfo); //商品组合名称
	}
	if( moduleList.moduleName == "承保公司" ){
		$("#companyName").text(modueInfo);				//承保公司名称
	}
	if( moduleList.moduleName == "基本信息" ){
		var str = "";
	    str += '<div class="d1">';
	    str += '<div class="label">'+subModuleName+'：</div>';
	    str += '<div class="conter">';
	    if( subModuleName == "保障期限"){
	    	str += '<ul class="radio"><li class="on">'+modueInfo+'</li></ul>'
	    }else if( subModuleName == "缴费期间" ){
	    	var moduleList = modueInfo.split("、");
	    	str += '<ul class="radio">';
	    	for(var i = 0; i < moduleList.length; i++){
	    		str += '<li class="on">'+moduleList[i]+'</li>'
	    	}
	    	str +='</ul>'
	    }else{
	    	str += modueInfo;
	    }
	   
	    str += '</div></div>';
	    $("#insurance-choice").append(str);
	}
	if( moduleList.moduleName == "产品特色" ){
	    var str = "";
	    str += '<dl class="module mb10 whitebackground ">'
	    str += '<dt class="content-title"><img src="../../../image/insurance/product_detail.png">' + moduleList.moduleName + '</dt>'
	    str += '<dd class="con content-info star">' 
	    str += modueInfo     	    
	    str += '</dd></dl>'
	    $(".insurance-content").append(str);
	}
    
    
}

/**
 * @function 所有产品条款列表
 */
function clauseModuleStr( clauseModuleList ){
    var moduleName = '保险产品详细说明';
    var str = "";
    str += '<dl class="module mb10 whitebackground ">'
    str += '<dt class="content-title"><img src="../../../image/insurance/product_point.png">' + moduleName + '</dt>'
    str += '<dd class="content-info"><ul class="clearfix" id="">'
    for(var i = 0; i < clauseModuleList.length; i++ ){
        if( clauseModuleList[i].isNeed == "1" ){
            str += '<li data-url="' + clauseModuleList[i].insurancClauseDownload + '" data-productid="'+clauseModuleList[i].productId+'" onclick="download(this)"><p class="li-left"><span class="orange">(必选)</span>' + clauseModuleList[i].productName + '</p>';
        }else if( clauseModuleList[i].isNeed == "0" ){
            str += '<li data-url="' + clauseModuleList[i].insurancClauseDownload + '" data-productid="'+clauseModuleList[i].productId+'" onclick="download(this)"><p class="li-left">' + clauseModuleList[i].productName + '</p>';
        } 
        if( clauseModuleList[i].riskClass == "01" ){
            str += '<p class="li-right">主险<span class="iconleft"></span></p></li>';
        }else if( clauseModuleList[i].riskClass == "02" ){
            str += '<p class="li-right">附加险<span class="iconleft"></span></p></li>';
        }    
    }
    str += '</ul></dd></dl>'
    $(".insurance-content").append(str);
}
/**
 * @function 跳转到条款页面
 * @param {*} obj 
 */
function download(obj){
    var downloadUrl = $(obj).attr("data-url");
    var productId = $(obj).attr("data-productid");
    //window.location.href = downloadUrl;
    urlParm.title = "保险产品详细说明";
    urlParm.leftIco = "1";
    urlParm.rightIco = "0";
    urlParm.downIco = "0";
    urlParm.productId = productId;
    var jsonStr = UrlEncode(JSON.stringify(urlParm));
    window.location.href = base.url + "tongdaoApp/html/agreement/liveProductProtocol.html?jsonKey="+jsonStr;
}

function toYuyueList(){
	urlParm.title = "预约列表";
	urlParm.leftIco = "1";
	urlParm.rightIco = "0";
	urlParm.downIco = "0";
	urlParm.userCode = mobile;
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/agent/myBookings/subscribeList.html?jsonKey="+jsonStr;
}

function toInsuranceConsultant(){
	urlParm.title = "保险顾问";
	urlParm.leftIco = "1";
	urlParm.rightIco = "0";
	urlParm.downIco = "0";
	urlParm.userCode = mobile;
	var url = base.url + "customerBasic/getCustomerBasicInfo.do";
	var agentId ="";
	var sendJson = {
			"head":{
				"channel" : "02",
	            "userCode" : "",
	            "transTime" : $.getTimeStr(),
	            "transToken": ""
			},
			"body":{
				"customerId":customerId
			}
	}
	$.reqAjaxsFalse( url, sendJson, function(data){
		console.log(data);
		if( data.statusCode == "000000"){
			agentId = data.returns.agentInfo.agentId
		}
	} );
	urlParm.agentId  = agentId;
	urlParm.type = roleType;
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/insuranceConsultant/insuranceConsultant.html?jsonKey="+jsonStr;
}

function getTouxiang(mobile){
	$.ajax({
		type: "get",
		url: base.url+"customerBasic/getAppImage.do",
		data: "userName="+mobile,
		success: function(data){
			if(data){
				$(".touinner").attr("src",base.url+"customerBasic/getAppImage.do?userName="+mobile);
			}else{
				$(".touinner").attr("src","../../../image/common/tou.png");
			}		
		   },
		error:function(){
			$(".touinner").attr("src","../../../image/account/tou.png");
		}
		});
}
function backlast(){
	sysback();
}
function shareHandle(){
	var title = shareTitle;
	var desc  = shareDesc;	
	var shareurl = base.url+"tongdaoApp/html/share/insurance/main/liveProductDetail.html"+window.location.search;
	var picUrl = getProductSharePic(ccId);
	shareMethod(shareurl,title,desc,"baodan",picUrl);		
};