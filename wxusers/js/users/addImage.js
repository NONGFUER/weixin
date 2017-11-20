var choose="0";//协议选中
$(function() {
	var str = window.location.search;
	str = str.substr(9, str.length);
	str = UrlDecode(str);
	parm = JSON.parse(str);
	/* 设置滑动区域 */
	$.setscroll();
	//点击返回图标，返回上一页面
	$("#content .h_back").unbind("tap").bind("tap",function(){
		parm.flag=1;
		var jsonKey = UrlEncode(JSON.stringify(parm));
		window.location.href="agentInfoRegister.html?jsonKey="+jsonKey;;
	})
	//点击注册协议，返回主页面
	$("#zhucexy .h_back").unbind("tap").bind("tap",function(){
		$("#content").show();
		$("#zhucexy").hide();
	});
	$("#zhucea").unbind("tap").bind("tap",function(){
		$("#content").hide();
		$("#zhucexy").show();
	});
	$("#checkbox").bind("tap",function(){
		if($(this).attr("src")=="../../image/17.png"){
			$(this).attr("src","../../image/16.png");
			$("#confirm").css("background","#ccc");
			choose="0";
		}else{
			$(this).attr("src","../../image/17.png");
			$("#confirm").css("background","#1b6bb8");
			choose="1";
		}
	})
	/**---影像功能----*/
	var method=function(){
		$(".addDiv").on('tap', function () {
			var _this=this;
			wx.chooseImage({
			    count: 1, // 默认9
			    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			    success: function (res) {
			        var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
			        $(_this).find(".p").hide();
			        $(_this).find(".img").attr("src",localIds);
			        $(_this).find("div").show();
					 wx.uploadImage({
		                    localId: localIds.toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
		                    isShowProgressTips: 1, // 默认为1，显示进度提示
		                    success: function (res) {
		                        var serverId = res.serverId; // 返回图片的服务器端ID
		                        $(_this).find(".img").attr("serverId",serverId);
		                    }
		                });
			    }
			});
		});
	}
	getConfig(method); 
/*	$("#fowardImg").localResizeIMG({
		width : 400,
		quality : 500,
		success : function(result) {
			var img = new Image();
			img.src = result.base64;
			$("#span").hide();
			$("#img").attr("src",img.src);
			$("#div").show();
		}
	});
	
	
	$("#backImg").localResizeIMG({
		width : 400,
		quality : 500,
		success : function(result) {
			var img = new Image();
			img.src = result.base64;
			$("#span1").hide();
			$("#img1").attr("src",img.src);
			$("#div1").show();
		}
	});*/
	
	
	
	$("#confirm").bind("tap",function(){
		if(choose=="1"){
			var image1=$("#img").attr("serverId");
			var image2=$("#img1").attr("serverId");
			if(image1==undefined){
				mui.alert("请上传身份证正面照片！","温馨提示");
				return false;
			}
			if(image2==undefined){
				mui.alert("请上传身份证反面照片！","温馨提示");
				return false;
			}
			var url = base.url + "agent/image.do";
			var reqData = {
					"head":{
						"userCode":parm.phone,
						"transTime":$.getTimeStr(),
						"channel":"02",
						"transToken":""
					},"body":{
						 "imagelist":[{
							 "image":image1
						 },{
							 "image":image2
						 }],
						 "customerId":parm.customerId,
						 "userName":parm.phone,
						 "wxchannel":"01"
					}
				
			};
			$.reqAjaxs(url, reqData, function(data){
				if(data.statusCode=="000000"){
					window.location.href="certificationSubmissionSuccess.html"+window.location.search;
				}else{
					mui.alert(data.statusMessage,"温馨提示");
				}
			});
		}
	})
});

/* 设置滑动区域 */
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#indexarea,#xyarea").height(Scrollheight);
	mui("#indexarea,#xyarea").scroll();
};
