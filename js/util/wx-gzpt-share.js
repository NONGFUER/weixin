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
			jsApiList : [ 'chooseImage','onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','hideMenuItems','showMenuItems','uploadImage']
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
			// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
			/*wx.chooseImage({
				count : 1, // 默认9
				sizeType : [ 'original', 'compressed' ], // 可以指定是原图还是压缩图，默认二者都有
				sourceType : [ 'album', 'camera' ], // 可以指定来源是相册还是相机，默认二者都有
				success : function(res) {
					var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
				}
			});
			
			//分享给朋友（此处代码复制到需要分享的页面js中，注意在初始化结束之后调用，可以设置成页面加载完成后或延时执行）
			wx.onMenuShareAppMessage({
			    title: '测试分享给朋友', // 分享标题
			    desc: '这是分享描述', // 分享描述
			    link: 'www.baidu.com', // 分享链接
			    imgUrl: '', // 分享图标
			    type: '', // 分享类型,music、video或link，不填默认为link
			    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			    success: function () { 
			        // 用户确认分享后执行的回调函数
			        alert("成功分享给朋友");
			    },
			    cancel: function () { 
			        // 用户取消分享后执行的回调函数
			    	alert("已取消分享给朋友");
			    }
			});
			
			//分享到QQ
			wx.onMenuShareQQ({
			    title: '测试分享到QQ', // 分享标题
			    desc: '分享到QQ描述', // 分享描述
			    link: 'www.baidu.com', // 分享链接
			    imgUrl: '', // 分享图标
			    success: function () { 
			       // 用户确认分享后执行的回调函数
			        alert("成功分享给QQ");
			    },
			    cancel: function () { 
			       // 用户取消分享后执行的回调函数
			    	alert("取消分享QQ");
			    }
			});*/
			
		});
	} else {
		alert("公众号初始化失败！");
	}

};


