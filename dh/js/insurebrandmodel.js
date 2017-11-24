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

function showHeader()
{
	var backflag = getUrlParam("backflag");
	if(backflag){
		 var citycode = getViewData("citycode");
		 if(citycode!="3110000"&&citycode!="3310000"){//非北京  非上海
			 var brandmodelname = getViewData("brandmodelname");
		     $(".demomodel").html(brandmodelname||"");
		     $("#tip").show();
		 }
	}
    if(isApp() == 'yes')
    {
        $("#header").hide();
        $("#main").css("margin-top","-35px");
        $("#record").css("margin-top",145+$("#tip").height()+10+"px");
    }
    else
    {
        $("#header").show();
        $("#main").css("margin-top","5px");
        $("#record").css("margin-top",180+$("#tip").height()+10+"px");
    }
}

function initData()
{
    if(!vaildateData()) return;

    function pullRefresh(callback){
        mui.init({
            pullRefresh : {
                container:"#record",
                up : {
                    contentrefresh: '上拉加载显示更多',
                    callback :callback
                }
            }
        });
    }

    pullRefresh(function(){

        var index = getViewData("brandmodelrecordindex") || "0";
        var total = getViewData("brandmodelrecordtotal") || "0";
        var indexpage = parseInt(index);
        var totalpage = parseInt((parseInt(total) - 1)/20) + 1;

        if(indexpage >= totalpage) mui.toast('没有更多数据了');

        setTimeout(function() {
            mui('#record').pullRefresh().endPullupToRefresh();
            if(totalpage > indexpage){
                doSearchBrandmodel(indexpage + 1);
            }
        }, 100);
    });

    reloadView();

    //清空 记录
    clearRecord();
    reloadRecordView();


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

    $("#brandmodelname input").unbind("blur").bind("blur",function() {
        mui('#record').scroll().scrollTo(0,0);      // 滚动到顶部
        saveBrandmodelname();
    });

    $("#brandmodelname label").unbind("tap").bind("tap",function() {
    	if(!vaildateData()) return;
        searchBrandmodelname();
    });

    $("#license").unbind("tap").bind("tap",function() {
        setViewData("openshadow","license");
        reloadView();
    });

    $("#licenseshadow").unbind("tap").bind("tap",function() {
        setViewData("openshadow","");
        reloadView();
    });

    $(".listtext").live("tap",function(event) {
        saveBrandmodel($(event.currentTarget.innerHTML));
    });
}

function jumpback()
{
    window.location.href = "insurecarinfo.html";
}

function saveBrandmodelname()
{
    setViewData("brandmodelname",$("#brandmodelname input").val());
    reloadView();

    //清空 记录
    clearRecord();
    reloadRecordView();
}

function clearRecord()
{
    setViewData("brandmodelrecord","[]");
    setViewData("brandmodelrecordtotal","0");
    setViewData("brandmodelrecordindex","0");
}

function searchBrandmodelname() {
    mui('#record').scroll().scrollTo(0,0);      // 滚动到顶部

    saveBrandmodelname();

    if (!checkChannel()) return;
    if (!checkCity()) return;
    if (!checkPlate()) return;
    if (!checkRackno()) return;
    if (!checkEngineno()) return;
    if (!checkRegistDate()) return;
    if (!checkTransferDate()) return;
    if (!checkBrandmodelName()) return;

    doSearchBrandmodel(1);
}

function saveBrandmodel(target)
{
    var brandname = target.attr("brandname");
    var seatcount = target.attr("seatcount");
    var vehiclemodeldata = target.attr("vehiclemodeldata");

    setViewData("brandmodel",brandname);
    setViewData("seatcount",seatcount);
    setViewData("vehiclemodeldata",vehiclemodeldata);
    setViewData("checkcode","");
    
    reloadView();

    //清除 套餐 setmeal
    var sessionid = getViewData("sessionid");
    delStorageData(sessionid + "meal1");
    delStorageData(sessionid + "meal2");
    delStorageData(sessionid + "meal3");

    window.location.href = "insurecarinfo.html";
}

function doSearchBrandmodel(index)
{
    // 方法定义
    var fun = function(result){
        if (result.status.statusCode != "000000") {
            muiAlert(result.status.statusMessage);
            return;
        }

        setViewData("checktradeno",result.status.returns.tradeNoDto.tradeNo|| "");
        setViewData("checkno",result.status.returns.tradeNoDto.checkNo|| "");
        setViewData("checkimg",result.status.returns.tradeNoDto.checkCode|| "");

        if (!isDefined(result.carsinfo.total) || result.carsinfo.total <= 0) {
            setViewData("brandmodelrecord","[]");
            setViewData("brandmodelrecordtotal",result.carsinfo.total);
            setViewData("brandmodelrecordindex","0");

            reloadRecordView();
            return;
        }

        var brandmodels = fillBrandmodelData(result.carsinfo.vehicleModelList);
        setViewData("brandmodelrecordtotal",result.carsinfo.total);
        setViewData("brandmodelrecordindex",index + "");

        setViewData("brandmodelrecord",JSON.stringify(brandmodels));
        reloadRecordView();
    };

    var channelcode = getViewData("channelcode");
    var citycode = getViewData("citycode");
    var isnewplate = getViewData("isnewplate");
    var plateno = getViewData("plateno");
    var rackno = getViewData("rackno");
    var engineno = getViewData("engineno");
    var registdate = getViewData("registdate");
    var brandmodelname = getViewData("brandmodelname");

    if(!isFake)
        ServiceSend.getBrandmodelList(channelcode,citycode,plateno,rackno,engineno,engineno,registdate,brandmodelname,index,fun);
    else
        $.get("data/brandmodeldata.json?1",fun);
}

function fillBrandmodelData(brandmodelList)
{
    var brandmodels = [];
    var brandmodel,brandname,vehiclestyle,purchaseprice,seatcount,marketDate;
    for(var index in brandmodelList)
    {
        brandmodel = brandmodelList[index];
        brandname = brandmodel.brandName || brandmodel.vehicleJingyouDto.vehicleName || "";
        vehiclestyle = brandmodel.vehicleStyleDesc || "";
        purchaseprice = brandmodel.purchasePrice || brandmodel.vehicleJingyouDto.price || "" + "";
        seatcount = brandmodel.seatCount + "";
        marketdate = brandmodel.marketDate || "";

        brandmodels.push(
        {
            'brandname':brandname,
            'brandstyle':vehiclestyle,
            'brandprice':purchaseprice,
            'seatcount':seatcount,
            'marketdate':marketdate,
            'vehiclemodeldata':JSON.stringify(brandmodel),
        });
    }
    return brandmodels;
}

var recordTemplate = $("#record li:first-child").clone();
$("#record ul").empty();

function fillList(datalist)
{
    var data;
    for(var index in datalist)
    {
        data = datalist[index];
        var record = recordTemplate.clone();
        if(index % 2 == 0)
            record.css("background-color","#fff");
        else
            record.css("background-color","#fafafa");

        record.children("div")
            .attr("brandname",data.brandname)
            .attr("seatcount",data.seatcount)
            .attr("vehiclemodeldata",data.vehiclemodeldata);

        var children = $(record.children("div")[0]).children("div");
        children[0].innerHTML = data.brandname + data.brandstyle;
        children[1].innerHTML = data.marketdate + "销售<br/>" + data.brandprice + "元";

        $("#record ul").append(record);
    }
}

function reloadRecordView()
{
   var brandmodelrecord = getViewData("brandmodelrecord");

    if(brandmodelrecord == "[]")
    {
        $("#record").hide();
        $("#record ul").empty();
        $("#unrecord").show();
    }
    else if(brandmodelrecord != "")
    {
        $("#unrecord").hide();
        fillList($.parseJSON(brandmodelrecord));
        $("#record").show();
    }
    else
    {
        $("#unrecord").hide();
        $("#record").hide();
    }
}

function reloadView()
{
    var brandmodelname = getViewData("brandmodelname");
    $("#brandmodelname input").val(brandmodelname||"");

    var openshadow = getViewData("openshadow");

    $("#licenseshadow").hide();
    if(openshadow == "license") $("#licenseshadow").show();
}