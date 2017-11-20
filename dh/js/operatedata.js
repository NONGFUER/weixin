function initViewData(randomno,callback)
{
    sessionStorage.setItem("randomno",randomno);
    var currentdata = sessionStorage.getItem(randomno);

    if(currentdata != null) {
        callback();
        return;
    }
    queryHistory(randomno,callback);
}

function queryHistory(randomno,callback) {
    // 方法定义
    var fun = function (result) {
        if (result.statusCode != "000000") {
            muiAlert(result.statusMessage);
            callback();
            return;
        }

        if(!isDefined(result.returns.cxCarMessage)
            || !isDefined(result.returns.cxChannel)
            || !isDefined(result.returns.cxProvince)
            || !isDefined(result.returns.cxOrder))
        {
            callback();
            return;
        }

        //在这里 加载所有数据

        var isnewplate = (result.returns.cxOrder.newcarFlag == "1")?"true":"false";
        var plateno = isnewplate == "true"?"":result.returns.cxOrder.plateno;

        var registdate = result.returns.cxCarMessage.registerDate||"";
        registdate = registdate.length > 10?registdate.substr(0,10):registdate;
        var transferdate = result.returns.cxCarMessage.transferDate||"";
        transferdate = transferdate.length > 10?transferdate.substr(0,10):transferdate;

        var certificatedate = result.returns.cxCarMessage.certificateDate||"";
        certificatedate = certificatedate.length > 10?certificatedate.substr(0,10):certificatedate;

        var owneridbegindate = result.returns.cxOrder.certiStartdate||"";
        owneridbegindate = owneridbegindate.length > 10?owneridbegindate.substr(0,10):owneridbegindate;
        var owneridenddate = result.returns.cxOrder.certiEnddate||"";
        owneridenddate = owneridenddate.length > 10?owneridenddate.substr(0,10):owneridenddate;

        var data = {
            "channelcode":result.returns.cxChannel.channelCode||"",
            "channelname":result.returns.cxChannel.channelName||"",
            "provincename":result.returns.cxProvince.cxProvinceName||"",
            "provincecode":result.returns.cxProvince.cxProvinceId||"",
            "cityname":result.returns.cxProvince.cxCityName||"",
            "citycode":result.returns.cxProvince.cxCityCode||"",
            "platename":result.returns.cxProvince.carPlate||"",
            "isnewplate":isnewplate,
            "plateno":plateno,

            "sessionid":result.returns.cxOrder.sessionid||"",
            "rackno":result.returns.cxCarMessage.rackNo||"",
            "engineno":result.returns.cxCarMessage.engineNo||"",
            "istransfer":result.returns.cxCarMessage.transferFlag == "1"?"true":"false",
            "isforeign":result.returns.cxCarMessage.ecdemicVehicleFlag == "1"?"true":"false",
            "registdate":registdate,
            "transferdate":transferdate,

            "brandmodelname":result.returns.cxCarMessage.vehicleBrand||"",
            "seatcount":parseInt(result.returns.cxCarMessage.seats||"0") + "",
            "fueltypecode":result.returns.cxCarMessage.fuelType||"",
            "fueltypename":result.returns.cxCarMessage.fuelTypeName||"",
            "certificatetypecode":result.returns.cxCarMessage.certificateType||"",
            "certificatetypename":result.returns.cxCarMessage.certificateTypeName||"",
            "certificateno":result.returns.cxCarMessage.certificateNo||"",
            "certificatedate":certificatedate,

            "ownername":result.returns.cxOrder.ownerName||"",
            "ownermobile":result.returns.cxOrder.ownerMobile||"",
            "owneremail":result.returns.cxOrder.ownerEmail||"",
            "owneridcard":result.returns.cxOrder.ownerIdno||"",
            "ownernation":result.returns.cxOrder.nation||"",
            "ownerpublish":result.returns.cxOrder.issuerAuthority||"",
            "owneridbegindate":owneridbegindate,
            "owneridenddate":owneridenddate,
        };

        setViewDatas(data);
        callback();
    };

    if (!isFake)
        ServiceSend.queryHistory(randomno, fun);
    else
        $.get("data/historydata.json", fun);
}

function saveUrlInfo() {
    var plateno = getUrlParam("plateno");
    var rackno = getUrlParam("rackno");
    var engineno = getUrlParam("engineno");
    var brandmodelname = getUrlParam("brandmodelname");
    var registdate = getUrlParam("registdate");

    if (isEmpty(plateno)) return;
    var data = {
        "urlplateno": plateno,
        "urlrackno": rackno,
        "urlengineno": engineno,
        "urlbrandmodelname": brandmodelname,
        "urlregistdate": registdate,
    };

    setViewDatas(data);
}

function loadUrlInfo(plateno) {
    var urlplateno = getViewData("urlplateno");
    var urlrackno = getViewData("urlrackno");
    var urlengineno = getViewData("urlengineno");
    var urlbrandmodelname = getViewData("urlbrandmodelname");
    var urlregistdate = getViewData("urlregistdate");

    if (isEmpty(plateno)) return;
    if (isEmpty(urlplateno)) return;
    if (plateno != urlplateno) return;
    
    var data = {
        "rackno": urlrackno,
        "engineno": urlengineno,
        "brandmodelname": urlbrandmodelname,
        "registdate": urlregistdate,
    };

    setViewDatas(data);
}

function setStorageData(name, value)
{
    if(typeof value != "string") value = JSON.stringify(value);
    sessionStorage.setItem(name,value);
}

function getStorageData(name)
{
    if(isEmpty(name)) return "";

    var data = sessionStorage.getItem(name);
    if(isEmpty(data)) return null;
    return $.parseJSON(data);
}

function delStorageData(name)
{
    sessionStorage.removeItem(name);
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

function setSwitchData(name)
{
    var value = getViewData(name);
    if(!isDefined(value)) value = "false";

    var data = {};
    data[name] = value;
    setViewDatas(data);
}

//判断 数据是否改变
function isChangeViewData(name, newValue)
{
    var oldValue = getViewData(name);
    return newValue != oldValue;
}

function setViewData(name, value)
{
    var data = {};
    data[name] = charEntities(value);
    setViewDatas(data);
}

function setViewDatas(data)
{
    if(data == null) return;

    var randomno = sessionStorage.getItem("randomno");
    var currentdata = sessionStorage.getItem(randomno);
    if(isEmpty(currentdata)) currentdata = "{}";

    currentdata = $.parseJSON(currentdata);

    for(var key in data){
        currentdata[key] = charEntities(data[key]);
    }

    sessionStorage.setItem(randomno,JSON.stringify(currentdata));
}

function getViewData(name)
{
    if(isEmpty(name)) return "";

    var randomno = sessionStorage.getItem("randomno");
    var currentdata = sessionStorage.getItem(randomno);
    if(isEmpty(currentdata)) return "";

    currentdata = $.parseJSON(currentdata);

    return currentdata[name]||"";
}

function setRiskData(name,value)
{
    var data = {};
    data[name] = value;
    setRiskDatas(data);
}

function setRiskDatas(data)
{
    if(data == null) return;

    var risk = sessionStorage.getItem("risk");
    if(isEmpty(risk)) risk = "{}";

    risk = $.parseJSON(risk);

    for(var key in data){
        risk[key] = data[key];
    }
    sessionStorage.setItem("risk",JSON.stringify(risk));
}

function getRiskData(name)
{
    if(isEmpty(name)) return "";

    var risk = sessionStorage.getItem("risk");
    if(isEmpty(risk)) return "";

    risk = $.parseJSON(risk);

    return risk[name]||"";
}

function fillPopPickerData(datas,textname,valuename)
{
    var datalist = new Array();
    for(var index in datas)
    {
        datalist.push({"text":datas[index][textname],"value":datas[index][valuename],"json":JSON.stringify(datas[index])});
    }
    return datalist;
}

function popPickerDate(name,value,beginDate,endDate,callback)
{
    var date = value;
    if(isEmpty(value)) date = new Date().Format("yyyy-MM-dd");

    if(!isDefined(beginDate)) beginDate = addYear(new Date(),-30);
    if(!isDefined(endDate)) endDate = addYear(new Date(),30);

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

        // 这里 可以对自动填充身份证 的结束时间 以及刷新
        callback();
    })
}

function checkChannel()
{
    var channelcode = getViewData("channelcode");

    if (isEmpty(channelcode)) {
        muiAlert("请选择渠道！");
        return false;
    }
    return true;
}

function checkProvince()
{
    var provincecode = getViewData("provincecode");

    if (isEmpty(provincecode)) {
        muiAlert("请选择省份！");
        return false;
    }
    return true;
}

function checkCity()
{
    var citycode = getViewData("citycode");

    if (isEmpty(citycode)) {
        muiAlert("请选择城市！");
        return false;
    }
    return true;
}

function checkPlate()
{
    if($("#plateno input").length > 0) setViewData("plateno",$("#plateno input").val());
    var plateno = getViewData("plateno");

    var isnewplate = getViewData("isnewplate");
    if (isnewplate != "true")
    {
        if (plateno.length <= 2) {
            muiAlert("请输入车牌号码，或勾选新车未上牌！",function () {
                if($("#plateno input").length > 0) $("#plate input").focus();
            });
            return false;
        }
        if (!regex.plateno.test(plateno)) {
            muiAlert("车牌号码格式不正确！", function () {
                if($("#plateno input").length > 0) $("#plate input").focus();
            });
            return false;
        }
    }
    return true;
}

function checkRackno()
{
    if($("#rackno input").length > 0) setViewData("rackno",$("#rackno input").val());
    var rackno = getViewData("rackno");

    if(isEmpty(rackno))
    {
        muiAlert("请输入车辆识别代码！",function () {
            if($("#rackno input").length > 0) $("#rackno input").focus();
        });
        return false;
    }
    if(!regex.rackno.test(rackno)) {
        muiAlert("车辆识别代码格式不正确！",function () {
            if($("#rackno input").length > 0) $("#rackno input").focus();
        });
        return false;
    }
    return true;
}

function checkEngineno()
{
    if($("#engineno input").length > 0) setViewData("engineno",$("#engineno input").val());
    var engineno = getViewData("engineno");

    if(isEmpty(engineno))
    {
        muiAlert("请输入发动机号！",function () {
            if($("#engineno input").length > 0) $("#engineno input").focus();
        });
        return false;
    }
    if(!regex.engineno.test(engineno)) {
        muiAlert("发动机号格式不正确！",function () {
            if($("#engineno input").length > 0) $("#engineno input").focus();
        });
        return false;
    }
    return true;
}

function checkRegistDate()
{
    var registdate = getViewData("registdate");

    if(isEmpty(registdate))
    {
        muiAlert("请选择车辆注册日期！");
        return false;
    }
    if(!regex.date.test(registdate)) {
        muiAlert("请选择车辆注册日期！");
        return false;
    }
    return true;
}

function checkTransferDate()
{
    var transferdate = getViewData("transferdate");

    var istransfer = getViewData("istransfer");
    if (istransfer == "true")
    {
        if(isEmpty(transferdate))
        {
            muiAlert("请选择车辆过户日期！");
            return false;
        }
        if(!regex.date.test(transferdate)) {
            muiAlert("请选择车辆过户日期！");
            return false;
        }
    }
    return true;
}

function checkBrandmodelName()
{
    if($("#brandmodelname input").length > 0) setViewData("brandmodelname",$("#brandmodelname input").val());
    var brandmodelname = getViewData("brandmodelname");

    if (isEmpty(brandmodelname)) {
        muiAlert("请输入搜索的品牌型号！",function () {
            if($("#brandmodelname input").length > 0) $("#brandmodelname input").focus();
        });
        return false;
    }
    return true;
}

function checkBrandmodel()
{
    var brandmodel = getViewData("brandmodel");

    if (isEmpty(brandmodel)) {
        muiAlert("请输入搜索的品牌型号！");
        return false;
    }
    return true;
}

function checkSeatcount()
{
    if($("#seatcount input").length > 0) setViewData("seatcount",$("#seatcount input").val());
    var seatcount = getViewData("seatcount");

    if (isEmpty(seatcount)) {
        muiAlert("请输入座位数！",function () {
            if($("#seatcount input").length > 0) $("#seatcount input").focus();
        });
        return false;
    }
    if(!regex.seatcount.test(seatcount)) {
        muiAlert("请输入座位数！",function () {
            if($("#seatcount input").length > 0) $("#seatcount input").focus();
        });
        return false;
    }
    return true;
}

function checkFuelType()
{
    var fueltypecode = getViewData("fueltypecode");

    var citycode = getViewData("citycode");
    if(citycode == "3110000")//北京
    {
        if (isEmpty(fueltypecode)) {
            muiAlert("请选择车辆能源种类！");
            return false;
        }
    }
    return true;
}

function checkCertificateType()
{
    var certificatetypecode = getViewData("certificatetypecode");

    var isnewplate = getViewData("isnewplate");
    var citycode = getViewData("citycode");
    if(citycode == "3110000")//北京
    {
        if(isnewplate == "true")
        {
            if (isEmpty(certificatetypecode)) {
                muiAlert("请选择车辆来历凭证种类！");
                return false;
            }
        }
    }
    return true;
}

function checkCertificateNo()
{
    if($("#certificateno input").length > 0) setViewData("certificateno",$("#certificateno input").val());
    var certificateno = getViewData("certificateno");

    var isnewplate = getViewData("isnewplate");
    var citycode = getViewData("citycode");
    if(citycode == "3110000")//北京
    {
        if(isnewplate == "true")
        {
            if (isEmpty(certificateno)) {
                muiAlert("请输入车辆来历凭证编号！",function () {
                    if($("#certificateno input").length > 0) $("#certificateno input").focus();
                });
                return false;
            }
            if (certificateno.length < 4) {
                muiAlert("请正确填写车辆来历凭证编号！",function () {
                    if($("#certificateno input").length > 0) $("#certificateno input").focus();
                });
                return false;
            }
        }
    }
    return true;
}

function checkCertificateDate()
{
    var certificatedate = getViewData("certificatedate");

    var isnewplate = getViewData("isnewplate");
    var citycode = getViewData("citycode");
    if(citycode == "3110000")//北京
    {
        if(isnewplate == "true")
        {
            if (isEmpty(certificatedate)) {
                muiAlert("请选择车辆来历凭证所载日期！");
                return false;
            }
            if(!regex.date.test(certificatedate)) {
                muiAlert("请选择车辆来历凭证所载日期！");
                return false;
            }
        }
    }
    return true;
}

function checkCheckCode()
{
    if($("#checkcode input").length > 0) setViewData("checkcode",$("#checkcode input").val());
    var checkcode = getViewData("checkcode");

    var checkimg = getViewData("checkimg");
    if(!isEmpty(checkimg))
    {
        if (isEmpty(checkcode)) {
            muiAlert("请输入验证码！",function () {
                if($("#checkcode input").length > 0) $("#checkcode input").focus();
            });
            return false;
        }
    }
    return true;
}

function checkOwnerName()
{
    if($("#ownername input").length > 0) setViewData("ownername",$("#ownername input").val());
    var ownername = getViewData("ownername");

    if(isEmpty(ownername))
    {
        muiAlert("请输入车主姓名！",function () {
            if($("#ownername input").length > 0) $("#ownername input").focus();
        });
        return false;
    }
    if(!regex.chinese.test(ownername))
    {
        muiAlert("请正确填写车主姓名<br/>仅可以填写中文！",function () {
            if($("#ownername input").length > 0) $("#ownername input").focus();
        });
        return false;
    }
    return true;
}

function checkOwnerMobile()
{
    if($("#ownermobile input").length > 0) setViewData("ownermobile",$("#ownermobile input").val());
    var ownermobile = getViewData("ownermobile");

    if(isEmpty(ownermobile))
    {
        muiAlert("请输入车主手机号码！",function () {
            if($("#ownermobile input").length > 0) $("#ownermobile input").focus();
        });
        return false;
    }
    if(!regex.mobile.test(ownermobile))
    {
        muiAlert("请正确填写车主手机号码<br/>手机号码格式错误！",function () {
            if($("#ownermobile input").length > 0) $("#ownermobile input").focus();
        });
        return false;
    }
    return true;
}

function checkOwnerEmail()
{
    if($("#owneremail input").length > 0) setViewData("owneremail",$("#owneremail input").val());
    var owneremail = getViewData("owneremail");

    var citycode = getViewData("citycode");
    if(citycode == "3110000" || citycode == "3440300")//北京 深圳
    {
        if(isEmpty(owneremail))
        {
            muiAlert("请输入车主邮箱！",function () {
                if($("#owneremail input").length > 0) $("#owneremail input").focus();
            });
            return false;
        }
        if(!regex.email.test(owneremail))
        {
            muiAlert("请正确填写车主邮箱<br/>邮箱格式错误！",function () {
                if($("#owneremail input").length > 0) $("#owneremail input").focus();
            });
            return false;
        }
    }
    return true;
}

function checkOwnerIdCard()
{
    if($("#owneridcard input").length > 0) setViewData("owneridcard",$("#owneridcard input").val());
    var owneridcard = getViewData("owneridcard");

    if(isEmpty(owneridcard))
    {
        muiAlert("请输入车主身份证号！",function () {
            if($("#owneridcard input").length > 0) $("#owneridcard input").focus();
        });
        return false;
    }

    if(testIdCard(owneridcard) != 0)
    {
        muiAlert("请正确填写车主身份证号<br/>身份证号格式错误！",function () {
            if($("#owneridcard input").length > 0) $("#owneridcard input").focus();
        });
        return false;
    }

    if(getAgeByidcard(owneridcard) < 18)
    {
        muiAlert("车主身份证未满18周岁！",function () {
            if($("#owneridcard input").length > 0) $("#owneridcard input").focus();
        });
        return false;
    }

    return true;
}

function checkOwnerIdBeginDate()
{
    var owneridbegindate = getViewData("owneridbegindate");

    var citycode = getViewData("citycode");
    if(citycode == "3110000")//北京
    {
        if(isEmpty(owneridbegindate))
        {
            muiAlert("请选择身份证有效起期！");
            return false;
        }
        if(!regex.date.test(owneridbegindate)) {
            muiAlert("请选择身份证有效起期！");
            return false;
        }
    }
    return true;
}

function checkOwnerIdEndDate()
{
    var owneridenddate = getViewData("owneridenddate");

    var citycode = getViewData("citycode");
    if(citycode == "3110000")//北京
    {
        if(isEmpty(owneridenddate))
        {
            muiAlert("请选择身份证有效止期！");
            return false;
        }
        if(!regex.date.test(owneridenddate)) {
            muiAlert("请选择身份证有效止期！");
            return false;
        }
    }
    return true;
}

function checkOwnerNation()
{
    var ownernation = getViewData("ownernation");

    var citycode = getViewData("citycode");
    if(citycode == "3110000")//北京
    {
        if(isEmpty(ownernation))
        {
            muiAlert("请选择身份证民族！");
            return false;
        }
    }
    return true;
}

function checkOwnerPublish()
{
    if($("#ownerpublish input").length > 0) setViewData("ownerpublish",$("#ownerpublish input").val());
    var ownerpublish = getViewData("ownerpublish");

    var citycode = getViewData("citycode");
    if(citycode == "3110000")//北京
    {
        if(isEmpty(ownerpublish))
        {
            muiAlert("请选择身份证签发机构！",function () {
                if($("#ownerpublish input").length > 0) $("#ownerpublish input").focus();
            });
            return false;
        }
        if(!regex.publish.test(ownerpublish))
        {
            muiAlert("请正确填写身份证签发机构<br/>填写中文！",function () {
                if($("#ownerpublish input").length > 0) $("#ownerpublish input").focus();
            });
            return false;
        }
    }
    return true;
}

function checkInsuredName()
{
    if($("#insuredname input").length > 0) setViewData("insuredname",$("#insuredname input").val());
    var insuredname = getViewData("insuredname");

    var insuredsame = getViewData("insuredsame");
    if(insuredsame == "true") return true;

    if(isEmpty(insuredname))
    {
        muiAlert("请输入被保人姓名！",function () {
            if($("#insuredname input").length > 0) $("#insuredname input").focus();
        });
        return false;
    }
    if(!regex.chinese.test(insuredname))
    {
        muiAlert("请正确填写被保人姓名<br/>仅可以填写中文！",function () {
            if($("#insuredname input").length > 0) $("#insuredname input").focus();
        });
        return false;
    }
    return true;
}

function checkInsuredMobile()
{
    if($("#insuredmobile input").length > 0) setViewData("insuredmobile",$("#insuredmobile input").val());
    var insuredmobile = getViewData("insuredmobile");

    var insuredsame = getViewData("insuredsame");
    if(insuredsame == "true") return true;

    if(isEmpty(insuredmobile))
    {
        muiAlert("请输入被保人手机号码！",function () {
            if($("#insuredmobile input").length > 0) $("#insuredmobile input").focus();
        });
        return false;
    }
    if(!regex.mobile.test(insuredmobile))
    {
        muiAlert("请正确填写被保人手机号码<br/>手机号码格式错误！",function () {
            if($("#insuredmobile input").length > 0) $("#insuredmobile input").focus();
        });
        return false;
    }
    return true;
}

function checkInsuredEmail()
{
    if($("#insuredemail input").length > 0) setViewData("insuredemail",$("#insuredemail input").val());
    var insuredemail = getViewData("insuredemail");

    var insuredsame = getViewData("insuredsame");
    if(insuredsame == "true") return true;

    var citycode = getViewData("citycode");
    if(citycode == "3110000" || citycode == "3440300")//北京 深圳
    {
        if(isEmpty(insuredemail))
        {
            muiAlert("请输入被保人邮箱！",function () {
                if($("#insuredemail input").length > 0) $("#insuredemail input").focus();
            });
            return false;
        }
        if(!regex.email.test(insuredemail))
        {
            muiAlert("请正确填写被保人邮箱<br/>邮箱格式错误！",function () {
                if($("#insuredemail input").length > 0) $("#insuredemail input").focus();
            });
            return false;
        }
    }
    return true;
}

function checkInsuredIdCard()
{
    if($("#insuredidcard input").length > 0) setViewData("insuredidcard",$("#insuredidcard input").val());
    var insuredidcard = getViewData("insuredidcard");

    var insuredsame = getViewData("insuredsame");
    if(insuredsame == "true") return true;

    if(isEmpty(insuredidcard))
    {
        muiAlert("请输入被保人身份证号！",function () {
            if($("#insuredidcard input").length > 0) $("#insuredidcard input").focus();
        });
        return false;
    }

    if(testIdCard(insuredidcard) != 0)
    {
        muiAlert("请正确填写被保人身份证号<br/>身份证号格式错误！",function () {
            if($("#insuredidcard input").length > 0) $("#insuredidcard input").focus();
        });
        return false;
    }

    if(getAgeByidcard(insuredidcard) < 18)
    {
        muiAlert("被保人身份证未满18周岁！",function () {
            if($("#insuredidcard input").length > 0) $("#insuredidcard input").focus();
        });
        return false;
    }

    return true;
}

function checkInsuredIdBeginDate()
{
    var insuredidbegindate = getViewData("insuredidbegindate");

    var insuredsame = getViewData("insuredsame");
    if(insuredsame == "true") return true;

    var citycode = getViewData("citycode");
    if(citycode == "3110000")//北京
    {
        if(isEmpty(insuredidbegindate))
        {
            muiAlert("请选择被保人身份证有效起期！");
            return false;
        }
        if(!regex.date.test(insuredidbegindate)) {
            muiAlert("请选择被保人身份证有效起期！");
            return false;
        }
    }
    return true;
}

function checkInsuredIdEndDate()
{
    var insuredidenddate = getViewData("insuredidenddate");

    var insuredsame = getViewData("insuredsame");
    if(insuredsame == "true") return true;

    var citycode = getViewData("citycode");
    if(citycode == "3110000")//北京
    {
        if(isEmpty(insuredidenddate))
        {
            muiAlert("请选择被保人身份证有效止期！");
            return false;
        }
        if(!regex.date.test(insuredidenddate)) {
            muiAlert("请选择被保人身份证有效止期！");
            return false;
        }
    }
    return true;
}

function checkInsuredNation()
{
    var insurednation = getViewData("insurednation");

    var insuredsame = getViewData("insuredsame");
    if(insuredsame == "true") return true;

    var citycode = getViewData("citycode");
    if(citycode == "3110000")//北京
    {
        if(isEmpty(insurednation))
        {
            muiAlert("请选择被保人身份证民族！");
            return false;
        }
    }
    return true;
}

function checkInsuredPublish()
{
    if($("#insuredpublish input").length > 0) setViewData("insuredpublish",$("#insuredpublish input").val());
    var insuredpublish = getViewData("insuredpublish");

    var insuredsame = getViewData("insuredsame");
    if(insuredsame == "true") return true;

    var citycode = getViewData("citycode");
    if(citycode == "3110000")//北京
    {
        if(isEmpty(insuredpublish))
        {
            muiAlert("请选择被保人身份证签发机构！",function () {
                if($("#insuredpublish input").length > 0) $("#insuredpublish input").focus();
            });
            return false;
        }
        if(!regex.publish.test(insuredpublish))
        {
            muiAlert("请正确填写被保人身份证签发机构<br/>填写中文！",function () {
                if($("#insuredpublish input").length > 0) $("#insuredpublish input").focus();
            });
            return false;
        }
    }
    return true;
}

function checkPolicyholderName()
{
    if($("#policyholdername input").length > 0) setViewData("policyholdername",$("#policyholdername input").val());
    var policyholdername = getViewData("policyholdername");

    var policyholdersame = getViewData("policyholdersame");
    if(policyholdersame == "true") return true;

    if(isEmpty(policyholdername))
    {
        muiAlert("请输入投保人姓名！",function () {
            if($("#policyholdername input").length > 0) $("#policyholdername input").focus();
        });
        return false;
    }
    if(!regex.chinese.test(policyholdername))
    {
        muiAlert("请正确填写投保人姓名<br/>仅可以填写中文！",function () {
            if($("#policyholdername input").length > 0) $("#policyholdername input").focus();
        });
        return false;
    }
    return true;
}

function checkPolicyholderMobile()
{
    if($("#policyholdermobile input").length > 0) setViewData("policyholdermobile",$("#policyholdermobile input").val());
    var policyholdermobile = getViewData("policyholdermobile");

    var policyholdersame = getViewData("policyholdersame");
    if(policyholdersame == "true") return true;

    if(isEmpty(policyholdermobile))
    {
        muiAlert("请输入投保人手机号码！",function () {
            if($("#policyholdermobile input").length > 0) $("#policyholdermobile input").focus();
        });
        return false;
    }

    if(!regex.mobile.test(policyholdermobile))
    {
        muiAlert("请正确填写投保人手机号码<br/>手机号码格式错误！",function () {
            if($("#policyholdermobile input").length > 0) $("#policyholdermobile input").focus();
        });
        return false;
    }
    return true;
}

function checkPolicyholderEmail()
{
    if($("#policyholderemail input").length > 0) setViewData("policyholderemail",$("#policyholderemail input").val());
    var policyholderemail = getViewData("policyholderemail");

    var policyholdersame = getViewData("policyholdersame");
    if(policyholdersame == "true") return true;

    var citycode = getViewData("citycode");
    if(citycode == "3110000" || citycode == "3440300")//北京 深圳
    {
        if(isEmpty(policyholderemail))
        {
            muiAlert("请输入投保人邮箱！",function () {
                if($("#policyholderemail input").length > 0) $("#policyholderemail input").focus();
            });
            return false;
        }
        if(!regex.email.test(policyholderemail))
        {
            muiAlert("请正确填写投保人邮箱<br/>邮箱格式错误！",function () {
                if($("#policyholderemail input").length > 0) $("#policyholderemail input").focus();
            });
            return false;
        }
    }
    return true;
}

function checkPolicyholderIdCard()
{
    if($("#policyholderidcard input").length > 0) setViewData("policyholderidcard",$("#policyholderidcard input").val());
    var policyholderidcard = getViewData("policyholderidcard");

    var policyholdersame = getViewData("policyholdersame");
    if(policyholdersame == "true") return true;

    if(isEmpty(policyholderidcard))
    {
        muiAlert("请输入投保人身份证号！",function () {
            if($("#policyholderidcard input").length > 0) $("#policyholderidcard input").focus();
        });
        return false;
    }

    if(testIdCard(policyholderidcard) != 0)
    {
        muiAlert("请正确填写投保人身份证号<br/>身份证号格式错误！",function () {
            if($("#policyholderidcard input").length > 0) $("#policyholderidcard input").focus();
        });
        return false;
    }

    if(getAgeByidcard(policyholderidcard) < 18)
    {
        muiAlert("投保人身份证未满18周岁！",function () {
            if($("#policyholderidcard input").length > 0) $("#policyholderidcard input").focus();
        });
        return false;
    }
    return true;
}

function checkPolicyholderIdBeginDate()
{
    var citycode = getViewData("citycode");
    var policyholderidbegindate = getViewData("policyholderidbegindate");

    var policyholdersame = getViewData("policyholdersame");
    if(policyholdersame == "true") return true;

    if(citycode == "3110000")//北京
    {
        if(isEmpty(policyholderidbegindate))
        {
            muiAlert("请选择投保人身份证有效起期！");
            return false;
        }
        if(!regex.date.test(policyholderidbegindate)) {
            muiAlert("请选择投保人身份证有效起期！");
            return false;
        }
    }
    return true;
}

function checkPolicyholderIdEndDate()
{
    var citycode = getViewData("citycode");
    var policyholderidenddate = getViewData("policyholderidenddate");

    var policyholdersame = getViewData("policyholdersame");
    if(policyholdersame == "true") return true;

    if(citycode == "3110000")//北京
    {
        if(isEmpty(policyholderidenddate))
        {
            muiAlert("请选择投保人身份证有效止期！");
            return false;
        }
        if(!regex.date.test(policyholderidenddate)) {
            muiAlert("请选择投保人身份证有效止期！");
            return false;
        }
    }
    return true;
}

function checkPolicyholderNation()
{
    var citycode = getViewData("citycode");
    var policyholdernation = getViewData("policyholdernation");

    var policyholdersame = getViewData("policyholdersame");
    if(policyholdersame == "true") return true;

    if(citycode == "3110000")//北京
    {
        if(isEmpty(policyholdernation))
        {
            muiAlert("请选择投保人身份证民族！");
            return false;
        }
    }
    return true;
}

function checkPolicyholderPublish()
{
    if($("#policyholderpublish input").length > 0) setViewData("policyholderpublish",$("#policyholderpublish input").val());
    var policyholderpublish = getViewData("policyholderpublish");

    var policyholdersame = getViewData("policyholdersame");
    if(policyholdersame == "true") return true;

    var citycode = getViewData("citycode");
    if(citycode == "3110000")//北京
    {
        if(isEmpty(policyholderpublish))
        {
            muiAlert("请选择投保人身份证签发机构！",function () {
                if($("#policyholderpublish input").length > 0) $("#policyholderpublish input").focus();
            });
            return false;
        }
        if(!regex.publish.test(policyholderpublish))
        {
            muiAlert("请正确填写投保人身份证签发机构<br/>填写中文！",function () {
                if($("#policyholderpublish input").length > 0) $("#policyholderpublish input").focus();
            });
            return false;
        }
    }
    return true;
}

function checkRisk()
{
    var risks = [];
    risks.push(getRiskData("carloss" + "coveragevalue"));           // 车辆损失险
    risks.push(getRiskData("thirdparty" + "coveragevalue"));        // 第三者责任险
    risks.push(getRiskData("driver" + "coveragevalue"));            // 司机座位险
    risks.push(getRiskData("passenger" + "coveragevalue"));         // 乘客座位责任险
    risks.push(getRiskData("theft" + "coveragevalue"));             // 全车盗抢险
    risks.push(getRiskData("glassbroken" + "coveragevalue"));       // 玻璃破碎险
    risks.push(getRiskData("carscrach" + "coveragevalue"));         // 车身划痕险
    risks.push(getRiskData("selfignite" + "coveragevalue"));        // 自燃损失险
    risks.push(getRiskData("enginewading" + "coveragevalue"));      // 发动机涉水损失险
    risks.push(getRiskData("newequipment" + "coveragevalue"));      // 新增加设备损失险
    risks.push(getRiskData("mentaldistress" + "coveragevalue"));    // 精神损害抚慰金责任险
    risks.push(getRiskData("appointrepair" + "coveragevalue"));     // 指定专修厂险
    risks.push(getRiskData("nothirdparty" + "coveragevalue"));      // 无法找到第三方特约险
    risks.push(getRiskData("cardamager" + "coveragevalue"));        // 车损险绝对免赔额

    for(var index in risks)
    {
        if(risks[index] != "不投保" && risks[index] != "不可投保")
            return true;
    }

    muiAlert("请至少选择投保一个商业险！");
    return false;
}

function checkSpecialRisk()
{
    var risks = [];
    // 以下4项保险需任选2项或2项以上
    risks.push(getRiskData("enginewading" + "coveragevalue"));      // 发动机涉水损失险
    risks.push(getRiskData("newequipment" + "coveragevalue"));      // 新增加设备损失险
    risks.push(getRiskData("mentaldistress" + "coveragevalue"));    // 精神损害抚慰金责任险
    risks.push(getRiskData("appointrepair" + "coveragevalue"));     // 指定专修厂险

    var count = 0;
    for (var index in risks) {
        if (risks[index] != "不投保" && risks[index] != "不可投保")
            count++;
    }

    if (count >= 2) return true;

    muiAlert("请在4选2部分至少选择2款保险！");
    return false;
}

function checkAddressId()
{
    var addressid = getViewData("addressid");
    if(isEmpty(addressid))
    {
        muiAlert("请选择保单寄送地址！");
        return false;
    }

    return true;
}


function checkAddressName()
{
    if($("#addressname input").length > 0) setViewData("addressname",$("#addressname input").val());
    var addressname = getViewData("addressname");

    if(isEmpty(addressname))
    {
        muiAlert("请输入收件人姓名！",function () {
            if($("#addressname input").length > 0) $("#addressname input").focus();
        });
        return false;
    }
    if(!regex.chinese.test(addressname))
    {
        muiAlert("请正确填写收件人姓名<br/>仅可以填写中文！",function () {
            if($("#addressname input").length > 0) $("#addressname input").focus();
        });
        return false;
    }
    return true;
}

function checkAddressMobile()
{
    if($("#addressmobile input").length > 0) setViewData("addressmobile",$("#addressmobile input").val());
    var addressmobile = getViewData("addressmobile");

    if(isEmpty(addressmobile))
    {
        muiAlert("请输入保单收件人手机号码！",function () {
            if($("#addressmobile input").length > 0) $("#addressmobile input").focus();
        });
        return false;
    }
    if(!regex.mobile.test(addressmobile))
    {
        muiAlert("请正确填写收件人手机号码<br/>手机号码格式错误！",function () {
            if($("#addressmobile input").length > 0) $("#addressmobile input").focus();
        });
        return false;
    }
    return true;
}

function checkAddressInfo()
{
    if($("#addressinfo textarea").length > 0) setViewData("addressinfo",$("#addressinfo textarea").val());
    var addressinfo = getViewData("addressinfo");

    if(isEmpty(addressinfo))
    {
        muiAlert("请输入保单配送详细地址！",function () {
            if($("#addressinfo textarea").length > 0) $("#addressinfo textarea").focus();
        });
        return false;
    }
    if(addressinfo.length < 4)
    {
        muiAlert("请正确输入保单配送详细地址！",function () {
            if($("#addressinfo textarea").length > 0) $("#addressinfo textarea").focus();
        });
        return false;
    }
    return true;
}
