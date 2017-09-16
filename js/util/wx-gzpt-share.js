/**
 * 公众号分享功能初始化
 */
var method;
function getConfig(fuc) {
	method=fuc
	var url = base.url + "wxBasic/getConfig.do";// 获取验证码
	var data = {
		"url" : encodeURIComponent(location.href.split('#')[0])
	};
	$.toAjaxs(url, data, $.getConfigBack);
}
$.getConfigBack = function(param) {
	if (param.statusCode == '000000') {
		wx.config({
			debug : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			appId : param.returns.config.appId, // 必填，公众号的唯一标识
			timestamp : param.returns.config.timestamp, // 必填，生成签名的时间戳
			nonceStr : param.returns.config.nonceStr, // 必填，生成签名的随机串
			signature : param.returns.config.signature,// 必填，签名，见附录1
			"url":location.href.split('#')[0],
			jsApiList : [ 'chooseImage','onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','uploadImage']
		// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});
		wx.error(function(res) {
			
			//alert("wxError--" + JSON.stringify(res));
			// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
		});
		wx.ready(function() {
			wx.checkJsApi({
			    jsApiList: ['chooseImage','onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','uploadImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
			    success: function(res) {
			    	//alert("wxReady--" + res);
			        // 以键值对的形式返回，可用的api值true，不可用为false
			        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
			    }
			});
			
			//分享给朋友（此处代码复制到需要分享的页面js中，注意在初始化结束之后调用，可以设置成页面加载完成后或延时执行）
			method();
		
			
		});
	} else {
		alert("公众号初始化失败！");
	}

};


