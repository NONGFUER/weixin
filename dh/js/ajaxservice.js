document.write("<script language='javascript' src='js/crypto-js/crypto-js.js' ></script>");

var baseUrl = window.location.protocol + "//" + window.location.host + "/tongdaoPlatform/";
//baseUrl = "http://td-pro.ta-by.com/tongdaoPlatform/";

var serviceUrl = {
    queryHistoryInfo: baseUrl + "vi/selectHistoryInfo.do",
    getChannel: baseUrl + "bill/queryIssueChannel.do",
    getProvince: baseUrl + "gzhcx/queryProvinceInfo.do",
    getCity: baseUrl + "gzhcx/queryCityInfo.do",
    getCache:baseUrl + "commonCache/getByCacheCode.do",
    selelctBrandmodel:baseUrl + "vi/selectCarTypeInfo.do",
    saveSimpleCarInfo:baseUrl + "vi/saveCxInfoOne.do",
    saveFullCarInfo:baseUrl + "vi/saveCxInfoTwo.do",
    queryMealInfo:baseUrl + "gzhcx/queryCxCommodityInfo.do",
    saveRiskInfo:baseUrl + "gzhcx/saveCxRiskInfo.do",
    getAllCarInfo:baseUrl + "cx/getAllInfo.do",
    getDistributionInfo:baseUrl + "distribution/getDistributionOne.do",
    createAddress:baseUrl + "distribution/saveDistribution.shtml",
    editAddress:baseUrl + "distribution/UpDistribution.shtml",
    createOrder:baseUrl + "dhController/dhOrderConfirm.do",
    queryOrder:baseUrl + "dhController/dhOrderQuery.do"

};

var ServiceSend = {
    queryHistory:function(randomno,callback)
    {
        var url = serviceUrl.queryHistoryInfo + '?time=' + new Date().getTime();

        var requestData =  {
            "head":{
                "userCode": "",
                "transTime":new Date().Format("yyyy-MM-dd hh:mm:ss"),
                "channel":serverParam.channel,
            },"body":{
                "userName" : randomno,
            }
        };

        asyncSend(url,requestData,function(result){
            callback(result);
        });
    },
    getChannelList:function(callback)
    {
        var channeldata = getStorageData("channeldata");
        if(isDefined(channeldata))
        {
            callback(channeldata);
            return;
        }

        var url = serviceUrl.getChannel + '?time=' + new Date().getTime();
        var requestData =  {
            "head":{
                "userCode":"",
                "transTime":new Date().Format("yyyy-MM-dd hh:mm:ss"),
                "channel":serverParam.channel,
            },"body":{}
        };

        asyncSend(url,requestData,function(result){
            setStorageData("channeldata",result);
            callback(result);
        });
    },
    getProvinceList:function(channelcode,callback)
    {
        var provincedata = getStorageData("provincedata" + channelcode);
        if(isDefined(provincedata))
        {
           callback(provincedata);
            return;
        }

        var url = serviceUrl.getProvince + '?time=' + new Date().getTime();
        var requestData =  {
            "head":{
                "userCode":"",
                "transTime":new Date().Format("yyyy-MM-dd hh:mm:ss"),
                "channel":serverParam.channel,
                "issueChannel":channelcode
            },"body":{}
        };

        asyncSend(url,requestData,function(result){
            setStorageData("provincedata" + channelcode,result);
            //JSON字符串转Json
            result = $.parseJSON(result);
            callback(result);
        });
    },
    getCityList:function(channelcode,provincecode,callback)
    {
        var citydata = getStorageData("citydata" + channelcode + provincecode);
        if(isDefined(citydata))
        {
            callback(citydata);
            return;
        }

        var url = serviceUrl.getCity + '?time=' + new Date().getTime();
        var requestData =  {
            "head":{
                "userCode":"",
                "transTime":new Date().Format("yyyy-MM-dd hh:mm:ss"),
                "channel":serverParam.channel,
                "cxProvinceId":provincecode,
                "issueChannel":channelcode
            },"body":{}
        };

        asyncSend(url,requestData,function(result){
            setStorageData("citydata" + channelcode + provincecode,result);
            //JSON字符串转Json
            result = $.parseJSON(result);
            callback(result);
        });
    },
    getFuelList:function(callback)
    {
        var fueltypedata = getStorageData("fueltypedata");
        if(isDefined(fueltypedata))
        {
            callback(fueltypedata);
            return;
        }

        var url = serviceUrl.getCache + '?time=' + new Date().getTime();
        var cacheCode = {"cacheCode" : "commonCacheBO.dictionary.bx_fuel_type"};
        var requestData = {"request":cacheCode};

        asyncSend(url,requestData,function(result){
            setStorageData("fueltypedata",result);
            callback(result);
        });
    },
    getCertificateList:function(callback)
    {
        var certificatetypedata = getStorageData("certificatetypedata");
        if(isDefined(certificatetypedata))
        {
            callback(certificatetypedata);
            return;
        }

        var url = serviceUrl.getCache + '?time=' + new Date().getTime();
        var cacheCode = {"cacheCode" : "commonCacheBO.dictionary.bx_certificate_type"};
        var requestData = {"request":cacheCode};

        asyncSend(url,requestData,function(result){
            setStorageData("certificatetypedata",result);
            callback(result);
        });
    },
    getNationList:function(callback)
    {
        var nationdata = getStorageData("nationdata");
        if(isDefined(nationdata))
        {
            callback(nationdata);
            return;
        }

        var url = serviceUrl.getCache + '?time=' + new Date().getTime();
        var cacheCode = {"cacheCode" : "commonCacheBO.dictionary.bx_nation"};
        var requestData = {"request":cacheCode};

        asyncSend(url,requestData,function(result){
            setStorageData("nationdata",result);
            callback(result);
        });
    },
    getBrandmodelList:function(channelcode,citycode,plateno,rackno,enginno,engineno,registdate,brandmodelname,index,callback)
    {
        var url = serviceUrl.selelctBrandmodel + '?time=' + new Date().getTime();
        var data =  {
            "frameNo":rackno,
            "enginNo":enginno,
            "licenseNo":plateno,
            "brandName":brandmodelname,
            "cityCode":citycode,
            "enrollDate":registdate,
            "purchaseDate":registdate,
            "startDate":addDate(1).Format("yyyy-MM-dd"),// T + 1
            "issueChannel":channelcode,
            "page" : index,
            "rows" : "20",
            "callback" : 'jsonp1045'
        };
        var requestData = {"request":data};

        asyncSend(url,requestData,function(result){
            //JSON字符串转Json
            result = $.parseJSON(result);
            callback(result);
        });
    },
    saveSimpleCarInfo:function(randomno,channelcode,isnewplate,plateno,provincecode,provincename,citycode,cityname,callback)
    {
        var url = serviceUrl.saveSimpleCarInfo + '?time=' + new Date().getTime();
        var cxOrder = {
            "cityCode":citycode,
            "cityName":provincename + "-" + cityname,
            "companyCode":serverParam.companycode,
            "issueChannel":channelcode,
            "newcarFlag":isnewplate == "true"?1:0,
            "plateno":isnewplate == "true"?"":plateno,
            "provinceCode":provincecode,
            "provinceName":provincename,
        };
        var cxInfoDTO = {
            "productId": "", // 产品编号
            "sessionId": "", // 唯一流水号
            "agentCode": randomno,
            "openId": "",
            "comparyCode": serverParam.companycode,
            "cxOrder": cxOrder,
            "orderChannel": serverParam.channel
        };

        var data = {"cxInfoDTO":cxInfoDTO};
        var requestData = {"request":data};
        asyncSend(url,requestData,function(result){
            //JSON字符串转Json
            result = $.parseJSON(result);
            callback(result);
        });
    },
    saveFullCarInfo:function(
        randomno,sessionid,channelcode,isnewplate,plateno,provincecode,provincename,citycode,cityname,
        rackno,engineno,istransfer,isforeign,registdate,transferdate,brandmodel,seatcount,
        fueltypecode,fueltypename,certificatetypecode,certificatetypename,certificateno,certificatedate,
        ownername,ownermobile,owneremail,owneridcard,owneridbegindate,owneridenddate,ownernation,ownerpublish,
        checktradeno,checkno,checkcode,vehiclemodeldata,callback){
        var url = serviceUrl.saveFullCarInfo + '?time=' + new Date().getTime();

        var vehiclemodel = $.parseJSON(vehiclemodeldata);
        var vehicleModelData = {"vehicleModelData": vehiclemodel};
        vehicleModelData = UrlEncode(JSON.stringify(vehicleModelData));

        var cxCarMessage = {
            "sessionid":sessionid,
            "citycode":citycode,
            "transferFlag":istransfer == "true"?1:0,
            "transferDate":istransfer == "true"?transferdate:'2000-01-01',
            "engineNo":engineno,
            "rackNo":rackno,
            "vehicleBrand":brandmodel,
            "registerDate":registdate,
            "seats":seatcount + ".0",

            "vehicleValue":vehiclemodel.purchasePrice,
            "vehicleid":vehiclemodel.rbcode,
            "currentvalue":vehiclemodel.actualValue, // 实际价值
            "enginecapacity":vehiclemodel.exhaustCapacity, // 排量
            "producingarea":vehiclemodel.importFlag, // 车型产地
            "carName":vehiclemodel.carName,
            "jingyouVehicleCode":vehiclemodel.vehicleJingyouDto.vehicleCode,
            "jingyouVehicleName":vehiclemodel.vehicleJingyouDto.vehicleName,
            "jingyouPrice":vehiclemodel.vehicleJingyouDto.price,
            "jingyouFamilyname":vehiclemodel.vehicleJingyouDto.familyName,
            "noticeType":vehiclemodel.noticeType,
            "vehiclehycode":vehiclemodel.hyModelCode,
            "wholeWeight":vehiclemodel.vehicleWeight,

            "ecdemicVehicleFlag":isforeign == "true"?1:0,
            "drivearea":"0", // 出单地省内【0】 中国境内【3】 这里约定的是出单地点 默认为0
            "vehicleinvoicedate":registdate,
            "runMileRate":"3000",
            "isHaveGps":0,
            "familyCarCount":"0",
        };

        var cxOrder = {
            "companyCode":serverParam.companycode,
            "issueChannel":channelcode,
            "cityCode":citycode,
            "plateno":plateno,
            "newcarFlag":isnewplate == "true"?1:0,
            "provinceName":provincename,
            "provinceCode":provincecode,
            "cityName":provincename + "-" + cityname,

            "ownerName":ownername,
            "ownerMobile":ownermobile,
            "ownerIdno":owneridcard,
        };

        //北京地区
        if(citycode == "3110000"){
            cxCarMessage.fuelType = fueltypecode||"";
            cxCarMessage.fuelTypeName = fueltypename||"";
            cxOrder.certiStartdate = owneridbegindate||addYear(new Date(),-10).Format("yyyy-MM-dd");
            cxOrder.certiEnddate = owneridenddate||addYear(new Date(),10).Format("yyyy-MM-dd");
            cxOrder.nation = ownernation||"";
            cxOrder.issuerAuthority = ownerpublish||"";

            //新车
            if(isnewplate == "true"){
                cxCarMessage.certificateType = certificatetypecode||"";
                cxCarMessage.certificateTypeName = certificatetypename||"";
                cxCarMessage.certificateNo = certificateno||"";
                cxCarMessage.certificateDate = certificatedate||registdate;
            }
        }

        //深圳地区 北京地区
        if(citycode == "3440300"||citycode == "3110000"){
            cxOrder.ownerEmail = owneremail||"";
        }

        var cxOffer = {
            "sessionid": sessionid,
            "businessBegindate": addDate(1).Format("yyyy-MM-dd"),// T + 1
        };

        var cxInfoDTO = {
            "productId": "", // 产品编号
            "sessionId": sessionid, // 唯一流水号
            "agentCode": randomno,
            "openId": "",
            "comparyCode":serverParam.companycode,

            "tradeNO": checktradeno,                        // 这里 后台拼写有误  所以只能写着这样

            "checkNo": checkno,
            "checkCode": checkcode,
            "vehicleModelData": vehicleModelData,
            "cxCarMessage": cxCarMessage,
            "cxOffer": cxOffer,
            "cxOrder": cxOrder,
        };

        var data = {"cxInfoDTO":cxInfoDTO};
        var requestData = {"request":data};
        asyncSend(url,requestData,function(result){
            //JSON字符串转Json
            result = $.parseJSON(result);
            callback(result);
        });
    },
    queryMealInfo:function(mealno,sessionid,callback)
    {
        //这个 不是 每次都 调用
        var mealdata = getStorageData(sessionid + mealno);
        if(isDefined(mealdata))
        {
            callback(mealdata);
            return;
        }

        var commodityno = "";
        if(mealno == "meal1") commodityno = serverParam.commodityno.meal1;
        if(mealno == "meal2") commodityno = serverParam.commodityno.meal2;
        if(mealno == "meal3") commodityno = serverParam.commodityno.meal3;

        var url = serviceUrl.queryMealInfo + '?time=' + new Date().getTime();
        var data = {
            "companyCode": serverParam.companycode,
            "commodityNo": commodityno
        };
        var requestData = {"request":data};

        asyncSend(url,requestData,function(result){
            setStorageData(sessionid + mealno,result);
            //JSON字符串转Json
            result = $.parseJSON(result);
            callback(result);
        });
    },
    saveRiskInfo: function(randomno,sessionid,provincecode,checkno,checkcode,checktradeno,risk,callback)
    {
        var url = serviceUrl.saveRiskInfo + '?time=' + new Date().getTime();

        var cxOffer = {
            "businessBegindate": risk.businessbegindate,                //商业险起保日期 取当前日期后一天
            "comparyCode": serverParam.companycode,
            "sessionId": sessionid, // 唯一流水号
            "productId": risk.productid, // 产品编号

            "jqxBegindate": risk.jqxbegindate,                          //交强险起保日期 取当前日期后一天
            "jqxFlag": risk.jqxvalue,                                   // 交强险投保标志 投保  不投保
            "jqxPre": risk.jqxcode,                                     // 交强险保费  1: 投保 0:不投保

            "carlossFlag": risk.carlosscoveragevalue,                   // 车辆损失险  投保 不投保
            "carlossCoverage": risk.carlosscoveragecode,                // 车辆损失险  1: 投保 0:不投保
            "carlossMpFlag": risk.carlosscoveragempvalue,               // 车辆损失险 不计免赔  投保 不投保
            "carlossMpCoverage": risk.carlosscoveragempcode,            // 车辆损失险 不计免赔  1: 勾选不计免赔 0:未勾选不计免赔

            "thirdpartyFlag": risk.thirdpartycoveragevalue,             // 第三者责任险  5万  10万  15万 150万 不投保
            "thirdpartyCoverage": risk.thirdpartycoveragecode,          // 第三者责任险  50000  100000 150000 1500000 0:不投保
            "thirdpartyMpFlag": risk.thirdpartycoveragempvalue,         // 第三者责任险 不计免赔  投保 不投保
            "thirdpartyMpCoverage": risk.thirdpartycoveragempcode,      // 第三者责任险 不计免赔  1: 勾选不计免赔 0:未勾选不计免赔

            "driverFlag": risk.drivercoveragevalue,                     // 司机座位险  1万/座  2万/座  10万/座 20万/座 不投保
            "driverCoverage": risk.drivercoveragecode,                  // 司机座位险  10000  20000 100000 200000 0:不投保
            "driverMpFlag": risk.drivercoveragempvalue,                 // 司机座位险 不计免赔  投保 不投保
            "driverMpCoverage": risk.drivercoveragempcode,              // 司机座位险 不计免赔  1: 勾选不计免赔 0:未勾选不计免赔

            "passengerFlag": risk.passengercoveragevalue,               // 乘客座位责任险  1万/座  2万/座  10万/座 20万/座 不投保
            "passengerCoverage": risk.passengercoveragecode,            // 乘客座位责任险  10000  20000 100000 200000 0:不投保
            "passengerMpFlag": risk.passengercoveragempvalue,           // 乘客座位责任险 不计免赔  投保 不投保
            "passengerMpCoverage": risk.passengercoveragempcode,        // 乘客座位责任险 不计免赔  1: 勾选不计免赔 0:未勾选不计免赔

            "theftFlag": risk.theftcoveragevalue,                       // 全车盗抢险  投保 不投保
            "theftCoverage": risk.theftcoveragecode,                    // 全车盗抢险  1: 投保 0:不投保
            "theftMpFlag": risk.theftcoveragempvalue,                   // 全车盗抢险 不计免赔  投保 不投保
            "theftMpCoverage": risk.theftcoveragempcode,                // 全车盗抢险 不计免赔  1: 勾选不计免赔 0:未勾选不计免赔

            "glassFlag": risk.glassbrokencoveragevalue,                 // 玻璃破碎险  投保 不投保
            "glassCoverage": risk.glassbrokencoveragecode,              // 玻璃破碎险  1: 投保 0:不投保

            "carscrachFlag": risk.carscrachcoveragevalue,               // 车身划痕险   2千  5千  1万 2万 不投保
            "carscrachCoverage": risk.carscrachcoveragecode,            // 车身划痕险   2000 5000 10000 20000 0:不投保
            "carscrachMpFlag": risk.carscrachcoveragempvalue,           // 车身划痕险 不计免赔  投保 不投保
            "carscrachMpCoverage": risk.carscrachcoveragempcode,        // 车身划痕险 不计免赔  1: 勾选不计免赔 0:未勾选不计免赔

            "selfigniteFlag": risk.selfignitecoveragevalue,             // 自燃损失险   投保 不投保
            "selfigniteCoverage": risk.selfignitecoveragecode,          // 自燃损失险   1: 投保 0:不投保
            "selfigniteMpFlag": risk.selfignitecoveragempvalue,         // 自燃损失险 不计免赔  投保 不投保
            "selfigniteMpCoverage": risk.selfignitecoveragempcode,      // 自燃损失险 不计免赔  1: 勾选不计免赔 0:未勾选不计免赔

            "wadingFlag": risk.enginewadingcoveragevalue,               // 发动机涉水损失险   投保 不投保
            "wadingCoverage": risk.enginewadingcoveragecode,            // 发动机涉水损失险   1: 投保 0:不投保
            "wadingMpFlag": risk.enginewadingcoveragempvalue,           // 发动机涉水损失险 不计免赔  投保 不投保
            "wadingMpCoverage": risk.enginewadingcoveragempcode,        // 发动机涉水损失险 不计免赔  1: 勾选不计免赔 0:未勾选不计免赔

            "newEquipmentFlag": risk.newequipmentcoveragevalue,         // 新增加设备损失险   投保 不投保
            "newEquipmentCoverage": risk.newequipmentcoveragecode,      // 新增加设备损失险   1: 投保 0:不投保
            "newEquipmentMpFlag": risk.newequipmentcoveragempvalue,     // 新增加设备损失险 不计免赔  投保 不投保
            "newEquipmentMpCoverage": risk.newequipmentcoveragempcode,  // 新增加设备损失险 不计免赔  1: 勾选不计免赔 0:未勾选不计免赔

            "mentaldistressFlag": risk.mentaldistresscoveragevalue,     // 精神损害抚慰金责任险    2千  5千  1万 不投保
            "mentaldistressCoverage": risk.mentaldistresscoveragecode,  // 精神损害抚慰金责任险   2000 5000 10000 0:不投保
            "mentaldistressMpFlag": risk.mentaldistresscoveragempvalue, // 精神损害抚慰金责任险 不计免赔  投保 不投保
            "mentaldistressMpCoverage": risk.mentaldistresscoveragempcode,// 精神损害抚慰金责任险 不计免赔  1: 勾选不计免赔 0:未勾选不计免赔

            "appointrepairFlag": risk.appointrepaircoveragevalue,       // 指定专修厂险   投保 不投保
            "appointrepairCoverage": risk.appointrepaircoveragecode,    // 指定专修厂险   1: 投保 0:不投保

            "nothirdpartFlag": risk.nothirdpartycoveragevalue,          // 无法找到第三方特约险   投保 不投保
            "nothirdpartCoverage": risk.nothirdpartycoveragecode,       // 无法找到第三方特约险   1: 投保 0:不投保

            "carDamagerFlag": risk.cardamagercoveragevalue,             // 车损险绝对免赔额   500 不投保
            "carDamagerCoverage": risk.cardamagercoveragecode,          // 车损险绝对免赔额   500 0:不投保
        };

        var cxInfoDTO = {
            "fgFlag" : serverParam.fgflag,
            "comparyCode": serverParam.companycode,
            "agentCode" : randomno,
            "sessionId" : sessionid, // 唯一流水号
            "productId" : risk.productid, // 产品编号
            "commodityNo" : risk.commodityno,
            "cxOffer" : cxOffer,
        };

        var data = {
            "provinceCode":provincecode,
            "checkNo": checkno,
            "checkCode": checkcode,
            "tradeNo": checktradeno,
            "cxInfoDTO" : cxInfoDTO,
        };

        if(isDefined(risk.checkflag))                                   //验证码标识
        {
            data["checkDtoList"] = [{
                "checkFlag":risk.checkflag,
                "querySequenceNo":risk.checksequenceno,
                "checkCode":risk.checkcode,
            }]
        }

        var requestData = {"request":data};

        asyncSend(url,requestData,function(result){
            callback(result);
        });
    },
    getAllCarInfo:function(sessionid,callback)
    {
        var url = serviceUrl.getAllCarInfo + '?time=' + new Date().getTime();
        var data =  {
            "sessionId" : sessionid
        };
        var requestData = {"request":data};

        asyncSend(url,requestData,function(result){
            //JSON字符串转Json
            result = $.parseJSON(result);
            callback(result);
        });
    },
    getDistributionInfo:function(randomno,callback)
    {
        var url = serviceUrl.getDistributionInfo + '?time=' + new Date().getTime();
        var data =  {
            "userName" : randomno,
            "companycode":"000",
        };
        var requestData = {"request":data};

        asyncSend(url,requestData,function(result){
            //JSON字符串转Json
            result = $.parseJSON(result);
            callback(result);
        });
    },
    createAddress:function(randomno,addressprovince,addressname,addressmobile,addressinfo,callback)
    {
        var url = serviceUrl.createAddress + '?time=' + new Date().getTime();

        var cxDistribution = {
            "companycode":"000",
            "username":randomno,
            "id":"",
            "province":addressprovince,
            "receivername":addressname,
            "receiverphoneno":addressmobile,
            "address":addressinfo,
            "defaultflag":"2",// 选择默认
        };
        var data =  {
            "cxDistribution" : cxDistribution,
        };
        var requestData = {"request":data};

        asyncSend(url,requestData,function(result){
            //JSON字符串转Json
            result = $.parseJSON(result);
            callback(result);
        });
    },
    editAddress:function(randomno,addressid,addressprovince,addressname,addressmobile,addressinfo,callback)
    {
        var url = serviceUrl.editAddress + '?time=' + new Date().getTime();

        var cxDistribution = {
            "companycode":"000",
            "username":randomno,
            "id":addressid,
            "province":addressprovince,
            "receivername":addressname,
            "receiverphoneno":addressmobile,
            "address":addressinfo,
            "defaultflag":"2",// 选择默认
        };
        var data =  {
            "cxDistribution" : cxDistribution,
        };
        var requestData = {"request":data};

        asyncSend(url,requestData,function(result){
            //JSON字符串转Json
            result = $.parseJSON(result);
            callback(result);
        });
    },
    createOrder:function(citycode,sessionid,orderno,tradeno,
        insuredname,insuredmobile,insuredemail,insuredidcard,insuredidbegindate,insuredidenddate,insurednation,insuredpublish,
        policyholdername,policyholdermobile,policyholderemail,policyholderidcard,policyholderidbegindate,policyholderidenddate,policyholdernation,policyholderpublish,
        addressprovince,addressname,addressmobile,addressinfo,callback)
    {
        var url = serviceUrl.createOrder + '?time=' + new Date().getTime();

        var requestData = {
            'head':{
                'userCode': tradeno,    //暂存统一平台订单号
                'transTime':new Date().Format("yyyy-MM-dd hh:mm:ss"),
                'channel':serverParam.channel,
            },'body':{
                "addressInsuredDto":{
                    "sessionid":sessionid,
                    "orderNo":orderno,
                    "sjrMobile":addressmobile,                  // 收件人手机号
                    "sjrName":addressname,                      // 收件人姓名
                    "addresseeprovince":addressprovince,        // 收件人省市
                    "psAddress":addressinfo,                    // 收件人详细地址

                    "phname":policyholdername,                  // 投保人姓名
                    "phtelephone":policyholdermobile,           // 投保人手机
                    "phidtype":"01",                            // 投保人证件类型 01:身份证
                    "phidno":policyholderidcard,                // 投保人证件号码
                    "phbirthdate":getBirthdayByidcard(policyholderidcard),// 投保人出生日期
                    "gender":getSexByidcard(policyholderidcard),// 投保人性别
                    "phaddress":addressprovince + " " + addressinfo,//投保人地址

                    "insuredname":insuredname,                  // 被保人姓名
                    "insuredmobile":insuredmobile,              // 被保人手机
                    "insuredidtype":"01",                       // 被保人证件类型 身份证
                    "insuredidno":insuredidcard,                // 被保人证件号码
                    "insuredbirthdate":getBirthdayByidcard(insuredidcard),// 被保人出生日期
                    "insuredgender":getSexByidcard(insuredidcard),// 被保人性别
                    "insuredadress":addressprovince + " " + addressinfo,//被保人地址
                }
            }
        };

        //北京地区
        if(citycode == "3110000"){
            requestData.body.addressInsuredDto.phStartDate = policyholderidbegindate;       // 投保人身份证 起始时间
            requestData.body.addressInsuredDto.phEndDate = policyholderidenddate;           // 投保人身份证 结束时间
            requestData.body.addressInsuredDto.phnation = policyholdernation;               // 投保人身份证民族
            requestData.body.addressInsuredDto.phissuer = policyholderpublish;              // 投保人身份证发证机构

            requestData.body.addressInsuredDto.insuredStartDate = insuredidbegindate;       // 被保人身份证 起始时间
            requestData.body.addressInsuredDto.insuredEndDate = insuredidenddate;           // 被保人身份证 结束时间
            requestData.body.addressInsuredDto.insurednation = insurednation;               // 被保人身份证民族
            requestData.body.addressInsuredDto.insuredissuer = insuredpublish;              // 被保人身份证发证机构
        }
        //深圳地区  北京地区
        if(citycode=="3440300"||citycode == "3110000"){
            requestData.body.addressInsuredDto.phemail = policyholderemail;                 // 投保人邮箱
            requestData.body.addressInsuredDto.insuredemail = insuredmobile;                // 被保人邮箱
        }

        asyncSend(url,requestData,function(result){
            callback(result);
        });
    },
    queryOrder:function(globalno,appno,polno,callback)
    {
        var url = serviceUrl.queryOrder + '?time=' + new Date().getTime();

        var requestData =  {
            "head":{
                "userCode": "",
                "transTime":new Date().Format("yyyy-MM-dd hh:mm:ss"),
                "channel":serverParam.channel,
            },"body":{
                "globalno":globalno,
                "appno":appno,
                "polno":polno
            }
        };

        asyncSend(url,requestData,function(result){
        	//JSON字符串转Json
            result = $.parseJSON(result);
            callback(result);
        });
    },
};


/**
 * 加密数据
 * @param {type} data 待加密的字符串
 * @param {type} keyStr 秘钥
 * @param {type} ivStr 向量
 * @returns {unresolved} 加密后的数据
 */
function aesEncrypt(data, keyStr, ivStr) {
    var sendData = CryptoJS.enc.Utf8.parse(data);
    var key = CryptoJS.enc.Utf8.parse(keyStr);
    var iv  = CryptoJS.enc.Utf8.parse(ivStr);
    var encrypted = CryptoJS.AES.encrypt(sendData, key,{iv:iv,mode:CryptoJS.mode.CBC});
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
};

function urlEncodeForBase64(sStr) {
    return escape(sStr).replace(/\+/g, '%2B').replace(/\"/g, '%22').replace(
        /\'/g, '%27').replace(/\//g, '%2F');
}

function asyncSend(url,sendData,callback)
{
    var requestJson = aesEncrypt(JSON.stringify(sendData), secretKey, secretKey);
    requestJson = urlEncodeForBase64(requestJson);

    $.ajax({
        async : true,
        type : "POST",
        url : url,
        data : "jsonKey=" + requestJson,
        dataType : 'json',
        timeout : 60000,
        beforeSend : function(xhr) {
            // 开启遮罩
            openBusyShadow();
        },
        success :function (data)
        {
            // 去除遮罩
            closeBusyShadow();
            if (isDefined(callback)) callback(data);//zdx

        },
        error : function(data) {
            // 去除遮罩
            closeBusyShadow();
            muiAlert("网络好像开小差了呢，请设置给力一点儿网络吧！");
        }
    });
}

function openBusyShadow()
{
    if($("#busyshadow").length == 0)
    {
        var html =
            '<div id="busyshadow" class="mui-backdrop">' +
            '   <div class="backdrop-content"  style="margin-top: 200px;">' +
            '       <img style="width: 30%" src="img/loading.gif">' +
            '   </div>' +
            '</div>';

        $("body").append(html);
    }
    $("#busyshadow").show();
}

function closeBusyShadow()
{
    $("#busyshadow").hide();
}




