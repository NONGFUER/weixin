//避免软键盘 挡住输入框
$(window).resize(function()
{
    if(getBrowerType == "PC") return;
    var deviceWidth = document.documentElement.clientWidth;
    if(deviceWidth > 750) deviceWidth = 750;

    if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
        window.setTimeout(function () {
            document.activeElement.scrollIntoViewIfNeeded();
        }, 0);
    }
});

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function getUrlParam(name) {
    var param = window.location.search.substr(1);
    if(regex.base64.test(param)) param = new Base64().decode(param);
    
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = param.match(reg);  //匹配目标参数
    if (r != null) return decodeURI(r[2]); return ""; //返回参数值
}

function generateBase64Url(url)
{
    var pos = url.indexOf("?");
    if(pos == -1) return url;
    return url.substring(0,pos) + "?" + new Base64().encode(url.substring(pos + 1));
}

function getBrowerType()
{
    var userAgent = navigator.userAgent;

    if(userAgent.match(/Android/i)) return "Android";
    if(userAgent.match(/BlackBerry/i)) return "BlackBerry";
    if(userAgent.match(/iPhone|iPad|iPod/i)) return "IOS";
    if(userAgent.match(/IEMobile/i)) return "Windows";

    return "PC";
}

//是否是APP
function isApp() {
    var userAgent = navigator.userAgent;

    var isApp = userAgent.indexOf("CEAIRAPP") != -1;
    var isWechat = userAgent.indexOf("MicroMessenger") != -1;

    return isApp?"yes":"no";
}

function addDate(day)
{
    return new Date(new Date().getTime() + day * 24 * 3600 * 1000);
}

function addYear(startday,year)
{
    var date = startday;
    if(typeof(startday) == "string") date = new Date(startday.replace(/\-/g,"\/"));

    var fullyear = date.getFullYear() + year;
    var month = date.getMonth();
    var date = date.getDate();
    return new Date(fullyear,month,date);
}

function getDate(str)
{
    return new Date(str.replace(/\-/g,"\/"));
}

// 格式化数字四舍五入保存两位小数
function formatNumOfTwo(num) {
    var formatNum = Math.round(num * Math.pow(10, 2)) / Math.pow(10, 2);
    return formatNum.toFixed(2);
}

function isDefined(str) {
    if (str == null || typeof (str) == "undefined" || str == "null" || str == "") {
        return false;
    }
    return true;
}

function isEmpty(str) {
    if (str == null || str == "null" || str == "" || str.replace(/^\s+|\s+$/g, "") == "") {
        return true;
    }
    return false;
}

function charEntities(str) {
    str = str.replace(/\r\n/g, "");
    str = str.replace(/\n/g, "");
    str = str.replace(/\r/g, "");
    
    return str;
}

function complianceMobile(mobile){
    if(isEmpty(mobile)) return "";
    var start = mobile.substring(0,3);
    var end = mobile.substring(7,11);

    return start + "****" + end;
}

//启用右滑关闭功能
mui.init({
    swipeBack: true
});

function muiAlert(content,callback)
{
    if(isDefined(callback))
        mui.alert(content,'温馨提示', callback);
    else
        mui.alert(content,'温馨提示');
}

function UrlEncode(str) {
    return new Base64().encode(str);
}

function UrlDecode(str) {
    return new Base64().decode(str);
}

function getExpireTimeByidcard(idcard)
{
    var age = getAgeByidcard(idcard);
    if(age < 16) return 5;
    if(age >= 16 && age < 26) return 10;
    if(age >= 26 && age < 46) return 20;
    if(age >= 46) return 30;
}

// 通过 身份证 获得性别
function getSexByidcard(idcard)
{
    if (parseInt(idcard.substr(16, 1)) % 2 == 0)  return 2;
    return 1;
}

// 通过 身份证 获得生日
function getBirthdayByidcard(idcard)
{
    return idcard.substr(6, 4) + "-" + idcard.substr(10, 2) + "-" + idcard.substr(12, 2);
}

// 通过 身份证 获得 年龄
function getAgeByidcard(idcard)
{
    var birthday = getBirthdayByidcard(idcard);

    var day = birthday.split("-");
    var birthYear = day[0];
    var birthMonth = day[1];
    var birthDay = day[2];

    d = new Date();
    var nowYear = d.getFullYear();
    var nowMonth = d.getMonth() + 1;
    var nowDay = d.getDate();

    if(nowYear == birthYear){
        returnAge = 0;//同年 则为0岁
    }
    else{
        var ageDiff = nowYear - birthYear ; //年之差
        if(ageDiff > 0){
            if(nowMonth == birthMonth) {
                var dayDiff = nowDay - birthDay;//日之差
                if(dayDiff < 0)
                {
                    returnAge = ageDiff - 1;
                }
                else
                {
                    returnAge = ageDiff ;
                }
            }
            else
            {
                var monthDiff = nowMonth - birthMonth;//月之差
                if(monthDiff < 0)
                {
                    returnAge = ageDiff - 1;
                }
                else
                {
                    returnAge = ageDiff ;
                }
            }
        }
        else
        {
            returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
        }
    }
    return returnAge;//返回周岁年龄
}

// 验证身份证
function testIdCard(idcard) {
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