$(function(){
	productQR();
	var method = function() {
		var title = "渠道出单";
		var desc = "分享二维码";
		var picUrl = $("#QRCode").attr("src");				
		wx.showMenuItems({
			menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline'] // 要显示的菜单项
		});

		//分享给朋友
		wx.onMenuShareAppMessage({
			title: title, // 分享标题
			desc: desc, // 分享描述
			link: $("#QRCode").attr("src"), // 分享链接
			imgUrl: picUrl, // 分享图标
			type: '', // 分享类型,music、video或link，不填默认为link
			dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			success: function() {
				// 用户确认分享后执行的回调函数
				// mui.alert("您已成功分享给好友！","温馨提示");
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
				mui.alert("您取消了分享！", "温馨提示");
			}
		});
		//分享到朋友圈
		wx.onMenuShareTimeline({
			title: title + "-" + desc, // 分享描述, // 分享标题  
			link: $("#QRCode").attr("src"), // 分享链接  
			imgUrl: picUrl, // 分享图标  
			success: function() {
				// 用户确认分享后执行的回调函数  
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数  
				mui.alert("您取消了分享！", "温馨提示");
			}
		});
	}
	getConfig(method);
});

function productQR(){
	var url = base.url +'productCommon/productQR.do';
	var reqData = {
		"head":{
			"channel" : "02",
            "userCode" : mobile,
            "transTime" : $.getTimeStr(),
            "transToken": ""
		},
		"body":{
			"customerId": customerId,
			"url": urlParm.lastUrl,
			"flag":"1"//1产品列表，2产品详情
		}			
	}
	$.reqAjaxs( url, reqData, productQRCallback );
}

function productQRCallback(data){
	console.log(data);
	$("#QRCode").attr("src",data.returns.QRUrl);
}