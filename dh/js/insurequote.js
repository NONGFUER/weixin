document.write("<script language='javascript' src='js/saverisk.js?v=20171110' ></script>");
$(function(){
    scrollScreen();

    showHeader();
    initData();
    setEvent();
});

//屏幕滚动
function scrollScreen() {
    // 输入特殊处理
    if (isApp() == 'yes') $("#scollfill").show();
    mui('.mui-scroll-wrapper').scroll();
}

//非APP 显示
function showHeader()
{
    if(isApp() == 'yes')
    {
        $("#header").hide();
        $("#scroll").css("margin-top","0px");
    }
    else
    {
        $("#header").show();
        $("#scroll").css("margin-top","45px");
    }
}

function initData()
{
    if(!vaildateData()) return;

    getCarInfo();
    reloadView();
}

function vaildateData()
{
    var sessionid = getViewData("sessionid");
    var citycode = getViewData("citycode");
    var rackno = getViewData("rackno");
    var productid = getRiskData("productid");

    if(isEmpty(sessionid) || isEmpty(citycode))
    {
        window.location.href = "insuremain.html";
        return false;
    }

    if(!isEmpty(sessionid) && isEmpty(rackno))
    {
        window.location.href = "insurecarinfo.html";
        return false;
    }

    if(isEmpty(productid))
    {
        window.location.href = "insurecoverage.html";
        return false;
    }
    return true;
}

function setEvent()
{
    $("#back").unbind("tap").bind("tap",function() {
        jumpback();
    });

    $("#price").unbind("tap").bind("tap",function() {
        price();
    });

    $("#addaddress").unbind("tap").bind("tap",function() {
        addaddress();
    });

    $("#address").unbind("tap").bind("tap",function() {
        addaddress();
    });

    $("#jqx").unbind("tap").bind("tap",function() {
        var begindate=addDate(1);
        var enddate = addDate(90);
        popJqxAndBusinessDate("jqxbegindate",$("#jqx input").val(),begindate,enddate);
    });

    $("#business").unbind("tap").bind("tap",function() {
    	var begindate=addDate(1);
        var enddate = addDate(90);
        popJqxAndBusinessDate("businessbegindate",$("#business input").val(),begindate,enddate);
    });

    $("#insured .mui-switch").unbind("toggle").bind("toggle",function(){
        switchData("insuredsame");
        reloadView();
    });

    $("#policyholder .mui-switch").unbind("toggle").bind("toggle",function(){
        switchData("policyholdersame");
        reloadView();
    });

    $("#insuredname input").unbind("blur").bind("blur",function() {
        setViewData("insuredname",$("#insuredname input").val());
        reloadView();
    });

    $("#insuredmobile input").unbind("blur").bind("blur",function() {
        setViewData("insuredmobile",$("#insuredmobile input").val());
        reloadView();
    });

    $("#insuredemail input").unbind("blur").bind("blur",function() {
        setViewData("insuredemail",$("#insuredemail input").val());
        reloadView();
    });

    $("#insuredidcard input").unbind("blur").bind("blur",function() {
        setViewData("insuredidcard",$("#insuredidcard input").val());
        reloadView();
    });

    $("#insuredidbegindate").unbind("tap").bind("tap",function() {
        // 需要先填写 身份证
        if(!checkInsuredIdCard()) return;

        var beginDate = addYear(new Date(),-30);
        var endDate = new Date();
        popPickerDate("insuredidbegindate",$("#insuredidbegindate input").val(),beginDate,endDate,function () {
            var insuredidbegindate = getViewData("insuredidbegindate");
            if(isEmpty(insuredidbegindate)) return;

            var insuredidcard = getViewData("insuredidcard");
            var expiretime = getExpireTimeByidcard(insuredidcard);

            insuredidenddate = addYear(insuredidbegindate,expiretime).Format("yyyy-MM-dd");
            setViewData("insuredidenddate",insuredidenddate);
            reloadView();
        });
    });

    $("#insuredidenddate").unbind("tap").bind("tap",function() {
        // 需要先填写 身份证 和 开始时间
        if(!checkInsuredIdCard()) return;
        if(!checkInsuredIdBeginDate()) return;

        var beginDate = new Date();
        var endDate = addYear(new Date(),30);
        popPickerDate("insuredidenddate",$("#insuredidenddate input").val(),beginDate,endDate,function () {
            reloadView();
        });
    });

    $("#insurednation").unbind("tap").bind("tap",function() {
        popInsuredAndPolicyholderNation("insurednation");
    });

    $("#insuredpublish input").unbind("blur").bind("blur",function() {
        setViewData("insuredpublish",$("#insuredpublish input").val());
        reloadView();
    });

    $("#policyholdername input").unbind("blur").bind("blur",function() {
        setViewData("policyholdername",$("#policyholdername input").val());
        reloadView();
    });

    $("#policyholdermobile input").unbind("blur").bind("blur",function() {
        setViewData("policyholdermobile",$("#policyholdermobile input").val());
        reloadView();
    });

    $("#policyholderemail input").unbind("blur").bind("blur",function() {
        setViewData("policyholderemail",$("#policyholderemail input").val());
        reloadView();
    });

    $("#policyholderidcard input").unbind("blur").bind("blur",function() {
        setViewData("policyholderidcard",$("#policyholderidcard input").val());
        reloadView();
    });

    $("#policyholderidbegindate").unbind("tap").bind("tap",function() {
        // 需要先填写 身份证
        if(!checkPolicyholderIdCard()) return;

        var beginDate = addYear(new Date(),-30);
        var endDate = new Date();
        popPickerDate("policyholderidbegindate",$("#policyholderidbegindate input").val(),beginDate,endDate,function () {
            var policyholderidbegindate = getViewData("policyholderidbegindate");
            if(isEmpty(policyholderidbegindate)) return;

            var policyholderidcard = getViewData("policyholderidcard");
            var expiretime = getExpireTimeByidcard(policyholderidcard);

            policyholderidenddate = addYear(policyholderidbegindate,expiretime).Format("yyyy-MM-dd");
            setViewData("policyholderidenddate",policyholderidenddate);
            reloadView();
        });
    });

    $("#policyholderidenddate").unbind("tap").bind("tap",function() {
        // 需要先填写 身份证 和 开始时间
        if(!checkPolicyholderIdCard()) return;
        if(!checkPolicyholderIdBeginDate()) return;

        var beginDate = new Date();
        var endDate = addYear(new Date(),30);
        popPickerDate("policyholderidenddate",$("#policyholderidenddate input").val(),beginDate,endDate,function () {
            reloadView();
        });
    });

    $("#policyholdernation").unbind("tap").bind("tap",function() {
        popInsuredAndPolicyholderNation("policyholdernation");
    });

    $("#policyholderpublish input").unbind("blur").bind("blur",function() {
        setViewData("policyholderpublish",$("#policyholderpublish input").val());
        reloadView();
    });

    $("#submit").unbind("tap").bind("tap",function() {
    	if(!vaildateData()) return;
        submit();
    });
}

function jumpback()
{
    window.location.href = "insurecoverage.html";
}

function getCarInfo() {

    // 方法定义
    var fun = function(result){
        if (result.status.statusCode != "000000") {
            muiAlert(result.status.statusMessage);
            return;
        }

        var citycode = result.cxInfo.cxCarMessage.citycode;         //地区信息
        var isnewplate = (result.cxInfo.cxOrder.newcarFlag == "1")?"true":"false";
        var plateno = isnewplate == "true"?"":result.cxInfo.cxOrder.plateno;
        var tradeno = result.cxInfo.cxOrder.tradeno;                //请求天安核保接口交易流水号
        var orderno = result.cxInfo.cxOrder.orderNo;

        var jqxpre = result.cxInfo.cxOffer.jqxPre||0.00;               // 交强险价格
        var businesspre = result.cxInfo.cxOffer.businessPre||0.00;     // 商业险价格
        // 交强险 起保日期
        var jqxbegindate = (jqxpre == 0)?addDate(1).Format("yyyy-MM-dd"):new Date(result.cxInfo.cxOffer.jqxBegindate.time).Format("yyyy-MM-dd");
        var jqxenddate = (jqxpre == 0)?addDate(365).Format("yyyy-MM-dd"):new Date(result.cxInfo.cxOffer.jqxEnddate.time).Format("yyyy-MM-dd");

        // 商业险 起保日期
        var businessbegindate = (businesspre == 0)?addDate(1).Format("yyyy-MM-dd"):new Date(result.cxInfo.cxOffer.businessBegindate.time).Format("yyyy-MM-dd");
        var businessenddate = (businesspre == 0)?addDate(365).Format("yyyy-MM-dd"):new Date(result.cxInfo.cxOffer.businessEnddate.time).Format("yyyy-MM-dd");

        var vehicletaxpre = result.cxInfo.cxOffer.vehicletaxPre;     // 车船税
        var totalpre = result.cxInfo.cxOffer.totalpremium;           // 总保费

        var jqxlevel = result.cxInfo.cxOrder.elrLevelCtp;                            //交强险风险等级
        var businesslevel = result.cxInfo.cxOrder.elrLevelCom;                       //商业险风险等级
        var alllevel = result.cxInfo.cxOrder.elrLevelAll;                            //保险总风险等级

        // 是否与被保险人 投保人 一致
        var cxParty = result.cxInfo.cxParty;
        var insuredsame = getViewData("insuredsame");
        var insuredname = getViewData("insuredname");
        var insuredmobile = getViewData("insuredmobile");
        var insuredemail = getViewData("insuredemail");
        var insuredidcard = getViewData("insuredidcard");
        var insuredidbegindate = getViewData("insuredidbegindate");
        var insuredidenddate = getViewData("insuredidenddate");
        var insurednation = getViewData("insurednation");
        var insuredpublish = getViewData("insuredpublish");

        var policyholdersame = getViewData("policyholdersame");
        var policyholdername = getViewData("policyholdername");
        var policyholdermobile = getViewData("policyholdermobile");
        var policyholderemail = getViewData("policyholderemail");
        var policyholderidcard = getViewData("policyholderidcard");
        var policyholderidbegindate = getViewData("policyholderidbegindate");
        var policyholderidenddate = getViewData("policyholderidenddate");
        var policyholdernation = getViewData("policyholdernation");
        var policyholderpublish = getViewData("policyholderpublish");

        if(isDefined(cxParty))
        {
            var insuredbegindate = result.cxInfo.cxParty.insuredstartdate;  // 被保人起期
            if(isDefined(insuredbegindate))
                insuredidbegindate = new Date(insuredbegindate.time).Format("yyyy-MM-dd");
            else
                insuredidbegindate = "2000-01-01";

            var insuredenddate = result.cxInfo.cxParty.insuredenddate;      // 被保人止期
            if(isDefined(insuredenddate))
                insuredidenddate = new Date(insuredenddate.time).Format("yyyy-MM-dd");
            else
                insuredidenddate = "2050-01-01";

            insuredname = result.cxInfo.cxParty.insuredname||"";            // 被保人姓名
            insuredemail = result.cxInfo.cxParty.insuredemail||"";          // 被保人邮箱
            insuredidcard = result.cxInfo.cxParty.insuredidno||"";          // 被保人身份证号
            insuredmobile = result.cxInfo.cxParty.insuredmobile||"";        // 被保人手机号
            insurednation = result.cxInfo.cxParty.insurednation||"";        // 被保人民族
            insuredpublish = result.cxInfo.cxParty.insuredissuer||"";       // 被保人发证机构

            insuredsame = (insuredname == "")?"true":"false";

            var policyholderbegindate = result.cxInfo.cxParty.insuredstartdate;// 被保人起期
            if(isDefined(policyholderbegindate))
                policyholderidbegindate = new Date(policyholderbegindate.time).Format("yyyy-MM-dd");
            else
                policyholderidbegindate = "2000-01-01";

            var policyholderenddate = result.cxInfo.cxParty.insuredenddate; // 被保人止期
            if(isDefined(policyholderenddate))
                policyholderidenddate = new Date(policyholderenddate.time).Format("yyyy-MM-dd");
            else
                policyholderidenddate = "2050-01-01";

            policyholdername = result.cxInfo.cxParty.phname||"";            // 投保人姓名
            policyholderemail = result.cxInfo.cxParty.phemail||"";          // 投保人邮箱
            policyholderidcard = result.cxInfo.cxParty.phidno||"";          // 投保人身份证号
            policyholdermobile = result.cxInfo.cxParty.phtelephone||"";     // 投保人手机号
            policyholdernation = result.cxInfo.cxParty.phnation||"";        // 投保人民族
            policyholderpublish = result.cxInfo.cxParty.phissuer||"";       // 投保人发证机构

            policyholdersame = (policyholdername == "")?"true":"false";
        }

        setViewData("citycode",citycode);
        setViewData("isnewplate",isnewplate);
        setViewData("plateno",plateno);
        setViewData("tradeno",tradeno);
        setViewData("orderno",orderno);

        setViewData("jqxpre",formatNumOfTwo(jqxpre) + "");
        setViewData("businesspre",formatNumOfTwo(businesspre) + "");
        setViewData("jqxbegindate",jqxbegindate);
        setViewData("jqxenddate",jqxenddate);
        setViewData("businessbegindate",businessbegindate);
        setViewData("businessenddate",businessenddate);
        setViewData("vehicletaxpre",formatNumOfTwo(vehicletaxpre) + "");
        setViewData("totalpre",formatNumOfTwo(totalpre) + "");

        setViewData("jqxlevel",jqxlevel);
        setViewData("businesslevel",businesslevel);
        setViewData("alllevel",alllevel);

        if(insuredsame == "") insuredsame = "true";
        setViewData("insuredsame",insuredsame);
        setViewData("insuredname",insuredname);
        setViewData("insuredemail",insuredemail);
        setViewData("insuredidcard",insuredidcard);
        setViewData("insuredmobile",insuredmobile);
        setViewData("insuredidbegindate",insuredidbegindate);
        setViewData("insuredidenddate",insuredidenddate);
        setViewData("insurednation",insurednation);
        setViewData("insuredpublish",insuredpublish);

        if(policyholdersame == "") policyholdersame = "true";
        setViewData("policyholdersame",policyholdersame);
        setViewData("policyholdername",policyholdername);
        setViewData("policyholderemail",policyholderemail);
        setViewData("policyholderidcard",policyholderidcard);
        setViewData("policyholdermobile",policyholdermobile);
        setViewData("policyholderidbegindate",policyholderidbegindate);
        setViewData("policyholderidenddate",policyholderidenddate);
        setViewData("policyholdernation",policyholdernation);
        setViewData("policyholderpublish",policyholderpublish);

        getDistributionInfo();
        reloadView();

         // 购买交强险 但 车船税返回 0
        if(vehicletaxpre == 0 && jqxpre != 0)
        {
            var jqxyear = jqxbegindate.substring(0,4);
            var nowyear = new Date().Format("yyyy-MM-dd").substring(0,4);
            var yearbegindate = jqxyear + "-01-01";
            // 交强险 起保日期 跨年了  不能代缴车船税
            if(jqxyear != nowyear){
                muiAlert("当前时间购买交强险只能缴纳"+nowyear+"年的车船税。如您需代缴"+jqxyear+"年的车船税，可在"+jqxyear+"年内购买交强险。");
            }else{
            	var citycode = getViewData("citycode");
            	if(parm.body.cityCode=="3120000"){//天津
					modelAlert("天津地区购买车险暂不支持代缴车船税。");
				}else{
	                muiAlert("您当前购买的车险保单无法代缴车船税，如需了解详情，可拨打客服热线 4006895505 进行咨询");
				}
            }
        }
    };

    var sessionid = getViewData("sessionid");

    if(!isFake)
        ServiceSend.getAllCarInfo(sessionid,fun);
    else
        $.get("data/carinfodata.json", fun);
}

function price()
{
    window.location.href = "insureprice.html";
}

function addaddress()
{
    window.location.href = "insureaddress.html";
}

function getDistributionInfo()
{
    // 方法定义
    var fun = function(result){
        if (result.status.statusCode != "000000") {
            muiAlert(result.status.statusMessage);
            return;
        }
        var addressid = result.cxDistribution.id || "";                           // 配送ID
        var addressprovince = result.cxDistribution.province || "";               // 配送省份
        var addressname = result.cxDistribution.receivername || "";               // 配送姓名
        var addressmobile = result.cxDistribution.receiverphoneno || "";          // 配送手机号
        var addressinfo = result.cxDistribution.address || "";                    // 配送地址

        //默认项
        if(isEmpty(addressprovince))
        {
            var provincename = getViewData("provincename");
            var cityname = getViewData("cityname");
            addressprovince = provincename + " " + cityname;
           // addressinfo = provincename + cityname;
            
        }
        if(isEmpty(addressname)) addressname = getViewData("ownername");
        if(isEmpty(addressmobile)) addressmobile = getViewData("ownermobile");
        
        setViewData("addressid",addressid + "");
        setViewData("addressprovince",addressprovince);
        setViewData("addressname",addressname);
        setViewData("addressmobile",addressmobile);
        setViewData("addressinfo",addressinfo);

        reloadView();
    };

    var randomno = getViewData("randomno");

    if(!isFake)
        ServiceSend.getDistributionInfo(randomno,fun);
    else
        $.get("data/distributiondata.json", fun);
}

function popJqxAndBusinessDate(name,value,beginDate,endDate)
{
    var date = value;
    if(isEmpty(date)) date = new Date().Format("yyyy-MM-dd");

    if(!isDefined(beginDate)) beginDate = new Date();
    if(!isDefined(endDate)) endDate = addDate(1);

    var options = {
        "type":"date",
        "beginDate":beginDate,
        "endDate":endDate,
        "value":date,
    }
    var dtpicker = new mui.DtPicker(options);
    dtpicker.show(function(dt) {
        dtpicker.dispose();

        var value = getViewData(name);
        if(value == dt.text) return;

        setViewData(name,dt.text);

        //如果 日期改变 需要重新 计算

        showFixDateDialog(function (){

            var jqxbegindate = getViewData("jqxbegindate");
            var businessbegindate = getViewData("businessbegindate");

            setRiskData("jqxbegindate",jqxbegindate);
            setRiskData("businessbegindate",businessbegindate);

            saveRiskServer(function (){
                window.location.href = "insurequote.html";
            })
        });

        reloadView();
    })
}

function showFixDateDialog(callback)
{
    mui.prompt("","","起保时间变更",['确定','取消'],function(event){
        if(event.index == 0) callback();
    });
    var img = $("<br/><img class='logoimg' alt='天安车险' src='img/talogo.png'>");
    $('.mui-popup-text').html(img);
    $('.mui-popup-input').html("<br/>修改起保时间，系统会重新进行报价，是否确定修改<br/><br/>");
}

function switchData(name)
{
    var value = getViewData(name);
    if(!isDefined(value)) value = "true";

    if(value == "true")
        value = "false";
    else
        value = "true";

    var data = {};
    data[name] = value;
    setViewDatas(data);
}

function popInsuredAndPolicyholderNation(param)
{
    // 方法定义
    var fun = function(result){
        if (result.statusCode != "000000") {
            muiAlert(result.statusMessage);
            return;
        }

        var datas = result.returns.cacheValue;
        // JSON字符串转Json
        if (typeof datas == "string") datas = $.parseJSON(datas);

        var nations = fillPopPickerData(datas,"text","text");
        
        var popPicker = new mui.PopPicker();
        popPicker.setData(nations);
        popPicker.show(function(items) {
            popPicker.dispose();

            var nation = items[0];
            var nationtext = nation.text;
            var currentnation = getViewData(param);

            if(currentnation == nationtext) return;

            setViewData(param,nationtext);
            reloadView();
        });
    };

    if(!isFake)
        ServiceSend.getNationList(fun);
    else
        $.get("data/nationdata.json",fun);
}

function submit() {
    setViewData("insuredname", $("#insuredname input").val());
    setViewData("insuredmobile", $("#insuredmobile input").val());
    setViewData("insuredemail", $("#insuredemail input").val());
    setViewData("insuredidcard", $("#insuredidcard input").val());
    setViewData("insuredpublish", $("#insuredpublish input").val());

    setViewData("policyholdername", $("#policyholdername input").val());
    setViewData("policyholdermobile", $("#policyholdermobile input").val());
    setViewData("policyholderemail", $("#policyholderemail input").val());
    setViewData("policyholderidcard", $("#policyholderidcard input").val());
    setViewData("policyholderpublish", $("#policyholderpublish input").val());

    if (!checkAddressId()) return;

    if (!checkInsuredName()) return;
    if (!checkInsuredMobile()) return;
    if (!checkInsuredEmail()) return;
    if (!checkInsuredIdCard()) return;
    if (!checkInsuredIdBeginDate()) return;
    if (!checkInsuredIdEndDate()) return;
    if (!checkInsuredNation()) return;
    if (!checkInsuredPublish()) return;

    if (!checkPolicyholderName()) return;
    if (!checkPolicyholderMobile()) return;
    if (!checkPolicyholderEmail()) return;
    if (!checkPolicyholderIdCard()) return;
    if (!checkPolicyholderIdBeginDate()) return;
    if (!checkPolicyholderIdEndDate()) return;
    if (!checkPolicyholderNation()) return;
    if (!checkPolicyholderPublish()) return;

    var fun = function()
    {
        submitServer(function (reason)
        {
            var randomno = getViewData("randomno");
            var url = rongstoneUrl;

            var complianceMobile = getCarMobile();
            url = url.replace("${RANDOMNO}", randomno);
            url = url.replace("${REASON}", reason);
            url = url.replace("${MOBILE}", complianceMobile);

            window.location.href = url;
        })
    };

    showImportantNoticeDialog(fun);
}

function showImportantNoticeDialog(callback)
{
    var citycode = getViewData("citycode");

    if(citycode == "3310000") //上海
    {
        mui.prompt("","","<span style='color:#f11018'>上海车险部重要提示</span>",['确定','修改'],function(event){
            if(event.index == 0) callback();
        });
        var img = $("<br/><img class='logoimg' alt='天安车险' src='img/talogo.png'>");
        $('.mui-popup-text').html(img);
        $('.mui-popup-input').html("<br/>车险行业平台规定 ：<br/><br/><span style='color:#f11018'>投保订单提交后将被锁定<br/><br/>三个工作日内将无法修改</span><br/><br/>请确保正确填写车辆投保信息<br><br>是否需要修改？<br/><br/>");
        return;
    }
    callback();
}

function getCarMobile()
{
    var insuredsame = getViewData("insuredsame");
    var insuredmobile = getViewData("insuredmobile");
    var ownermobile = getViewData("ownermobile");

    if(insuredsame == "true") return complianceMobile(ownermobile);
    return complianceMobile(insuredmobile);
}

function submitServer(callback)
{
    // 方法定义
    var fun = function(result){
        var reason = "";
        if (result.statusCode != "000000")
            reason = encodeURI(result.statusMessage);

        callback(reason);
    };
    var citycode = getViewData("citycode");
    var sessionid = getViewData("sessionid");
    var orderno = getViewData("orderno");
    var tradeno = getViewData("tradeno");

    var addressprovince = getViewData("addressprovince");
    var addressname = getViewData("addressname");
    var addressmobile = getViewData("addressmobile");
    var addressinfo = getViewData("addressinfo");

    var ownername = getViewData("ownername");
    var ownermobile = getViewData("ownermobile");
    var owneremail = getViewData("owneremail");
    var owneridcard = getViewData("owneridcard");
    var owneridbegindate = getViewData("owneridbegindate");
    var owneridenddate = getViewData("owneridenddate");
    var ownernation = getViewData("ownernation");
    var ownerpublish = getViewData("ownerpublish");

    var insuredsame = getViewData("insuredsame");
    var insuredname = getViewData("insuredname");
    var insuredmobile = getViewData("insuredmobile");
    var insuredemail = getViewData("insuredemail");
    var insuredidcard = getViewData("insuredidcard");
    var insuredidbegindate = getViewData("insuredidbegindate");
    var insuredidenddate = getViewData("insuredidenddate");
    var insurednation = getViewData("insurednation");
    var insuredpublish = getViewData("insuredpublish");

    var policyholdersame = getViewData("policyholdersame");
    var policyholdername = getViewData("policyholdername");
    var policyholdermobile = getViewData("policyholdermobile");
    var policyholderemail = getViewData("policyholderemail");
    var policyholderidcard = getViewData("policyholderidcard");
    var policyholderidbegindate = getViewData("policyholderidbegindate");
    var policyholderidenddate = getViewData("policyholderidenddate");
    var policyholdernation = getViewData("policyholdernation");
    var policyholderpublish = getViewData("policyholderpublish");

    if(insuredsame == "true")
    {
        insuredname = ownername;
        insuredmobile = ownermobile;
        insuredemail = owneremail;
        insuredidcard = owneridcard;
        insuredidbegindate = owneridbegindate;
        insuredidenddate = owneridenddate;
        insurednation = ownernation;
        insuredpublish = ownerpublish;
    }

    if(policyholdersame == "true")
    {
        policyholdername = ownername;
        policyholdermobile = ownermobile;
        policyholderemail = owneremail;
        policyholderidcard = owneridcard;
        policyholderidbegindate = owneridbegindate;
        policyholderidenddate = owneridenddate;
        policyholdernation = ownernation;
        policyholderpublish = ownerpublish;
    }

    if(!isFake)
        ServiceSend.createOrder
        (citycode,sessionid,orderno,tradeno,
        insuredname,insuredmobile,insuredemail,insuredidcard,insuredidbegindate,insuredidenddate,insurednation,insuredpublish,
        policyholdername,policyholdermobile,policyholderemail,policyholderidcard,policyholderidbegindate,policyholderidenddate,
        policyholdernation,policyholderpublish,addressprovince,addressname,addressmobile,addressinfo,fun);
    else
        $.get("data/createorderdata.json",fun);
}

function reloadView()
{
    var citycode = getViewData("citycode");
    var isnewplate = getViewData("isnewplate");
    var plateno = getViewData("plateno");

    var totalpre = getViewData("totalpre");
    var jqxpre = getViewData("jqxpre");
    var vehicletaxpre = getViewData("vehicletaxpre");
    var jqxbegindate = getViewData("jqxbegindate");
    var businesspre = getViewData("businesspre");
    var businessbegindate = getViewData("businessbegindate");
    
    var addressid = getViewData("addressid");
    var addressprovince = getViewData("addressprovince");
    var addressname = getViewData("addressname");
    var addressmobile = getViewData("addressmobile");
    var addressinfo = getViewData("addressinfo");

    var insuredsame = getViewData("insuredsame");
    var insuredname = getViewData("insuredname");
    var insuredmobile = getViewData("insuredmobile");
    var insuredemail = getViewData("insuredemail");
    var insuredidcard = getViewData("insuredidcard");
    var insuredidbegindate = getViewData("insuredidbegindate");
    var insuredidenddate = getViewData("insuredidenddate");
    var insurednation = getViewData("insurednation");
    var insuredpublish = getViewData("insuredpublish");

    var policyholdersame = getViewData("policyholdersame");
    var policyholdername = getViewData("policyholdername");
    var policyholdermobile = getViewData("policyholdermobile");
    var policyholderemail = getViewData("policyholderemail");
    var policyholderidcard = getViewData("policyholderidcard");
    var policyholderidbegindate = getViewData("policyholderidbegindate");
    var policyholderidenddate = getViewData("policyholderidenddate");
    var policyholdernation = getViewData("policyholdernation");
    var policyholderpublish = getViewData("policyholderpublish");


    if(isnewplate == "true") plateno = "新车未上牌";
    $("#plateno").text(plateno);
    $("#totalpre").text("￥" + totalpre);


    if(parseInt(jqxpre) == 0)
        $("#jqx").hide();
    else
        $("#jqx").show();

    if(parseInt(businesspre) == 0)
        $("#business").hide();
    else
        $("#business").show();

    if(isEmpty(addressid))
        $("#address").hide();
    else
        $("#address").show();

    $("#jqxbegindate").val(jqxbegindate);
    $("#jqxpre").text("￥" + jqxpre);
    $("#vehicletaxpre").text("￥" + vehicletaxpre);

    $("#businessbegindate").val(businessbegindate);
    $("#businesspre").text("￥" + businesspre);

    $("#addressprovince").text(addressprovince);
    $("#addressname").text(addressname);
    $("#addressmobile").text(addressmobile);
    $("#addressinfo").text(addressinfo);

    if(insuredsame == "true")
    {
        $("#insured .mui-switch").addClass("mui-active");
        $("#insuredinfo").hide();
    }
    else
    {
        $("#insured .mui-switch").removeClass("mui-active");
        $("#insuredinfo").show();
    }

    if(policyholdersame == "true")
    {
        $("#policyholder .mui-switch").addClass("mui-active");
        $("#policyholderinfo").hide();
    }
    else
    {
        $("#policyholder .mui-switch").removeClass("mui-active");
        $("#policyholderinfo").show();
    }

    if(citycode == "3440300"||citycode == "3110000")//深圳   北京
    {
        $("#insuredemail").show();
        $("#policyholderemail").show();
    }
    else
    {
        $("#insuredemail").hide();
        $("#policyholderemail").hide();
    }

    if(citycode == "3110000")//北京
    {
        $("#insuredidbegindate").show();
        $("#insuredidenddate").show();
        $("#insurednation").show();
        $("#insuredpublish").show();

        $("#policyholderidbegindate").show();
        $("#policyholderidenddate").show();
        $("#policyholdernation").show();
        $("#policyholderpublish").show();
    }
    else
    {
        $("#insuredidbegindate").hide();
        $("#insuredidenddate").hide();
        $("#insurednation").hide();
        $("#insuredpublish").hide();

        $("#policyholderidbegindate").hide();
        $("#policyholderidenddate").hide();
        $("#policyholdernation").hide();
        $("#policyholderpublish").hide();
    }

    $("#insuredname input").val(insuredname);
    $("#insuredmobile input").val(insuredmobile);
    $("#insuredemail input").val(insuredemail);
    $("#insuredidcard input").val(insuredidcard);
    $("#insuredidbegindate input").val(insuredidbegindate);
    $("#insuredidenddate input").val(insuredidenddate);
    $("#insurednation input").val(insurednation);
    $("#insuredpublish input").val(insuredpublish);

    $("#policyholdername input").val(policyholdername);
    $("#policyholdermobile input").val(policyholdermobile);
    $("#policyholderemail input").val(policyholderemail);
    $("#policyholderidcard input").val(policyholderidcard);
    $("#policyholderidbegindate input").val(policyholderidbegindate);
    $("#policyholderidenddate input").val(policyholderidenddate);
    $("#policyholdernation input").val(policyholdernation);
    $("#policyholderpublish input").val(policyholderpublish);
}