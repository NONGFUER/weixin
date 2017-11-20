$(function(){
    startSlider();
	scrollScreen();

	showHeader();
	initData();
	setEvent();
	
});
//自动轮播
function startSlider()
{
	mui('.mui-slider').slider({
	    interval:3000//自动轮播周期，若为0则不自动播放，默认为0；
	});
}
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
    var randomno = getUrlParam("randomno");
    initViewData(randomno,function(){
    	
    	//保存 url传递过来的信息
        saveUrlInfo();
        
        setViewData("randomno",randomno);
        setViewData("brandmodel","");
        var channelcode = getUrlParam("channel");
        if(isEmpty(channelcode)) channelcode = getViewData("channelcode");
        setViewData("channelcode",channelcode);

        var backurl = getUrlParam("backurl");
        if(isEmpty(backurl)) backurl = getViewData("basebackurl");
        setViewData("basebackurl",backurl);

        var isnewplate = getViewData("isnewplate");
        if(isEmpty(isnewplate)) isnewplate = "false";
        setViewData("isnewplate",isnewplate);

        reloadView();
    });
}

function vaildateData()
{
    var randomno = getUrlParam("randomno");
    var backurl = getUrlParam("backurl");
    if(isEmpty(backurl)) backurl = getViewData("basebackurl");

    if(isEmpty(randomno))
    {
        muiAlert("对不起,信息不完整请重试!");
        if(isEmpty(backurl))
            window.history.go(-2);
        else
            window.location.href = backurl;
        return false;
    }
    return true;
}

function setEvent()
{
    $("#back").unbind("tap").bind("tap",function() {
        jumpback();
    });

    $("#channel").unbind("tap").bind("tap",function() {
    	if(!vaildateData()) return;
        popChannel();
    });

    $("#province").unbind("tap").bind("tap",function() {
        popProvince();
    });

    $("#city").unbind("tap").bind("tap",function() {
        popCity();
    });

    $("#newplate").unbind("tap").bind("tap",function() {
        switchData("isnewplate");
        saveNewPlate();
    });

    $("#plate input").unbind("blur").bind("blur",function() {
        savePlate();
    });

    $("#submit").unbind("tap").bind("tap",function() {
    	if(!vaildateData()) return;
        submit();
    });
}

function jumpback()
{
    var backurl = getViewData("basebackurl");

    if(isEmpty(backurl))
        window.history.go(-2);
    else
        window.location.href = backurl;
}

function popChannel()
{
    // 方法定义
    var fun = function(result){

        if (result.statusCode != "000000") {
            muiAlert(result.statusMessage);
            return;
        }

        
        var datas = result.returns.bxCxChannel;
        // JSON字符串转Json
        if (typeof datas == "string") datas = $.parseJSON(datas);

        var channels = fillPopPickerData(datas,"text","value");

        var popPicker = new mui.PopPicker();
        popPicker.setData(channels);
        popPicker.show(function(items) {
            popPicker.dispose();

			var channel = items[0];
            var channelname = channel.text;
            var channelcode = channel.value;
            var currentchannelcode = getViewData("channelcode");

            if(currentchannelcode == channelcode) return;

            var data = {
                "channelname":channelname,
                "channelcode":channelcode,
                "provincename":"",
                "provincecode":"",
                "cityname":"",
                "citycode":"",
                "platename":"",
                "brandmodel":"",
            };
            setViewDatas(data);
            reloadView();
        });
    };

    if (!isFake)
        ServiceSend.getChannelList(fun);
    else
        $.get("data/channeldata.json",fun);
}

function popProvince()
{
    // 方法定义
    var fun = function (result) {
        if (result.status.statusCode != "000000") {
            muiAlert(result.status.statusMessage);
            return;
        }

        var datas = result.cityinfo.rows;
        // JSON字符串转Json
        if (typeof datas == "string") datas = $.parseJSON(datas);

        var provinces = fillPopPickerData(datas, "contName", "id");
        
        provinces = sortProvinces(provinces);
        var popPicker = new mui.PopPicker();
        popPicker.setData(provinces);

        popPicker.show(function (items) {
            popPicker.dispose();

            var province = items[0];
            var provincename = province.text;
            var provincecode = province.value;
            var currentprovincecode = getViewData("provincecode");

            if (currentprovincecode == provincecode) return;

            var data = {
                "provincename": provincename,
                "provincecode": provincecode,
                "cityname": "",
                "citycode": "",
                "platename": "",
                "plateno": "",
                "brandmodel": "",
            };
            setViewDatas(data);
            reloadView();
        });
    };

    if (!checkChannel()) return;
    var channelcode = getViewData("channelcode");

    if (!isFake)
        ServiceSend.getProvinceList(channelcode, fun);
    else
        $.get("data/provincedata.json", fun);
}

function sortProvinces(provinces)
{
    // 排序 将直辖市放在前面
    var array = [];
    var province;
    for(var index in provinces)
    {
        province = provinces[index];

        if(province.text.indexOf("北京") != -1) province.order = 1;
        else if(province.text.indexOf("上海") != -1) province.order = 2;
        else if(province.text.indexOf("天津") != -1) province.order = 3;
        else if(province.text.indexOf("深圳") != -1) province.order = 4;
        else if(province.text.indexOf("厦门") != -1) province.order = 5;
        else if(province.text.indexOf("青岛") != -1) province.order = 6;
        else if(province.text.indexOf("重庆") != -1) province.order = 7;
        else if(province.text.indexOf("宁波") != -1) province.order = 8;
        else if(province.text.indexOf("宁波") != -1) province.order = 8;
        else province.order = 99;
    }

    provinces.sort(function (data1,data2){
        return data1.order - data2.order;
    });

    return provinces;
}

function popCity()
{
    // 方法定义
    var fun = function (result){
        if (result.status.statusCode != "000000") {
            muiAlert(result.status.statusMessage);
            return;
        }

        var datas = result.cityinfo.rows;
        // JSON字符串转Json
        if (typeof datas == "string") datas = $.parseJSON(datas);

        var citys = fillPopPickerData(datas,"contName","id");
        
        var popPicker = new mui.PopPicker();
        popPicker.setData(citys);

        popPicker.show(function(items) {
            popPicker.dispose();

            var city = items[0];
            var cityname = city.text;
            var citycode = city.value;
            var currentcitycode = getViewData("citycode");

            if(currentcitycode == citycode) return;

            var platename = JSON.parse(city.json)["cityPlate"];

            var data = {
                "cityname":cityname,
                "citycode":citycode,
                "platename":platename,
                "plateno":"",
                "brandmodel":"",
            };
            setViewDatas(data);
            reloadView();
        });
    };

    if(!checkChannel()) return;
    if(!checkProvince()) return;

    var channelcode = getViewData("channelcode");
    var provincecode = getViewData("provincecode");

    if (!isFake)
        ServiceSend.getCityList(channelcode,provincecode,fun);
    else
        $.get("data/citydata.json", fun);
}

function getContentByProvince(provincecode) {
    var content = "此地区今日能查询及投保 ${DATE} 前的车险<br/>新车未上牌无此限制";

    switch(provincecode) {
        case "31": //上海市
            day = 30;
            break;
        case "8"://江苏省
            day = 40;
            break;
        case "10"://浙江省
            day = 60;
            break;
        case "16"://山东省
            day = 60;
            break;
        default:
            day = 90;
    }

    var now = new Date().getTime();
    var str = new Date(now + day * 24 * 60 * 60 * 1000).Format("yyyy-MM-dd");

    return content.replace("${DATE}", str);
}

function saveNewPlate()
{
    setSwitchData("isnewplate");

    //需要 改变 的变量
    setViewData("registdate","");
    setViewData("istransfer","false");
    setViewData("transferdate","");
    setViewData("brandmodel","");

    reloadView();
}

function savePlate() {
    if (isChangeViewData("plateno", $("#plate input").val())) {
        setViewData("plateno", $("#plate input").val());

        //需要 改变 的变量
        setViewData("brandmodel", "");
        reloadView();
    }
}

function submit()
{
    setSwitchData("isnewplate");
    setViewData("plateno", $("#plate input").val());

    if(!checkChannel()) return;
    if(!checkProvince()) return;
    if(!checkCity()) return;
    if(!checkPlate()) return;

    submitServer(function (){
        loadCarInfo(function (){
            window.location.href = "insurecarinfo.html";
        });
    });
}

function submitServer(callback)
{
    // 方法定义
    var fun = function (result){
        if (result.status.statusCode != "000000") {
            muiAlert(result.status.statusMessage);
            return;
        }
        setViewData("sessionid",result.sessionId);
        reloadView();

        callback();
    };

    var randomno = getViewData("randomno");
    var channelcode = getViewData("channelcode");
    var provincename = getViewData("provincename");
    var provincecode = getViewData("provincecode");
    var cityname = getViewData("cityname");
    var citycode = getViewData("citycode");
    var plateno = getViewData("plateno");
    var isnewplate = getViewData("isnewplate");

    if (!isFake)
        ServiceSend.saveSimpleCarInfo(randomno,channelcode,isnewplate,plateno,provincecode,provincename,citycode,cityname,fun);
    else
        $.get("data/savecarinfodata.json", fun);
}

function loadCarInfo(callback)
{
    // 方法定义
    var fun = function (result){
        if (result.status.statusCode != "000000") {
            muiAlert(result.status.statusMessage);
            return;
        }

        // 在这里 获得 续保信息

        callback();
    };

    var plateno = getViewData("plateno");
    if(isEmpty(plateno)) {
    	callback();
    	return;
    }

    //先加载 url的信息
    loadUrlInfo();

    if (!isFake){
    	callback();
    	// ServiceSend.loadCarInfo(plateno,fun);
    }
    else{
    	$.get("data/loadcarinfodata.json", fun);
    }
        
}

function reloadView()
{
    var channelcode = getViewData("channelcode");
    var channelname = getViewData("channelname");
    var provincename = getViewData("provincename");
    var provincecode = getViewData("provincecode");
    var cityname = getViewData("cityname");
    var platename = getViewData("platename");
    var plateno = getViewData("plateno");
    var isnewplate = getViewData("isnewplate");

    if(isEmpty(plateno)) plateno = platename;
    
    var channelcode = getUrlParam("channel");
    if(!isEmpty(channelcode))  $("#channel").hide();
   
    $("#channel input").val(channelname||"");
    $("#province input").val(provincename||"");
    $("#city input").val(cityname||"");
    if(!isEmpty(provincename)) $("#notice").html(getContentByProvince(provincecode));

    //设置 是否新车未上牌
    {
        var src = $("#newplate img").attr("src");
        src = src.replace(/uncheck|checked/g, isnewplate == "true" ? "checked" : "uncheck");
        $("#newplate img").attr("src", src);

        if (isnewplate == "true") {
            $("#plate input").attr("disabled", "disabled");
            $("#plate input").attr("placeholder","新车未上牌");
            $("#plate input").val("");
        }
        else {
            $("#plate input").removeAttr("disabled");
            $("#plate input").attr("placeholder","请输入车牌号码");
     	    $("#plate input").val(plateno||"");
    	}
	}
}