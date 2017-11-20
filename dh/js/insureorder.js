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

    var globalno = getUrlParam("globalno");
    var appno = getUrlParam("appno");
    var polno = getUrlParam("polno");

    getCarOrderInfo(globalno,appno,polno);
}

function vaildateData()
{
    var globalno = getUrlParam("globalno");
    var appno = getUrlParam("appno");
    var polno = getUrlParam("polno");

    if(isEmpty(globalno))
    {
        muiAlert("对不起,信息不完整请重试!",function(){
            window.history.go(-2);
        });
        return false;
    }

    if(isEmpty(appno) && isEmpty(polno))
    {
        muiAlert("对不起,信息不完整请重试!",function(){
            window.history.go(-2);
        });
        return false;
    }

    return true;
}

function setEvent()
{
    $("#back").unbind("tap").bind("tap",function() {
        jumpback();
    });

    $("#guide").unbind("tap").bind("tap",function() {
        guide();
    });
    
    $("#detail").unbind("tap").bind("tap",function() {
        submit();
    });
}

function jumpback()
{
    window.history.go(-2);
}

function getCarOrderInfo(globalno,appno,polno) {

    // 方法定义
    var fun = function(result){
        if (result.status.statusCode != "000000") {
            muiAlert(result.status.statusMessage);
            return;
        }

        var globalno = result.cxInfo.cxOrder.userName||"";                  //全局流水号
        var orderstatus = result.cxInfo.cxOrder.orderStatus||"";            //保单状态
        var sessionid = result.cxInfo.cxOrder.sessionid;                    //session

        var mealname = result.cxInfo.cxOrder.commodityName;                 //套餐名称

        var appno = result.cxInfo.cxOrder.appno||"";                        //投保单号
        var polno = result.cxInfo.cxOrder.polno||"";                        //保单号
        var businessappno = result.cxInfo.cxOrder.businessAppno||"";        //商业险投保单号
        var businesspolno = result.cxInfo.cxOrder.businessPolno||"";        //商业险保单号
        var jqxappno = result.cxInfo.cxOrder.forceAppno||"";                //交强险投保单号
        var jqxpolno = result.cxInfo.cxOrder.forcePolno||"";                //交强险保单号

        var jqxpre = result.cxInfo.cxOffer.jqxPre||0.00;                    // 交强险价格
        var businesspre = result.cxInfo.cxOffer.businessPre||0.00;          // 商业险价格
        var vehicletaxpre = result.cxInfo.cxOffer.vehicletaxPre||0.00;      // 车船税
        var totalpre = result.cxInfo.cxOffer.totalpremium||0.00;            // 总保费

        var insuredname = result.cxInfo.cxParty.insuredname||"";            // 被保人姓名
        var insuredidcard = result.cxInfo.cxParty.insuredidno||"";          // 被保人身份证号
        var insuredmobile = result.cxInfo.cxParty.insuredmobile||"";        // 被保人手机号


        var viewData = {
        	"globalno":globalno,
            "orderstatus":orderstatus,
            "sessionid":sessionid,
            "mealname":mealname,

            "appno":appno,
            "polno":polno,
            "jqxappno":jqxappno,
            "jqxpolno":jqxpolno,
            "businessappno":businessappno,
            "businesspolno":businesspolno,

            "jqxpre":jqxpre,
            "businesspre":businesspre,
            "vehicletaxpre":vehicletaxpre,
            "totalpre":totalpre,

            "insuredname":insuredname,
            "insuredidcard":insuredidcard,
            "insuredmobile":insuredmobile,
        };

        reloadDetailView(viewData);
    };

    if(!isFake)
        ServiceSend.queryOrder(globalno,appno,polno,fun);
    else
        $.get("data/orderdata.json", fun);
}

function guide()
{
    var globalno = $("#globalno").text();
   
    var randomno = "";
    if(!isEmpty(globalno)) randomno = globalno;
    
    var url = rongstoneGuideUrl;
    url = url.replace("${RANDOMNO}", randomno);

    window.location.href = url;
}

function submit()
{
    var sessionid = $("#detail").attr("sessionid");
    window.location.href = "insureorderdetail.html?sessionid=" + sessionid;
}

function reloadDetailView(data)
{
	var globalno = data["globalno"];
    var orderstatus = data["orderstatus"];
    var sessionid = data["sessionid"];
    var mealname = data["mealname"];

    var appno = data["appno"];
    var polno = data["polno"];
    var jqxappno = data["jqxappno"];
    var jqxpolno = data["jqxpolno"];
    var businessappno = data["businessappno"];
    var businesspolno = data["businesspolno"];

    var jqxpre = data["jqxpre"];
    var businesspre = data["businesspre"];
    var vehicletaxpre = data["vehicletaxpre"];
    var totalpre = data["totalpre"];

    var insuredname = data["insuredname"];
    var insuredidcard = data["insuredidcard"];
    var insuredmobile = data["insuredmobile"];

    var statusname;
    switch(orderstatus)
    {
        case "02":statusname = "已过期";break;
        case "03":statusname = "核保失败";break;
        case "04":statusname = "核保中";break;
        case "05":statusname = "待支付";break;
        case "06":statusname = "承保失败";break;
        case "07":statusname = "承保中";break;
        case "09":statusname = "承保成功";break;
        case "10":statusname = "保障中";break;
        case "99":statusname = "已失效";break;
        default: statusname = "未知";
    }

    $("#globalno").text(globalno);
    $("#globalno").hide();
    $("#orderstatus").text(statusname);

    $("#totalpre").text(formatNumOfTwo(totalpre) + " 元");
    $("#businesspre").text(formatNumOfTwo(businesspre) + " 元");
    $("#jqxpre").text(formatNumOfTwo(jqxpre) + " 元");
    $("#vehicletaxpre").text(formatNumOfTwo(vehicletaxpre) + " 元");

    $("#appno").text(appno);
    $("#polno").text(polno);
    $("#jqxappno").text(jqxappno);
    $("#jqxpolno").text(jqxpolno);
    $("#businessappno").text(businessappno);
    $("#businesspolno").text(businesspolno);

    $("#insuredname").text(insuredname);
    $("#insuredidcard").text(insuredidcard);
    $("#insuredmobile").text(insuredmobile);

    $("#version").text(mealname);

    $("#insuretype").text("车险");
    $("#companytype").text("天安财险");
    $("#company").text("天安财险保险股份有限公司");

    $("#detail").attr("sessionid",sessionid);
}