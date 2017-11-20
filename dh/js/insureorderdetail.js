//显示专享服务
var displayService = false;
var displayCar = false;
var displayOwner = false;
var displayInsured = false;
var displayPolicyholder = false;
var currentNotice;
var displayAddress = false;

$(function(){
    scrollScreen();
    
    showHeader();
    initData();
    setEvent();
});

function scrollScreen()
{
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

    var sessionid = getUrlParam("sessionid");
    getCarOrderDetailInfo(sessionid);

    reloadView();
}

function vaildateData()
{
    var sessionid = getUrlParam("sessionid");

    if(isEmpty(sessionid))
    {
        window.history.go(-1);
        return false;
    }
    return true;
}

function setEvent()
{
    $("#car").unbind("tap").bind("tap",function() {
        switchCar();
    });

    $("#owner").unbind("tap").bind("tap",function() {
        switchOwner();
    });

    $("#insured").unbind("tap").bind("tap",function() {
        switchInsured();
    });

    $("#policyholder").unbind("tap").bind("tap",function() {
        switchPolicyholder();
    });

    $("#service").unbind("tap").bind("tap",function() {
        switchService();
    });
    
    $("#address").unbind("tap").bind("tap",function() {
        switchAddress();
    });

    $("#servicerecord .service").live("tap",function(event) {
        displayNotice($(event.currentTarget));
    });

    $("#submit").unbind("tap").bind("tap",function() {
        submit();
    });
}

function switchCar()
{
    displayCar = !displayCar;
    reloadView();
}

function switchOwner()
{
    displayOwner = !displayOwner;
    reloadView();
}

function switchInsured()
{
    displayInsured = !displayInsured;
    reloadView();
}

function switchPolicyholder()
{
    displayPolicyholder = !displayPolicyholder;
    reloadView();
}

function switchAddress()
{
    displayAddress = !displayAddress;
    reloadView();
}

function switchService()
{
    displayService = !displayService;
    reloadView();
}

function getCarOrderDetailInfo(sessionid) {

    // 方法定义
    var fun = function(result){
        if (result.status.statusCode != "000000") {
            muiAlert(result.status.statusMessage);
            return;
        }

        var jqxpre = result.cxInfo.cxOffer.jqxPre||0.00;                    // 交强险价格
        var businesspre = result.cxInfo.cxOffer.businessPre||0.00;          // 商业险价格
        var vehicletaxpre = result.cxInfo.cxOffer.vehicletaxPre||0.00;      // 车船税
        var totalpre = result.cxInfo.cxOffer.totalpremium||0.00;            // 总保费

        // 交强险 起保日期
        var jqxbegindate = (jqxpre == 0)?addDate(1).Format("yyyy-MM-dd"):new Date(result.cxInfo.cxOffer.jqxBegindate.time).Format("yyyy-MM-dd");
        var jqxenddate = (jqxpre == 0)?addDate(365).Format("yyyy-MM-dd"):new Date(result.cxInfo.cxOffer.jqxEnddate.time).Format("yyyy-MM-dd");

        // 商业险 起保日期
        var businessbegindate = (businesspre == 0)?addDate(1).Format("yyyy-MM-dd"):new Date(result.cxInfo.cxOffer.businessBegindate.time).Format("yyyy-MM-dd");
        var businessenddate = (businesspre == 0)?addDate(365).Format("yyyy-MM-dd"):new Date(result.cxInfo.cxOffer.businessEnddate.time).Format("yyyy-MM-dd");

        var citycode = result.cxInfo.cxCarMessage.citycode;                 //地区信息
        var isnewplate = (result.cxInfo.cxOrder.newcarFlag == "1")?"true":"false";
        var cityname = result.cxInfo.cxOrder.cityName;                      //地区信息
        var plateno = isnewplate == "true"?"":result.cxInfo.cxOrder.plateno;
        var rackno = result.cxInfo.cxCarMessage.rackNo||"";                 // 车辆识别代码
        var engineno = result.cxInfo.cxCarMessage.engineNo||"";             // 发动机号
        var registdate = new Date(result.cxInfo.cxCarMessage.registerDate.time).Format("yyyy-MM-dd");// 注册日期
        var producingarea = result.cxInfo.cxCarMessage.producingarea||"";   // 车型产地  进口车、合资车、国产车
        var brandmodel = result.cxInfo.cxCarMessage.vehicleBrand||"";       // 品牌型号

        var ownername = result.cxInfo.cxOrder.ownerName||"";                // 车主姓名
        var owneremail = result.cxInfo.cxOrder.ownerEmail||"";              // 车主邮箱
        var owneridcard = result.cxInfo.cxOrder.ownerIdno||"";              // 车主身份证号
        var ownermobile = result.cxInfo.cxOrder.ownerMobile||"";            // 车主手机号

        var insuredname = result.cxInfo.cxParty.insuredname||"";            // 被保人姓名
        var insuredemail = result.cxInfo.cxParty.insuredemail||"";          // 被保人邮箱
        var insuredidcard = result.cxInfo.cxParty.insuredidno||"";          // 被保人身份证号
        var insuredmobile = result.cxInfo.cxParty.insuredmobile||"";        // 被保人手机号

        var policyholdername = result.cxInfo.cxParty.phname||"";            // 投保人姓名
        var policyholderemail = result.cxInfo.cxParty.phemail||"";          // 投保人邮箱
        var policyholderidcard = result.cxInfo.cxParty.phidno||"";          // 投保人身份证号
        var policyholdermobile = result.cxInfo.cxParty.phtelephone||"";     // 投保人手机号
        var owneraddress = result.cxInfo.cxOrder.addresseeprovince + " " + result.cxInfo.cxOrder.psAddress ||"";            // 投保人地址
        
        var viewData = {
            "jqxpre":jqxpre,
            "businesspre":businesspre,
            "vehicletaxpre":vehicletaxpre,
            "totalpre":totalpre,

            "jqxbegindate":jqxbegindate,
            "jqxenddate":jqxenddate,
            "businessbegindate":businessbegindate,
            "businessenddate":businessenddate,

            "citycode":citycode,
            "isnewplate":isnewplate,
            "cityname":cityname,
            "plateno":plateno,
            "rackno":rackno,
            "engineno":engineno,
            "registdate":registdate,
            "producingarea":producingarea,
            "brandmodel":brandmodel,

            "ownername":ownername,
            "owneremail":owneremail,
            "owneridcard":owneridcard,
            "ownermobile":ownermobile,

            "insuredname":insuredname,
            "insuredemail":insuredemail,
            "insuredidcard":insuredidcard,
            "insuredmobile":insuredmobile,

            "policyholdername":policyholdername,
            "policyholderemail":policyholderemail,
            "policyholderidcard":policyholderidcard,
            "policyholdermobile":policyholdermobile,
            "owneraddress":owneraddress,

        };
        reloadDetailView(viewData);

        var mainrisks = getRiskList(result.cxRiskInfoList.main);            // 主险
        var addrisks = getRiskList(result.cxRiskInfoList.add);              // 附加险
        var abatementrisks = getRiskList(result.cxRiskInfoList.all);        // 不计免赔

        var riskList = [];
        riskList = riskList.concat(mainrisks);
        riskList = riskList.concat(addrisks);
        riskList = riskList.concat(abatementrisks);

        //需要先清除所有内容
        clearRiskList();
        fillRiskList(riskList);

        var serviceList = getServiceList(result.cxRiskInfoList.cxPriservices); //专享服务

        //需要先清除所有内容
        clearServiceList();
        fillServiceList(serviceList);

        reloadView();
    };

    if(!isFake)
        ServiceSend.getAllCarInfo(sessionid,fun);
    else
        $.get("data/carinfodata.json", fun);
}

var riskCount = 1;
function getRiskList(risks)
{
    var riskList = [];
    var risk,riskcode,riskname,riskfee,riskdetail;
    for(var index in risks)
    {
        risk = risks[index];

        riskcode = "risk" + riskCount++;    // 数字
        riskname = risk.name;               // 玻璃单独破碎险
        riskfee = risk.pre;                 // 费用
        riskdetail = risk.coverage;         // 额度

        if(riskname.indexOf("不计免赔") == -1){
        	if(riskdetail=="1"||riskdetail=="0")
        	riskdetail = "投保";	
        	else	
            riskdetail += riskdetail.indexOf("元") == -1?" 元":"";
        }
        else
        {
            riskname = riskname.replace("不计免赔","<br/>不计免赔");
            riskdetail = "投保";
        }


        var data = {};
        data["riskcode"] = riskcode;
        data["riskname"] = riskname;
        data["riskfee"] = riskfee;
        data["riskdetail"] = riskdetail;

        riskList.push(data);
    }
    return riskList;
}

function getServiceList(services)
{
    var serviceList = [];
    var service,title,info;
    for(var index in services)
    {
        service = services[index];

        title = service.serviceTitle;
        info = filterInfo(service.serviceInfo);
        serviceList.push({
            "serviceid":service.id,
            "servicename":title,
            "serviceinfo":info,
        })
    }
    return serviceList;
}

function filterInfo(str)
{
    str = str.replace(/<[^>]+>/g,"")    //去掉所有的html标记
    str = str.replace(/\\r\\n/g, "<br/>");
    return str;
}

var riskRecordTemplate = $("#riskrecord").children().clone();
$("#riskrecord").empty();

var serviceRecordTemplate = $("#servicerecord").children().clone();
$("#servicerecord").empty();

function clearRiskList()
{
    $("#riskrecord").empty();
}

function clearServiceList()
{
    $("#servicerecord").empty();
    displayService = false;
}

function fillRiskList(riskList)
{
    var data,riskcode;
    for(var index = 0; index < riskList.length;index++)
    {
        data = riskList[index];
        var riskrecord = riskRecordTemplate.clone();
        riskcode = data.riskcode;
        riskrecord.attr("id",riskcode);

        $("#riskrecord").append(riskrecord);
        if(index < riskList.length - 1) $("#riskrecord").append("<br/>");

        reloadRiskView(data);
    }
}

function fillServiceList(serviceList)
{
    var data0,data1,data2;
    for(var index = 0; index < serviceList.length;)
    {
        var servicerecord = serviceRecordTemplate.clone();
        data0 = serviceList[index++];
        data1 = serviceList[index++];
        data2 = serviceList[index++];

        if(!isDefined(data0))
            $(servicerecord.children()[0]).children().remove();
        else
        {
            $(servicerecord.children()[0]).children().text(data0.servicename);
            $(servicerecord.children()[0]).children().attr("id","service" + data0.serviceid);
            $(servicerecord.children()[0]).children().attr("data",data0.serviceinfo);
        }

        if(!isDefined(data1))
            $(servicerecord.children()[1]).children().remove();
        else
        {
            $(servicerecord.children()[1]).children().text(data1.servicename);
            $(servicerecord.children()[1]).children().attr("id","service" + data1.serviceid);
            $(servicerecord.children()[1]).children().attr("data",data1.serviceinfo);
        }

        if(!isDefined(data2))
            $(servicerecord.children()[2]).children().remove();
        else
        {
            $(servicerecord.children()[2]).children().text(data2.servicename);
            $(servicerecord.children()[2]).children().attr("id","service" + data2.serviceid);
            $(servicerecord.children()[2]).children().attr("data",data2.serviceinfo);
        }

        $("#servicerecord").append(servicerecord);

        if(index < serviceList.length - 1) $("#servicerecord").append("<br/>");

    }
}

function displayNotice(target)
{
    currentNotice = target.attr("id");
    reloadView();
}

function submit()
{
    window.history.go(-1);
}

function reloadRiskView(data)
{
    if(!isDefined(data)) return;

    var riskcode = data.riskcode;
    $("#" + riskcode + " .blacktext").html(data["riskname"]);
    $("#" + riskcode + " .coverage").html(data["riskdetail"]);
    $("#" + riskcode + " .graytext").html(formatNumOfTwo(data["riskfee"]) + " 元");
}

function reloadDetailView(data)
{
    var totalpre = data["totalpre"];
    var jqxpre = data["jqxpre"];
    var businesspre = data["businesspre"];
    var vehicletaxpre = data["vehicletaxpre"];
    var jqxbegindate = data["jqxbegindate"];
    var jqxenddate = data["jqxenddate"];
    var businessbegindate = data["businessbegindate"];
    var businessenddate = data["businessenddate"];

    var citycode = data["citycode"];
    var isnewplate = data["isnewplate"];
    var cityname = data["cityname"];
    var plateno = data["plateno"];
    var rackno = data["rackno"];
    var engineno = data["engineno"];
    var registdate = data["registdate"];
    var brandmodel = data["brandmodel"];

    var ownername = data["ownername"];
    var ownermobile = data["ownermobile"];
    var owneremail = data["owneremail"];
    var owneridcard = data["owneridcard"];

    var insuredname = data["insuredname"];
    var insuredmobile = data["insuredmobile"];
    var insuredemail = data["insuredemail"];
    var insuredidcard = data["insuredidcard"];

    var policyholdername = data["policyholdername"];
    var policyholdermobile = data["policyholdermobile"];
    var policyholderemail = data["policyholderemail"];
    var policyholderidcard = data["policyholderidcard"];
    var owneraddress = data["owneraddress"];


    if(parseInt(jqxpre) == 0)
        $("#jqx").hide();
    else
        $("#jqx").show();

    if(parseInt(businesspre) == 0)
        $("#business").hide();
    else
        $("#business").show();

    $("#totalpre").text(formatNumOfTwo(totalpre) + " 元");
    $("#jqxpre").text(formatNumOfTwo(jqxpre) + " 元");
    $("#vehicletaxpre").text(formatNumOfTwo(vehicletaxpre) + " 元");
    $("#businesspre").text(formatNumOfTwo(businesspre) + " 元");

    $("#jqxbegindate").text(jqxbegindate);
    $("#businessbegindate").text(businessbegindate);
    $("#jqxbegin").text(jqxbegindate);
    $("#jqxend").text(jqxenddate);
    $("#businessbegin").text(businessbegindate);
    $("#businessend").text(businessenddate);

    if(isnewplate == "true") plateno = "新车未上牌";
    $("#plateno").text(plateno);

    $("#cityname").text(cityname);
    $("#rackno").text(rackno);
    $("#engineno").text(engineno);
    $("#registdate").text(registdate);
    $("#brandmodel").text(brandmodel);

    if(citycode == "3110000" || citycode == "3440300")//北京 深圳
    {
        $("#emailowner").show();
        $("#emailinsured").show();
        $("#emailpolicyholder").show();
    }
    else
    {
        $("#emailowner").hide();
        $("#emailinsured").hide();
        $("#emailpolicyholder").hide();
    }


    $("#ownername").text(ownername);
    $("#ownermobile").text(ownermobile);
    $("#owneremail").text(owneremail);
    $("#owneridcard").text(owneridcard);

    $("#insuredname").text(insuredname);
    $("#insuredmobile").text(insuredmobile);
    $("#insuredemail").text(insuredemail);
    $("#insuredidcard").text(insuredidcard);

    $("#policyholdername").text(policyholdername);
    $("#policyholdermobile").text(policyholdermobile);
    $("#policyholderemail").text(policyholderemail);
    $("#policyholderidcard").text(policyholderidcard);
    $("#owneraddress").text(owneraddress);
    
    

}

function reloadView()
{
    if(displayCar)
    {
        $("#car .mui-icon").removeClass("mui-icon-arrowright");
        $("#car .mui-icon").addClass("mui-icon-arrowdown");
        $("#carinfo").show();
    }
    else
    {
        $("#car .mui-icon").removeClass("mui-icon-arrowdown");
        $("#car .mui-icon").addClass("mui-icon-arrowright");
        $("#carinfo").hide();
    }

    if(displayOwner)
    {
        $("#owner .mui-icon").removeClass("mui-icon-arrowright");
        $("#owner .mui-icon").addClass("mui-icon-arrowdown");
        $("#ownerinfo").show();
    }
    else
    {
        $("#owner .mui-icon").removeClass("mui-icon-arrowdown");
        $("#owner .mui-icon").addClass("mui-icon-arrowright");
        $("#ownerinfo").hide();
    }

    if(displayInsured)
    {
        $("#insured .mui-icon").removeClass("mui-icon-arrowright");
        $("#insured .mui-icon").addClass("mui-icon-arrowdown");
        $("#insuredinfo").show();
    }
    else
    {
        $("#insured .mui-icon").removeClass("mui-icon-arrowdown");
        $("#insured .mui-icon").addClass("mui-icon-arrowright");
        $("#insuredinfo").hide();
    }

    if(displayPolicyholder)
    {
        $("#policyholder .mui-icon").removeClass("mui-icon-arrowright");
        $("#policyholder .mui-icon").addClass("mui-icon-arrowdown");
        $("#policyholderinfo").show();
    }
    else
    {
        $("#policyholder .mui-icon").removeClass("mui-icon-arrowdown");
        $("#policyholder .mui-icon").addClass("mui-icon-arrowright");
        $("#policyholderinfo").hide();
    }

    
    if(displayAddress)
    {
        $("#address .mui-icon").removeClass("mui-icon-arrowright");
        $("#address .mui-icon").addClass("mui-icon-arrowdown");
        $("#addressinfo").show();
    }
    else
    {
        $("#address .mui-icon").removeClass("mui-icon-arrowdown");
        $("#address .mui-icon").addClass("mui-icon-arrowright");
        $("#addressinfo").hide();
    }
    
    if(displayService)
    {
        $("#service .mui-icon").removeClass("mui-icon-arrowright");
        $("#service .mui-icon").addClass("mui-icon-arrowdown");
        $("#servicerecord").show();

        $("#servicenotice").show();
    }
    else
    {
        $("#service .mui-icon").removeClass("mui-icon-arrowdown");
        $("#service .mui-icon").addClass("mui-icon-arrowright");
        $("#servicerecord").hide();

        $("#servicenotice").hide();
        $("#servicenotice").html("");
        currentNotice = "";
    }

    var index = 1;
    var list = $("#servicerecord .service");
    for(var index = 0; index < list.length;index++)
    {
        $(list[index]).removeClass("mui-active");
    }

    if(!isEmpty(currentNotice))
    {
        $("#" + currentNotice).addClass("mui-active");
        var content = $("#" + currentNotice).attr("data");
        $("#servicenotice").html(content);
    }
}

