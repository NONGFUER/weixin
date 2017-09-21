/**
 * @作者：马巍巍 时间：2016-01-13 功能：包含移动端所用的一些方法
 */

// 秘钥
var secretKey = "t171420100302rsa";
var actionStartTime;//浏览页面的埋点时间
var base = {
		url : window.location.protocol+"//"+window.location.host+"/tongdaoPlatform/",
		urlsxy : window.location.protocol+"//"+window.location.host+"/tongdaoSxyPlatform/",
		share_url1: window.location.protocol+"//"+window.location.host+"/tongdaoPlatform/",
		share_url2: window.location.protocol+"//"+window.location.host+"/tongdaoPlatform/",
		shareAdimg : "../../imgs/ad/",
		imagePath : "../../../image/", // 图片路径
};
var suixinyi = {
		url : window.location.protocol+"//"+window.location.host+"/tongdaoSxyPlatform/",
}
document.write("<script language='javascript' src='"+base.url+"tongdaoApp/js/lib/common/aes.js' ></script>");
document.write("<script language='javascript' src='"+base.url+"tongdaoApp/js/lib/common/pad-iso10126-min.js' ></script>");
var dic_m = new Map();
var dic_m1 = new Map();
if (typeof tit !== 'object') {
	var tit = {};
}

/**
 * 选择弹出框
 * 
 * 使用方法：openSelectList(id,param,valuename,valuecode); id:所要赋值的区域；
 * 
 * param：所要渲染的Json数据；
 * 
 * valuename：文本框默认值 ；
 * 
 * valuecode：文本框默认值 的code
 * 
 * 
 * 此方法依赖组件 mui，请在页面中先引入 mui.min.css、 mui.min.js
 * 
 * author: maweiwei
 * 
 * tel：13564515264
 */
function openSelectList(id, param, valuename, callBack, flag) {
	var paramlist = param.split(","); // 字符串转化为数组
	var liststr = '';
	liststr += '<div id="selectpop" class="selectpop"'
			+ 'style="position: absolute; width: 100%;height: 100%;top: 0;'
			+ 'left: 0;background: rgba(0,0,0,0.3);z-index: 999;">';
	liststr += '<div class="selectlist"'
			+ 'style="position: fixed;width: 80%;top: 12%;left: 10%;">';
	liststr += '<div class="selectlist_title"'
			+ 'style="width: 100%;height: 4.15rem;line-height: 4.15rem;'
			+ 'font-size: 1.68rem;padding-left: 0.85rem;'
			+ 'border-bottom: 1px solid #d2d1d6;background-color: #fff;"'
			+ '>请选择</div>';
	liststr += '<div  style="background-color: #fff;width: 100%;';
	if (paramlist.length > 8) {
		liststr += 'height:30.795rem;position: absolute;top: 4.15rem;bottom: 0;'
				+ 'left: 0;overflow: hidden;"  class="mui-scroll-wrapper">';
		liststr += '<div class="mui-scroll">';
	} else {
		liststr += '">';
	}
	for ( var i = 0; i < paramlist.length; i++) {
		liststr += '<div class="selectlist_li"'
				+ 'style="width: 100%;height: 3.85rem;line-height: 3.85rem;'
				+ 'font-size: 1.55rem;padding: 0 0.85rem;border-bottom: 1px solid #d2d1d6;"">';
		liststr += '<span class="name">' + paramlist[i] + '</span>';
		liststr += '<span class="num" style="display:none">' + i + '</span>';
		liststr += '<div style="width: 2rem;float: right;">';

		if (paramlist[i] == valuename) {
			liststr += '<img src="../../images/chooseYes.png"/></div>';
		} else {
			liststr += '<img src="../../images/chooseNo.png"/></div>';
		}
		liststr += '</div>';
	}
	if (paramlist.length > 8) {
		liststr += '</div></div>';
	} else {
		liststr += '</div>';
	}
	liststr += '<div class="selectlist_footer" style="'
			+ 'width: 100%;position: absolute;background-color: #FFF;';

	if (paramlist.length > 8) {
		liststr += 'top: 34.9rem;'
	}
	liststr += '">';
	liststr += '<div id="selectcomfirm"'
			+ 'style="border-right: 1px solid #d2d1d6;width: 49%;height: 4.5rem;'
			+ 'line-height: 4.5rem;font-size: 1.55rem;color: #FE5000;'
			+ 'text-align: center;display: inline-block;">' + '确定</div>';
	liststr += '<div id="selectcancle"' + 'style="width: 49%;height: 4.5rem;'
			+ 'line-height: 4.5rem;font-size: 1.55rem;color: #FE5000;'
			+ 'text-align: center;display: inline-block;">' + '取消</div>';
	liststr += '</div></div></div>';

	$("body").append(liststr);
	mui(".mui-scroll-wrapper").scroll();
	showzhezhao_div();
	$(".selectlist_li").unbind("tap").bind(
			"tap",
			function() {
				$(".selectlist_li").find("img").attr("src",
						"../../images/chooseNo.png");
				$(this).find('img').attr('src', "../../images/chooseYes.png");
			});
	$("#selectcomfirm")
			.unbind("tap")
			.bind(
					"tap",
					function() {
						var selectname = valuename;
						var num;
						$(".selectlist_li")
								.each(
										function() {
											if ($(this).find("img").attr("src") == "../../images/chooseYes.png") {
												selectname = $(this).find(
														".name").html();
												num = $(this).find(".num")
														.html();
											}
										});
						$("#" + id).val(selectname);
						if (flag) {
							callBack(num, selectname);
						} else {
							callBack(num);
						}
						$(".selectpop").remove();
						setTimeout(function() {
							$(".show_divzhezhao").remove();// 删除遮罩
						}, 200);

					});
	$("#selectcancle").unbind("tap").bind("tap", function() {
		$(".selectpop").remove();
		setTimeout(function() {
			$(".show_divzhezhao").remove();// 删除遮罩
		}, 200);
	});
}
/**
 * 选择MUI弹出框
 * 
 * 使用方法：openDicList(id, dicType, dicCode, flag);
 * 
 * @param id:所要赋值的区域；
 * 
 * @param dicType：数据字典类型；
 * 
 * @param dicCode：默认选项 ；
 * 
 * @param flag：false同步/true异步
 * 
 * 此方法依赖组件 mui，请在页面中先引入 mui.min.css、
 * mui.min.js,mui.picker.min.css,mui.picker.min.js
 * 
 * author: maweiwei
 * 
 * tel：13564515264
 */
function openDicMuiList(id, dicType, dicCode, flag) {
	var sendData = {
		"cacheCode" : "commonCacheBO.dictionary." + dicType
	};
	var requestData = {};
	requestData.request = sendData;
	var requestJson = aesEncrypt(JSON.stringify(requestData), secretKey, secretKey);
	requestJson=URLencodeForBase64(requestJson);
	$.ajax({
		async : true,
		type : "POST",
		url : base.url + "/commonCache/getByCacheCode.do",
		data : "jsonKey=" + requestJson,
		dataType : 'json',
		success : function(data) {
			dic_m.put(id, data.returns.cacheValue);
			dic_m1.put(id, dicCode);
			$("#" + id).bind("tap", function() {
				(function($, doc) {
					var paramlist = JSON.parse(dic_m.get(id)); // 字符串转化为数组
					// 一级联动
					var selectPicker = new $.PopPicker();
					selectPicker.setData(paramlist);
					var selectResult = doc.getElementById(id);
					selectPicker.show(function(items) {
						selectResult.value = items[0].text;
						selectResult.style.color = "#585858";
						selectResult.name = items[0].value;
					});
				})(mui, document);
			});
		}
	});

}
/**
 * 选择弹出框
 * 
 * 使用方法：openDicList(id, dicType, dicCode, flag);
 * 
 * @param id:所要赋值的区域；
 * 
 * @param dicType：数据字典类型；
 * 
 * @param dicCode：默认选项 ；
 * 
 * @param flag：false同步/true异步
 * 
 * 此方法依赖组件 mui，请在页面中先引入 mui.min.css、 mui.min.js
 * 
 * author: maweiwei
 * 
 * tel：13564515264
 */
function openDicList(id, dicType, dicCode, flag) {
	var sendData = {
		"cacheCode" : "commonCacheBO.dictionary." + dicType
	};
	var requestData = {};
	requestData.request = sendData;
	var requestJson = JSON.stringify(requestData);
	$.ajax({
				async : true,
				type : "POST",
				url : base.url + "/commonCache/getByCacheCode.do",
				data : "jsonKey=" + requestJson,
				dataType : 'json',
				success : function(data) {
					dic_m.put(id, data.returns.cacheValue);
					dic_m1.put(id, dicCode);
					$("#" + id)
							.bind(
									"tap",
									function() {
										var paramlist = JSON.parse(dic_m
												.get(id)); // 字符串转化为数组
										var liststr = '';
										liststr += '<div id="selectpop" class="selectpop"'
												+ 'style="position: absolute; width: 100%;height: 100%;top: 0;'
												+ 'left: 0;background: rgba(0,0,0,0.3);z-index: 999;">';
										liststr += '<div class="selectlist"'
												+ 'style="position: fixed;width: 80%;top: 12%;left: 10%;">';
										liststr += '<div class="selectlist_title"'
												+ 'style="width: 100%;height: 4.15rem;line-height: 4.15rem;'
												+ 'font-size: 1.68rem;padding-left: 0.85rem;'
												+ 'border-bottom: 1px solid #d2d1d6;background-color: #fff;"'
												+ '>请选择</div>';
										liststr += '<div  style="background-color: #fff;width: 100%;';
										if (paramlist.length > 8) {
											liststr += 'height:30.795rem;position: absolute;top: 4.15rem;bottom: 0;'
													+ 'left: 0;overflow: hidden;"  class="mui-scroll-wrapper">';
											liststr += '<div class="mui-scroll">';
										} else {
											liststr += '">';
										}
										for ( var i = 0; i < paramlist.length; i++) {
											liststr += '<div class="selectlist_li"'
													+ 'style="width: 100%;height: 3.85rem;line-height: 3.85rem;'
													+ 'font-size: 1.55rem;padding: 0 0.85rem;border-bottom: 1px solid #d2d1d6;"">';
											liststr += '<span class="name">'
													+ paramlist[i].text
													+ '</span>';
											liststr += '<span class="num" style="display:none">'
													+ paramlist[i].value
													+ '</span>';
											liststr += '<div style="width: 2rem;float: right;">';

											if (paramlist[i].value == dic_m1
													.get(id)) {
												liststr += '<img src="../../images/chooseYes.png"/></div>';
											} else {
												liststr += '<img src="../../images/chooseNo.png"/></div>';
											}
											liststr += '</div>';
										}
										if (paramlist.length > 8) {
											liststr += '</div></div>';
										} else {
											liststr += '</div>';
										}
										liststr += '<div class="selectlist_footer" style="'
												+ 'width: 100%;position: absolute;background-color: #FFF;';

										if (paramlist.length > 8) {
											liststr += 'top: 34.9rem;'
										}
										liststr += '">';
										liststr += '<div id="selectcomfirm"'
												+ 'style="border-right: 1px solid #d2d1d6;width: 49%;height: 4.5rem;'
												+ 'line-height: 4.5rem;font-size: 1.55rem;color: #FE5000;'
												+ 'text-align: center;display: inline-block;">'
												+ '确定</div>';
										liststr += '<div id="selectcancle"'
												+ 'style="width: 49%;height: 4.5rem;'
												+ 'line-height: 4.5rem;font-size: 1.55rem;color: #FE5000;'
												+ 'text-align: center;display: inline-block;">'
												+ '取消</div>';
										liststr += '</div></div></div>';

										$("body").append(liststr);
										mui(".mui-scroll-wrapper").scroll();
										showzhezhao_div();
										$(".selectlist_li")
												.unbind("tap")
												.bind(
														"tap",
														function() {
															$(".selectlist_li")
																	.find("img")
																	.attr(
																			"src",
																			"../../images/chooseNo.png");
															$(this)
																	.find('img')
																	.attr(
																			'src',
																			"../../images/chooseYes.png");
														});
										$("#selectcomfirm")
												.unbind("tap")
												.bind(
														"tap",
														function() {
															var selectname;
															var num;
															$(".selectlist_li")
																	.each(
																			function() {
																				if ($(
																						this)
																						.find(
																								"img")
																						.attr(
																								"src") == "../../images/chooseYes.png") {
																					selectname = $(
																							this)
																							.find(
																									".name")
																							.html();
																					num = $(
																							this)
																							.find(
																									".num")
																							.html();
																				}
																			});
															dic_m1.put(id, num);
															$("#" + id)
																	.val(
																			selectname)
																	.css(
																			"color",
																			"#585858");
															$("#" + id)
																	.attr(
																			"name",
																			num);

															$(".selectpop")
																	.remove();
															setTimeout(
																	function() {
																		$(
																				".show_divzhezhao")
																				.remove();// 删除遮罩
																	}, 200);

														});
										$("#selectcancle").unbind("tap").bind(
												"tap",
												function() {
													$(".selectpop").remove();
													setTimeout(function() {
														$(".show_divzhezhao")
																.remove();// 删除遮罩
													}, 200);
												});
									})

				}
			});

}

/**
 * onclick 创建遮罩层 弹出框取消后消失，防止点透
 */
function showzhezhao_div() {
	var stdiv = '<div class="show_divzhezhao" style="position: absolute; width: 100%;height: 100%;top: 0;left: 0;z-index: 990;"></div>';
	$("body").append(stdiv);
}

/**用于App的alert方法
 *  封装mui的alert提示框 使用方法：modelAlert(message,describe,method);
 * 
 * 此方法依赖组件 mui，请在页面中先引入 mui.min.css、mui.min.js
 * @param message 提示信息
 * @param describe   按钮提示内容
 * @param method 点击确定后，执行的方法 
 * author: maweiwei 
 * tel：13564515264
 */

function modelAlert(message, describe, method) {
	/**--android alert黑屏问题   周定祥--*/
	$("body").append('<div class="mui-popup mui-popup-in" style="display: block;"><div class="mui-popup-inner"><div class="mui-popup-title">温馨提示</div><div class="mui-popup-text">'+message+'</div></div><div class="mui-popup-buttons"><span class="mui-popup-button mui-popup-button-bold">确定</span></div></div>');
	$("body").append('<div class="mui-popup-backdrop mui-active" style="display: block;"></div>');
	$(".mui-popup-button").on("tap",function(){
		setTimeout(function(){
			if (method != null && method != "" && method != undefined) {
				method();
			}
			$(".mui-popup-backdrop,.mui-popup").remove();
		},200)
	});
}	
//function modelAlert(message, describe, method) {
//	if($.isNull(describe)){
//		describe = "确定";
//	}
//	var btnArray = [describe];
//	mui.alert(message, "温馨提示", btnArray, function() {
//		if (method != null && method != "" && method != undefined) {
//			method();
//		}
//	});
//};
/**
 * 自定义消息确认框 使用方法：modelConfirm(messages,describe1,describe1,method1,method2);
 * 此方法依赖组件 mui，请在页面中先引入 mui.min.css、mui.min.js
 * @param message
 *            待确认信息
 * @param describe1
 *            确定按钮描述
 * @param describe2
 *            取消按钮描述
 * @param method1
 *            点击确定后，执行的方法
 * @param method2
 *            点击取消后，执行的方法 author: maweiwei tel：13564515264
 */
function modelConfirm(messages, describe1, describe2, method1, method2) {
	if($.isNull(describe1)){
		describe1 = "确定";
	}
	if($.isNull(describe2)){
		describe2 = "取消";
	}
	var btnArray = [describe2, describe1];
	mui.confirm(messages, "温馨提示", btnArray, function(e) {
		if (e.index == 1) {
			if (method1 != null && method1 != "" && method1 != undefined) {
				method1();
			}
		} else {
			if (method2 != null && method2 != "" && method2 != undefined) {
				method2();
			}
		}
	});
}
/**
 * 自定义消息确认框 使用方法：modelToast(messages);
 * 此方法依赖组件 mui，请在页面中先引入 mui.min.css、mui.min.js
 * @param message
 *            提示信息
 * author: maweiwei tel：13564515264
 */
function modelToast(messages) {
	mui.toast(messages);
}
/**
 * 自定义alert提示框 使用方法：creatAlert(message,describe,method);
 * 
 * @param message 提示信息
 * @param describe   按钮提示内容
 * @param method 点击确定后，执行的方法 
 * author: maweiwei 
 * tel：13564515264
 */
function creatAlert(message, describe, method) {
	var str = '';
	str += '<div class="mask" style="position:absolute;z-index:9999;height:100%;width:100%;top:0;left:0;background:rgba(0,0,0,0.3)">';
	str += '<div class="pop_alert" style="position:fixed;width: 80%;left:10%;top: 30%;background-color: #FFFFFF">';
	str += '<div class="pop_title" style="width: 100%;height: 3.5rem;font-size: 1.5rem;background: #fafafa;line-height: 3.5rem;">';
	str += '<div class="pop_closeimg" style="width: 1rem;margin-left: 1rem;display: inline-block;">';
	str += '<img src="../../imgs/public/dh_tmclose.png" /></div>';
	str += '<div style="width: 79%; display: inline-block;text-align: center;">';
	str += '<div style="width: 1.1rem;margin-right: 0.5rem;display: inline-block;">';
	str += '<img src="../../imgs/public/dh_tishi.png"/></div><span>提示</span></div></div>';
	str += '<div class="pop_alert_msg" style="width=100%;font-size: 1.333rem;padding:1.8rem 1.5rem;letter-spacing: 0.8px;line-height:2.1825rem;text-align:center;';
	str += 'word-wrap: break-word;word-break: normal;border-bottom: 1px #dcdcdc solid;">'
			+ message;
	str += '</div>';
	str += '<div class="pop_alert_btn" style="width: 100%;color: #0b579f;';
	str += 'font-size: 1.5rem;text-align: center;line-height: 3.5rem;">';
	if (describe == "" || describe == undefined || describe == null) {
		str += '确定';
	} else {
		str += describe;
	}
	str += '</div>';
	str += '</div>';
	str += '</div>';
	$("body").append(str);
	$(".pop_alert_btn").on("tap", function() {
		if (method != null && method != "" && method != undefined) {
			$(this).parent().parent().remove();
			method();
		} else {
			$(this).parent().parent().remove();
		}
	});
	$(".pop_closeimg").on("tap", function() {
		$(this).parent().parent().parent().remove();
	});
};
/**
 * 自定义消息确认框 使用方法：creatConfirm(messages,describe1,describe1,method1,method2);
 * 
 * @param message
 *            待确认信息
 * @param describe1
 *            按钮1描述
 * @param describe2
 *            按钮2描述
 * @param method1
 *            点击取消后，执行的方法
 * @param method2
 *            点击确定后，执行的方法 author: maweiwei tel：13564515264
 */
function creatConfirm(messages, describe1, describe2, method1, method2) {
	var strc = '';
	strc += '<div class="mask" style="position:absolute;z-index:9999;height:100%;width:100%;top:0;left:0;background:rgba(0,0,0,0.3)">';
	strc += '<div class="pop_confirm" style="position:fixed;width: 80%;left:10%;top: 38%;background-color: #FFFFFF">';
	strc += '<div class="pop_title" style="width: 100%;height: 3.5rem;font-size: 1.333rem;background: #fafafa;line-height: 3.5rem;">';
	strc += '<div class="pop_closeimg" style="width: 1rem;margin-left: 1rem;display: inline-block;">';
	strc += '<img src="../../imgs/public/dh_tmclose.png" /></div>';
	strc += '<div style="width: 79%; display: inline-block;text-align: center;">';
	strc += '<div style="width: 1.1rem;margin-right: 0.5rem;display: inline-block;">';
	strc += '<img src="../../imgs/public/dh_tishi.png"/></div><span>提示</span></div></div>';
	strc += '<div class="pop_confirm_msg" style="width=100%;font-size: 1.333rem;padding:0.5rem 1.5rem;line-height: 4.1825rem;';
	strc += 'text-align:center;word-wrap: break-word;word-break: normal;border-bottom: 1px #dcdcdc solid;">'
			+ messages;
	strc += '</div>';
	strc += '<div class="pop_confirm_cancel" style="width: 50%;color: #0b579f;font-size: 1.5rem;text-align: center;';
	strc += 'line-height: 3.5rem;float: left;border-right: 1px solid #dcdcdc;">';
	if (describe1 == "" || describe1 == undefined || describe1 == null) {
		strc += '取消';
	} else {
		strc += describe1;
	}
	strc += '</div>';
	strc += '<div class="pop_confirm_ok" style="width: 50%;color: #0b579f;font-size: 1.5rem;text-align: center;';
	strc += 'line-height: 3.5rem;float: left;">';
	if (describe2 == "" || describe2 == undefined || describe2 == null) {
		strc += '确定';
	} else {
		strc += describe2;
	}
	strc += '</div>';
	strc += '</div>';
	strc += '</div>';
	$("body").append(strc);
	$(".pop_confirm_ok").on("tap", function() {
		$(this).parent().parent().remove();
		method1();
	});
	$(".pop_confirm_cancel").on("tap", function() {
		if (method2 != null && method2 != "" && method2 != undefined) {
			$(this).parent().parent().remove();
			method2();
		} else {
			$(this).parent().parent().remove();
		}
	});
	$(".pop_closeimg").on("tap", function() {
		$(this).parent().parent().parent().remove();
	});
}
/**
 * 自定义功能提示框 使用方法： creatSpecialAlert(title,message,desc,method);
 * 
 * @param title
 *            提示框标题
 * @param message
 *            提示信息
 * @param desc
 *            提示内容描述
 * @param method
 *            点击功能按钮所执行的方法 author: maweiwei tel：13564515264
 */
function creatSpecialAlert(title, message, desc, method) {
	var str = '';
	str += '<div class="mask" style="position:absolute;z-index:9999;height:100%;width:100%;top:0;left:0;background:rgba(0,0,0,0.3)">';
	str += '<div class="pop_special" style="position:fixed;width: 80%;left:10%;top: 30%;border-radius:0.85rem;background-color: #FFFFFF">';
	str += '<div style="width: 100%;height: 3.8rem;font-size: 1.68rem;text-align: center;font-weight: bold;color: #fe5000; padding-top: 1.5rem;">'
			+ title + '</div>';
	str += '<div class="pop_special_msg" style="width=100%;font-size: 1.5rem;padding:0 1.5rem 1rem;letter-spacing: 0.8px;line-height:2.1825rem;text-align:center;';
	str += 'word-wrap: break-word;word-break: normal;border-bottom: 1px #d2d1d6 solid;">'
			+ message;
	str += '</div>';
	str += '<div class="pop_special_btn" style="width: 100%;color: #fe5000;';
	str += 'font-size: 1.68rem;text-align: center;line-height: 3.5rem;">'
			+ desc + '</div>';
	str += '</div>';
	str += '</div>';
	$("body").append(str);
	$(".pop_special_btn").on("tap", function() {
		if (method != null && method != "" && method != undefined) {
			$(this).parent().parent().remove();
			method();
		}
	});
};

/* 页面加载时的遮罩 */
$.ajaxPrevent = function() {
	// 创建遮罩
	var ajaxPrevent = "";
	ajaxPrevent += "<div class='ajax_prevent' style='position: fixed;width: 100%;height: 100%;top: 0;"
			+ "left: 0;z-index: 999;background:rgba(0,0,0,0)'>";
	ajaxPrevent += "<div class='ajax_prevent_a' style='width: 30%;margin-top: 55%;"
			+ "margin-left: 35%;text-align: center;background-clip: padding-box;"
			+ "color: #585858;'>";
	ajaxPrevent += "<img src='"+base.url+"tongdaoApp/image/common/dh_loading.gif' style='width:100%'></div></div>";
	$("body").append(ajaxPrevent);
	$(".ajax_prevent_a").css("margin-top",(window.innerHeight - $(".ajax_prevent_a").width())/2);
};
/* 页面加载时的遮罩 */
$.prop = function() {
	// 创建遮罩
	var ajaxPrevent = "";
	ajaxPrevent += "<div class='prop' style='position: fixed;width: 100%;height: 100%;top: 0;"
			+ "left: 0;z-index: 1000;background:rgba(0,0,0,0)'>";
	ajaxPrevent += "<div class='ajax_prevent_a' style='width: 30%;margin-top: 55%;"
			+ "margin-left: 35%;text-align: center;background-clip: padding-box;"
			+ "color: #585858;'>";
	ajaxPrevent += "<img src='"+base.url+"tongdaoApp/image/common/dh_loading.gif' style='width:100%'></div></div>";
	$("body").append(ajaxPrevent);
	$(".ajax_prevent_a").css("margin-top",(window.innerHeight - $(".ajax_prevent_a").width())/2);
};
/*--------------<--------------<------- platform Start-------<--------------<-------------*/
/*******************************************************************************
 * isAndroid : 是否为安卓系统 alert(tit.platform.isAndroid) isBlackBerry : 是否为黑莓
 * alert(tit.platform.isBlackBerry) isIpad : 是否为iPad alert(tit.platform.isIpad)
 * isIphone : 是否为iPhone alert(tit.platform.isIphone) isMacintosh : 是否为Mac
 * alert(tit.platform.isMacintosh) isMobile : 是否为移动设备
 * alert(tit.platform.isMobile) isWindows : 是否为Windows
 * alert(tit.platform.isWindows) isX11 : 是否为X11 alert(tit.platform.isX11)
 * 
 ******************************************************************************/
if (typeof tit.platform !== 'object') {
	tit.platform = {
		isAndroid : /android/i.test(navigator.userAgent),
		isBlackBerry : /BlackBerry/i.test(navigator.userAgent),
		isIpad : /ipad/i.test(navigator.userAgent),
		isIphone : /iphone/i.test(navigator.userAgent),
		isMacintosh : /macintosh/i.test(navigator.userAgent),
		isMobile : !!navigator.userAgent.match(/AppleWebKit.*Mobile.*/)
				|| !!navigator.userAgent.match(/AppleWebKit/),
		isWindows : /windows/i.test(navigator.userAgent),
		isX11 : /x11/i.test(navigator.userAgent)
	};
}
/*--------------<--------------<------- regExp Start-------<--------------<-------------*/
/*******************************************************************************
 * isAdult : 判断是否已成年 alert(tit.regExp.isAdult("310113198704121234") ) isChinese :
 * 判断是否为中文 alert(tit.regExp.isChinese("我是中文")) isDate : 判断是否为正确日期格式
 * alert(tit.regExp.isDate("2012-12-12")) isEmail : 判断是否为Email地址
 * alert(tit.regExp.isEmail("lancer07@139.com")) isIdcard : 判断是否为身份证号
 * alert(tit.regExp.isIdcard("310113198502031876")) isMobile : 判断是否为手机号
 * alert(tit.regExp.isMobile("13661234567")) isQQ : 判断是否为QQ号
 * alert(tit.regExp.isQQ("180003000")) isTel : 判断是否为固定电话号
 * alert(tit.regExp.isTel("021-56565656")) isURL : 判断是否为链接地址
 * alert(tit.regExp.isURL("http://www.linqing07.com")) isPsd : 判断是否为密码
 * alert(tit.regExp.isPsd("wwewewewe")) isPostalcode : 判断是否为邮政编码
 * alert(tit.regExp.isPostalcode("223200")) isCardNum : 判断是否只有字母和数字
 * alert(tit.regExp.isCardNum("223200")) isMoney : 判断是否只有点和数字
 * alert(tit.regExp.isMoney("2.1"))
 * isNumber : 判断是否只有数字 alert(tit.regExp.isNumber("2.1"))
 * 
 ******************************************************************************/
if (typeof tit.regExp !== 'object') {
	tit.regExp = {
		isAdult : function(str) {
			var s = str;
			if (tit.regExp.isIdcard(s)) {
				var birthday = (new Date(s.slice(6, 10), s.slice(10, 12) - 1, s
						.slice(12, 14))), today = (new Date());
				return (today - birthday > 18 * 365 * 24 * 60 * 60 * 1000);
			} else {
				return false;
			}
		},
		isChinese : function(str) {
			var reg = /^[\u4E00-\u9FFF]+$/;
			return reg.test(str);
		},
		isDate : function(str) {
			var reg = /^\d{4}-\d{1,2}-\d{1,2}$/;
			return reg.test(str);
		},
		isEmail : function(str) {
			// var reg =
			// /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
			//var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*[A-Za-z0-9_]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}[a-z0-9]+$/;// 开始必须是一个或者多个单词字符或者是-，加上@，然后又是一个或者多个单词字符或者是-。然后是点“.”和单词字符和-的组合，可以有一个或者多个组合,邮箱不能以
			var reg =/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
			// .以及其它特殊字符开头和结束,邮箱域名结尾为2~5个字母，比如cn、com、name
			return reg.test(str);
		},
		isIdcard : function(str) {
			var reg = /^(\d{14}|\d{17})(\d|[xX])$/;
			return reg.test(str);
		},
		isPlateNumber : function(str) {
			var reg = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5,6}$/;
			var reg2 = /^LS[A-Z_0-9]{5}$/;
			return reg.test(str) || reg2.test(str);
		},
		isVehicleIdentification : function(str) {
			var reg = /^[A-Z_0-9]{17}$/;
			return reg.test(str);
		},
		isMobile : function(str) {
			var reg = /^0*(13|14|15|17|18)\d{9}$/;
			return reg.test(str);
		},
		isQQ : function(str) {
			var reg = /^[1-9][0-9]{4,}$/;
			return reg.test(str);
		},
		isTel : function(str) {
			var reg = /^\d{3,4}-\d{7,8}(-\d{3,4})?$/;
			return reg.test(str);
		},
		isURL : function(str) {
			var reg = /http:\/\/[A-Za-z0-9\.-]{3,}\.[A-Za-z]{3}/;
			return reg.test(str);
		},
		isPsd : function(str) {
			var reg = "^[\\w@\\-\\.]{6,16}$";
			return new RegExp(reg).test(str);
		},
		isPostalcode : function(str) {
			var reg = /^[1-9][0-9]{5}$/;
			return reg.test(str);
		},
		isCardNum : function(str) {
			var reg = /^[A-Za-z0-9]+$/;
			return reg.test(str);
		},
		isMoney : function(str) {
			var reg = /^(\-)?(([1-9]\d*)|[0-9])(\.\d+)?$/;
			return reg.test(str);
		},
		isNumber : function(str) {
			var reg = /^[0-9]+$/;
			return reg.test(str);
		}
	};
}

/*******************************************************************************
 * 以下方法一般是基于jquery/zepto $.toAjaxs : 基于jquery的ajax请求方法 $.isNull : 判断是否为空
 * $.makeHover : 模拟hover效果 $.checkMoney : 验证输入金额带提醒(数字和小数点) Array
 * $.trChangeColor :隔行换色 $.replacePlaceholder : 解决placeholder的line-height问题
 * $.touchEffect : 按钮点击的效果 $.getDateStr : 获取多少天后的日期(年-月-日) $.getTimeStr : 获取时间
 * (年-月-日 时:分:秒) $.getTimeStr2 : 获取时间 (年-月-日) $.getTimeStr3 : 获取时间 (年)
 * $.getMonthNumber : 获得两个日期之间相差多少个月 timeFormatDate(new
 * Date().getTime(),'yyyy-MM-dd HH:mm:ss')毫秒数转化为指定格式日期 $.charEntities : 前台特殊字符修改
 * $.checklength : input中文长度判断 $.checkIdCard : 验证身份证 trim : 去掉字符串左右两端的空格
 * getUrlQueryString : 得到地址栏参数
 ******************************************************************************/
// 保存自动登录的账号密码
function setUserInfo(username, psd) {
	var setUserInfo = {
		"username" : username,
		"psd" : pad
	};
	var TITsetUserInfo = JSON.stringify(setUserInfo);
	localStorage.setUserInfo = TITsetUserInfo;
};
// 获取自动登录的账号密码
function getUserInfo() {
	var getUserInfo = localStorage.setUserInfo;
	var TITgetUserInfo = JSON.parse(getUserInfo);
	return TITgetUserInfo;
};
// 保存账号到账号列表
function setUserName(username) {
	localStorage.setUserName = username;
};
// 获取账号列表
function getUserName() {
	return localStorage.setUserName;
};

/**
 * 加密数据
 * @param {type} data 待加密的字符串
 * @param {type} keyStr 秘钥
 * @param {type} ivStr 向量
 * @returns {unresolved} 加密后的数据
 */
function aesEncrypt(data, keyStr, ivStr) {
    var sendData = CryptoJS.enc.Utf8.parse(data);
    var key = CryptoJS.enc.Utf8.parse(keyStr);
    var iv  = CryptoJS.enc.Utf8.parse(ivStr);
    var encrypted = CryptoJS.AES.encrypt(sendData, key,{iv:iv,mode:CryptoJS.mode.CBC});
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
};

function URLencodeForBase64(sStr) {
	return escape(sStr).replace(/\+/g, '%2B').replace(/\"/g, '%22').replace(
			/\'/g, '%27').replace(/\//g, '%2F');
}

/**
 * ajax请求方法 author: maweiwei
 */
$.toAjaxs = function(url, dataList, callBack) {
	var requestData = {};
	requestData.request = dataList;
	var requestJson = aesEncrypt(JSON.stringify(requestData), secretKey, secretKey);
	requestJson=URLencodeForBase64(requestJson);
	$.ajax({
		url : url,
		type : 'POST',
		data : "jsonKey=" + requestJson,
		dataType : "json",
		timeout : 60000,
		success : function(data) {
			$(".ajax_prevent").remove();// 去除遮罩
			if ($.isNull(callBack)) {

			} else {
				callBack(data);
			}
		},
		error : function(data) {
			$(".ajax_prevent").remove();// 去除遮罩
			modelAlert("网络好像开小差了呢，请设置给力一点儿网络吧！");
		},
		complete : function(data) {
		},
		beforeSend : function(xhr) {
			$.ajaxPrevent();
		},
		async : true,
	});
};

/**----请求报文无request节点的ajax请求---*/
$.reqAjaxs = function(url, requestData, callBack) {
	var requestJson = aesEncrypt(JSON.stringify(requestData), secretKey, secretKey);
	requestJson=URLencodeForBase64(requestJson);
	$.ajax({
		url : url,
		type : 'POST',
		data : "jsonKey=" + requestJson,
		dataType : "json",
		timeout : 60000,
		success : function(data) {
			$(".ajax_prevent").remove();// 去除遮罩
			if (!$.isNull(callBack)) {
				callBack(data);
			}
		},
		error : function(data) {
			$(".ajax_prevent").remove();// 去除遮罩
			modelAlert("网络好像开小差了呢，请设置给力一点儿网络吧！");
		},
		beforeSend : function(xhr) {
			$.ajaxPrevent();
		},
		async : true,
	});
};
/**
 * ajax请求方法 去遮罩层 author: maweiwei
 */
$.toAjaxsno = function(url, dataList, callBack) {
	var requestData = {};
	requestData.request = dataList;
	var requestJson = aesEncrypt(JSON.stringify(requestData), secretKey, secretKey);
	requestJson=URLencodeForBase64(requestJson);
	$.ajax({
		url : url,
		type : 'POST',
		data : "jsonKey=" + requestJson,
		dataType : "json",
		timeout : 60000,
		success : function(data) {
			if (!$.isNull(callBack)) {
				callBack(data);
			}
		},
		error : function(data) {
			
		},
		complete : function(data) {
		},
		beforeSend : function(xhr) {
		},
		async : true,
	});
};


/**
 * ajax请求方法 
 * 调取壳上的方法来去除课上的操作
 * author: maweiwei 
 */
$.toAjaxsSyshide = function(url, dataList, callBack) {
	var requestData = {};
	requestData.request = dataList;
	var requestJson = JSON.stringify(requestData);
	$.ajax({
		url : url,
		type : 'POST',
		data : "jsonKey=" + requestJson,
		dataType : "json",
		timeout : 60000,
		success : function(data) {
			closeSyspop();
			if ($.isNull(callBack)) {

			} else {
				callBack(data);
			}
		},
		error : function(data) {
			closeSyspop();
			modelAlert("网络好像开小差了呢，请设置给力一点儿网络吧！");
		},
		complete : function(data) {
		},
		beforeSend : function(xhr) {},
		async : true,
	});
};

$.isNull = function(str) {
	if (str == null || typeof (str) == "undefined" || str == "null"
			|| str == "") {
		return true;
	}
	return false;
};

$.isStringNull = function(str) {
	if (str == null || str == "null" || str == ""
			|| str.replace(/^\s+|\s+$/g, "") == "") {
		return true;
	}
	return false;
};

// 模拟hover效果
$.makeHover = function(obj, param1, param2) {
	if ($.isNull(param1)) {
		param1 = "#e6e6e6";
	}
	;
	if ($.isNull(param2)) {
		param2 = "#fff";
	}
	;
	for ( var i = 0; i < obj.length; i++) {
		obj[i].addEventListener('touchstart', function(e) {
			this.style.backgroundColor = param1;
		});
		obj[i].addEventListener('touchend', function(e) {
			this.style.backgroundColor = param2;
		});
	}
	;
};
// 验证输入金额带提醒(数字和小数点)
$.checkMoney = function(money) {
	var result;
	if ($.isNull(money.val())) {
		result = false;
	}
	var reg = /^(\-)?(([1-9]\d*)|[0-9])(\.\d+)?$/;
	// var reg = /(^[-+]?[1-9]\d*(\.\d{1,2})?$)|(^[-+]?[0]{1}(\.\d{1,2})?$)/;
	if (!reg.test(money.val())) {
		alert("请您输入合法金额!");
		money.val("");
		result = false;
	} else {
		var number = $.changeTwoDecimal(money.val());
		money.val(number);
		result = true;
	}
	return result;
};
$.changeTwoDecimal = function(x) {
	var f_x = parseFloat(x);
	if (isNaN(f_x)) {
		return false;
	}
	;
	var f_x = Math.floor(x * 100) / 100;
	var s_x = f_x.toString();
	var pos_decimal = s_x.indexOf('.');
	if (pos_decimal < 0) {
		pos_decimal = s_x.length;
		s_x += '.';
	}
	while (s_x.length <= pos_decimal + 2) {
		s_x += '0';
	}
	;
	return s_x;
};
// 隔行换色
$.trChangeColor = function(obj, color) {
	if (obj.length > 0) {
		for ( var i = 0; i < obj.length; i++) {
			if (i % 2 == 1) {
				obj.eq(i).css("background-color", color);
			}
		}
	}
};
// 解决placeholder的line-height问题
$.replacePlaceholder = function(domObj, placeholderStr) {
	if (placeholderStr == "请输入密码") {
		domObj.attr("type", "text");
	}
	if ($(domObj).val() == placeholderStr) {
		$(domObj).css("color", "#ccc");
	}else{
		$(domObj).css("color", "#333");
	}
	$(domObj).unbind().bind({
		focus : function() {
			if ($(domObj).val() == placeholderStr) {
				$(domObj).val("").css("color", "#333");
				if (placeholderStr == "请输入密码") {
					domObj.attr("type", "password");
				}
			}
		},
		blur : function() {
			if ($(domObj).val() == "") {
				$(domObj).val(placeholderStr).css("color", "#ccc");
				if (placeholderStr == "请输入密码") {
					domObj.attr("type", "text");
				}
			}
		}
	});
};
// 解决placeholder的line-height问题
$.replacePlaceholder2 = function(domObj, placeholderStr) {
	if (placeholderStr.indexOf("密码") != -1) {
		domObj.attr("type", "text");
	}
	$(domObj).unbind().bind({
		focus : function() {
			if ($(domObj).val() == placeholderStr) {
				$(domObj).val("").css("color", "#585858");
				if (placeholderStr.indexOf("密码") != -1) {
					domObj.attr("type", "password");
				}
			}
		},
		blur : function() {
			if ($(domObj).val() == "") {
				$(domObj).val(placeholderStr).css("color", "#ccc");
				if (placeholderStr.indexOf("密码") != -1) {
					domObj.attr("type", "text");
				}
			}
		}
	});
};
// 按钮点击的效果
$.touchEffect = function(domobj, startcolor, endcolor) {
	$(domobj).bind('touchstart', function(e) {
		domobj.css("background-color", startcolor);
	}).bind('touchend', function(e) {
		domobj.css("background-color", endcolor);
	});
};
// 获取日期
$.getDateStr = function(dflag, time, AddDayCount) {
	if (dflag == "0") {
		var current = new Date(); // 当前时间
	} else {
		var current = new Date(time); // 某天
	}
	current.setDate(current.getDate() + AddDayCount);// 获取AddDayCount天后的日期
	var year = current.getFullYear();
	var month = current.getMonth() + 1;
	if (month < 10) {
		month = "0" + month;
	}
	var day = current.getDate();
	if (day < 10) {
		day = "0" + day;
	}
	return year + "-" + month + "-" + day;
};
// 获取时间
$.getTimeStr = function() {
	var current = new Date(); // 当前时间
	var year = current.getFullYear();
	var month = current.getMonth() + 1;
	if (month < 10) {
		month = "0" + month;
	}
	var day = current.getDate();
	if (day < 10) {
		day = "0" + day;
	}
	return year + "-" + month + "-" + day + " " + current.getHours() + ":"
			+ current.getMinutes() + ":" + current.getSeconds();
};
// 获取时间 (年-月-日)
$.getTimeStr2 = function(param) {
	if (param == ""||param==undefined) {
		var current = new Date();
	} else {
		var current = new Date(param);
	}
	var year = current.getFullYear();
	var month = current.getMonth() + 1;
	if (month < 10) {
		month = "0" + month;
	}
	var day = current.getDate();
	if (day < 10) {
		day = "0" + day;
	}
	return year + "-" + month + "-" + day;
};
// 获取时间 (年)
$.getTimeStr3 = function(param) {
	if (param == "") {
		var current = new Date();
	} else {
		var current = new Date(param);
	}
	var year = current.getFullYear();
	return year;
};
// 获得两个日期之间相差多少个月
$.getMonthNumber = function(date1, date2) {
	// 默认格式为"2003-03-03",根据自己需要改格式和方法
	var year1 = date1.substr(0, 4);
	var year2 = date2.substr(0, 4);
	var month1 = date1.substr(5, 2);
	var month2 = date2.substr(5, 2);
	var len = (year2 - year1) * 12 + (month2 - month1);

	var day = date2.substr(8, 2) - date1.substr(8, 2);
	if (day > 0) {
		len += 1;
	} else if (day < 0) {
		len -= 1;
	}
	;
	return len;
};

// 获得两个日期之间相差多少个月
$.getMonthNumber1 = function(date1, date2) {
	// 默认格式为"2003-03-03",根据自己需要改格式和方法
	var year1 = date1.split("-")[0];
	var year2 = date2.split("-")[0];
	var month1 = date1.split("-")[1];
	var month2 = date2.split("-")[1];
	var len = (year2 - year1) * 12 + (month2 - month1);

	var day = date2.split("-")[2] - date1.split("-")[2];
	if (day > 0) {
		len += 1;
	} else if (day < 0) {
		len -= 1;
	}
	;
	return len;
};
// 毫秒数转化为指定格式日期
var timeFormatDate = function(time, format) {
	var x = new Date(time);
	var z = {
		y : x.getFullYear(),
		M : x.getMonth() + 1,
		d : x.getDate(),
		H : x.getHours(),
		m : x.getMinutes(),
		s : x.getSeconds()
	};
	return format.replace(/(y+|M+|d+|H+|m+|s+)/g, function(v) {
		return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1)))
				.slice(-(v.length > 2 ? v.length : 2));
	});
};
// alert(format(new Date().getTime(), 'yyyy-MM-dd HH:mm:ss'));

// 前台特殊字符修改
$.charEntities = function(param) {
	param = param.replace(/\"/g, "”");
	param = param.replace(/\'/g, "’");
	param = param.replace(/\r\n/g, "");
	param = param.replace(/\n/g, "");
	param = param.replace(/\r/g, "");
	return param;
};
// input中文长度判断
$.checklength = function(strTemp, realsize) {
	var i, sum;
	sum = 0;
	for (i = 0; i < strTemp.length; i++) {
		if ((strTemp.charCodeAt(i) >= 0) && (strTemp.charCodeAt(i) <= 255))
			sum = sum + 1;
		else {
			sum = sum + 2;
		}
	}
	if (sum >= realsize) {
		return false;
	} else {
		return true;
	}
};
// 验证身份证
$.checkIdCard = function(idcard) {
	var area = {
		11 : "北京",
		12 : "天津",
		13 : "河北",
		14 : "山西",
		15 : "内蒙古",
		21 : "辽宁",
		22 : "吉林",
		23 : "黑龙江",
		31 : "上海",
		32 : "江苏",
		33 : "浙江",
		34 : "安徽",
		35 : "福建",
		36 : "江西",
		37 : "山东",
		41 : "河南",
		42 : "湖北",
		43 : "湖南",
		44 : "广东",
		45 : "广西",
		46 : "海南",
		50 : "重庆",
		51 : "四川",
		52 : "贵州",
		53 : "云南",
		54 : "西藏",
		61 : "陕西",
		62 : "甘肃",
		63 : "青海",
		64 : "宁夏",
		65 : "新疆"
	};
	var idcard, Y, JYM;
	var S, M;
	var idcard_array = new Array();
	idcard_array = idcard.split("");
	if (area[parseInt(idcard.substr(0, 2))] == null) {
		return 3
	}
	;
	switch (idcard.length) {
	case 15:
		if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0
				|| ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard
						.substr(6, 2)) + 1900) % 4 == 0)) {
			ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;// 测试出生日期的合法性
		} else {
			ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;// 测试出生日期的合法性
		}
		if (ereg.test(idcard)) {
			return 0;
		} else {
			return 2;
			break;
		}
	case 18:
		if (parseInt(idcard.substr(6, 4)) % 4 == 0
				|| (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard
						.substr(6, 4)) % 4 == 0)) {
			ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;// 闰年出生日期的合法性正则表达式
		} else {
			ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;// 平年出生日期的合法性正则表达式
		}
		if (ereg.test(idcard)) {
			S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
					+ (parseInt(idcard_array[1]) + parseInt(idcard_array[11]))
					* 9
					+ (parseInt(idcard_array[2]) + parseInt(idcard_array[12]))
					* 10
					+ (parseInt(idcard_array[3]) + parseInt(idcard_array[13]))
					* 5
					+ (parseInt(idcard_array[4]) + parseInt(idcard_array[14]))
					* 8
					+ (parseInt(idcard_array[5]) + parseInt(idcard_array[15]))
					* 4
					+ (parseInt(idcard_array[6]) + parseInt(idcard_array[16]))
					* 2 + parseInt(idcard_array[7]) * 1
					+ parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9])
					* 3;
			Y = S % 11;
			M = "F";
			JYM = "10X98765432";
			M = JYM.substr(Y, 1);
			if (M == idcard_array[17]) {
				var iddate = idcard.substr(6, 8);
				var idyear = parseInt(iddate.substr(0, 4));
				var idmonth = parseInt(iddate.substr(4, 2));
				var idday = parseInt(iddate.substr(6, 2));
				// alert(iddate+","+idyear+","+idmonth+","+idday);
				var now = new Date();
				var year = now.getFullYear(); // 年
				var month = now.getMonth() + 1; // 月
				var day = now.getDate();
				// alert(now+","+year+","+month+","+day);
				if (idyear > year) {
					return 2;
				} else if (idyear == year) {
					if (idmonth > month) {
						return 2;
					} else if (idmonth == month) {
						if (idday > day) {
							return 2;
						} else {
							return 0;
						}
					} else {
						return 0;
					}
				} else {
					return 0;
				}
			} else {
				return 3;
			}
		} else {
			return 2;
			break;
		}
	default:
		return 1;
		break;
	}
};
/*******************************************************************************
 * 去掉字符串左右两端的空格
 * 
 * @param ：
 * @return：
 ******************************************************************************/
function trim(str) {
	return str.replace(/(^\s*)|(\s*$)/g, "");
}
/**
 * 得到地址栏参数
 * 
 * @param names
 *            参数名称
 * @param urls
 *            从指定的urls获取参数
 * @returns string
 */
function getUrlQueryString(names, urls) {
	urls = urls || window.location.href;
	urls && urls.indexOf("?") > -1 ? urls = urls
			.substring(urls.indexOf("?") + 1) : "";
	var reg = new RegExp("(^|&)" + names + "=([^&]*)(&|$)", "i");
	var r = urls ? urls.match(reg) : window.location.search.substr(1)
			.match(reg);
	if (r != null && r[2] != "")
		return unescape(r[2]);
	return null;
};
/*******************************************************************************
 * 以下方法一般是基于jquery/zepto和mui框架 $.setscrollarea : 区域滑动方法 $.poppicker : 选择一级联动
 * $.poppicker2 : 选择二级联动 $.poppicker3 : 选择三级联动 $.pulluptoRefresh : 区域上拉加载
 * openDataNowDate : 打开mui日期控件-默认当前日期 openData : 打开mui日期控件-默认当前日期的后一天
 * openDataCustomized 打开日期控件（自定义起始日期 默认选中日期 结束日期）
 * openDataMonth : 打开mui日期控件（只有月份选择）：默认当前月
 * 
 ******************************************************************************/
/**
 * 区域滑动；使用方法：$.setscrollarea(id); 此方法依赖组件 mui，请在页面中先引入mui.min.css、mui.min.js
 * 仅用于页面只有头部和内容两部分组成的页面 author: maweiwei tel：13564515264
 */
$.setscrollarea = function(id) {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#" + id).height(Scrollheight);
	mui("#" + id).scroll();
}
/**
 * 选择一级联动；使用方法：$.poppicker(id,param); 此方法依赖组件 mui，请在页面中先引入 mui.min.css、
 * mui.picker.min.css mui.min.js、mui.picker.min.js id:所要赋值的区域； flag:
 * 赋值模块是否未input param：所要渲染的Json数据； author: maweiwei tel：13564515264
 */
$.poppicker = function(id, param, flag) {
	(function($, doc) {
		// 一级联动
		var selectPicker = new $.PopPicker();
		selectPicker.setData(param);
		var showCityPickerButton = doc.getElementById(id);
		var selectResult = doc.getElementById(id);
		selectPicker.show(function(items) {
			if (flag == "input") {
				selectResult.value = items[0].text;
				selectPicker.dispose();// 释放组件资源
			} else {
				selectResult.innerText = items[0].text;
				selectPicker.dispose();// 释放组件资源
			}
		});
	})(mui, document);
}

/**
 * 选择一级联动；使用方法：$.poppicker(id,param); 此方法依赖组件 mui，请在页面中先引入 mui.min.css、
 * mui.picker.min.css mui.min.js、mui.picker.min.js id:所要赋值的区域； flag:
 * 赋值模块是否未input param：所要渲染的Json数据； author: maweiwei tel：13564515264
 */
$.poppickerForFun = function(id, param, flag, fun) {
	(function($, doc) {
		// 一级联动
		var selectPicker = new $.PopPicker();
		selectPicker.setData(param);
		var showCityPickerButton = doc.getElementById(id);
		var selectResult = doc.getElementById(id);
		selectPicker.show(function(items) {
			if (flag == "input") {
				selectResult.name = items[0].value;
				selectResult.value = items[0].text;
				selectPicker.dispose();// 释放组件资源
				fun(items[0].value);
			} else {
				selectResult.innerText = items[0].text;
				fun(items[0].text);
				selectPicker.dispose();// 释放组件资源
			}
		});
	})(mui, document);
}
/**
 * 选择二级联动；使用方法：$.poppicker2(id,param); 此方法依赖组件 mui，请在页面中先引入 mui.min.css、
 * mui.picker.min.css mui.min.js、mui.picker.min.js id:所要赋值的区域； flag:
 * 赋值模块是否未input param：所要渲染的Json数据； author: maweiwei tel：13564515264
 */
$.poppicker2 = function(id, param, flag) {
	(function($, doc) {
		// 二级联动
		var selectPicker = new $.PopPicker({
			layer : 2
		});
		selectPicker.setData(param);
		var showCityPickerButton = doc.getElementById(id);
		var selectResult = doc.getElementById(id);
		selectPicker.show(function(items) {
			if (flag == "input") {
				selectResult.value = items[0].text + " " + items[1].text;
				selectResult.name = items[0].value + " " + items[1].value;
				selectPicker.dispose();// 释放组件资源
			} else {
				selectResult.innerText = items[0].text + " " + items[1].text;
				doc.getElementById(id).value = items[1].value;
				selectPicker.dispose();// 释放组件资源
			}
		});
	})(mui, document);
}

/**
 * 选择三级联动；使用方法：$.poppicker3(id,param); 此方法依赖组件 mui，请在页面中先引入 mui.min.css、
 * mui.picker.min.css mui.min.js、mui.picker.min.js id:所要赋值的区域； flag:
 * 赋值模块是否未input param：所要渲染的Json数据； author: maweiwei tel：13564515264
 */
$.poppicker3 = function(id, param, flag) {
	(function($, doc) {
		// 三级联动
		var selectPicker3 = new $.PopPicker({
			layer : 3
		});
		selectPicker3.setData(param);
		var showCityPickerButton = doc.getElementById(id);
		var selectResult3 = doc.getElementById(id);
		selectPicker3.show(function(items) {
			if (flag == "input") {
				if (items[2] == null || JSON.stringify(items[2]) == "{}") {
					selectResult3.value = items[0].text + " " + items[1].text;
					selectPicker3.dispose();// 释放组件资源
				} else {
					selectResult3.value = items[0].text + " " + items[1].text
							+ " " + items[2].text;
					selectPicker3.dispose();// 释放组件资源
				}
			} else {
				if (items[2] == null || JSON.stringify(items[2]) == "{}") {
					selectResult3.innerText = items[0].text + " "
							+ items[1].text;
					selectPicker3.dispose();// 释放组件资源
				} else {
					selectResult3.innerText = items[0].text + " "
							+ items[1].text + " " + items[2].text;
					selectPicker3.dispose();// 释放组件资源
				}
			}

		});
	})(mui, document);
}
/**
 * 页面只有一个上拉区域需要上拉加载 
 * 使用方法：$.pulluptoRefreshmui(id1, id2, pageNo,totalpage,method);
 * id1:所要上拉的区域；
 * id2:所要赋值的区域；
 * pageNo： 当前页数
 * totalpage： 总页数
 * method：上拉后执行的方法；
 * 此方法依赖组件
 * mui，请在页面中先引入 mui.min.css、mui.min.js
 * author: maweiwei
 */
$.pulluptoRefresmui = function(id1, id2, pageNo, method) {
	mui.init({
		pullRefresh: {
			container: "#"+id1,
			up: {
				contentrefresh: '',
				callback: pullupRefresh
			}
		}
	});
	//上拉加载回调方法
	function pullupRefresh(){
		$(".mui-pull-bottom-pocket .mui-pull").find(".mui-pull-loading").removeClass("mui-spinner");
		if(pageNo > totalpage){
			if($("#"+id2).find(".tipclear").length < 1){
				$("#"+id2).append("<div style='clear:both' class='tipclear'></div><p style='text-align:center;margin-bottom:0;margin-top:0.5rem;'class='tips'>没有更多数据了！</p>");
			}
		}
		setTimeout(function() {
			mui("#"+id1).pullRefresh().endPullupToRefresh(); 
			if(totalpage >= pageNo){
				method();
			}
		}, 100);
	}
}

/**
 * 打开日期控件:默认当前日期 使用方法：openDataNowDate(id); 此方法依赖组件 mui，请在页面中先引入 mui.min.css、
 * mui.listpicker.css、mui.dtpicker.css
 * mui.min.js、mui.listpicker.js、mui.dtpicker.js
 * 
 * author: maweiwei tel：13564515264
 */

function openDataNowDate(id) {
	var pickers = {};
	var optionsJson = '{"type":"date","beginYear":"1980"}';
	var options = JSON.parse(optionsJson);
	var id = id;
	var result = document.getElementById(id);
	pickers[id] = pickers[id] || new mui.DtPicker(options);
	pickers[id].show(function(rs) {
		result.value = rs.text;
		pickers[id].dispose();// 释放组件资源

	});
}
/**
 * 打开日期控件:默认当前日期的后一天 使用方法：openData(id); 此方法依赖组件 mui，请在页面中先引入 mui.min.css、
 * mui.listpicker.css、mui.dtpicker.css
 * mui.min.js、mui.listpicker.js、mui.dtpicker.js
 * 
 * author: maweiwei tel：13564515264
 */
function openData(id) {
	var now = new Date();
	now.setDate(now.getDate() + 1);
	var bY = now.getFullYear();
	var bM = now.getMonth() + 1;
	if (bM < 10) {
		bM = "0" + bM;
	}
	var bD = now.getDate();
	if (bD < 10) {
		bD = "0" + bD;
	}
	var bh = now.getHours;
	var bi = now.getMinutes();

	var pickers = {};
	var optionsJson = '{"type":"date","value":"' + bY + '-' + bM + '-' + bD
			+ '"}';
	var options = JSON.parse(optionsJson);
	var id = id;
	var result = document.getElementById(id);
	pickers[id] = pickers[id] || new mui.DtPicker(options);
	pickers[id].show(function(rs) {
		result.value = rs.text;
		pickers[id].dispose();// 释放组件资源
	});
}

/**
 * <button id='demo' data-options='{"type":"date","value":"2017-03-09","beginYear":2015,"beginMonth":3,"beginDay":2,"endYear":2020}' class="btn mui-btn mui-btn-block">自定义 ...</button>
 * 打开日期控件（自定义起始日期 默认选中日期 结束日期）： 使用方法：openDataCustomized(id); 此方法依赖组件 mui，请在页面中先引入
 * mui.min.css、 mui.picker.min.css
 * mui.min.js、mui.picker.min.js 
 */
function openDataCustomized(id) {
	var result = document.getElementById(id);
	result.addEventListener('tap', function() {
		var optionsJson = this.getAttribute('data-options') || '{}';
		var options = JSON.parse(optionsJson);
		var id = this.getAttribute('id');
		/*
		 * 首次显示时实例化组件
		 * 示例为了简洁，将 options 放在了按钮的 dom 上
		 * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
		 */
		var picker = new mui.DtPicker(options);
		picker.show(function(rs) {
			/*
			 * rs.value 拼合后的 value
			 * rs.text 拼合后的 text
			 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
			 * rs.m 月，用法同年
			 * rs.d 日，用法同年
			 * rs.h 时，用法同年
			 * rs.i 分（minutes 的第二个字母），用法同年
			 */
			result.value = rs.text;
			/* 
			 * 返回 false 可以阻止选择框的关闭
			 * return false;
			 */
			/*
			 * 释放组件资源，释放后将将不能再操作组件
			 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
			 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
			 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
			 */
			picker.dispose();
		});		
	});		
}
/**
 * 打开日期控件（只有月份选择）：默认当前月 使用方法：openDataMonth(id); 此方法依赖组件 mui，请在页面中先引入
 * mui.min.css、 mui.listpicker.css、mui.dtpicker.css
 * mui.min.js、mui.listpicker.js、mui.dtpicker.js author: maweiwei tel：13564515264
 */
function openDataMonth(id) {
	var pickers = {};
	var optionsJson = '{"type":"month"}';
	var options = JSON.parse(optionsJson);
	var id = id;
	var result = document.getElementById(id);
	pickers[id] = pickers[id] || new mui.DtPicker(options);
	pickers[id].show(function(rs) {
		result.value = rs.text;
		pickers[id].dispose();// 释放组件资源
	});
}

function UrlEncode(str) {
	var b = new Base64();
	str = b.encode(str);
	return str;
}
function UrlDecode(str) {
	var b = new Base64();
	str = b.decode(str);
	return str;
}

function Base64() {
	_keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	this.encode = function(input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = _utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2)
					+ _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
		}
		return output;
	}

	// public method for decoding
	this.decode = function(input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = _keyStr.indexOf(input.charAt(i++));
			enc2 = _keyStr.indexOf(input.charAt(i++));
			enc3 = _keyStr.indexOf(input.charAt(i++));
			enc4 = _keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}
		output = _utf8_decode(output);
		return output;
	}

	// private method for UTF-8 encoding
	_utf8_encode = function(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for ( var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}
		return utftext;
	}

	// private method for UTF-8 decoding
	_utf8_decode = function(utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while (i < utftext.length) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12)
						| ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
}

// Array.prototype.remove = function(s) {
// for ( var i = 0; i < this.length; i++) {
// if (s == this[i])
// this.splice(i, 1);
// }
// }

/**
 * Simple Map
 * 
 * 
 * var m = new Map(); m.put('key','value'); ... var s = "";
 * m.each(function(key,value,index){ s += index+":"+ key+"="+value+"\n"; });
 * alert(s);
 * 
 * @author dewitt
 * @date 2008-05-24
 */
function Map() {
	/** 存放键的数组(遍历用到) */
	this.keys = new Array();
	/** 存放数据 */
	this.data = new Object();

	/**
	 * 放入一个键值对
	 * 
	 * @param {String}
	 *            key
	 * @param {Object}
	 *            value
	 */
	this.put = function(key, value) {
		if (this.data[key] == null) {
			this.keys.push(key);
		}
		this.data[key] = value;
	};

	/**
	 * 获取某键对应的值
	 * 
	 * @param {String}
	 *            key
	 * @return {Object} value
	 */
	this.get = function(key) {
		return this.data[key];
	};

	/**
	 * 删除一个键值对
	 * 
	 * @param {String}
	 *            key
	 */
	this.remove = function(key) {
		this.keys.remove(key);
		this.data[key] = null;
	};

	/**
	 * 遍历Map,执行处理函数
	 * 
	 * @param {Function}
	 *            回调函数 function(key,value,index){..}
	 */
	this.each = function(fn) {
		if (typeof fn != 'function') {
			return;
		}
		var len = this.keys.length;
		for ( var i = 0; i < len; i++) {
			var k = this.keys[i];
			fn(k, this.data[k], i);
		}
	};

	/**
	 * 获取键值数组(类似Java的entrySet())
	 * 
	 * @return 键值对象{key,value}的数组
	 */
	this.entrys = function() {
		var len = this.keys.length;
		var entrys = new Array(len);
		for ( var i = 0; i < len; i++) {
			entrys[i] = {
				key : this.keys[i],
				value : this.data[i]
			};
		}
		return entrys;
	};

	/**
	 * 判断Map是否为空
	 */
	this.isEmpty = function() {
		return this.keys.length == 0;
	};

	/**
	 * 获取键值对数量
	 */
	this.size = function() {
		return this.keys.length;
	};

	/**
	 * 重写toString
	 */
	this.toString = function() {
		var s = "{";
		for ( var i = 0; i < this.keys.length; i++, s += ',') {
			var k = this.keys[i];
			s += k + "=" + this.data[k];
		}
		s += "}";
		return s;
	};
}

function testMap() {
	var m = new Map();
	m.put('key1', 'Comtop');
	m.put('key2', '南方电网');
	m.put('key3', '景新花园');
	alert("init:" + m);

	m.put('key1', '康拓普');
	alert("set key1:" + m);

	m.remove("key2");
	alert("remove key2: " + m);

	var s = "";
	m.each(function(key, value, index) {
		s += index + ":" + key + "=" + value + "\n";
	});
	alert(s);
}

/**
 * 通过身份证返回性别
 * 
 * 1-男;2-女
 */
$.getSex = function(data) {
	if (parseInt(data.substr(16, 1)) % 2 == 0) {
		return 2;
	} else {
		return 1;
	}
};
/**
 * 通过身份证返回生日
 */
$.getBirthDay = function(data) {
	var bd = data.substr(6, 4) + "-" + data.substr(10, 2) + "-"
			+ data.substr(12, 2);
	return bd;

};
/**
 * 通过出生日期获取年龄
 * 
 * 参数birthDay now  yyyy-MM-dd 
 */
$.getAge=function(birth,now){
	if (now != null && now != "" && now != undefined) {
		var current = new Date(Date.parse(now));
	}else{
		var current = new Date();
	}	

	var yearNow = current.getFullYear();
	var monthNow = current.getMonth();
	var dayOfMonthNow = current.getDate();

	var birthDay=new Date(Date.parse(birth));
	var yearBirth = birthDay.getFullYear();
	var monthBirth = birthDay.getMonth();
	var dayOfMonthBirth = birthDay.getDate();

	var age = yearNow - yearBirth;
	if (monthNow <= monthBirth) {
		if (monthNow == monthBirth) {
			if (dayOfMonthNow < dayOfMonthBirth){
				age--;
			}
		} else {
			age--;
		}
	}
	if(age==0){
		current.setDate(dayOfMonthNow-30);
		if((current.getTime()-birthDay.getTime())<0){//出生未满30天
			age=-1;
		}
	}
	return age;
}

// 是否选择按钮
$.yesSelect = function(domobj) {
	$(domobj).unbind("tap").bind(
			"tap",
			function() {
				var index = $(domobj).index($(this));
				$(domobj).eq(index).removeClass("info_unselected").addClass(
						"info_selected").siblings()
						.removeClass("info_selected").addClass(
								"info_unselected");
			});
};

// 格式化数字四舍五入保存两位小数
$.formatNumOfTwo = function(param) {
	var param2 = Math.round(param * Math.pow(10, 2)) / Math.pow(10, 2);
	// param = Math.floor(param);
	return param2.toFixed(2);
};
/*保留两位小数*/
function savenum(num){
	num = parseFloat(num);
	var number = num.toFixed(2);
	return number;
}

// 浮点数相乘，保留整数部分
function accMul(arg1, arg2) {
	var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
	try {
		m += s1.split(".")[1].length
	} catch (e) {
	}
	try {
		m += s2.split(".")[1].length
	} catch (e) {
	}
	return Number(s1.replace(".", "")) * Number(s2.replace(".", ""))
			/ Math.pow(10, m)
}
/*
 * 匹配银行图标 使用方法：bankiconselect("招商银行");
 */
function bankiconselect(bankname) {
	var bankimg = "../../imgs/bankicon/";
	if (bankname.indexOf("农业银行") > -1) {
		bankimg += "nyBank.png";
	} else if (bankname.indexOf("中国银行") > -1) {
		bankimg += "chinaBank.png";
	} else if (bankname.indexOf("建设银行") > -1) {
		bankimg += "jsBank.png";
	} else if (bankname.indexOf("兴业银行") > -1) {
		bankimg += "xyBank.png";
	} else if (bankname.indexOf("光大银行") > -1) {
		bankimg += "gdBank.png";
	} else if (bankname.indexOf("平安银行") > -1) {
		bankimg += "paBank.png";
	} else if (bankname.indexOf("浦发银行") > -1) {
		bankimg += "pfBank.png";
	} else if (bankname.indexOf("邮政") > -1) {
		bankimg += "yzcxBank.png";
	} else if (bankname.indexOf("中信银行") > -1) {
		bankimg += "zxBank.png";
	} else if (bankname.indexOf("深圳发展银行") > -1) {
		bankimg += "szfzBank.png";
	} else if (bankname.indexOf("招商银行") > -1) {
		bankimg += "zsBank.png";
	} else if (bankname.indexOf("民生银行") > -1) {
		bankimg += "msBank.png";
	} else if (bankname.indexOf("广州银行") > -1) {
		bankimg += "gzBank.png";
	} else if (bankname.indexOf("华夏银行") > -1) {
		bankimg += "hxBank.png";
	} else if (bankname.indexOf("广发银行") > -1) {
		bankimg += "gfBank.png";
	} else if (bankname.indexOf("工商") > -1) {
		bankimg += "gsBank.png";
	} else if (bankname.indexOf("上海银行") > -1) {
		bankimg += "shBank.png";
	} else if (bankname.indexOf("渤海银行") > -1) {
		bankimg += "bhBank.png";
	} else if (bankname.indexOf("交通银行") > -1) {
		bankimg += "jtBank.png";
	}
	if (bankimg == "../../imgs/bankicon/") {
		return "";
	} else {
		return bankimg;
	}
}
/*
 * 匹配银行圆形图标 使用方法：bankiconselect("招商银行");
 */
function bankCircleicon(bankname) {
	var bankimg = "../../imgs/bankIcons/";
	if (bankname.indexOf("农业银行") > -1) {
		bankimg += "nyBank.png";
	} else if (bankname.indexOf("中国银行") > -1) {
		bankimg += "chinaBank.png";
	} else if (bankname.indexOf("建设银行") > -1) {
		bankimg += "jsBank.png";
	} else if (bankname.indexOf("兴业银行") > -1) {
		bankimg += "xyBank.png";
	} else if (bankname.indexOf("光大银行") > -1) {
		bankimg += "gdBank.png";
	} else if (bankname.indexOf("平安银行") > -1) {
		bankimg += "paBank.png";
	} else if (bankname.indexOf("浦发银行") > -1) {
		bankimg += "pfBank.png";
	} else if (bankname.indexOf("邮政") > -1) {
		bankimg += "yzcxBank.png";
	} else if (bankname.indexOf("中信银行") > -1) {
		bankimg += "zxBank.png";
	} else if (bankname.indexOf("深圳发展银行") > -1) {
		bankimg += "szfzBank.png";
	} else if (bankname.indexOf("招商银行") > -1) {
		bankimg += "zsBank.png";
	} else if (bankname.indexOf("民生银行") > -1) {
		bankimg += "msBank.png";
	} else if (bankname.indexOf("广州银行") > -1) {
		bankimg += "gzBank.png";
	} else if (bankname.indexOf("华夏银行") > -1) {
		bankimg += "hxBank.png";
	} else if (bankname.indexOf("广发银行") > -1) {
		bankimg += "gfBank.png";
	} else if (bankname.indexOf("工商") > -1) {
		bankimg += "gsBank.png";
	} else if (bankname.indexOf("上海银行") > -1) {
		bankimg += "shBank.png";
	} else if (bankname.indexOf("渤海银行") > -1) {
		bankimg += "bhBank.png";
	} else if (bankname.indexOf("交通银行") > -1) {
		bankimg += "jtBank.png";
	}
	if (bankimg == "../../imgs/bankIcons/") {
		return "";
	} else {
		return bankimg;
	}
}
/*
 * 匹配银行底色 使用方法：bankiconcolor("招商银行");
 */
function bankiconcolor(bankname) {
	var bankcolor = "#1b6bb8";
	if (bankname.indexOf("农业银行") > -1) {
		bankcolor = "#57c2bb";
	} else if (bankname.indexOf("中国银行") > -1) {
		bankcolor = "#ff6179";
	} else if (bankname.indexOf("建设银行") > -1) {
		bankcolor = "#5ea4f3";
	} else if (bankname.indexOf("兴业银行") > -1) {
		bankcolor = "#5ea4f3";
	} else if (bankname.indexOf("光大银行") > -1) {
		bankcolor = "#a62ed0";
	} else if (bankname.indexOf("平安银行") > -1) {
		bankcolor = "#fe8238";
	} else if (bankname.indexOf("浦发银行") > -1) {
		bankcolor = "#4588f6";
	} else if (bankname.indexOf("邮政") > -1) {
		bankcolor = "#5cbb32";
	} else if (bankname.indexOf("中信银行") > -1) {
		bankcolor = "#ff6179";
	} else if (bankname.indexOf("深圳发展银行") > -1) {
		bankcolor = "#02a3f1";
	} else if (bankname.indexOf("招商银行") > -1) {
		bankcolor = "#ff6179";
	} else if (bankname.indexOf("民生银行") > -1) {
		bankcolor = "#128ee0";
	} else if (bankname.indexOf("广州银行") > -1) {
		bankcolor = "#ff6179";
	} else if (bankname.indexOf("华夏银行") > -1) {
		bankcolor = "#ff616";
	} else if (bankname.indexOf("广发银行") > -1) {
		bankcolor = "#ff6179";
	} else if (bankname.indexOf("工商") > -1) {
		bankcolor = "#ff6179";
	} else if (bankname.indexOf("上海银行") > -1) {
		bankcolor = "#577efa";
	} else if (bankname.indexOf("渤海银行") > -1) {
		bankcolor = "#577efa";
	} else if (bankname.indexOf("交通银行") > -1) {
		bankcolor = "#4588f6";
	}
	return bankcolor;
}
var certificatearray = [ {
	name : '身份证',
	code : '01'
}, {
	name : '军人证',
	code : '02'
}, {
	name : '护照',
	code : '03'
}, {
	name : '港澳通行证或台胞证',
	code : '04'
}, {
	name : '户口簿',
	code : '05'
}, {
	name : '返乡证',
	code : '06'
}, {
	name : '驾照',
	code : '07'
}, {
	name : '其他',
	code : '00'
} ]; // 证件类型
/*数字动态增长*/
function AddNum(num,id,timerFlag,number){
	if(!timerFlag){
		interval=setInterval(function(){setTimeshow(num,id,timerFlag)},100); 
	}
	/*计时器显示的信息*/
	function setTimeshow(totalnum,id,timerFlag){
		var addnum = parseInt(totalnum*0.1);
		if(addnum == 0){
			addnum = totalnum*0.1;
		}
		var totalstr = String(totalnum);
		totalstr = totalstr.split(".")[1];
		if(!$.isNull(totalstr)){
			totalstr = "."+totalstr;
		}else{
			totalstr = "";
		}
		if(number >= totalnum){
			clearInterval(interval);
			$("."+id).html(cutStr(totalnum) + totalstr);
			timerFlag = true;
		}else{
			$("."+id).html(cutStr(number));
			number = number + addnum;
			timerFlag = false;
		}
	}
};
var cutStr=function(str){
	  str = str.toString(); 
	  str =str.split('.')[0];
	  var newStr=new Array(str.length+parseInt(str.length/3));  
	  var strArray=str.split("");
	  newStr[newStr.length-1]=strArray[strArray.length-1];   
	  var currentIndex=strArray.length-1;
	  for(var i=newStr.length-1;i>=0;i--){ 
	    if((newStr.length-i)%4==0){  
	    	if(i == 0){
	    		 newStr[i]=strArray[currentIndex--]
	    	}else{
	    		newStr[i]=",";  
	    	}
	    }  
	    else{   
	      newStr[i]=strArray[currentIndex--];   
	    }   
	  }   
	  return newStr.join("")   
};
// url传值加密过程
/*
 * var jsonObj = { 'head' : { 'userId' : userId, 'userName' : userName,
 * 'loginflag' : loginflag, 'source': source }, "body":{ "flag":"1" } }; var
 * jsonStr = JSON.stringify(jsonObj); jsonStr = UrlEncode(jsonStr); nextPageUrl =
 * url + "?" + "jsonKey=" + jsonStr;//下一页的url // url传值解密过程 var str =
 * window.location.search; str = str.substr(9, str.length); str =
 * UrlDecode(str); parm = JSON.parse(str);
 */

/**
 * 通用埋点方法
 * 
 * page 页面路径：如gfb\\newExp\\App\\js\\often\\clientManager-list
 * 
 * actions 动作：浏览，离开，注册，登录，购买等
 * 
 * actionDescription 动作描述，暂时填页面标题
 * 
 */
$.saveUserBehaviorAnalyzer = function(page, actions, actionDescription,
		actionAttribute1, actionAttribute2, actionAttribute3, actionAttribute4,
		async) {
	if(actions == "浏览"){
		actionStartTime = new Date();
	}
	var AnalyzerHead={};
	var AnalyzerBody={};
	var userBehaviorAnalyzer = {
			"head":AnalyzerHead,
			"body":AnalyzerBody
	};
	if (async == null) {
		async = true;
	}
	var urlstr = getUrlQueryString('jsonKey');
	if (urlstr != null) {
		urlstr = UrlDecode(urlstr);
		parm = JSON.parse(urlstr);
		AnalyzerBody.customerId = parm.body.customerId;
		AnalyzerBody.channel = "1";
		AnalyzerBody.transTime =$.getTimeStr();
		AnalyzerBody.uuid = parm.body.uuid;
		AnalyzerBody.modelSpecification = parm.body.modelSpecification;
	}
	AnalyzerBody.ip = returnCitySN["cip"];
	AnalyzerBody.city = returnCitySN["cname"];
	AnalyzerBody.page = page;
	AnalyzerBody.actions = actions;
	AnalyzerBody.actionDescription = actionDescription;
	AnalyzerBody.actionAttribute1 = actionAttribute1;
	AnalyzerBody.actionAttribute2 = actionAttribute2;
	AnalyzerBody.actionAttribute3 = actionAttribute3;
	if(actions == "离开"){
		var endtime = new Date();
		var QuantumTime=(endtime.getTime()-actionStartTime.getTime())/1000;  //时间差的毫秒数
		QuantumTime= parseInt(QuantumTime)
		AnalyzerBody.actionAttribute4 = QuantumTime;
	}else{
		AnalyzerBody.actionAttribute4 = actionAttribute4;
	}
	AnalyzerBody.requestUrl="/commonCache/saveUserBehaviorAnalyzer";
	AnalyzerBody.systemChannel="02";
	var requestJson = aesEncrypt(JSON.stringify(userBehaviorAnalyzer), secretKey,
			secretKey);
	requestJson = URLencodeForBase64(requestJson);
	$.ajax({
		url : base.url + "common/commonRequest.do",
		type : 'POST',
		data : "jsonKey=" + requestJson,
		dataType : "json",
		timeout : 60000,
		async : async,
		success : function(data) {
		}

	});
};
//获取当前时间
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}

function toDecimal2(x) { 
      var f = parseFloat(x); 
      if (isNaN(f)) { 
        return false; 
      } 
      var f = Math.round(x*100)/100; 
      var s = f.toString(); 
      var rs = s.indexOf('.'); 
      if (rs < 0) { 
        rs = s.length; 
        s += '.'; 
      } 
      while (s.length <= rs + 2) { 
        s += '0'; 
      } 
      return s; 
}


//险种代码转险种名称
function productIdToName(productId){
	if(productId=="004199002"){
		return "男性高发恶性肿瘤险";
	}else if(productId=="004199003"){
		return "女性高发恶性肿瘤险";
	}else if(productId=="004199004"){
		return "男性常见恶性肿瘤险";
	}else if(productId=="004199005"){
		return "女性常见恶性肿瘤险";
	}else if(productId=="004199006"){
		return "少儿高发恶性肿瘤险";
	}else if(productId=="004199007"){
		return "少儿常见恶性肿瘤险";
	}else{
		return "";
	}			
		
}
//险种代码转险种名称
function productIdToNameTotal(productId){
	if(productId=="004199002" || productId=="004199004"){
		return "男性百万恶性肿瘤险";
	}else if(productId=="004199003" || productId=="004199005"){
		return "女性百万恶性肿瘤险";
	}else if(productId=="004199006" || productId=="004199007"){
		return "少儿百万恶性肿瘤险";
	}else{
		return "";
	}			
		
}
function toField(str){
	var field = "";
	if(str == "01"){
		field = "意外险"
	}else if(str == "02"){
		field = "少儿险"
	}else if(str == "03"){
		field = "养老险"
	}else if(str == "04"){
		field = "重疾险"
	}else if(str == "05"){
		field = "医疗险"
	}else if(str == "06"){
		field = "人寿险"
	}else if(str == "07"){
		field = "理财险"
	}else if(str == "08"){
		field = "车辆险"
	}else if(str == "09"){
		field = "家财险"
	}else if(str == "10"){
		field = "企业财产险"
	}else if(str == "11"){
		field = "农业险"
	}
	return field;
}
/**
 * @function  手机号中间四位隐去
 */
$.phonePrivate = function(phone){
	if(phone){
		var phoneOhter = phone.replace(/(\d{3})\d*(\d{4})/g,"$1****$2");
	}else{
		var phoneOther = '';
	}
	return phoneOhter;	
}
/**
 * @function  身份证中间四位隐去
 */
$.certifiPrivate = function(ID){
	if(ID){
		var IDOther = ID.replace(/(\S{3})\S*(\S{4})/g,"$1********$2");
	}else{
		var IDOther = '';
	}
	return IDOther;	
}
/*
 * @function mui页面内容滚动
 */
$.setscroll = function(objId) {
	var Scrollheight = window.innerHeight - $("header").height;
	$("#"+objId).height(Scrollheight + "px");
	mui("#"+objId).scroll();
};
$.toreqAjaxs = function(url, dataList, callBack) {
	var requestData = {};
	requestData.request = dataList;
	var requestJson = aesEncrypt(JSON.stringify(requestData), secretKey, secretKey);
	requestJson=URLencodeForBase64(requestJson);
	$.ajax({
		url : url,
		type : 'POST',
		data : "jsonKey=" + requestJson,
		dataType : "json",
		timeout : 60000,
		success : function(data) {
			if ($.isNull(callBack)) {

			} else {
				$(".ajax_prevent").remove();// 去除遮罩
				callBack(data);
			}
		},
		error : function(data) {
			$(".ajax_prevent").remove();// 去除遮罩
			modelAlert("网络好像开小差了呢，请设置给力一点儿网络吧！");
		},
		beforeSend : function(xhr) {
			$.ajaxPrevent();
		},
		async : true,
	});
};

/**--风险评测枚举转换--*/
function changeLevel(level){
	if(level.indexOf("a")!=-1){
		level="（风险评价A类）"
	}else if(level.indexOf("b")!=-1){
		level="（风险评价B类）"
	}else if(level.indexOf("c")!=-1){
		level="（风险评价C类）"
	}else if(level.indexOf("d")!=-1){
		level="（风险评价D类）"
	}else{
		level="（风险无等级）"
	}
	return level;
}

/**--渠道代码转渠道名称--*/
function changeChannel(channel){
	var url = base.url + "bill/selectChannel.do";
	var requestData = {
		"head":{
			"userCode":"",
			"transTime":$.getTimeStr(),
			"channel":"3"
		},"body":{
	        "channelCode" : channel
		}
	};
	var requestJson = aesEncrypt(JSON.stringify(requestData), secretKey, secretKey);
	requestJson=URLencodeForBase64(requestJson);
	$.ajax({
		url : url,
		type : 'POST',
		data : "jsonKey=" + requestJson,
		dataType : "json",
		timeout : 60000,
		success : function(data) {
			$(".ajax_prevent").remove();// 去除遮罩
			channel=data.returns.bxCxChannel.channelName;
		},
		error : function(data) {
			$(".ajax_prevent").remove();// 去除遮罩
			modelAlert("网络好像开小差了呢，请设置给力一点儿网络吧！");
		},
		beforeSend : function(xhr) {
			$.ajaxPrevent();
		},
		async : false,
	});
	return channel;
}
/**截取年月日***/
function subTime(timeStr){
  return timeStr.substring(0,10);
}