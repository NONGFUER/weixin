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

    var istransfer = getViewData("istransfer");
    if(isEmpty(istransfer)) istransfer = "false";

    setViewData("istransfer",istransfer);

    var isforeign = getViewData("isforeign");
    if(isEmpty(isforeign)) isforeign = "false";

    setViewData("isforeign",isforeign);
    reloadView();
}

function vaildateData()
{
    var sessionid = getViewData("sessionid");
    var citycode = getViewData("citycode");

    if(isEmpty(sessionid) || isEmpty(citycode))
    {
        window.location.href = "insuremain.html";
        return false;
    }
    return true;
}

function setEvent()
{
    $("#back").unbind("tap").bind("tap",function() {
        jumpback();
    });

    $("#rackno input").unbind("blur").bind("blur",function() {
        saveRackno();
    });

    $("#engineno input").unbind("blur").bind("blur",function() {
        saveEngineno();
    });

    $("#registdate").unbind("tap").bind("tap",function() {
        popRegistAndTransferDate("registdate",$("#registdate input").val());
    });

    $("#istransfer .mui-switch").unbind("toggle").bind("toggle",function(){
        switchData("istransfer");
        reloadView();
    });

    $("#transferdate").unbind("tap").bind("tap",function() {
        popRegistAndTransferDate("transferdate",$("#transferdate input").val());
    });

    $("#brandmodel").unbind("tap").bind("tap",function() {
    	if(!vaildateData()) return;
        selectBrandModel();
    });

    $("#seatcount input").unbind("blur").bind("blur",function() {
        setViewData("seatcount",$("#seatcount input").val());
        reloadView();
    });

    $("#isforeign .mui-switch").unbind("toggle").bind("toggle",function(){
        switchData("isforeign");
        reloadView();
    });

    $("#fueltype").unbind("tap").bind("tap",function() {
        popFuelType();
    });

    $("#certificatetype").unbind("tap").bind("tap",function() {
        popCertificateType();
    });

    $("#certificateno input").unbind("blur").bind("blur",function() {
        setViewData("certificateno",$("#certificateno input").val());
        reloadView();
    });

    $("#certificatedate").unbind("tap").bind("tap",function() {
        var beginDate = addYear(new Date(),-20);
        var endDate = new Date();
        popPickerDate("certificatedate",$("#certificatedate input").val(),beginDate,endDate,function () {
            reloadView();
        });
    });

    $("#checkcode input").unbind("blur").bind("blur",function() {
        setViewData("checkcode",$("#checkcode input").val());
        reloadView();
    });

    $("#checkcode img").unbind("tap").bind("tap",function() {
    	if(!vaildateData()) return;
        searchCheckImg();
    });

    $("#ownername input").unbind("blur").bind("blur",function() {
        setViewData("ownername",$("#ownername input").val());
        reloadView();
    });

    $("#ownermobile input").unbind("blur").bind("blur",function() {
        setViewData("ownermobile",$("#ownermobile input").val());
        reloadView();
    });

    $("#owneremail input").unbind("blur").bind("blur",function() {
        setViewData("owneremail",$("#owneremail input").val());
        reloadView();
    });

    $("#owneridcard input").unbind("blur").bind("blur",function() {
        setViewData("owneridcard",$("#owneridcard input").val());
        reloadView();
    });

    $("#owneridbegindate").unbind("tap").bind("tap",function() {
        // 需要先填写 身份证
        if(!checkOwnerIdCard()) return;

        var beginDate = addYear(new Date(),-30);
        var endDate = new Date();
        popPickerDate("owneridbegindate",$("#owneridbegindate input").val(),beginDate,endDate,function(){
            var owneridbegindate = getViewData("owneridbegindate");
            if(isEmpty(owneridbegindate)) return;

            var owneridcard = getViewData("owneridcard");
            var expiretime = getExpireTimeByidcard(owneridcard);

            owneridenddate = addYear(owneridbegindate,expiretime).Format("yyyy-MM-dd");
            setViewData("owneridenddate",owneridenddate);
            reloadView();
        });
    });

    $("#owneridenddate").unbind("tap").bind("tap",function() {
        // 需要先填写 身份证 和 开始时间
        if(!checkOwnerIdCard()) return;
        if(!checkOwnerIdBeginDate()) return;

        var beginDate = new Date();
        var endDate = addYear(new Date(),30);
        popPickerDate("owneridenddate",$("#owneridenddate input").val(),beginDate,endDate,function () {
            reloadView();
        });
    });

    $("#ownernation").unbind("tap").bind("tap",function() {
        popOwnerNation();
    });

    $("#ownerpublish input").unbind("blur").bind("blur",function() {
        setViewData("ownerpublish",$("#ownerpublish input").val());
        reloadView();
    });

    $("#license").unbind("tap").bind("tap",function() {
        setViewData("openshadow","license");
        reloadView();
    });

    $("#licenseshadow").unbind("tap").bind("tap",function() {
        setViewData("openshadow","");
        reloadView();
    });

    $("#contract").unbind("tap").bind("tap",function() {
        setViewData("openshadow","contract");
        reloadView();
    });

    $("#contractshadow").unbind("tap").bind("tap",function() {
        setViewData("openshadow","");
        reloadView();
    });

    $("#idcard").unbind("tap").bind("tap",function() {
        setViewData("openshadow","idcard");
        reloadView();
    });

    $("#idcardshadow").unbind("tap").bind("tap",function() {
        setViewData("openshadow","");
        reloadView();
    });

    $("#submit").unbind("tap").bind("tap",function() {
    	if(!vaildateData()) return;
        submit();
    });
}

function jumpback()
{
    var randomno = getViewData("randomno");
    window.location.href = "insuremain.html?randomno=" + randomno;
}

function saveRackno()
{
    if (isChangeViewData("rackno",$("#rackno input").val())) {
        setViewData("rackno",$("#rackno input").val());

        //需要 改变 的变量
        setViewData("brandmodel", "");
        reloadView();
    }
}

function saveEngineno()
{
    if (isChangeViewData("engineno",$("#engineno input").val())) {
        setViewData("engineno",$("#engineno input").val());

        //需要 改变 的变量
        setViewData("brandmodel", "");
        reloadView();
    }
}

function popRegistAndTransferDate(name,value)
{
    var date = value;
	if(isEmpty(date)) date = new Date().Format("yyyy-MM-dd");

    var beginDate = addYear(new Date(),-20);
    var endDate = addDate(-1);          //T - 1

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

        //需要 改变 的变量
        setViewData("brandmodel", "");
        reloadView();
    })
}

function selectBrandModel()
{
    setViewData("rackno",$("#rackno input").val());
    setViewData("engineno",$("#engineno input").val());

    if(!checkChannel()) return;
    if(!checkCity()) return;
    if(!checkPlate()) return;
    if(!checkRackno()) return;
    if(!checkEngineno()) return;
    if(!checkRegistDate()) return;
    if(!checkTransferDate()) return;

    window.location.href = "insurebrandmodel.html";
}

function popFuelType()
{
    // 方法定义
    var fun = function (result){
        if (result.statusCode != "000000") {
            muiAlert(result.statusMessage);
            return;
        }

        var datas = result.returns.cacheValue;
        // JSON字符串转Json
        if (typeof datas == "string") datas = $.parseJSON(datas);

        var fuels = fillPopPickerData(datas,"text","value");

        var popPicker = new mui.PopPicker();
        popPicker.setData(fuels);
        popPicker.show(function(items) {
            popPicker.dispose();

            var fueltype = items[0];
            var fueltypename = fueltype.text;
            var fueltypecode = fueltype.value;
            var currentfueltypecode = getViewData("fueltypecode");

            if(currentfueltypecode == fueltypecode) return;

            var data = {
                "fueltypename":fueltypename,
                "fueltypecode":fueltypecode,
            };

            setViewDatas(data);
            reloadView();
        });
    };

    if (!isFake)
        ServiceSend.getFuelList(fun);
    else
        $.get("data/fueldata.json", fun);
}

function popCertificateType()
{
    // 方法定义
    var fun = function (result){
        if (result.statusCode != "000000") {
            muiAlert(result.statusMessage);
            return;
        }

        var datas = result.returns.cacheValue;
        // JSON字符串转Json
        if (typeof datas == "string") datas = $.parseJSON(datas);

        var certificates = fillPopPickerData(datas,"text","value");

        var popPicker = new mui.PopPicker();
        popPicker.setData(certificates);
        popPicker.show(function(items) {
            popPicker.dispose();

            var certificatetype = items[0];
            var certificatetypename = certificatetype.text;
            var certificatetypecode = certificatetype.value;
            var currentcertificatetypecode = getViewData("certificatetypecode");

            if(currentcertificatetypecode == certificatetypecode) return;

            var data = {
                "certificatetypename":certificatetypename,
                "certificatetypecode":certificatetypecode,
            };

            setViewDatas(data);
            reloadView();
        });
    };

    if (!isFake)
        ServiceSend.getCertificateList(fun);
    else
        $.get("data/certificatedata.json", fun);
}

function popOwnerNation()
{
    // 方法定义
    var fun = function (result){
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
            var currentnation = getViewData("ownernation");

            if(currentnation == nationtext) return;

            setViewData("ownernation",nationtext);
            reloadView();
        });
    };

    if (!isFake)
        ServiceSend.getNationList(fun);
    else
        $.get("data/nationdata.json", fun);
}

function searchCheckImg()
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
        setViewData("checkcode","");
        
        reloadView();
    };

    var channelcode = getViewData("channelcode");
    var citycode = getViewData("citycode");
    var isnewplate = getViewData("isnewplate");
    var plateno = getViewData("plateno");
    var rackno = getViewData("rackno");
    var engineno = getViewData("engineno");
    var registdate = getViewData("registdate");
    var brandmodelname = getViewData("brandmodelname");

    var index = 1;

    if (!isFake)
        ServiceSend.getBrandmodelList(channelcode,citycode,plateno,rackno,engineno,engineno,registdate,brandmodelname,index,fun);
    else
        $.get("data/brandmodeldata.json", fun);
}

function submit()
{
    setViewData("rackno",$("#rackno input").val());
    setViewData("engineno",$("#engineno input").val());
    setSwitchData("istransfer");
    setSwitchData("isforeign");
    setViewData("seatcount",$("#seatcount input").val());
    setViewData("checkcode",$("#checkcode input").val());
    setViewData("certificateno",$("#certificateno input").val());
    setViewData("ownername",$("#ownername input").val());
    setViewData("ownermobile",$("#ownermobile input").val());
    setViewData("owneremail",$("#owneremail input").val());
    setViewData("owneridcard",$("#owneridcard input").val());
    setViewData("ownerpublish",$("#ownerpublish input").val());

    reloadView();

    if(!checkRackno()) return;
    if(!checkEngineno()) return;
    if(!checkRegistDate()) return;
    if(!checkTransferDate()) return;
    if(!checkBrandmodel()) return;
    if(!checkSeatcount()) return;
    if(!checkFuelType()) return;
    if(!checkCertificateType()) return;
    if(!checkCertificateNo()) return;
    if(!checkCertificateDate()) return;
    if(!checkCheckCode()) return;
    if(!checkOwnerName()) return;
    if(!checkOwnerMobile()) return;
    if(!checkOwnerEmail()) return;
    if(!checkOwnerIdCard()) return;
    if(!checkOwnerIdBeginDate()) return;
    if(!checkOwnerIdEndDate()) return;
    if(!checkOwnerNation()) return;
    if(!checkOwnerPublish()) return;

    submitServer(function (){
        window.location.href = "insurecoverage.html";
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

        setViewData("sessionid",result.sessionId);
        reloadView();

        callback();
    };

    var randomno = getViewData("randomno");
    var sessionid = getViewData("sessionid");
    var channelcode = getViewData("channelcode");
    var isnewplate = getViewData("isnewplate");
    var plateno = getViewData("plateno");
    var provincecode = getViewData("provincecode");
    var provincename = getViewData("provincename");
    var citycode = getViewData("citycode");
    var cityname = getViewData("cityname");
    var rackno = getViewData("rackno");
    var engineno = getViewData("engineno");
    var istransfer = getViewData("istransfer");
    var isforeign = getViewData("isforeign");
    var registdate = getViewData("registdate");
    var transferdate = getViewData("transferdate");
    var brandmodel = getViewData("brandmodel");
    var seatcount = getViewData("seatcount");
    var fueltypecode = getViewData("fueltypecode");
    var fueltypename = getViewData("fueltypename");
    var certificatetypecode = getViewData("certificatetypecode");
    var certificatetypename = getViewData("certificatetypename");
    var certificateno = getViewData("certificateno");
    var certificatedate = getViewData("certificatedate");
    var ownername = getViewData("ownername");
    var ownermobile = getViewData("ownermobile");
    var owneremail = getViewData("owneremail");
    var owneridcard = getViewData("owneridcard");
    var owneridbegindate = getViewData("owneridbegindate");
    var owneridenddate = getViewData("owneridenddate");
    var ownernation = getViewData("ownernation");
    var ownerpublish = getViewData("ownerpublish");
    var checktradeno = getViewData("checktradeno");
    var checkno = getViewData("checkno");
    var checkcode = getViewData("checkcode");
    var vehiclemodeldata = getViewData("vehiclemodeldata");

    if (!isFake)
        ServiceSend.saveFullCarInfo
        (randomno,sessionid,channelcode,isnewplate,plateno,provincecode,provincename,citycode,cityname,
        rackno,engineno,istransfer,isforeign,registdate,transferdate,brandmodel,seatcount,
        fueltypecode,fueltypename,certificatetypecode,certificatetypename,certificateno,certificatedate,
        ownername,ownermobile,owneremail,owneridcard,owneridbegindate,owneridenddate,ownernation,ownerpublish,
        checktradeno,checkno,checkcode,vehiclemodeldata,fun);
    else
        $.get("data/savecarinfodata.json", fun);
}

function reloadView()
{
    var citycode = getViewData("citycode");
    var isnewplate = getViewData("isnewplate");
    var rackno = getViewData("rackno");
    var engineno = getViewData("engineno");
    var istransfer = getViewData("istransfer");
    var isforeign = getViewData("isforeign");
    var registdate = getViewData("registdate");
    var transferdate = getViewData("transferdate");
    var brandmodel = getViewData("brandmodel");
    var seatcount = getViewData("seatcount");
    var fueltypename = getViewData("fueltypename");
    var certificatetypename = getViewData("certificatetypename");
    var certificateno = getViewData("certificateno");
    var certificatedate = getViewData("certificatedate");
    var checkimg = getViewData("checkimg");
    var checkcode = getViewData("checkcode");

    var ownername = getViewData("ownername");
    var ownermobile = getViewData("ownermobile");
    var owneremail = getViewData("owneremail");
    var owneridcard = getViewData("owneridcard");
    var owneridbegindate = getViewData("owneridbegindate");
    var owneridenddate = getViewData("owneridenddate");
    var ownernation = getViewData("ownernation");
    var ownerpublish = getViewData("ownerpublish");

    var openshadow = getViewData("openshadow");

    $("#licenseshadow").hide();
    $("#idcardshadow").hide();
    $("#contractshadow").hide();

    if(openshadow == "license")  $("#licenseshadow").show();
    if(openshadow == "idcard") $("#idcardshadow").show();
    if(openshadow == "contract") $("#contractshadow").show();

    if(isforeign == "true")
        $("#isforeign .mui-switch").addClass("mui-active");
    else
        $("#isforeign .mui-switch").removeClass("mui-active");

    if(istransfer == "true") {
        $("#transferdate").show();
        $("#istransfer .mui-switch").addClass("mui-active");
    }
    else {
        $("#transferdate").hide();
        $("#istransfer .mui-switch").removeClass("mui-active");
    }

    $("#rackno input").val(rackno||"");
	$("#engineno input").val(engineno||"");
    $("#registdate input").val(registdate||"");
    $("#transferdate input").val(transferdate||"");
    $("#brandmodel input").val(brandmodel||"");
    $("#seatcount input").val(seatcount||"");
    $("#fueltype input").val(fueltypename||"");
    $("#certificatetype input").val(certificatetypename||"");
    $("#certificateno input").val(certificateno||"");
    $("#certificatedate input").val(certificatedate||"");
    $("#checkcode input").val(checkcode||"");

    $("#ownername input").val(ownername||"");
    $("#ownermobile input").val(ownermobile||"");
    $("#owneremail input").val(owneremail||"");
    $("#owneridcard input").val(owneridcard||"");
    $("#owneridbegindate input").val(owneridbegindate||"");
    $("#owneridenddate input").val(owneridenddate||"");
    $("#ownernation input").val(ownernation||"");
    $("#ownerpublish input").val(ownerpublish||"");


    if(isEmpty(checkimg)) {
        $("#checkcode").hide();
        $("#checkcode img").attr("src","");
    }else{
        $("#checkcode").show();
        $("#checkcode img").attr("src","data:image/png;base64," + checkimg);
    }

    if(citycode == "3440300"||citycode == "3110000")//深圳 北京
    {
        $("#owneremail").show();
    }
    else
    {
        $("#owneremail").hide();
    }

    if(citycode == "3110000")//北京
    {
        $("#certificate").show();
        $("#certificate").prev("br").show();
        $("#fueltype").show();
        $("#owneridbegindate").show();
        $("#owneridenddate").show();
        $("#ownernation").show();
        $("#ownerpublish").show();

        if(isnewplate == "true")
        {
            $("#certificatetype").show();
            $("#certificateno").show();
            $("#certificatedate").show();
        }
        else
        {
            $("#certificatetype").hide();
            $("#certificateno").hide();
            $("#certificatedate").hide();
        }
    }
    else
    {
        $("#certificate").hide();
        $("#certificate").prev("br").hide();

        $("#certificatetype").hide();
        $("#certificateno").hide();
        $("#certificatedate").hide();

        $("#fueltype").hide();
        $("#owneridbegindate").hide();
        $("#owneridenddate").hide();
        $("#ownernation").hide();
        $("#ownerpublish").hide();
    }
}