$(function(){
    //$.setscroll( "bodyMuiScroll" );
    sendCommodityListRequest(ccId);//APP产品模块线下产品详情查询
});

function sendCommodityListRequest(ccId){
    var url = requestUrl.commodityListUrl;
    var sendJson = {
        "head" : {
            "channel" : "01",
            "userCode" : mobile,
            "transTime" : $.getTimeStr()
        },
        "body" : {
            "commodityCombinationId": ccId
        }
    }
    $.reqAjaxs( url, sendJson, commodityListRender );
}

function commodityListRender(data){
    console.log(data);
    if( data.statusCode == ajaxStatus.success ){
    	var body = data.returns;
    	var commodityInfoList = body.commodityInfoList;
    	for( var i = 0; i < commodityInfoList.length; i++ ){
    		var commodityStr = '<div class="bar" data-cid="'+commodityInfoList[i].id+'" onclick="toArticle(this)"><span>'+commodityInfoList[i].commodityName+'</span><div class="icon_bxtk"><img class="" src="../../../image/insurance/tkright.png"></div></div>';
    		$(".commodityList").append(commodityStr);
    	}
    }else{
       modelAlert( message.requestFail );
    }
}

function toArticle(obj){
	urlParm.cId  = $(obj).attr("data-cid");
	urlParm.title = "条款列表";
	urlParm.leftIco = "1";
	urlParm.rightIco = "0";
	urlParm.downIco = "0";
	urlParm.frompage = "commodityHtml";
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "weixin/wxJsJdx/html/agreement/article.html?jsonKey="+jsonStr;
}

function backlast(){
	urlParm.title = "产品详情";
	urlParm.leftIco = "1";
	if( roleType != "00" ){
		urlParm.rightIco = "1";
	}else{
		urlParm.rightIco = "0";
	}
	urlParm.downIco = "0";
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "weixin/wxJsJdx//html/insurance/main/productDetail.html?jsonKey="+jsonStr;
}
//佣金接口
//function sendCommissionInfoRequest(provinceCode,cityCode,commodityId,roleType){
//    var url = requestUrl.commissionInfoUrl;
//    var sendJson = {
//        "head" : {
//            "channel" : "01",
//            "userCode" : mobile,
//            "transTime" : $.getTimeStr()
//        },
//        "body" : {
//            "provinceCode": "320000",
//            "cityCode": "320012",
//            "commodityId": "118",
//            "roleType":roleType
//        }
//    }
//    $.reqAjaxs( url, sendJson, commissionInfoRender );
//}
//function commissionInfoRender(data){
//    console.log(data);
//}