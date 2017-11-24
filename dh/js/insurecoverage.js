document.write("<script language='javascript' src='js/saverisk.js?v=20171123' ></script>");

//显示专享服务
var displayService = false;
var currentMeal;
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
        $("#main").css("margin-top","-45px");
        $("#scroll").css("margin-top","45px");
    }
    else
    {
        $("#header").show();
        $("#main").css("margin-top","0px");
        $("#scroll").css("margin-top","90px");
    }
}

function initData()
{
    if(!vaildateData()) return;

    switchSegmented("meal1");
    reloadView();
}

function vaildateData()
{
    var sessionid = getViewData("sessionid");
    var citycode = getViewData("citycode");
    var rackno = getViewData("rackno");

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
    return true;
}

function setEvent()
{
    $("#back").unbind("tap").bind("tap",function() {
        jumpback();
    });

    //选项卡
    $(".segmented").unbind("tap").bind("tap",function(event) {
        mui('.mui-scroll-wrapper').scroll().scrollTo(0,0);          //滚动到顶部
        switchSegmented($(event.currentTarget).attr("id"));
    });

    //投保按钮
    $("#riskrecord .cover").live("tap",function(event) {
        popRisk($(event.currentTarget).attr("riskcode"));
    });

    //投保按钮
    $("#specialriskrecord .cover").live("tap",function(event) {
        popRisk($(event.currentTarget).attr("riskcode"));
    });

    //不计免赔
    $(".abatement").live("tap",function(event) {
        saveAbatement($(event.currentTarget).attr("riskcode"));
    });

    //交强险
    $("#jqx").unbind("tap").bind("tap",function() {
        switchJqx();
    });

    $("#service").unbind("tap").bind("tap",function() {
        switchService();
    });

    $("#servicerecord .service").live("tap",function(event) {
        displayNotice($(event.currentTarget));
    });

    $("#buyinsure").unbind("tap").bind("tap",function() {
        window.location.href = "carinsure.html";
    });

    $("#submit").unbind("tap").bind("tap",function() {
    	if(!vaildateData()) return;
        submit();
    });
}

function jumpback()
{
    window.location.href = "insurecarinfo.html";
}

function switchService()
{
    displayService = !displayService;
    reloadView();
}

function popRisk(riskcode)
{
    if(riskcode == "cardamagercoverage") return;            //车损险绝对免赔额  不允许更改

    var riskvalue = getRiskData(riskcode + "value");        // 投保
    var riskforce = getRiskData(riskcode + "force");        // 是否强制投保
    if(riskvalue == "投保")                                  // 如果是 现在是投保 并且强制投保  就直接退出
    {
        if(riskforce == "true") return;
    }

    var popPickerData = getStorageData(riskcode);

    var popPicker = new mui.PopPicker();
    popPicker.setData(popPickerData);
    popPicker.show(function(items) {
        popPicker.dispose();

        var risk = items[0];
        var riskvalue = risk.text;
        var riskamount = risk.value;

        var data = {};
        data["riskcode"] = riskcode;                            // glassbrokencoverage
        data[riskcode + "value"] = riskvalue;                   // 投保  不投保
        data[riskcode + "code"] = riskamount;                   // "0","1000","2000","3000"

        var riskmpvalue = getRiskData(riskcode + "mpvalue");    // 不计免赔  投保 不投保
        var riskmpcode = getRiskData(riskcode + "mpcode");      // 1-勾选不计免赔 0-未勾选不计免赔
        var riskmp = getRiskData(riskcode + "mp");              // 是否包含 不计免赔

        var riskforce = getRiskData(riskcode + "force");        // 是否强制投保
        if(riskvalue == "不投保" || riskvalue == "不可投保")      // 如果是 选择是不投保 并且强制投保  就直接退出
        {
            if(riskforce == "true") return;
        }

        // 不投保 的 不能 不计免赔
        if(riskvalue == "不投保" || riskvalue == "不可投保")
        {
            riskmpvalue = "不投保";                          // 不计免赔 不投保
            riskmpcode = "0";                               // 0-未勾选不计免赔
        }
        else
        {
            riskmpvalue = "投保";                            // 不计免赔 投保
            riskmpcode = "1";                               // 1-勾选不计免赔
        }

        data[riskcode + "mp"] = riskmp;                     // 是否包含 不计免赔
        data[riskcode + "mpvalue"] = riskmpvalue;           // 不计免赔  投保 不投保
        data[riskcode + "mpcode"] = riskmpcode;             // 1-勾选不计免赔 0-未勾选不计免赔

        setRiskDatas(data);
        reloadRiskView(data);
    });
}

function saveAbatement(riskcode)
{
    var data = {};
    data["riskcode"] = riskcode;                                // glassbrokencoverage
    var riskvalue = getRiskData(riskcode + "value");
    var riskamount = getRiskData(riskcode + "code");

    //不投保 不能 不计免赔
    if(riskvalue == "不投保" || riskvalue == "不可投保") return;

    var riskmpvalue = getRiskData(riskcode + "mpvalue");
    var riskmpcode = getRiskData(riskcode + "mpcode");
    var riskmpforce = getRiskData(riskcode + "mpforce");        // 是否强制投保
    if(riskmpvalue == "投保")                                    // 改变前 为 投保
    {
        if(riskmpforce == "true") return;
    }

    var riskmp = getRiskData(riskcode + "mp");                  // 是否包含 不计免赔
    data[riskcode + "mp"] = riskmp;
    data[riskcode + "mpvalue"] = (riskmpvalue == "投保")?"不投保":"投保";// 不计免赔  投保 不投保
    data[riskcode + "mpcode"] = (riskmpcode == "1")?"0":"1";    // 1-勾选不计免赔 0-未勾选不计免赔

    data[riskcode + "value"] = riskvalue;                       // 投保  不投保
    data[riskcode + "code"] = riskamount;                       // "0","1000","2000","3000"

    setRiskDatas(data);
    reloadRiskView(data);
}

function switchSegmented(mealnum)
{
    currentMeal = mealnum;
    reloadView();
    // 方法定义
    var fun = function(result){
        if (result.status.statusCode != "000000") {
            muiAlert(result.status.statusMessage);
            return;
        }

        //需要先删除当前risk选项
        delStorageData("risk");

        saveBaseAndJqx(result);

        var mainrisks = getRiskList(result.cxProduct.main_risk);    // 主险
        var addrisks = getRiskList(result.cxProduct.add_risk);      // 附加险

        var riskList = mainrisks.concat(addrisks);

        //需要先清除所有内容
        clearRiskList();
        fillRiskList(riskList);

        var serviceList = getServiceList(result.cxProduct.cxPriservice); //专享服务

        //需要先清除所有内容
        clearServiceList();
        fillServiceList(serviceList);

        reloadView();
    };

    var sessionid = getViewData("sessionid");

    if(!isFake)
        ServiceSend.queryMealInfo(currentMeal,sessionid,fun);
    else
        $.get("data/" + currentMeal + "data.json",fun);
}

function switchJqx()
{
    var data = {};
    var riskcode = "jqx";
    data["riskcode"] = riskcode;                            // glassbrokencoverage

    var riskvalue = getRiskData(riskcode + "value");        // 交强险投保标志 投保  不投保
    var riskamount = getRiskData(riskcode + "code");        // 交强险保费  1: 投保 0:不投保

    if(riskvalue == "投保")
    {
        riskvalue = "不投保";
        riskamount = "0";
    }
    else
    {
        riskvalue = "投保";
        riskamount = "1";
    }

    data[riskcode + "value"] = riskvalue;                   // 投保  不投保
    data[riskcode + "code"] = riskamount;                   // "0","1000","2000","3000"

    setRiskDatas(data);
    reloadJqxView(data);
}

function saveBaseAndJqx(result)
{
    var data = {};
    data["productid"] = result.cxProduct.base.product_id;   // productid
    data["commodityno"] = result.cxProduct.base.commodityNo;// commodityNo

    data["riskcode"] = "jqx";
    data["jqxvalue"] = "投保";                               // 交强险投保标志 投保  不投保
    data["jqxcode"] = "1";                                  // 交强险保费  1: 投保 0:不投保

    data["jqxbegindate"] = addDate(1).Format("yyyy-MM-dd"); //交强险起保日期 取当前日期后一天
    data["businessbegindate"] = addDate(1).Format("yyyy-MM-dd"); //商业险起保日期 取当前日期后一天

    setRiskDatas(data);
    reloadJqxView(data);
}

function reloadJqxView(data) {
    if(!isDefined(data)) return ;

    var riskcode = data.riskcode;
    var riskvalue = data[riskcode + "value"];

    if(riskvalue == "不投保" || riskvalue == "不可投保")
        $("#jqx .cover").addClass("disabled");
    else
        $("#jqx .cover").removeClass("disabled");
}

function getRiskList(risks)
{
    var riskList = [];
    var risk,riskcode,riskname,riskamount,riskvalue,riskhasmp,riskmpvalue,riskforce,riskmpforce;
    for(var index in risks)
    {
        risk = risks[index];

        riskforce = risk.need_select == "1"?"true":"false";         // 1:强制投保  2: 不强制投保
        riskmpforce = risk.need_select_mp == "1"?"true":"false";    // 不计免赔 1:强制投保  2: 不强制投保

        riskname = risk.duty_name;                                  // 玻璃单独破碎险
        riskcode = risk.duty_code.toLowerCase();                    // GlassBrokenCoverage -> glassbrokencoverage
        riskvalue = risk.duty_default.split(":")[1];                // 投保  不投保
        riskamount = getDutyAmount(riskvalue,risk.dutyDetails);     // "0","1000","2000","3000"
        riskhasmp = risk.deductible_flag == "01"?true:false;        // 包含 不计免赔
        riskmpvalue = risk.deductible_default == "01"?true:false;   // 勾选不计免赔

        var datas = risk.dutyDetails;
        // JSON字符串转Json
        if (typeof datas == "string") datas = $.parseJSON(datas);

        var popPickerData = fillPopPickerData(datas,"enuContent","dutyAmount");
        setStorageData(riskcode,popPickerData);

        var data = {};
        data["riskcode"] = riskcode;                            // glassbrokencoverage
        data[riskcode + "name"] = riskname;                     // 玻璃单独破碎险
        data[riskcode + "value"] = riskvalue;                   // 投保  不投保
        data[riskcode + "code"] = riskamount;                   // "0","1000","2000","3000"

        data[riskcode + "mp"] = riskhasmp?"true":"false";       // 是否包含 不计免赔
        data[riskcode + "mpvalue"] = riskmpvalue?"投保":"不投保";// 不计免赔  投保 不投保
        data[riskcode + "mpcode"] = riskmpvalue?"1":"0";        // 1-勾选不计免赔 0-未勾选不计免赔

        data[riskcode + "force"] = riskforce;                   // 是否强制投保
        data[riskcode + "mpforce"] = riskmpforce;               // 是否强制投保 不计免赔

        setRiskDatas(data);
        riskList.push(data);
    }
    return riskList;
}


function getDutyAmount(duty,dutyDetails)
{
    for(var index in dutyDetails)
    {
        if(dutyDetails[index].enuContent == duty)
            return dutyDetails[index].dutyAmount;
    }
    return duty;
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

var specialRiskRecordTemplate = $("#specialriskrecord").children().clone();

var serviceRecordTemplate = $("#servicerecord").children().clone();
$("#servicerecord").empty();

function clearRiskList()
{
    $("#riskrecord").empty();
    $("#specialriskrecord").empty();
}

function clearServiceList()
{
    $("#servicerecord").empty();
    displayService = false;
}

function fillRiskList(riskList)
{
    specialWarning();

    var data,riskcode;
    for(var index = 0; index < riskList.length;index++)
    {
        data = riskList[index];
        var riskrecord = riskRecordTemplate.clone();
        riskcode = data.riskcode;
        riskrecord.attr("id",riskcode);

        var riskrecordDiv = $("#riskrecord");
        if(isSpecialOperate(riskcode)) riskrecordDiv = $("#specialriskrecord");

        riskrecordDiv.append(riskrecord);
        if(index < riskList.length - 1) riskrecordDiv.append("<br/>");

        specialOperate(data);
        reloadRiskView(data);
    }
}

function specialWarning()
{
    // 套餐二 单独处理
    if(currentMeal == "meal2")
    {
        var special = specialRiskRecordTemplate.clone();
        $("#specialriskrecord").append(special);
        $("#specialriskrecord").append("<br/>");
    }
}

function isSpecialOperate(riskcode)
{
    if(currentMeal == "meal2")
    {
        // 发动机涉水险
        if(riskcode == "enginewadingcoverage") return true;
        // 新增设备险
        if(riskcode == "newequipmentcoverage") return true;
        // 精神损害抚慰金责任险
        if(riskcode == "mentaldistresscoverage") return true;
        // 指定专修厂特约险
        if(riskcode == "appointrepaircoverage") return true;
    }
    return false;
}

function specialOperate(data)
{
    if(!isDefined(data)) return ;

    var riskcode = data.riskcode;
    //玻璃单独破碎险  加上  是否 是国产
    if(riskcode == "glassbrokencoverage"){
        var vehiclemodeldata = getViewData("vehiclemodeldata");
        if(isDefined(vehiclemodeldata))
        {
            vehiclemodeldata = $.parseJSON(vehiclemodeldata);
            if(vehiclemodeldata.importFlag == "进口车")
                data[riskcode + "name"] += "<br/>(进口)";
            else
                data[riskcode + "name"] += "<br/>(国产)";

            setRiskData(riskcode + "name",data[riskcode + "name"]);
        }
    }

    
    // 套餐一 单独处理
    if(currentMeal == "meal1")
    {
        // 机动车损失险 不投保
        if(riskcode == "carlosscoverage"){
            data[riskcode + "value"] = "不投保";
            data[riskcode + "code"] = "0";

            setRiskData(riskcode + "value",data[riskcode + "value"]);
            setRiskData(riskcode + "code",data[riskcode + "code"]);

            data[riskcode + "mpvalue"] = "不投保";
            data[riskcode + "mpcode"] = "0";

            setRiskData(riskcode + "mpvalue",data[riskcode + "mpvalue"]);
            setRiskData(riskcode + "mpcode",data[riskcode + "mpcode"]);
        }
        // 驾驶人责任险 不投保
        if(riskcode == "drivercoverage"){
            data[riskcode + "value"] = "不投保";
            data[riskcode + "code"] = "0";

            setRiskData(riskcode + "value",data[riskcode + "value"]);
            setRiskData(riskcode + "code",data[riskcode + "code"]);

            data[riskcode + "mpvalue"] = "不投保";
            data[riskcode + "mpcode"] = "0";

            setRiskData(riskcode + "mpvalue",data[riskcode + "mpvalue"]);
            setRiskData(riskcode + "mpcode",data[riskcode + "mpcode"]);
        }

        // 乘客责任险 不投保
        if(riskcode == "passengercoverage"){
            data[riskcode + "value"] = "不投保";
            data[riskcode + "code"] = "0";

            setRiskData(riskcode + "value",data[riskcode + "value"]);
            setRiskData(riskcode + "code",data[riskcode + "code"]);

            data[riskcode + "mpvalue"] = "不投保";
            data[riskcode + "mpcode"] = "0";

            setRiskData(riskcode + "mpvalue",data[riskcode + "mpvalue"]);
            setRiskData(riskcode + "mpcode",data[riskcode + "mpcode"]);
        }

        // 第三者责任险 投保 100万
        if(riskcode == "thirdpartycoverage"){
            data[riskcode + "value"] = "100万";
            data[riskcode + "code"] = "1000000";

            setRiskData(riskcode + "value",data[riskcode + "value"]);
            setRiskData(riskcode + "code",data[riskcode + "code"]);

            data[riskcode + "mpvalue"] = "投保";
            data[riskcode + "mpcode"] = "1";

            setRiskData(riskcode + "mpvalue",data[riskcode + "mpvalue"]);
            setRiskData(riskcode + "mpcode",data[riskcode + "mpcode"]);
        }

        // 全车盗抢险 不投保
        if(riskcode == "theftcoverage"){
            data[riskcode + "value"] = "不投保";
            data[riskcode + "code"] = "0";

            setRiskData(riskcode + "value",data[riskcode + "value"]);
            setRiskData(riskcode + "code",data[riskcode + "code"]);

            data[riskcode + "mpvalue"] = "不投保";
            data[riskcode + "mpcode"] = "0";

            setRiskData(riskcode + "mpvalue",data[riskcode + "mpvalue"]);
            setRiskData(riskcode + "mpcode",data[riskcode + "mpcode"]);
        }
    }
    
    // 套餐二 单独处理
    if(currentMeal == "meal2")
    {
        // 玻璃单独破碎险 必须投保
        if(riskcode == "glassbrokencoverage"){
            data[riskcode + "value"] = "投保";
            data[riskcode + "code"] = "1";

            setRiskData(riskcode + "value",data[riskcode + "value"]);
            setRiskData(riskcode + "code",data[riskcode + "code"]);
        }

        // 自然损失险 必须投保
        if(riskcode == "selfignitecoverage"){
            data[riskcode + "value"] = "投保";
            data[riskcode + "code"] = "1";

            setRiskData(riskcode + "value",data[riskcode + "value"]);
            setRiskData(riskcode + "code",data[riskcode + "code"]);

            data[riskcode + "mpvalue"] = "投保";
            data[riskcode + "mpcode"] = "1";

            setRiskData(riskcode + "mpvalue",data[riskcode + "mpvalue"]);
            setRiskData(riskcode + "mpcode",data[riskcode + "mpcode"]);
        }
    }
}

function reloadRiskView(data)
{
    if(!isDefined(data)) return;

    var riskcode = data.riskcode;
    $("#" + riskcode + " .blacktext").html(data[riskcode + "name"]);
    $("#" + riskcode + " .cover").html(data[riskcode + "value"]);
    $("#" + riskcode + " .cover").attr("riskcode",riskcode);
    $("#" + riskcode + " .abatement").text("不计免赔");
    $("#" + riskcode + " .abatement").attr("riskcode",riskcode);

    var riskvalue = data[riskcode + "value"];
    if(riskvalue == "不投保" || riskvalue == "不可投保")
        $("#" + riskcode + " .cover").addClass("disabled");
    else
        $("#" + riskcode + " .cover").removeClass("disabled");

    var riskmpvalue = data[riskcode + "mpvalue"];
    if(riskmpvalue == "不投保" || riskmpvalue == "不可投保")
        $("#" + riskcode + " .abatement").addClass("disabled");
    else
        $("#" + riskcode + " .abatement").removeClass("disabled");

    // 不为 true 说明 此项 没有不计免赔
    var riskmp = data[riskcode + "mp"];
    if(riskmp != "true") $("#" + riskcode + " .abatement").remove();
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
    if(!checkRisk()) return;
    // 套餐二 单独处理
    if(currentMeal == "meal2" && !checkSpecialRisk()) return;

    saveRiskServer(function (){
        window.location.href = "insurequote.html";
    });
}

function reloadView()
{
    if(currentMeal == "meal1")
    {
        $("#meal1").addClass("mui-active");
        $("#meal2").removeClass("mui-active");
        $("#meal3").removeClass("mui-active");
        $("#meal1img").hide();
        $("#meal2img").show();
        $("#meal3img").show();
        $("#meal1imglight").show();
        $("#meal2imglight").hide();
        $("#meal3imglight").hide();

        $("#specialriskrecord").hide();
    }
    if(currentMeal == "meal2")
    {
        $("#meal1").removeClass("mui-active");
        $("#meal2").addClass("mui-active");
        $("#meal3").removeClass("mui-active");
        $("#meal1img").show();
        $("#meal2img").hide();
        $("#meal3img").show();
        $("#meal1imglight").hide();
        $("#meal2imglight").show();
        $("#meal3imglight").hide();

        $("#specialriskrecord").show();
    }
    if(currentMeal == "meal3")
    {
        $("#meal1").removeClass("mui-active");
        $("#meal2").removeClass("mui-active");
        $("#meal3").addClass("mui-active");
        $("#meal1img").show();
        $("#meal2img").show();
        $("#meal3img").hide();
        $("#meal1imglight").hide();
        $("#meal2imglight").hide();
        $("#meal3imglight").show();

        $("#specialriskrecord").hide();
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