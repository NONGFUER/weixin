//显示专享服务
var displayService = false;
var currentNotice;

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

    var sessionid = getViewData("sessionid");//zdx
    getCarDetailInfo(sessionid);

    reloadView();
}

function vaildateData()
{
    var sessionid = getViewData("sessionid");
    var citycode = getViewData("citycode");
    var rackno = getViewData("rackno");
    var productid = getRiskData("productid");
    var orderno = getViewData("orderno");

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

    if(isEmpty(orderno))
    {
        window.location.href = "insurequote.html";
        return false;
    }
    return true;
}


function getCarDetailInfo(sessionid) {

    // 方法定义
    var fun = function(result){
        if (result.status.statusCode != "000000") {
            muiAlert(result.status.statusMessage);
            return;
        }

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

function setEvent()
{
    $("#back").unbind("tap").bind("tap",function() {
        jumpback();
    });

    $("#service").unbind("tap").bind("tap",function() {
        switchService();
    });

    $("#servicerecord .service").live("tap",function(event) {
        displayNotice($(event.currentTarget));
    });

    $("#submit").unbind("tap").bind("tap",function() {
        submit();
    });
}

function jumpback()
{
    window.location.href = "insurequote.html";
}

function submit()
{
    window.location.href = "insurequote.html";
}

function switchService()
{
    displayService = !displayService;
    reloadView();
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

function reloadRiskView(data)
{
    if(!isDefined(data)) return;

    var riskcode = data.riskcode;
    $("#" + riskcode + " .blacktext").html(data["riskname"]);
    $("#" + riskcode + " .coverage").html(data["riskdetail"]);
    $("#" + riskcode + " .graytext").html(formatNumOfTwo(data["riskfee"]) + " 元");
}

function reloadView()
{
    var totalpre = getViewData("totalpre");
    var jqxpre = getViewData("jqxpre");
    var businesspre = getViewData("businesspre");
    var vehicletaxpre = getViewData("vehicletaxpre");
    var jqxbegindate = getViewData("jqxbegindate");
    var jqxenddate = getViewData("jqxenddate");
    var businessbegindate = getViewData("businessbegindate");
    var businessenddate = getViewData("businessenddate");

    if(parseInt(jqxpre) == 0)
        $("#jqx").hide();
    else
        $("#jqx").show();

    if(parseInt(businesspre) == 0)
        $("#business").hide();
    else
        $("#business").show();

    $("#totalpre").text("￥" + totalpre);
    $("#jqxpre").text("￥" + jqxpre);
    $("#vehicletaxpre").text("￥" + vehicletaxpre);
    $("#businesspre").text("￥" + businesspre);

    $("#jqxbegindate").text(jqxbegindate);
    $("#businessbegindate").text(businessbegindate);
    $("#jqxbegin").text(jqxbegindate);
    $("#jqxend").text(jqxenddate);
    $("#businessbegin").text(businessbegindate);
    $("#businessend").text(businessenddate);

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