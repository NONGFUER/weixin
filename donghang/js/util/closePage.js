/*该js未实现关闭功能*/
$(function(){
	var str = getUrlQueryString("jsonStr");
	if(str!=null){
		str = UrlDecode(str);
		parm = JSON.parse(str);
		var fromtype = parm.head.fromtype;//第三方销售渠道接入同道车险
		if(fromtype!=null&&fromtype!=""){//第三方销售渠道接入同道车险
			$(".h_next").html('<img style="width:20%;float:right;margin-right:10px;margin-top:14px;" src="../../images/close.png">')
			$(".h_next").on("tap",function(){
				if(fromtype=="08"){
					window.location.href="http://wap.maquee.cn/MyInformation/Index";
				}
				
			})
		}
	}
	var fromtype = getUrlQueryString("fromtype");
	if(fromtype!=null&&fromtype!=""){//第三方销售渠道接入同道车险
		$(".h_next").html('<img style="width:20%;float:right;margin-right:10px;margin-top:14px;" src="../../images/close.png">')
		$(".h_next").on("tap",function(){
			if(fromtype=="08"){
			   window.location.href="http://wap.maquee.cn/MyInformation/Index"
			}	
		})
	}
});