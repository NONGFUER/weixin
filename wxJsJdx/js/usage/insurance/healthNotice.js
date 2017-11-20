var _paq = _paq || [];
var healthy = {
		init: function() {
			healthy.submitBtn();
			getHealthToldRequest(ccId);
		},
		submitBtn: function() {
			$(".errorBtn").click(function() {
				healthy.submitFlase(this)
			}), 
			$("#gaozhiBtn").click(function() {
				$("#baoxiantiaokuan")[0] && $.newBox({
					id: $("#baoxiantiaokuan")
				})
			})
		},
		submitFlase: function(t) {
			_paq.push(["trackEvent", "身体不健康", util.ids.pid]);
			var t = $(t),
				i = $("#jwx_notice_tips");
			t.data("error") ? i.find(".text_error").html(t.data("error")) : i.find(".text_error").html("被保人的健康状况不满足该保险投保规定。"), 
			$.newBox({id: i})
		}
		
	}
var util = {
		ids: {
			pid: $("#productId").val(),
			zyid: "#zhiyeBox",
			ease: ".easeAmount",
			bmi: ".health-BMI"
		}
	};
healthy.init();
$("#btnHaif").click(function(){	//“全部为否”按钮
	urlParm.title    = "投保信息";
	urlParm.leftIco  = "1";
	urlParm.rightIco = "0";
	urlParm.downIco  = "0";
	var jsonStr1 = UrlEncode(JSON.stringify(urlParm));
	window.location.href = "insure.html?jsonKey="+jsonStr1;
});	
$("#otherProduct").bind("tap",function(){
	sysback();
});
$(".healthy-error .a1").click(function(){
	callService("4006895505",".kefuPhone")
})

//根据商品组合id查询健康告知
function getHealthToldRequest(ccId){
    var url = requestUrl.heathTold;
    var sendJson = {
        "head" : {
            "channel" : "01",
            "userCode" : mobile,
            "transTime" : $.getTimeStr(),
            "transToken": ""
        },
        "body" : {
            "commodityCombinationId": ccId//11-商务飞人  9-健康安详
        }
    }
    $.reqAjaxs( url, sendJson, healToldCallBack ); 
}
//渲染健康告知
function healToldCallBack(data){
	//console.log(data);
	if( data.statusCode == ajaxStatus.success ){		
		var body = data.returns;
		var healthTold = body.healthTold;
		for( var i = 0; i < healthTold.length; i++ ){
		 var str = healthTold[i].toldMessage +'<br/>';
		 $("#healthTold").append(str);
		}		
	}else{
		modelAlert(data.statusMessage);
	}
}
//返回
function backlast(){
	urlParm.title    = "产品详情";
	urlParm.leftIco  = "1";
	urlParm.rightIco = "0";
	urlParm.downIco  = "0";
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = "productDetail.html?jsonKey="+ jsonStr;
}