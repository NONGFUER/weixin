$(function() {
	
	$(".h_back").unbind("tap").bind("tap",function() {
		var userName = getUrlQueryString("userId");
		if(userName!=null){
			window.history.back();
		}else{
			var str = window.location.search;
			str = str.substr(9, str.length);
			str = UrlDecode(str);
			parm = JSON.parse(str);
			parm.body.pagesflag="1";
			var jsonStr = JSON.stringify(parm);
			jsonStr = UrlEncode(jsonStr);
			window.location.href = "carMes.html?jsonStr="+ jsonStr;
		}
		
	});
	$.setscrollarea("indexpart");
});