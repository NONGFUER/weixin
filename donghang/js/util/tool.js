(function ($) {
	 $.fn.inputPromptShow = function(options) { //定义插件的名称，这里为inputPromptShow
		var baseattr = {  //以下为该插件的属性及其默认值
			type: "password",
			content: "6至16位字符，可使用字母、数字或符号的组合",
			width: "90", // 宽度width单位是%
			fontSize: "1", // 字体font-size单位是rem
		};
		$("#inputPromptShow").remove();
//		$("#inputPromptShow").parentNode.removeChild($("#inputPromptShow"));
		var ops = $.extend(baseattr,options);
		if(ops.type == "password"){
			ops.content = "6至16位字符，可使用字母、数字或符号的组合";
		} else if(ops.type == "phone"){
			ops.content = "输入11位有效的手机号码";
		} else if(ops.type == "username"){
			ops.content = "4至30位字符，支持英文、数字及下划线组合";
		} else if(ops.type == "email"){
			ops.content = "正确格式的邮箱地址";
		};
		var addTxt = '<p style="position:absolute;z-index:100;" id="inputPromptShow">' + ops.content + '</p>';
		$("body").append(addTxt); 
		var divTop = $(this).offset().top + $(this).height() + 10;
		var divLeft = $(this).offset().left;
		$("#inputPromptShow").css({
			"top": divTop,
			"left": divLeft,
			"font-size": ops.fontSize + "rem",
			"color": "#585858",
			"padding": "5px",
			"border": "1px solid #fe5000",
			"border-radius": "6px",
			"background-color": "#fff",
		});
	};
	
})(Zepto);

$.fn.inputPromptHide = function(){
	$("#inputPromptShow").remove();
};
//定义下拉弹框方法
$.dropDownShow = function(dataJson,callBack) { 
	$("#dropDownDialog").remove();
	var addTxt = "<div style='position:fixed;z-index:100;top:0%;width: 100%;height: 100%;background: rgba(0,0,0,.2);' id='dropDownDialog'>";
	addTxt += "<p style='position:relative;z-index:101;float:right;width:3rem;height:3rem;border-radius:100%;background-color:#fe5000;color:#fff;text-align:center;font-size:2rem;line-height:3rem'>"+ "X" + "</p><div id='dropDownDialogArea'><ul>";
	var len = dataJson.length;
	for(var i=0;i<len;i++){
		addTxt += "<li>"+ dataJson[i].name + "</li>";
	}
	addTxt += "</ul></div></div>";
	$("body").append(addTxt); 
	$("#dropDownDialogArea").css({
		"position": "fixed",
		"left": "19%",
		"width": "62%",
		"font-size": "1.5rem",
		"color": "#585858",
		"border-radius": "6px",
		"background-color": "#fff",
	});
	$("#dropDownDialogArea li:nth-of-type(1)").css("border-top","1px solid #fe5000");
	$("#dropDownDialogArea li").css({
		"border-bottom": "1px solid #fe5000",
		"line-height": "2",
		"text-indent": "1em",
	});
	if(($("#dropDownDialogArea").height()/$("body").height()) <= 0.7){
		$("#dropDownDialogArea").css("top",(($("body").height()-$("#dropDownDialogArea").height())/2));
	} else {
		$("#dropDownDialogArea").height($("body").height()*0.7).css({
			"overflow":"hidden",
			"top" : ($("body").height()*0.15),
		});
		myScroll = new iScroll('dropDownDialogArea');
	};
	var h = $("#dropDownDialogArea").height();
	var btn_top = ($("body").height()-h)/2-$("#dropDownDialog p").height()*0.5;
	var btn_right = $("body").width()*(0.2-($("#dropDownDialog p").width()/$("body").width()/2));
	$("#dropDownDialog p").css({
		"margin-top" : btn_top,
		"margin-right" : btn_right,
	});
	$("#dropDownDialogArea li").tap(function(){
		var index = $("#dropDownDialogArea li").index($(this));
		var returnObj = {};
		returnObj.name = dataJson[index].name;
		returnObj.value= dataJson[index].value;
		$("#dropDownDialog").remove();
		callBack(returnObj);
	});
	$("#dropDownDialog p").tap(function(){
		$("#dropDownDialog").remove();
	});
};

