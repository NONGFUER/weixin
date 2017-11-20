document.write("<script language='javascript' src='js/mui/city.data-3.js' ></script>");
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

function setEvent()
{
    $("#addressname input").unbind("blur").bind("blur",function() {
        setViewData("addressname",$("#addressname input").val());
        reloadView();
    });

    $("#addressmobile input").unbind("blur").bind("blur",function() {
        setViewData("addressmobile",$("#addressmobile input").val());
        reloadView();
    });

    $("#addressinfo textarea").unbind("blur").bind("blur",function() {
        setViewData("addressinfo",$("#addressinfo textarea").val());
        reloadView();
    });

    $("#addressprovince").unbind("tap").bind("tap",function() {
        popProvinceCity();
    });

    $("#submit").unbind("tap").bind("tap",function() {
        submit();
    });
}

function popProvinceCity()
{
    var popPicker = new mui.PopPicker({layer: 3});
    popPicker.setData(cityData3);
    popPicker.show(function(items) {
        popPicker.dispose();
        var city  = (items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text;
        var currentcity = getViewData("addressprovince");

        if(currentcity == city) return;

        setViewData("addressprovince",city);
        reloadView();
    });
}

function submit()
{
    setViewData("addressname",$("#addressname input").val());
    setViewData("addressmobile",$("#addressmobile input").val());
    setViewData("addressinfo",$("#addressinfo textarea").val());

    reloadView();

    if(!checkAddressName()) return;
    if(!checkAddressMobile()) return;
    if(!checkAddressInfo()) return;

    submitServer(function (){
        window.location.href = "insurequote.html";
    });
}

function submitServer(callback)
{
    // 方法定义
    var fun = function(result){
        if (result.status.statusCode != "000000") {
            muiAlert(result.status.statusMessage);
            return;
        }
        callback();
    };

    var randomno = getViewData("randomno");
    var addressid = getViewData("addressid");
    var addressprovince = getViewData("addressprovince");
    var addressname = getViewData("addressname");
    var addressmobile = getViewData("addressmobile");
    var addressinfo = getViewData("addressinfo");

    if(isEmpty(addressid))
    {
        if(!isFake)
            ServiceSend.createAddress(randomno,addressprovince,addressname,addressmobile,addressinfo,fun);
        else
            $.get("data/brandmodeldata.json",fun);
    }
    else
    {
        if(!isFake)
            ServiceSend.editAddress(randomno,addressid,addressprovince,addressname,addressmobile,addressinfo,fun);
        else
            $.get("data/brandmodeldata.json",fun);
    }
}


function reloadView()
{
	var citycode = getViewData("citycode");
    var addressname = getViewData("addressname");
    var addressmobile = getViewData("addressmobile");
    var addressprovince = getViewData("addressprovince");
    var addressinfo = getViewData("addressinfo");

    $("#addressname input").val(addressname||"");
	$("#addressmobile input").val(addressmobile||"");
    $("#addressprovince input").val(addressprovince||"");
    $("#addressinfo textarea").text(addressinfo||"");
    
    if(citycode == "3110000")//北京
        $("#notice1").show();
    else
        $("#notice2").show();
}