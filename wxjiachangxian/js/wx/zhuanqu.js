$(function() {
	/* 设置滑动区域 */
	$.setscroll();
	//获取剩余份数
	$.getShengyu("21");
	//领取
	// getAppInfo();	
	/*	if(isComing == "1") {
			$(".zengsong").css({
				border: "1px solid #eee",
				color: "#eee"
			});
			$(".lingqu").css({
				border: "1px solid #eee",
				color: "#eee"
			});
		}*/
	if(typeof(roleType) == 'undefined') {
		roleType = '00';
	}else if(roleType==null){
		roleType = '00';
	}
	$(".lingqu").unbind("tap").bind("tap", function() {
		if(roleType == "00" || roleType == "") {
			var jsonStr = UrlEncode(JSON.stringify(urlParm));
		window.location.href = base.url + "weixin/wxusers/html/users/phoneValidate.html?fromtype=7&openid=" + openid + "&jsonKey=" + jsonStr;
		} else if(roleType == "05") {
			modelAlert("当前用户为团队人员，无法领取！");
		} else {
			tuLingqu();
		}
	})
	$(".zengsong").unbind().bind("tap", function() {
		if(roleType == "00" || roleType == "") {
			var jsonStr = UrlEncode(JSON.stringify(urlParm));
		window.location.href = base.url + "weixin/wxusers/html/users/phoneValidate.html?fromtype=7&openid=" + openid + "&jsonKey=" + jsonStr;
		} else if(roleType == "05") {
			modelAlert("当前用户为团队人员，无法赠送！");
		} else {
			shareHandle();
		}
	});
	$("#guanbi").unbind().bind("tap", function() {
		$('#weixin').hide()
	})
})
//获取剩余份数,领取记录
$.getShengyu = function(cId) {
	var url = base.url + "giveInsuranceAll/giveInsurance.do";
	var reqData = {
		"head": {
			"channel": "01",
			"userCode": mobile,
			"transTime": "",
			"transToken": transToken
		},
		"body": {
			"phone": mobile, //手机号
			"commmodityId": cId, //产品编码
			"customerId": customerId
		}
	}
	$.reqAjaxs(url, reqData, function(data) {
		//console.log(data);
		if(data.statusCode=="000000"){
			var param=data.returns.pager.entities;
			$(".shengyuNum").html(data.returns.surplusNum);
			var str="";
			var str1="";
			var str2="";
			var str3="";
			var str4="";
			var i=0;
			var length=param.length;//领取记录条数
			if(length==0){
				$(".zhankai").hide();
				$(".quanbu").html("暂无人领取");
				$(".quanbu").show();
				str4="<tr><th class='topLeft'>投保人名称</td><th class='middle'>投保人手机号</td><th class='topRight'>承保时间</td></tr>";
				$(".jiluTable").html(str4);
			}else if(length<=10 && length!=0){//小于10条，全部展示
				$(".zhankai").hide();
				$(".quanbu").html("已加载全部");
				$(".quanbu").show();
				str="<tr><th class='topLeft'>投保人名称</td><th class='middle'>投保人手机号</td><th class='topRight'>承保时间</td></tr>";
				for(i=0;i<param.length;i++){
					str+="<tr>";
					if( roleType == "01" ){
						str+="<td>"+$.namePrivate(param[i].insuName)+"</td>";
						str+="<td>"+$.phonePrivate(param[i].insuPhone)+"</td>";
					}else{
						str+="<td>"+param[i].insuName+"</td>";
						str+="<td>"+param[i].insuPhone+"</td>";
					}	
					str+="<td>"+param[i].underDate+"</td>";
					str+="</tr>";
				}
				$(".jiluTable").html(str);
			}else{//大于10条，先展示前10条，点击展开按钮时再展示全部
				$(".kai").html("点击展开");
				$(".kaiImg").html("<img src='../image/jiantou2.png'/>");
				/*$(".kaiImg img").attr("src","../../images/jiantou2.png");*/
				$(".zhankai").show();
				$(".quanbu").hide();
				str1="<tr><th class='topLeft'>投保人名称</td><th class='middle'>投保人手机号</td><th class='topRight'>承保时间</td></tr>";
				for(i=0;i<10;i++){
					str1+="<tr>";
					if( roleType == "01" ){
						str1+="<td>"+$.namePrivate(param[i].insuName)+"</td>";
						str1+="<td>"+$.phonePrivate(param[i].insuPhone)+"</td>";
					}else{
						str1+="<td>"+param[i].insuName+"</td>";
						str1+="<td>"+param[i].insuPhone+"</td>";
					}	
					str1+="<td>"+param[i].underDate+"</td>";
					str1+="</tr>";
				}
				$(".jiluTable").html(str1);
				
				$(".zhankai").unbind("tap").bind("tap",function(){
					if($(".kai").html()=="点击展开"){//点击展开
						$(".kai").html("点击收起");
						$(".kaiImg").html("<img src='../image/jiantou1.png'/>");
						/*$(".kaiImg img").attr("src","../../images/jiantou1.png");*/
						$(".zhankai").show();
						$(".quanbu").html("已加载全部");
						$(".quanbu").show();
						str2="<tr><th class='topLeft'>投保人名称</td><th class='middle'>投保人手机号</td><th class='topRight'>承保时间</td></tr>";
						for(i=0;i<length;i++){
							str2+="<tr>";
							if( roleType == "01" ){
								str2+="<td>"+$.namePrivate(param[i].insuName)+"</td>";
								str2+="<td>"+$.phonePrivate(param[i].insuPhone)+"</td>";
							}else{
								str2+="<td>"+param[i].insuName+"</td>";
								str2+="<td>"+param[i].insuPhone+"</td>";
							}							
							str2+="<td>"+param[i].underDate+"</td>";
							str2+="</tr>";
						}
						$(".jiluTable").html(str2);
					}else{//点击收起
						$(".kai").html("点击展开");
						$(".kaiImg").html("<img src='../image/jiantou2.png'/>");
						/*$(".kaiImg img").attr("src","../../images/jiantou2.png");*/
						$(".zhankai").show();
						$(".quanbu").hide();
						str3="<tr><th class='topLeft'>投保人名称</td><th class='middle'>投保人手机号</td><th class='topRight'>承保时间</td></tr>";
						for(i=0;i<10;i++){
							str3+="<tr>";
							if( roleType == "01" ){
								str3+="<td>"+$.namePrivate(param[i].insuName)+"</td>";
								str3+="<td>"+$.phonePrivate(param[i].insuPhone)+"</td>";
							}else{
								str3+="<td>"+param[i].insuName+"</td>";
								str3+="<td>"+param[i].insuPhone+"</td>";
							}							
							str3+="<td>"+param[i].underDate+"</td>";
							str3+="</tr>";
						}
						$(".jiluTable").html(str3);
					}
				})
			}
		} else {
			modelAlert(data.statusMessage);
		}
	})
}
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#contentHead").height(Scrollheight);
	mui("#contentHead").scroll();
};

function tuLingqu() {
	if(roleType == '00') {
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
		window.location.href = base.url + "weixin/wxusers/html/users/phoneValidate.html?fromtype=jcx&openid=" + openid + "&jsonKey=" + jsonStr;
	} else {
		urlParm.title = "驾乘人员意外伤害保险";
		urlParm.leftIco = "1";
		urlParm.rightIco = "0";
		urlParm.downIco = "0";
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
		window.location.href = base.url + "weixin/wxjiachangxian/html/jcxshouyeSharewx.html?jsonKey=" + jsonStr;
	}
}

function shareHandle() {
	if(roleType == '00') {
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
		window.location.href = base.url + "weixin/wxusers/html/users/phoneValidate.html?fromtype=7&openid=" + openid + "&jsonKey=" + jsonStr;
	} else {
		$('#weixin').show()
		var method = function() {
			var title = "易安驾乘无忧意外保险";
			var desc = "20万保额免费领，驾车乘车都能保，放心自驾游。";
			var picUrl = base.url + "tongdaoApp/image/share/jiachenxianfen.png";
			/*var shareurl = base.url + "weixin/wxjiachangxian/html/zhuanqu.html?fromtype=8&mobile=" + mobile + "&openid=" + openid;*/
			/*var shareurl = base.url + "weixin/wxjiachangxian/html/zhuanqu.html?fromtype=8";*/
			var ccId='15';
			var shareurl = base.url + "tongdaoApp/html/share/kongbai.html?mobile=" + mobile + '&ccId=' + ccId + '&type=8';
			wx.showMenuItems({
				menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline'] // 要显示的菜单项
			});

			//分享给朋友
			wx.onMenuShareAppMessage({
				title: title, // 分享标题
				desc: desc, // 分享描述
				link: shareurl, // 分享链接
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
				link: shareurl, // 分享链接  
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
};