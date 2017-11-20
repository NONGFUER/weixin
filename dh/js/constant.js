var rongstoneGuideUrl = "http://cxrs.ceair.com/s2i/guide.html?randomno=${RANDOMNO}&time=" + new Date().getTime();
var rongstoneUrl = "http://cxrs.ceair.com/s2i/confirm.html?randomno=${RANDOMNO}&reason=${REASON}&mobile=${MOBILE}&time=" + new Date().getTime();
// 秘钥
var secretKey = "t171420100302rsa";

var regex = {
    plateno:/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1,2}$/,
    rackno: /^[A-Z_0-9]{17}$/,
    engineno: /^[A-Z0-9]{5,19}$/,
    date:/^\d{4}-\d{1,2}-\d{1,2}$/,
    chinese:/^[·.\u4E00-\u9FFF]+$/,
    email:/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,
    mobile:/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/,
    publish:/^.*[·.\u4E00-\u9FFF]+.*$/,
    seatcount:/^\d{1}$/,
    base64:/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/,
}

var serverParam = {
    commodityno: {
        meal1: "0419900103",
        meal2: "0419900101",
        meal3: "0419900102",
    },
    companycode:"00004",// 101 天安保险公司编码
    fgflag:"1", //费改地区  1：是费改地区   0：不是费改地区
    channel:"1" //微信渠道
}

// 是否用假数据
var isFake = false;