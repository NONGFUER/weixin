var tagsList = [];
$(function(){
	commodifyTagRequest();	 //获取商品标签
	//getAgentInfoRequest();   //获取当前用户基本信息
	bannerRequest();		 //banner轮播列表
	//onlineProductRequest("2");  //在线产品请求
	mui("#lunslider").slider({
		interval: 2000
	});
	mui('.mui-scroll-wrapper').scroll();
	if( urlParm.shareFlag != 'Y'){
		var method = function() {
			var title = "同道保险";
			var desc = "为您提供专业的保险服务";
			var picUrl = base.url+'tongdaoApp/image/share/tongdaoic.png'		
			var shareUrl = base.url+"tongdaoApp/html/share/kongbai.html?mobile="+mobile+'&ccId=&type=10';
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
	}
});

//获取商品类别标签
function commodifyTagRequest(){
	var url = base.url + "commonCache/getPwbDictionary.do";
	var reqData = {
			 "head": {
				    "channel": "02",
				    "userCode": mobile,
				    "transTime": $.getTimeStr()
			 },
			 "body":{
				 "dicType":"commodity_combination_tag"
			 }
	}
	$.reqAjaxsFalse( url, reqData, commodifyTagCallBack );
}
//得到标签数据
function commodifyTagCallBack(data){
	if( data.statusCode == "000000" ){
		var tags = data.returns.pwbDictionary;
		var tagslen = tags.length;
		for( var i = 0; i < tagslen; i++ ){
			tagsList.push(tags[i].value);
			var tagStr = tagsStr(tags[i].text,i);
			var listCon = listConStr(i+1);
			$("#tagScroll").append(tagStr);
			//$("#proGroup").append(listCon);
			//onlineProductRequest(i)
		}
		onlineProductRequest1(document.getElementById('first'))
		$('.tagg').unbind('tap').bind('tap',function(){
			onlineProductRequest1($(this))
		});
	}
}

//拼接标签字符串
function tagsStr(tagText,index){
	var str = '';
	if( index == '0' ){
		str += '<span class="tagg mui-control-item mui-active" id="first" >'+ tagText +'</span>';
	}else{
		str += '<span class="tagg mui-control-item" id=""  >'+ tagText +'</span>';
	}    
	return str;    
}
function listConStr(index){
	var str = '';
	if( index == '1' ){
		str +=	'<div id="item1mobile" class="mui-slider-item mui-control-content mui-active">'
	}else{
		str +=	'<div id="item'+ index +'mobile" class="mui-slider-item mui-control-content ">'
	}		
		str +='<div id="scroll1" class="mui-scroll-wrapper">'
		str +='<div class="mui-scroll"><div class="product-items con-box"></div></div></div></div>'				
	return str;	
}

//banner请求
function bannerRequest(){
	console.log("轮播参数："+agentId);
	var url = base.url + "lunBo/getLunBoList.do";
	var reqData = {
			 "head": {
				    "channel": "1",//（1-app;2-pc;3-wx）
				    "userCode": mobile,
				    "transTime": $.getTimeStr()
			 },
			 "body":{
				 "lunboType":"2",
				 "agentId":agentId
			 }
	}
	$.reqAjaxsFalse( url, reqData, bannerCallback );
}

//banner请求数据响应，将banner图片渲染到页面
function bannerCallback(data){
	if( data.statusCode == "000000" ){
		var images = data.returns.lunBos;	//后台返回的轮播对象		
		var imgth = images.length;
		imagesStr(images,imgth);			//页面渲染，字符串拼接
	}
}

//拼接，先拼接最后一张，再按正常顺序拼接，最后拼接第一张
function imagesStr(imgs,length){	
	var lunbo0 = '<div class="mui-slider-item mui-slider-item-duplicate"><a href="#"><img data-ccid="'+imgs[length-1].commodityCombinationId+'" data-url="'+ imgs[length-1].linkUrl +'" onclick="toProductX(this)" src="'+imgs[length-1].picUrl+'" onerror="zwt(this)"></a></div>';
	$("#lunbo").append(lunbo0);
	for( var i = 0; i < length; i++ ){
		var picUrl = imgs[i].picUrl;
		var lunbo = '<div class="mui-slider-item"><a href="#"><img data-ccid="'+imgs[i].commodityCombinationId+'" data-url="'+ imgs[i].linkUrl +'" onclick="toProductX(this)" src="'+picUrl+'" onerror="zwt(this)"></a></div>';;
		$("#lunbo").append(lunbo);
	}
	var lunbol = '<div class="mui-slider-item mui-slider-item-duplicate"><a href="#"><img data-ccid="'+imgs[0].commodityCombinationId+'" data-url="'+ imgs[0].linkUrl +'" onclick="toProductX(this)" src="'+imgs[0].picUrl+'" onerror="zwt(this)"></a></div>';	
	$("#lunbo").append(lunbol);
	for( var i = 0; i < length; i++  ){
		if( i == 0 ){
			$("#dian").append('<div class="mui-indicator mui-active"></div>')
		}else{
			$("#dian").append('<div class="mui-indicator"></div>');
		}		
	}
}

//图片错误则显示默认图片
function zwt(obj){
	var errimg = base.url + 'weixin/images/common/zwt.png';
	$(obj).attr("src",errimg);
}


//获取用户信息
function getAgentInfoRequest(){
	var url = base.url + "customerBasic/getCustomerBasicInfo.do";
	var sendJson = {
			"head":{
				"channel" : "02",
	            "userCode" : mobile,
	            "transTime" : $.getTimeStr(),
	            "transToken": ""
			},
			"body":{
				"customerId":customerId
			}
	}
	$.reqAjaxsFalse( url, sendJson, agentInfoCallback ); 
}

//得到代理人信息机构代码
function agentInfoCallback(data){
	if(data.statusCode == "000000"){
		//agentId = data.returns.agentInfo.agentId + "";
		var cityCode = data.returns.customerBasic.cityCode;
		var cityName = data.returns.customerBasic.cityName;
		var provinceCode = data.returns.customerBasic.provinceCode;
		var provinceName = data.returns.customerBasic.provinceName;
		//$('#local').text(cityName);
		getAgentInfo(cityName)
	}
}

function onlineProductRequest1(obj){
	var url = base.url + "product/queryOnlineProduct.do";
	var sendJson = {
			"head":{
				"channel" : "02",
	            "userCode" : mobile,
	            "transTime" : $.getTimeStr(),
	            "transToken": ""
			},
			"body":{
				"tagInfo":$(obj).text(),
				"provinceCode":provinceCode,
				"cityCode":cityCode,
				"pageNo":"1",
				"pageSize":"100",
				"type":"01",		//角色
				"salesChannels":salesChannels,   //销售渠道：01佰盈渠道，02
				"commodityCombinationShowType":"01" //商品组合展示类型01-线上；02-线下；03-即将上线   04-微信
			}
	}
	$.reqAjaxs( url, sendJson, onlineProductCallback1 );
}

function onlineProductCallback1(data){
	if( data.statusCode == "000000" ){
		var onepage = data.returns.pager.entities;
		$("#lr").css("transform","translate3d(0px, 0px, 0px)");
		$('#proGroup').html('');
		for( var i = 0; i < onepage.length; i++ ){
			var staPrem = onepage[i].commodityCombination.startPiece;
			var proName = onepage[i].commodityCombination.commodityCombinationName;
			var proImge = onepage[i].commodityCombination.commodityCombinationImage;
			var proDesc = onepage[i].commodityCombination.insuredInfo;
			var proLink = onepage[i].commodityCombination.linkUrl;
			var proCcid = onepage[i].commodityCombination.id + "";
			var str = "";	 
				str += '<li class="list display-box" data-ccid="'+proCcid+'" data-url="'+ proLink +'" onclick="toProduct(this)">'
				str += '<img src="'+ proImge +'" id="pic" class="box-flex0" onerror="zwt(this)">'
				str += '<div class="cont box-flex1"><h3>'+ proName +'</h3><p class="tips">'+ proDesc +'</p><p class="price-box">'+ staPrem +'</p></div></li>'				
			$('#proGroup').append(str);
		}
	}else{
		
	}
}

//跳转到产品详情页面
function toProduct(obj){
	var urlto = $(obj).attr("data-url");	 	
	urlParm.ccId = $(obj).attr("data-ccid");					//ccId:"23"		
	urlParm.cityCode = cityCode;										//cityCode:"200000"
	urlParm.commodityCombinationId = $(obj).attr("data-ccid");	//commodityCombinationId:"23"
	urlParm.customerId = customerId;							//customerId:"812"	
	urlParm.isComing = '0';										//isComing:"0"																
	urlParm.mobile = mobile;									//mobile:"13852291705"																
	urlParm.provinceCode = provinceCode;									//provinceCode:"200000"																
	urlParm.roleType = roleType;								//roleType:"01"
	urlParm.entry = entry;										//区分入口:微信渠道,微信保险商城
	urlParm.title = '产品详情';									//title:"产品详情"					
	urlParm.rightIco = '1';															//ccCode:"00500006"  不需要
																//rightIco:"0"
																//leftIco:"1"
																//downIco:"0"
																//idAuth:"1"
																//name:"张瑞"
																//idNo:"41272719910403262X"															
																//transToken:"40bcc8a9c52618a928ab6165be49c711"
																//userCode:"13852291705"
	urlParm.sourcePage = 'qudaoMall'
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + urlto +'?jsonKey='+jsonStr;	
}

//跳转到产品详情页面
function toProductX(obj){
	var urlto = $(obj).attr("data-url");	 	
	urlParm.ccId = $(obj).attr("data-ccid");					//ccId:"23"		
	urlParm.cityCode = cityCode;										//cityCode:"200000"
	urlParm.commodityCombinationId = $(obj).attr("data-ccid");	//commodityCombinationId:"23"
	urlParm.customerId = customerId;							//customerId:"812"	
	urlParm.isComing = '0';										//isComing:"0"																
	urlParm.mobile = mobile;									//mobile:"13852291705"																
	urlParm.provinceCode = provinceCode;									//provinceCode:"200000"																
	urlParm.roleType = roleType;								//roleType:"01"
	urlParm.entry = entry;										//区分入口:微信渠道,微信保险商城
	urlParm.title = '产品详情'									//title:"产品详情"
	urlParm.rightIco = '1';															//ccCode:"00500006"  不需要
																//rightIco:"0"
																//leftIco:"1"
																//downIco:"0"
																//idAuth:"1"
																//name:"张瑞"
																//idNo:"41272719910403262X"																
																//transToken:"40bcc8a9c52618a928ab6165be49c711"
																//userCode:"13852291705"
	urlParm.sourcePage = 'qudaoMall'
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = urlto +'?jsonKey='+jsonStr;	
}

//通过城市名获取agentInfo
function getAgentInfo(cityName){
	var url = base.url + 'position/getPostionInfo.do'
	var reqData = {
			"head":{
				"channel" : "02",
	            "userCode" : mobile,
	            "transTime" : $.getTimeStr(),
	            "transToken": ""
			},
			"body":{
				"cityName" : cityName				
			}
	}
	$.reqAjaxsFalse( url, reqData, getAgentInfoCallback );
}

function getAgentInfoCallback(data){
	console.log(data.returns.companyAgent.agentId);
	if( data.statusCode == '000000' ){
		agentId = data.returns.companyAgent.agentId;
	}
}

//跳转到二维码出单
function deshi(){
	//urlParm.lastUrl = window.location.href;
	urlParm.qrFlag = 'mall';							//区别是从保险商城页跳过去还是从产品详情页跳过去
	urlParm.title = '出单二维码';
	urlParm.rightIco = '0';
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + 'weixin/insureChannels/QRCode/QRCode.html?jsonKey='+jsonStr;
}

function shareHandle(){
	urlParm.qrFlag = 'mall';							//区别是从保险商城页跳过去还是从产品详情页跳过去
	urlParm.title = '出单二维码';
	urlParm.rightIco = '0';
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + 'weixin/insureChannels/QRCode/QRCode.html?jsonKey='+jsonStr;
}

//返回上一页
//app:返回渠道出单首页weixin/insureChannels/index.html 参数jsonkey
//分享：不显示或者关闭
//微信：返回渠道出单首页weixin/insureChannels/index.html	参数&字符参openid=ohNt9vx44UP2EnqzE6_C2dOXZQ4Q&mobile=12300000000&cusId=89884&roletype=01
function backlast(){
	urlParm.title = '填写出单渠道';
	urlParm.rightIco = '0';
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + 'weixin/insureChannels/channelInfo/channelInfo.html?jsonKey='+jsonStr;
}