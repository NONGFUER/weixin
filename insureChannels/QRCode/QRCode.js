$(function(){
	mui('.mui-scroll-wrapper').scroll();
	if(urlParm.ccname){
		$('#ccname').text(urlParm.ccname);
	}else{
		$('#ccname').text('同道保险商城');
	}
	queryShowInfo(customerId)
	productQR();
	var method = function() {
		if( urlParm.qrFlag == 'mall' ){
			var title = "同道保险";
			var desc = "为您提供专业的保险服务";
			var picUrl = base.url+'tongdaoApp/image/share/tongdaoic.png'
		}else if( urlParm.qrFlag == 'detail' ){
			var title = urlParm.ccName;
			var desc = urlParm.shareDesc
			var picUrl = urlParm.sharePic
		}		
		var picUrl1 = $("#QRCode").attr("src");
		var shareUrl = base.url + 'weixin/insureChannels/QRCode/QRCodeShare.html?picUrl='+picUrl1;
		wx.showMenuItems({
			menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline'] // 要显示的菜单项
		});

		//分享给朋友
		wx.onMenuShareAppMessage({
			title: title, // 分享标题
			desc: desc, // 分享描述
			link: shareUrl, // 分享链接
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
			link: shareUrl, // 分享链接  
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
	$('#share').unbind('tap').bind('tap',function(){
		var method = function() {
			var title = "渠道出单";
			var desc = "分享二维码";
			var picUrl = $("#QRCode").attr("src");	
			var shareUrl = base.url + 'weixin/insureChannels/QRCode/QRCodeShare.html?picUrl='+picUrl;
			wx.showMenuItems({
				menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline'] // 要显示的菜单项
			});

			//分享给朋友
			wx.onMenuShareAppMessage({
				title: title, // 分享标题
				desc: desc, // 分享描述
				link: shareUrl, // 分享链接
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
				link: shareUrl, // 分享链接  
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
		$('#weixin').show()
		getConfig(method);
	});
	$("#guanbi").unbind('tap').bind("tap", function() {
		$('#weixin').hide()
	})
	
});

function productQR(){
	var url = base.url +'productCommon/productQR.do';
	if(urlParm.ccId){
		var ccId = urlParm.ccId;
	}else{
		var ccId = ''
	}
	if( urlParm.qrFlag == 'mall' ){
		var state = '10'
		var fl = '1'
	}else if( urlParm.qrFlag == 'detail' ){
		var state = '11'
		var fl = '2'
	}
	var shareurl = base.url+"tongdaoApp/html/share/kongbai.html?mobile="+mobile+'&ccId='+ccId+'&type='+state;
	var reqData = {
		"head":{
			"channel" : "02",
            "userCode" : mobile,
            "transTime" : $.getTimeStr(),
            "transToken": ""
		},
		"body":{
			"customerId": customerId,
			"url": shareurl,
			"flag":fl//1产品列表，2产品详情
		}			
	}
	$.reqAjaxs( url, reqData, productQRCallback );
}

function productQRCallback(data){
	console.log(data);
	$("#QRCode").attr("src",data.returns.QRUrl);
}

function queryShowInfo(customerId){
	var url = base.url + 'channel/queryShowInfo.do';
	var reqData = {
			'request':{
				"customerId" : customerId
			}
	}
	$.reqAjaxs( url, reqData, queryShowInfoCallback );
}

function queryShowInfoCallback(data){
	if( data.statusCode == '000000' ){
		var channelCustomerEdit     = data.returns.channelCustomerEdit;
		$("#qdDotName").attr('agentId',channelCustomerEdit.agentId);
		if($.isNull(channelCustomerEdit.bySalesmanCode)){
			$("#ywy").hide();
		}
		$("#ywyCode").val(channelCustomerEdit.bySalesmanCode); //业务员工号
		$("#ywyName").val(channelCustomerEdit.bySalesmanName); //业务员名称
		$("#ywyCompany").attr('name',channelCustomerEdit.bySalesmanOrgCode);//业务员分公司
		$("#ywyCompany").val(channelCustomerEdit.bySalesmanOrgName);
		$("#ywySubPany").attr('name',channelCustomerEdit.bySalesmanSubOrgCode);//业务员中支机构
		$("#ywySubPany").val(channelCustomerEdit.bySalesmanSubOrgName);
		
		$("#orgProvinceCode").attr('name',channelCustomerEdit.salesProvinceCode);			//渠道所属地区
		$("#orgProvinceCode").text(channelCustomerEdit.salesProvinceName);
		$("#orgCityCode").attr('name',channelCustomerEdit.salesCityCode);		//渠道所属地区
		$("#orgCityCode").text(channelCustomerEdit.salesCityName);
		$("#qdName").attr('name',channelCustomerEdit.salesChannelCode);			//渠道名称
		$("#qdName").text(channelCustomerEdit.salesChannelName);
		$("#qdDotName").attr('name',channelCustomerEdit.dotCode);			//渠道网点名称
		$("#qdDotName").text(channelCustomerEdit.dotName);
		if(channelCustomerEdit.isShow == '1'){
			$('.qqhidden').show();
		}
		$("#salesmanCode").val(channelCustomerEdit.salesmanCode);				//渠道员工工号
		$("#salesmanMobile").val(channelCustomerEdit.salesmanMobile);			//渠道员工名称
		$("#salesmanName").val(channelCustomerEdit.salesmanName);				//渠道员工手机号码
		$("#remark").val(channelCustomerEdit.remark);					//备注
	}else{
		modelAlert(data.statusMessage)
	}
}