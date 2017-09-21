/*--------------<--------------<------- Api Start-------<--------------<-------------*/
/*******************************************************************************
 * Ajax get : 使用Get方法获取数据
 * post : 使用Post方法传递数据
 * 
 * Browser chrome : 输出chrome信息 
 * core : 输出浏览器内核信息 
 * firefox : 输出ff信息 
 * IE : 输出ie信息 al
 * isGecko : 是否为Gecko内核 
 * isWebkit : 是否为Webkit内核 
 * opera : 输出opera信息 
 * safari :  输出safari信息 
 * version : 输出浏览器版本信息
 * 
 * cookie del : 销毁
 * cookie get : 获取
 * cookie set : 设置cookie
 * 
 * data add : 计算日期 
 * getCNDay : 显示周或星期 
 * toString : 格式化日期
 * 
 * img isComplete : 判断图片是否已经加载完成 
 * preload : 预加载图片
 * 
 * math randomColor : 随机颜色 
 * randomNum : 随机数 
 * sum : 求和
 * 
 * page getHeight : 获取页面高度 
 * getScrollLeft : 获取横向滚动量 
 * getScrollTop : 获取纵向滚动量
 * getViewHeight : 获取页面视觉区域高度 
 * getViewWidth : 获取页面视觉区域宽度 
 * getWidth : 获取页面宽度 
 * rollTo : 页面滚动至 
 * rollToBottom : 页面滚动至底部 
 * rollToTop ： 页面滚动至顶部
 * 
 * platform isAndroid : 是否为安卓系统 
 * isBlackBerry : 是否为黑莓 
 * isIpad : 是否为iPad 
 * isIphone :  是否为iPhone  
 * isMacintosh : 是否为Mac 
 * isMobile : 是否为移动设备
 * isWindows : 是否为Windows
 * isX11 : 是否为X11
 * 
 * regExp isAdult : 判断是否已成年 
 * isChinese : 判断是否为中文  
 * isDate : 判断是否为正确日期格式
 * isEmail : 判断是否为Email地址  
 * isIdcard : 判断是否为身份证号 
 * isMobile : 判断是否为手机号 
 * isQQ : 判断是否为QQ号 
 * isTel :判断是否为固定电话号 
 * isURL : 判断是否为链接地址 
 * isPsd : 判断是否为密码 
 * isPostalcode : 判断是否为邮政编码
 * isCardNum : 判断是否只有字母和数字 
 * isMoney : 判断是否只有点和数字
 *
 * string encrypt : 加密 
 * filterText : 屏蔽词 
 * isNotaNumber : 判断是否为数字 
 * noNumbers : 判断是否存在数字 
 * onlyNumbers : 判断是否为仅有数字
 * removeWhitespace : 移除字符串两边空白 
 * toArray : 转换为数组
 * unEncrypt : 解密
 * 
 * url getQueryVariable : 获取url参数的键值对 
 * getQueryString : 获取url参数的值 
 * getUrlParm :  获取url参数
 ******************************************************************************/
if (typeof tit !== 'object') {
	var tit = {};
}

/*--------------<--------------<------- Ajax Start-------<--------------<-------------*/
/*******************************************************************************
 * get : 使用Get方法获取数据, tit.ajax.get('2.xml',function(e){ console.log(e.getElementsByTagName('success')[0].firstChild.nodeValue) },'xml');
 * post : 使用Post方法传递数据, tit.ajax.post('ajax.txt',data,function(v){ console.log(e.getElementsByTagName('success')[0].firstChild.nodeValue) },'xml');
 * 
 ******************************************************************************/
if (typeof tit.ajax !== 'object') {
	tit.ajax = {
		_xmlHttp : function() {
			return new (window.ActiveXObject || window.XMLHttpRequest)(
					"Microsoft.XMLHTTP");
		},
		_AddEventToXHP : function(xhp, fun, format) {
			xhp.onreadystatechange = function() {
				if (xhp.readyState == 4 && xhp.status == 200) {
					var tmp = "";
					if (format) {
						switch (format) {
						case 'text':
							tmp = xhp.responseText;
							break;
						case 'json':
							tmp = eval('(' + xhp.responseText + ')');
							break;
						case 'xml':
							tmp = xhp.responseXML;
							break;
						}
					} else {
						tmp = eval('(' + xhp.responseText + ')');
					}
					fun(tmp);
				}
			};
		},
		get : function(url, fun, format, bool) {
			var _xhp = tit.ajax._xmlHttp();
			tit.ajax._AddEventToXHP(_xhp, fun || function() {
			}, format);
			_xhp.open("GET", url, bool);
			_xhp.send(null);
		},
		post : function(url, data, fun, format, bool) {
			var _xhp = tit.ajax._xmlHttp();
			tit.ajax._AddEventToXHP(_xhp, fun || function() {
			}, format);
			_xhp.open("POST", url, bool);
			_xhp.setRequestHeader("Content-Type",
					"application/x-www-form-urlencoded");
			_xhp.send(data);
		}
	};
};

/*--------------<--------------<------- Array Start-------<--------------<-------------*/
/*******************************************************************************
 * 删除数组指定下标或指定对象
 * 
 ******************************************************************************/
Array.prototype.remove = function(obj) {
	for ( var i = 0; i < this.length; i++) {
		var temp = this[i];
		if (!isNaN(obj)) {
			temp = i;
		}
		if (temp == obj) {
			for ( var j = i; j < this.length; j++) {
				this[j] = this[j + 1];
			}
			this.length = this.length - 1;
		}
	}
};
/*--------------<--------------<------- Browser Start-------<--------------<-------------*/
/*******************************************************************************
 * chrome : 输出chrome信息 alert(tit.browser.chrome) 
 * core : 输出浏览器内核信息 alert(tit.browser.core()) 
 * firefox : 输出ff信息 alert(tit.browser.firefox) 
 * IE : 输出ie信息 alert(tit.browser.ie) 
 * isGecko : 是否为Gecko内核 alert(tit.browser.isGecko)
 * isWebkit : 是否为Webkit内核 (tit.browser.isWebkit) 
 * opera : 输出opera信息 (tit.browser.opera) 
 * safari : 输出safari信息 (tit.browser.safari) 
 * version : 输出浏览器版本信息 (tit.browser.version())
 * 
 ******************************************************************************/
if (typeof tit.browser !== 'object') {
	tit.browser = {
		addFavorite : function(sURL, sTitle, notice) {
			try {
				window.external.addFavorite(sURL, sTitle);
			} catch (e) {
				try {
					window.sidebar.addPanel(sTitle, sURL, "");
				} catch (e) {
					return notice;
				}
			}
		},
		chrome : /chrome\/(\d+\.\d+)/i.test(navigator.userAgent) ? +RegExp['\x241']
				: undefined,
		core : function() {
			var type = (
			/* @cc_on!@ */0 ? 'msie' : window.chrome ? 'chrome'
					: window.opera ? 'opera'
							: window.MouseScrollEvent ? 'gecko'
									: window.WheelEvent ? 'safari' : 'unknown');
			return type;
		},
		firefox : /firefox\/(\d+\.\d+)/i.test(navigator.userAgent) ? +RegExp['\x241']
				: undefined,
		ie : /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || +RegExp['\x241'])
				: undefined,
		isGecko : /gecko/i.test(navigator.userAgent)
				&& !/like gecko/i.test(navigator.userAgent),
		isWebkit : /webkit/i.test(navigator.userAgent),
		opera : /opera(\/| )(\d+(\.\d+)?)(.+?(version\/(\d+(\.\d+)?)))?/i
				.test(navigator.userAgent) ? +(RegExp["\x246"] || RegExp["\x242"])
				: undefined,
		safari : /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i
				.test(navigator.userAgent)
				&& !/chrome/i.test(navigator.userAgent) ? +(RegExp['\x241'] || RegExp['\x242'])
				: undefined,
		version : function() {
			var Sys = {}, ua = navigator.userAgent.toLowerCase(), s, result;
			(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] : (s = ua
					.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] : (s = ua
					.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] : (s = ua
					.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] : (s = ua
					.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1]
					: 0;
			if (Sys.ie) {
				result = 'ie ' + Sys.ie;
			} else if (Sys.firefox) {
				result = 'firfox ' + Sys.firefox;
			} else if (Sys.chrome) {
				result = 'chrome ' + Sys.chrome;
			} else if (Sys.opera) {
				result = 'opera ' + Sys.opera;
			} else if (Sys.safari) {
				result = 'safari ' + Sys.safari;
			} else {
				result = 'other browser';
			}
			return result;
		}
	};
}
/*--------------<--------------<------- Cookie Start-------<--------------<-------------*/
/*******************************************************************************
 * del : 销毁cookie tit.cookie.del("test") 
 * get : 获取cookie alert(tit.cookie.get("test")) 
 * set : 设置cookie tit.cookie.set("test","测试成功")
 * 
 ******************************************************************************/
if (typeof tit.cookie !== 'object') {
	tit.cookie = {
		del : function(name, path, domain) {
			document.cookie = name + "=" + ((path) ? "; path=" + path : "")
					+ ((domain) ? "; domain=" + domain : "")
					+ "; expires=Thu, 01-Jan-70 00:00:01 GMT";
		},
		get : function(name) {
			var v = document.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
			return v ? decodeURIComponent(v[1]) : null;
		},
		set : function(name, value, expires, path, domain) {
			var str = name + "=" + encodeURIComponent(value);
			if (expires != null || expires != '') {
				if (expires == 0) {
					expires = 100 * 365 * 24 * 60;
				}
				var exp = new Date();
				exp.setTime(exp.getTime() + expires * 60 * 1000);
				str += "; expires=" + exp.toGMTString();
			}
			if (path) {
				str += "; path=" + path;
			}
			if (domain) {
				str += "; domain=" + domain;
			}
			document.cookie = str;
		}
	};
}
/*--------------<--------------<------- Date Start-------<--------------<-------------*/
/*******************************************************************************
 * var day = new Date; add : 计算日期, tit.date.add(day,20) 算出20天后的日期 
 * getCNDay : 显示周或星期, tit.date.getCNDay(day,"Z") "Z"显示周 否则显示星期 
 * toString : 格式化日期, tit.date.toString(day,"yyyy-mm-dd")
 * 
 ******************************************************************************/
if (typeof tit.date !== 'object') {
	tit.date = {
		add : function(day, num) {
			var val = day.valueOf();
			val = val + num * 24 * 60 * 60 * 1000;
			return new Date(val);
		},
		getCNDay : function(day, Z_XQ) {
			var cnDay = [ '周日', '周一', '周二', '周三', '周四', '周五', '周六' ], cnDay1 = [
					'星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ];
			if (typeof Z_XQ == 'undefined' || Z_XQ == 'Z') {
				return cnDay[day.getDay()];
			} else {
				return cnDay1[day.getDay()];
			}
		},
		toString : function(day, format) {
			if (typeof format == 'undefined') {
				format = 'yyyy-mm-dd';
			}
			var year = day.getFullYear();
			var month = day.getMonth() + 1;
			var date = day.getDate();

			format = format.replace('yyyy', year);
			format = format.replace('mm', month);
			format = format.replace('dd', date);
			return format;
		}

	};
}
/*--------------<--------------<------- Img  Start-------<--------------<-------------*/
/*******************************************************************************
 * var img = $("#abc"); isComplete : 判断图片是否已经加载完成 alert(tit.img.isComplete(img))
 * preload : 预加载图片 tit.img.preload('1.jpg','2.jpg','3.jpg')
 * 
 ******************************************************************************/
if (typeof tit.img !== 'object') {
	tit.img = {
		isComplete : function(img) {
			if (!img.complete) {
				return false;
			}
			if (typeof img.naturalWidth != "undefined" && img.naturalWidth == 0) {
				return false;
			}
			return true;
		},
		preload : function(argument) {
			var imageArray = new Array(argument.length);
			for ( var i = 0; i < argument.length; i++) {
				imageArray[i] = new Image;
				imageArray[i].src = argument[i];
			}
		}
	};
}
/*--------------<--------------<------- Math Start-------<--------------<-------------*/
/*******************************************************************************
 * randomColor : 随机颜色 alert(tit.math.randomColor()) 
 * randomNum : 随机数 tit.math.randomNum(50,100) 产生50-100之间的随机数 
 * sum : 求和 alert(tit.math.sum(10,20,20,32))
 * 
 ******************************************************************************/
if (typeof tit.math !== 'object') {
	tit.math = {
		randomColor : function() {
			var color = Math.random(0, 0xFFFFFF);
			return '#' + ('000000' + color.toString(16)).slice(-6);
		},
		randomNum : function(begin, end) {
			var c = end - begin + 1;
			return Math.floor(Math.random() * c + begin);
		},
		sum : function() {
			var result = 0;
			for ( var i = 0; i < arguments.length; i++) {
				result += arguments[i];
			}
			return result;
		}
	};
}
/*--------------<--------------<------- Page Start-------<--------------<-------------*/
/*******************************************************************************
 * getHeight : 获取页面高度 alert(tit.page.getHeight()) 
 * getScrollLeft : 获取横向滚动量  alert(tit.page.getScrollLeft())
 * getScrollTop : 获取纵向滚动量 alert(tit.page.getScrollTop()) 
 * getViewHeight : 获取页面视觉区域高度 alert(tit.page.getViewHeight()) 
 * getViewWidth : 获取页面视觉区域宽度  alert(tit.page.getViewWidth()) 
 * getWidth : 获取页面宽度 alert(tit.page.getWidth())
 * rollTo : 页面滚动至 tit.page.rollTo("#crumbs",20);//速度默认为80 
 * rollToBottom : 页面滚动至底部
 * tit.page.rollToBottom(20);//速度默认为50 
 * rollToTop ： 页面滚动至顶部
 * tit.page.rollToTop(20);//速度默认为50
 * 
 ******************************************************************************/
if (typeof tit.page !== 'object') {
	tit.page = {
		getHeight : function() {
			var doc = document, body = doc.body, html = doc.documentElement, client = doc.compatMode == 'BackCompat' ? body
					: doc.documentElement;
			return Math.max(html.scrollHeight, body.scrollHeight,
					client.clientHeight);
		},
		getScrollLeft : function() {
			var d = document;
			return window.pageXOffset || d.documentElement.scrollLeft
					|| d.body.scrollLeft;
		},
		getScrollTop : function() {
			var d = document;
			return window.pageYOffset || d.documentElement.scrollTop
					|| d.body.scrollTop;
		},
		getViewHeight : function() {
			var doc = document, client = doc.compatMode == 'BackCompat' ? doc.body
					: doc.documentElement;
			return client.clientHeight;
		},
		getViewWidth : function() {
			var doc = document, client = doc.compatMode == 'BackCompat' ? doc.body
					: doc.documentElement;
			return client.clientWidth;
		},
		getWidth : function() {
			var doc = document, body = doc.body, html = doc.documentElement, client = doc.compatMode == 'BackCompat' ? body
					: doc.documentElement;
			return Math.max(html.scrollWidth, body.scrollWidth,
					client.clientWidth);
		},
		rollTo : function(endPointElement, speed) {
			var nowScrollY = window.scrollY, endPoint = document
					.getElementById(endPointElement.substr(1)).offsetTop;
			if (nowScrollY != endPoint) {
				speed ? speed : 50;
				for ( var i = 1; i < speed; i *= 10) {
					if (speed / i < 10) {
						break;
					}
				}
				if (endPoint > speed) {
					var timer = setInterval(function() {
						if (nowScrollY < endPoint - i
								|| nowScrollY > endPoint + i) {
							if (nowScrollY < endPoint) {
								nowScrollY = nowScrollY + speed;
							} else if (nowScrollY > endPoint) {
								nowScrollY = nowScrollY - speed;
							}
							window.scroll(0, nowScrollY);
						} else {
							clearInterval(timer);
						}
					}, 13);
				} else {
					window.scroll(0, endPoint);
				}
			}
		},
		rollToBottom : function(speed) {
			var nowScrollY = window.scrollY, pageHeight = document.body.scrollHeight, timer = setInterval(
					function() {
						if (nowScrollY <= pageHeight) {
							nowScrollY = nowScrollY + (speed ? speed : 50);
							window.scroll(0, nowScrollY);
						} else {
							clearInterval(timer);
						}
					}, 13);
		},
		rollToTop : function(speed) {
			var nowScrollY = window.scrollY;
			if (nowScrollY > 0) {
				var timer = setInterval(function() {
					if (nowScrollY >= 0) {
						nowScrollY = nowScrollY - (speed ? speed : 50);
						window.scroll(0, nowScrollY);
					} else {
						clearInterval(timer);
					}
				}, 13);
			}
		}
	}
}
/*--------------<--------------<------- platform Start-------<--------------<-------------*/
/*******************************************************************************
 * isAndroid : 是否为安卓系统 alert(tit.platform.isAndroid) 
 * isBlackBerry : 是否为黑莓 alert(tit.platform.isBlackBerry) 
 * isIpad : 是否为iPad alert(tit.platform.isIpad)
 * isIphone : 是否为iPhone alert(tit.platform.isIphone) 
 * isMacintosh : 是否为Mac  alert(tit.platform.isMacintosh) 
 * isMobile : 是否为移动设备 alert(tit.platform.isMobile)
 * isWindows : 是否为Windows alert(tit.platform.isWindows)
 * isX11 : 是否为X11 alert(tit.platform.isX11)
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
 * isAdult : 判断是否已成年 alert(tit.regExp.isAdult("310113198704121234") ) 
 *isChinese : 判断是否为中文 alert(tit.regExp.isChinese("我是中文"))
 *isDate : 判断是否为正确日期格式  alert(tit.regExp.isDate("2012-12-12")) 
 *isEmail : 判断是否为Email地址  alert(tit.regExp.isEmail("lancer07@139.com")) 
 *isIdcard : 判断是否为身份证号  alert(tit.regExp.isIdcard("310113198502031876")) 
 *isMobile : 判断是否为手机号  alert(tit.regExp.isMobile("13661234567")) 
 *isQQ : 判断是否为QQ号  alert(tit.regExp.isQQ("180003000")) 
 *isTel : 判断是否为固定电话号  alert(tit.regExp.isTel("021-56565656")) 
 *isURL : 判断是否为链接地址  alert(tit.regExp.isURL("http://www.linqing07.com"))
 *isPsd : 判断是否为密码  alert(tit.regExp.isPsd("wwewewewe"))
 *isPostalcode : 判断是否为邮政编码  alert(tit.regExp.isPostalcode("223200"))
 *isCardNum : 判断是否只有字母和数字 alert(tit.regExp.isCardNum("223200"))
 *isMoney : 判断是否只有点和数字  alert(tit.regExp.isMoney("2.1"))
 *isNumOfTwo : 判断是否1-100之间可带两位小数  alert(tit.regExp.isNumOfTwo("3.12"))
 *isSiZeString : 判断是否为四则运算公式格式  alert(tit.regExp.isSiZeString("(10000*0.6-10000*0.6 *0.2)*0.2"))
 *isOnlySiZeSymbol : 判断四则运算公式是否只包含符号  alert(tit.regExp.isOnlySiZeSymbol(".+-*\/()"))
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
//			var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
			var reg = /^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,5}$/;//开始必须是一个或者多个单词字符或者是-，加上@，然后又是一个或者多个单词字符或者是-。然后是点“.”和单词字符和-的组合，可以有一个或者多个组合,邮箱不能以 - _ .以及其它特殊字符开头和结束,邮箱域名结尾为2~5个字母，比如cn、com、name
			return reg.test(str);
		},
		isPlateNumber : function(str) {
			var reg = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/;
			var reg2 = /^LS[A-Z_0-9]{5}$/;
			return reg.test(str) || reg2.test(str);
		},
		isVehicleIdentification : function(str) {
			var reg = /^[A-Z_0-9]{17}$/;
			return reg.test(str);
		},
		isIdcard : function(str) {
			var reg = /^(\d{14}|\d{17})(\d|[xX])$/;
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
		isNumOfTwo : function(str) {
			var returnFlag = false;
			if(str < 1 || str > 100){
				returnFlag = false;
			}else{
				var reg =/^[0-1]{0,1}[0-9]{0,1}[0-9]\.{0,1}\d{0,2}$/;
				returnFlag = reg.test(str);
			}
//			var reg =/^[0-1]{0,1}[0-9]{0,1}[0-9]\.{0,1}\d{0,2}$/;
//			return reg.test(str);
			return returnFlag;
		},
		isNumOfTwo02 : function(str) {
			var returnFlag = false;
			if(str < 0 || str > 100){
				returnFlag = false;
			}else{
				var reg =/^[0-1]{0,1}[0-9]{0,1}[0-9]\.{0,1}\d{0,2}$/;
				returnFlag = reg.test(str);
			}
//			var reg =/^[0-1]{0,1}[0-9]{0,1}[0-9]\.{0,1}\d{0,2}$/;
//			return reg.test(str);
			return returnFlag;
		},
		isNumOfTwo03 : function(str) {
			var returnFlag = false;
			if(str < 0 || str > 100){
				returnFlag = false;
			}else{
				var reg =/^[0-1]{0,1}[0-9]{0,1}[0-9]\.{0,1}\d{0,4}$/;
				returnFlag = reg.test(str);
			}
//			var reg =/^[0-1]{0,1}[0-9]{0,1}[0-9]\.{0,1}\d{0,2}$/;
//			return reg.test(str);
			return returnFlag;
		},
		isSiZeString : function(str) {
			var reg = /^[A-Z0-9\.\+\-\*\/\(\)]+$/;//允许大写字母、数字、小数点、加减乘除符号、英文小括号
			return reg.test(str);
		},
		isOnlySiZeSymbol : function(str) {
			var reg = /^[\.\+\-\*\/\(\)]+$/;//小数点、加减乘除符号、英文小括号
			return reg.test(str);
		}
	};
}
/*--------------<--------------<------- string Start-------<--------------<-------------*/
/*******************************************************************************
 * var initString="hello world";
 * encrypt : 加密 alert(tit.string(initString).encrypt()) 
 * filterText : 屏蔽词  alert(tit.string(initString).filterText("world")) 
 * isNotaNumber : 判断是否为数字 alert(tit.string("abcdefghijk").isNotaNumber()) 
 * md5: md5加密 
 * noNumbers : 判断是否存在数字 alert(tit.string("abcdefghijk").noNumbers()) 
 * onlyNumbers : 判断是否为仅有数字 alert(tit.string("213123123").onlyNumbers()) 
 * removeWhitespace : 移除字符串两边空白 alert(tit.string(" 213123123 ").removeWhitespace()) 
 * toArray : 转换为数组 newArr=tit.string(en).toArray(); 
 * unEncrypt : 解密 alert(tit.string(initString).unEncrypt())
 * 
 ******************************************************************************/
if (typeof tit.string !== 'object') {
	tit.string = window.tit.string = function(str) {
		return new tit.string.fn.init(str);
	};
	tit.string.fn = tit.string.prototype = {
		init : function(str) {
			if (typeof str === "string") {
				this[0] = str;
			}
		},
		encrypt : function(num) {
			var str = this[0], p = num || 0, idea = 0, output = '', i = 0, alterText = [], varCost = [], TextSize = str.length;
			p = p + 1;
			for (i = 0; i < TextSize; i++) {
				idea = Math.round(Math.random() * 111) + 77;
				alterText[i] = str.charCodeAt(i) + idea;
				varCost[i] = idea;
			}
			for (i = 0; i < TextSize; i++) {
				output += String.fromCharCode(alterText[i], varCost[i]);
			}
			return output;
		},
		filterText : function(badWords) {
			var str = this[0], re = new RegExp(badWords, "g");
			result = str.replace(re, "****");
			return (result);
		},
		isNotaNumber : function() {
			var str = this[0];
			return isNaN(str);
		},
		md5 : function() {
			var str = this[0];
			function RotateLeft(lValue, iShiftBits) {
				return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
			}
			function AddUnsigned(lX, lY) {
				var lX4, lY4, lX8, lY8, lResult;
				lX8 = (lX & 0x80000000);
				lY8 = (lY & 0x80000000);
				lX4 = (lX & 0x40000000);
				lY4 = (lY & 0x40000000);
				lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
				if (lX4 & lY4) {
					return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
				}
				if (lX4 | lY4) {
					if (lResult & 0x40000000) {
						return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
					} else {
						return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
					}
				} else {
					return (lResult ^ lX8 ^ lY8);
				}
			}
			function F(x, y, z) {
				return (x & y) | ((~x) & z);
			}
			function G(x, y, z) {
				return (x & z) | (y & (~z));
			}
			function H(x, y, z) {
				return (x ^ y ^ z);
			}
			function I(x, y, z) {
				return (y ^ (x | (~z)));
			}
			function FF(a, b, c, d, x, s, ac) {
				a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
				return AddUnsigned(RotateLeft(a, s), b);
			}
			;

			function GG(a, b, c, d, x, s, ac) {
				a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
				return AddUnsigned(RotateLeft(a, s), b);
			}
			;
			function HH(a, b, c, d, x, s, ac) {
				a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
				return AddUnsigned(RotateLeft(a, s), b);
			}
			;

			function II(a, b, c, d, x, s, ac) {
				a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
				return AddUnsigned(RotateLeft(a, s), b);
			}
			;
			function ConvertToWordArray(string) {
				var lWordCount;
				var lMessageLength = string.length;
				var lNumberOfWords_temp1 = lMessageLength + 8;
				var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
				var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
				var lWordArray = Array(lNumberOfWords - 1);
				var lBytePosition = 0;
				var lByteCount = 0;
				while (lByteCount < lMessageLength) {
					lWordCount = (lByteCount - (lByteCount % 4)) / 4;
					lBytePosition = (lByteCount % 4) * 8;
					lWordArray[lWordCount] = (lWordArray[lWordCount] | (string
							.charCodeAt(lByteCount) << lBytePosition));
					lByteCount++;
				}
				lWordCount = (lByteCount - (lByteCount % 4)) / 4;
				lBytePosition = (lByteCount % 4) * 8;
				lWordArray[lWordCount] = lWordArray[lWordCount]
						| (0x80 << lBytePosition);
				lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
				lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
				return lWordArray;
			}
			;
			function WordToHex(lValue) {
				var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
				for (lCount = 0; lCount <= 3; lCount++) {
					lByte = (lValue >>> (lCount * 8)) & 255;
					WordToHexValue_temp = "0" + lByte.toString(16);
					WordToHexValue = WordToHexValue
							+ WordToHexValue_temp.substr(
									WordToHexValue_temp.length - 2, 2);
				}
				return WordToHexValue;
			}
			;
			function Utf8Encode(string) {
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
			;
			var x = Array();
			var k, AA, BB, CC, DD, a, b, c, d;
			var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
			var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
			var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
			var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
			str = Utf8Encode(str);
			x = ConvertToWordArray(str);
			a = 0x67452301;
			b = 0xEFCDAB89;
			c = 0x98BADCFE;
			d = 0x10325476;
			for (k = 0; k < x.length; k += 16) {
				AA = a;
				BB = b;
				CC = c;
				DD = d;
				a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
				d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
				c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
				b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
				a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
				d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
				c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
				b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
				a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
				d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
				c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
				b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
				a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
				d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
				c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
				b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
				a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
				d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
				c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
				b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
				a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
				d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
				c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
				b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
				a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
				d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
				c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
				b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
				a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
				d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
				c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
				b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
				a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
				d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
				c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
				b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
				a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
				d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
				c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
				b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
				a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
				d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
				c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
				b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
				a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
				d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
				c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
				b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
				a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
				d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
				c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
				b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
				a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
				d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
				c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
				b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
				a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
				d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
				c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
				b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
				a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
				d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
				c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
				b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
				a = AddUnsigned(a, AA);
				b = AddUnsigned(b, BB);
				c = AddUnsigned(c, CC);
				d = AddUnsigned(d, DD);
			}
			var temp = WordToHex(a) + WordToHex(b) + WordToHex(c)
					+ WordToHex(d);
			return temp.toLowerCase();
		},
		noNumbers : function() {
			var str = this[0], searchForNumbers = /\d/;
			return (searchForNumbers.test(str) == false);
		},
		onlyNumbers : function() {
			var str = this[0],
			// searchForNonNumbers = /^[0-9]*$/;
			searchForNonNumbers = /\D+/;
			return (searchForNonNumbers.test(str) == false);
		},
		removeWhitespace : function() {
			var str = this[0], firstNonWhite = str.search(/\S/);
			if (firstNonWhite != -1) {
				for ( var i = str.length - 1; i >= 0; i--) {
					if (str.charAt(i).search(/\S/) != -1) {
						str = str.substring(firstNonWhite, i + 1);
						break;
					}
				}
			}
			return str;
		},
		toArray : function() {
			var str = this[0], args = [];

			for ( var i = 0; i < str.length; i++) {
				args.push(str[i]);
			}
			return args;
		},
		unEncrypt : function(num) {
			var str = this[0], p = num || 1;
			if (p > 0) {
				p = p - 1;
				var idea = 0, output = '', i = 0, alterText = [], varCost = [], TextSize = str.length;

				for (i = 0; i < TextSize; i++) {
					alterText[i] = str.charCodeAt(i);
					varCost[i] = str.charCodeAt(i + 1);
				}
				for (i = 0; i < TextSize; i = i + 2) {
					output += String.fromCharCode(alterText[i] - varCost[i]);
				}
				return output;
			}
		}
	};
	tit.string.fn.init.prototype = tit.string.prototype;
}
/*--------------<--------------<------- url Start-------<--------------<-------------*/
/*******************************************************************************
 * getQueryVariable : 获取url参数的键值对 console.log(tit.url.getQueryString());
 * getQueryString : 获取url参数的值 console.log(tit.url.getUrlParm()) 
 * getUrlParm : 获取url参数 console.log(tit.url.getUrlVars())
 * 
 ******************************************************************************/
if (typeof tit.url !== 'object') {
	tit.url = {
		getQueryString : function() {
			var result = [], queryString = location.search.substring(1), re = /([^&=]+)=([^&]*)/g, m;
			while (m = re.exec(queryString)) {
				result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
			}
			return result;
		},
		getUrlParm : function(name) {
			var regexS = "[\\?&]" + name + "=([^&#]*)", regex = new RegExp(
					regexS), tmpURL = window.location.href, results = regex
					.exec(tmpURL);
			if (results == null) {
				return "";
			} else {
				return results[1];
			}
		},
		getUrlVars : function() {
			var vars = [], hash, hashes = window.location.href.slice(
					window.location.href.indexOf('?') + 1).split('&');
			for ( var i = 0; i < hashes.length; i++) {
				hash = hashes[i].split('=');
				vars.push(hash[0]);
				vars[hash[0]] = hash[1];
			}
			return vars;
		}
	};
}

/*******************************************************************************
 * 以下方法一般是基于jquery/zepto
 * 
 * $.toAjax : 基于jquery的ajax请求方法 
 * $.isNull : 判断是否为空 
 * $.makeHover : 模拟hover效果
 * $.checkMoney : 验证输入金额带提醒(数字和小数点) 
 * Array remove: 删除数组指定下标或指定对象 
 * $.trChangeColor : 隔行换色 
 * $.replacePlaceholder : 解决placeholder的line-height问题 
 * $.sexSelect : 性别男女选择按钮 
 * $.touchEffect : 按钮点击的效果 
 * $.getDateStr : 获取多少天后的日期(年-月-日) 
 * $.getTimeStr : 获取时间 (年-月-日 时:分:秒) 
 * $.getTimeStr2 : 获取时间 (年-月-日) 
 * $.getTimeStr3 : 获取时间 (年)
 * $.getMonthNumber : 获得两个日期之间相差多少个月 
 * timeFormatDate(new Date().getTime(), 'yyyy-MM-dd HH:mm:ss')：毫秒数转化为指定格式日期  
 * $.charEntities : 前台特殊字符修改 
 * $.checklength : input中文长度判断
 * $.checkIdCard : 验证身份证 
 * getTop : 获取元素的纵坐标（相对于窗口）
 ******************************************************************************/
// 获取元素的纵坐标（相对于窗口）
function getTop(e) {
	var offset = e.offsetTop;
	if (e.offsetParent != null)
		offset += getTop(e.offsetParent);
	return offset;
}
// ajax-jquery测试请求方法
$.toAjax = function(url, dataList, callBack) {
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
			if ($.isNull(callBack)) {

			} else {
				callBack(data);
			}
		},
		error : function(data) {
			alert("请求失败");
		},
		complete : function(data) {
		},
		beforeSend : function(xhr) {
		},
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
// 删除数组指定下标或指定对象
Array.prototype.remove = function(obj) {
	for ( var i = 0; i < this.length; i++) {
		var temp = this[i];
		if (!isNaN(obj)) {
			temp = i;
		}
		if (temp == obj) {
			for ( var j = i; j < this.length; j++) {
				this[j] = this[j + 1];
			}
			this.length = this.length - 1;
		}
	}
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
	$(domObj).unbind().bind({
		focus : function() {
			if ($(domObj).val() == placeholderStr) {
				$(domObj).val("").css("color", "#585858");
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

// 性别男女选择按钮
$.sexSelect = function(domobj) {
	$(domobj).unbind("tap").tap(
			function() {
				var index = $(domobj).index($(this));
				$(domobj).eq(index).removeClass(
						"policyholder_info_sex_unselected").addClass(
						"policyholder_info_sex_selected").siblings()
						.removeClass("policyholder_info_sex_selected")
						.addClass("policyholder_info_sex_unselected");
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
	return year + "年" + month + "月" + day + "日" + current.getHours() + ":"
			+ current.getMinutes() + ":" + current.getSeconds();
};
$.getTimeStr2 = function(param) {
	if (param == "") {
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
	return year + "年" + month + "月" + day+'日';
};
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
//获得两个日期之间相差多少个月
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
//毫秒数转化为指定格式日期 
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
// 验证身份证 $.checkIdCard($("#input").val()) 0 success
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
		65 : "新疆",
		71 : "台湾",
		81 : "香港",
		82 : "澳门",
		91 : "国外"
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

// ---------------国福保枚举值
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
var certificateparam = "身份证,军人证,护照,港澳通行证或台胞证,户口簿,返乡证,驾照,其他"; // 证件类型
																// 字符串，供安卓使用
var recognizeeLelationArray = [ {
	name : "本人",
	code : "01"
}, {
	name : "配偶",
	code : "02"
}, {
	name : "父母",
	code : "03"
}, {
	name : "子女",
	code : "04"
}, {
	name : "其他",
	code : "00"
} ]; // 被保人与投保人关系
var recognizeeLelationParam = "本人,配偶,父母,子女,其他"; // 被保人与投保人关系 字符串，供安卓使用

//格式化数字四舍五入保存两位小数
$.formatNumOfTwo = function(param) {
	var param2 = Math.round(param*Math.pow(10, 2))/Math.pow(10, 2);
//	param = Math.floor(param);
	return param2.toFixed(2);
};

/**
 * 统计字节数
 * @param str
 * @returns
 */
function countvar(str){
	var bytesCount=0;
	for (var i = 0; i < str.length; i++)
	{
	  var c = str.charAt(i);
	  if (/^[\u0000-\u00ff]$/.test(c)) //匹配双字节
	  {
	  bytesCount += 1;
	  }
	  else
	  {
	  bytesCount += 2;
	  }
	}
	return bytesCount;
}
/**
 * 根据字节数截取字符串
 * @param str 字符串
 * @param length 字节数
 * @returns {String}
 */
function subvar(str,length){
	var bytesCount =0;
	var bytes="";
	for (var i = 0; i < str.length; i++)
	{
	  var c = str.charAt(i);
	  if (/^[\u0000-\u00ff]$/.test(c)) //匹配双字节
	  {
	  bytesCount += 1;
	  }
	  else
	  {
	  bytesCount += 2;
	  }
	  if(bytesCount>=length){
		  bytes=str.substring(0,i);
		  break;
	  }
	}
	return bytes;
}

//获得上一年在这一天的日期  
function getLastYeardate(){ 
   var currentdate = new Date();
   var strYear = currentdate.getFullYear() - 1;    
   var strDay = currentdate.getDate();    
   var strMonth = currentdate.getMonth()+1;  
   if(strMonth<10)    
   {    
      strMonth="0"+strMonth;    
   }  
   if(strDay<10)    
   {    
      strDay="0"+strDay;    
   }  
   datastr = strYear+"-"+strMonth+"-"+strDay;  
   return datastr;  
}

/* 手机号只能输入数字 */
function isNum(e) {
	var k = window.event ? e.keyCode : e.which;
	if (((k >= 48) && (k <= 57)) || k == 8 || k == 0) {
	} else {
		if (window.event) {
			window.event.returnValue = false;
		} else {
			e.preventDefault(); // for firefox
		}
	}
}

/**
 * 汉字Check
 * 
 * @param String
 * @returns false-不通过
 */
function checkCustomer(param) {
	reg = /^([A-Za-z]|[\u4E00-\u9FA5])+$/;
	return reg.test(param);
}