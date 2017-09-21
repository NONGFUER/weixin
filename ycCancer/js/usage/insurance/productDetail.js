//试算条件
var calChoices = []; 
var calNames	= [];
var choiceEdit = [];
var listArray = [];
var lowAge = "";
var upAge = "";
var healthFlag = "";
$(function(){
	if( isComing == "1"){
		$("#toubao").css({background:"#ccc"});
	}
	$("body").show();
    $.setscroll("bodyMuiScroll");
    buyBind();
    jieshaoToshuomingBind();		//介绍和产品详情间的切换
    //在线产品详情查询(ccCode,cityCode,provinceCode,type)  商品组合code,城市代码code,省code,用户角色
    sendProductInfoRequest( ccId, cityCode, provinceCode, roleType );	
    //根据商品组合id查询保费试算项 (ccId)           商品组合Id
    sendCalOptionsRequest( ccId );
    //对date类型试算项的初始化（绑定初始值和试算动作）
	getServiceTime()
	addChoice();
	for( var i = 0; i < calChoices.length; i++ ){
    	choiceBind( calNames[i] );
    }
	listChoiceBind();
	console.log(calChoices);
	console.log(choiceEdit);
    //根据保费试算项进行保费试算
    sendCaldoRequest( ccId );
    //calOptionsRender(data4);
    if( roleType != "00" && isComing != "1"){
    	 
    }
    /**拨打电话*/
	$(".kefu").unbind("tap").bind("tap",function(){
    	callService("4006895505",".kefuPhone");
    })
    $(".rexian").unbind("tap").bind("tap",function(){
    	callService("95505",".rexian");
    })
    $("#hetongDemo").unbind("tap").bind("tap",function(){
    	toHetongDemo(this)
    });
	
});

//根据保费试算项进行保费试算
function sendCaldoRequest(ccId){
	 var url = requestUrl.calDoUrl;
	 var sendJson = {
		"head" : {
		  "channel" : "01",
		  "userCode" : mobile,
		  "transTime" : $.getTimeStr(),
		  "transToken": ""
		},
		"body" : {
            "commodityCombinationId": ccId
		} 
     }
	 for(var i = 0; i < calChoices.length/2; i++){
		 var propName  = calChoices[2*i];
		 var propValue = calChoices[2*i+1];
		 sendJson.body[propName] = propValue;
	 }
     $.reqAjaxsFalse( url, sendJson, calDoRender ); 
}

//根据商品组合id查询保费试算项
function sendCalOptionsRequest(ccId){
    var url = requestUrl.calOptionsUrl;
    var sendJson = {
        "head" : {
            "channel" : "01",
            "userCode" : mobile,
            "transTime" : $.getTimeStr(),
            "transToken": ""
        },
        "body" : {
            "commodityCombinationId": ccId//11-商务飞人  9-健康安详
        }
    }
    $.reqAjaxsFalse( url, sendJson, calOptionsRender ); 
}

//在线产品详情查询
function sendProductInfoRequest(ccId,cityCode,provinceCode,type){
    var url = requestUrl.onlineProductInfoUrl;
    var sendJson = {
        "head" : {
            "channel" : "01",
            "userCode" : mobile,
            "transTime" : $.getTimeStr(),
            "transToken": ""
        },
        "body" : {
            "commodityCombinationId": ccId,//
            "cityCode":cityCode,//"220001",
            "type":type,//"04",
            "provinceCode":provinceCode//"220000"
        }
    }
    $.reqAjaxsFalse( url, sendJson, productInfoRender ); 
}

/**
 * @function 试算
 */
function calDoRender(data){
    console.log(data);
    cPrem = data.returns.premiun;
    $("#jwx_foot_price").text("价格：￥" + data.returns.premiun);
}

//试算条件
function calOptionsRender(data){
    console.log(data);
    if( data.statusCode == ajaxStatus.success ){
        var body = data.returns;
        var calOptionDtos = body.calOptionDtos;
        var j = 0;
        for(var i = 0; i < calOptionDtos.length; i++){
           var calName    = calOptionDtos[i].calName;
           var calCode    = calOptionDtos[i].calCode;
           var isCal	  = calOptionDtos[i].isCal;
           var showType   = calOptionDtos[i].showType;
           var calOptions = calOptionDtos[i].calOptions;       
           upAndLowDate( calCode, calOptions );
           var str = "";
           if( isCal == "1" ){      	   
        	   str += '<div class="d1 biCal" id="cal'+j+'" name="'+calCode+'">';
        	   j++
           }else{
        	   str += '<div class="d1" name="'+calCode+'">';
           }          
           str += '<div class="label">' + calName+ '：</div>';
           str += '<div class="conter" id="' + calCode + '">';
           str += '</div>';
           $(".insurance-choice").append(str); 
           appendStr(showType,calOptions,calCode);
        }        
    }else{
        modelAlert( message.requestFail );
    }
}
//为了解决默认加载是蒜香问题
function appendStr(showType,calOptions,calCode){
	 var calDetails = calOptionDetails(calOptions,calCode);//针对listArea拼接
     var listChoice = listChioceDetails(calOptions);//针对list,拼接          
	if( showType == 'date'){        	   
 	  var str = '<input id="birthdate" type="text" readonly="readonly">';
    }else if( showType == 'listArea' ){
 	  var str = calDetails;
    }else if( showType == 'label' ){
 	  var str = calOptions[0].enuContent;
    }else if( showType == 'list' ){
 	  var str = listChoice;
    } 
	$('div[name='+calCode+'] .conter').append(str);
}

//针对listArea试算枚举
//渲染规则 ：遍历listArea类型枚举，给默认值加加on
function calOptionDetails(calOptions){
    var optionsLength = calOptions.length;
    var str = "";
    str += '<ul class="radio" >'
    for(var i = 0; i < optionsLength; i++){
       if( calOptions[i].isDefalut == "1" ){   	   
    	   str += '<li class="on" data-value="' + calOptions[i].enuCode + '" data-cid="' + calOptions[i].commodityId + '" >' + calOptions[i].enuContent + '</li>'
    	   $('div[name='+calOptions[0].calCode+']').attr("data-value",calOptions[i].enuCode);
       }else{
           str += '<li data-value="' + calOptions[i].enuCode + '" data-cid="' + calOptions[i].commodityId + '" >' + calOptions[i].enuContent + '</li>'
       }
    }
    str += '</ul>'   
    return str;
}

//针对list试算枚举
//渲染规则：长度为1的无法点击，大于1的点击选择值
function listChioceDetails(calOptions){
	var optionsLength = calOptions.length;
	if( optionsLength == 1){
		var str = '<input id="textButton" data-value="' + calOptions[0].enuCode + '"  type="text" value="'+ calOptions[0].enuContent +'" readonly="readonly">';
		$('div[name='+calOptions[0].calCode+']').attr("data-value",calOptions[0].enuCode);
	}else if( optionsLength > 1){
		var str = '<input id="listButton" data-value="' + calOptions[0].enuCode + '"  type="text" value="'+ calOptions[0].enuContent +'" readonly="readonly">';
		$('div[name='+calOptions[0].calCode+']').attr("data-value",calOptions[0].enuCode);
		for( var i = 0; i < optionsLength; i++ ){
			var item = { text:calOptions[i].enuContent, value:calOptions[i].enuCode };
			listArray.push(item);
		}
	}else{
		
	}
	 return str;
}

//往试算组里面加条件
//规则：（试算项会被标记biCal）
function addChoice(){
	calChoices = [];
	$(".biCal").each(function(index,obj){
		var chioceName  = $(this).attr("name");//试算条件名
		calChoices.push(chioceName);
		calNames.push(chioceName);		
		var chioceValue =  $(this).attr("data-value");  //试算值				
		var calObj = {
				name  : chioceName,
				value : chioceValue
		}
		choiceEdit.push(calObj);
		calChoices.push(chioceValue);
		console.log(calChoices);
	});
}

//往试算组里面加条件值
function addChoiceValue( flag,flag1, chioceValue){
	if( flag == "1" && flag1 == "1" ){
		calChoices.push( chioceValue )
	}
}

//绑定listArea不同条件项的枚举选项
function choiceBind( calName ){
	$("#"+calName).find("li").bind("tap",function(){
		tab($(this),"on");
		var choiceValue = $(this).attr("data-value");
		$('div[name='+calName+']').attr("data-value",choiceValue);
		addChoice();
		console.log(calName +":"+$(this).attr("data-value"));//
		sendCaldoRequest( ccId );
	});
}

//绑定list选项
function listChoiceBind(  ){
	$("#listButton").bind("tap",function(){
		var sp = new mui.PopPicker();
		sp.setData(listArray);
		sp.show(function(item){
			$("#listButton").val(item[0].text);
			$("#listButton").attr("data-value",item[0].value);
			$('div[name="pieces"]').attr('data-value',item[0].value);
			addChoice();
			sendCaldoRequest(ccId);
		});
		
	});
}

//取得insuredAge年龄的最大最小值
//用于确定年龄选择器的范围值
function upAndLowDate( code, options){
	if( code == "insuredAge"){
		lowAge = parseInt(options[0].enuContent);
		upAge  = parseInt(options[1].enuContent);
	}
}

/**
 * @function 请求响应的线上产品详情数据
 * @param {*} data 
 */
function productInfoRender(data){
    console.log(data);
    if( data.statusCode == ajaxStatus.success ){
        var body = data.returns;
        var commodityCombinationModuleMapper = body.commodityCombinationModuleMapper;
        var commodityCombination             = body.commodityCombination;
        var companyProfile 					 = body.companyProfile;
        var healthTold						 = body.healthTold;			//健康告知
        if(healthTold.length != 0){
        	healthFlag = "y"
        }
        cId   = body.CommodityInfo[0].id;
        cName = body.CommodityInfo[0].commodityName;
        ccName = commodityCombination.commodityCombinationName;
        shareDesc = commodityCombination.insuredInfo;
        $(".banner-img").attr("src",commodityCombination.banner);		//渲染图片
        $("#commodityCombinationName").text(ccName);					//渲染商品组合名
        $("#companyName").text(companyProfile.companyName);				//渲染保险公司名字
        for(var i = 0; i < commodityCombinationModuleMapper.length; i++){
            moduleStr(commodityCombinationModuleMapper[i])				//渲染产品介绍和产品说明
        }
    }else{
        modelAlert( message.requestFail );
    }
}
//防癌险页面模块配置
function moduleStr(mapperList){	
	var str = "";
	if( mapperList.moduleName == "图片介绍" ){
		str += '<img src="' + mapperList.modueInfo + '" class="mb10">';
	}else {
		str += '<dl class="mb10 whitebackground">';
		str += '<dt class="dt">' + mapperList.moduleName + '</dt>';
		str += '<dd class="dd">';	
		if( mapperList.moduleType == "02" ){
			if( mapperList.moduleName == "保障责任" ){
				str += tableGener(mapperList.modueInfo);
			}else{
				str += mapperList.modueInfo;	
			}	    
		}else if( mapperList.moduleType == "03" ){//链接
			str += '<span class="btn1 fl" onclick="toCommodityList()">合同条款</span><span href="#" data-url="'+mapperList.modueInfo+'" class="btn1 ri" id="hetongDemo">合同样张</span>'
		}else if(  mapperList.moduleType == "01"  ){
			str += '<img src="' + mapperList.modueInfo + '" class="mb10">';
		}      								
		str += '</dd></dl>';
	}
	  
    if( mapperList.bigModuleName == "产品介绍" ){//属于产品介绍的进jieshao
        $(".jieshao").append(str);
    }else if( mapperList.bigModuleName == "详细说明" ){//属于详细说明的进shuoming
        $(".shuoming").append(str);
    }
}

//产品介绍 详情说明切换
function jieshaoToshuomingBind(){
    $(".insurance-tab").find("li").bind("click", function() {
        tab($(this),'on1');					
        $(".insurance-tab_content").hide().eq($(this).index()).show();					
    })
}

//
function tab(a, flag) {
	$(a).siblings().removeClass(flag); 
	$(a).addClass(flag);
};

//保障责任
function tableGener(dutyStr){
	var trCell = dutyStr.split("|");
	var tableStr = '<table class="gridtable">'
	for(var k = 0; k < trCell.length; k++){
		var tdCell = trCell[k].split("-");
		tableStr += '<tr>'
		for(var j = 0; j < tdCell.length ; j++){
			if( k == 0){
				tableStr += '<th>'+tdCell[j]+'</th>'
			}else{
				tableStr += '<td>'+tdCell[j]+'</td>'
			}					
		}
		tableStr += '</tr>'		
	}
	tableStr += '</table>'
	return tableStr;
}

/**
 * 对date类型试算项的初始化（绑定初始值和试算动作）
 * 
 * */
function getServiceTime(){
	var url = requestUrl.getServeTimeUrl;
	var reqData = {
		"head":{
			"channel":"01",
			"userCode":mobile,
			"transTime":$.getTimeStr()
		},"body":{ }
	}	
	$.reqAjaxsFalse( url, reqData, timeRender );
}

//初始化时间控件
function timeRender(data){
    if(data.statusCode == "000000") {
    	var currTime=new Date(data.returns.serviceTime);
    	var currentTime=new Date(data.returns.serviceTime);
    	if( lowAge == 0 ){
    		currentTime.setDate(currentTime.getDate() - 30);//出生30天
    	}else{
    		currentTime.setFullYear(currentTime.getFullYear()-lowAge, currentTime.getMonth(), currentTime.getDate());
    	}
    	currTime.setFullYear(currTime.getFullYear()-upAge-1, currTime.getMonth(), currTime.getDate()+1);//55周岁    	
    	var year = currTime.getFullYear(),month= currTime.getMonth()+1,day = currTime.getDate();
    	defaultTime=$.getTimeStr2(currentTime);
    	var endYear = currentTime.getFullYear(),endMonth = currentTime.getMonth()+1,endDay = currentTime.getDate();
    	$("#insuredAge input").attr("data-options",'{"type":"date","value":"'+defaultTime+'","beginYear":'+year+',"beginMonth":'+month+',"beginDay":'+day+',"endYear":'+endYear+',"endMonth":'+endMonth+',"endDay":'+endDay+'}');	
    	$("#insuredAge input").val(defaultTime);
    	var age = $.getAge(defaultTime);
		console.log(":" + age);
		$("div[name='insuredAge']").attr("data-value",age);
    	changeDate("birthdate");
    }else {
	   modelAlert(data.statusMessage);
	}
}

/**---出生日期 时间控件---*/
function changeDate(id){
	var result = document.getElementById(id);
	if(result){
		result.addEventListener('tap', function() {
			var optionsJson = this.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			var id = this.getAttribute('id');
			var picker = new mui.DtPicker(options);
			picker.show(function(rs) {
				result.value = rs.text;
				var age = $.getAge(rs.text);
				console.log(id + ":" + age);
				$("div[name='insuredAge']").attr("data-value",age);				
				addChoice();
				sendCaldoRequest( ccId );
				picker.dispose();
			});		
		});	
	}	
}

function buyBind(){
	$("#toubao").unbind('tap').bind('tap',function(){
		if( isComing == "1"){
			return false;
		}
		if( healthFlag == "y"){
			toHealthHtml();
		}else{
			toInsure();
		}				
	});	
}
//跳转到投保页面
function toInsure(){
	if($("div[name='versions']").length != 0){
		cId = $("div[name='versions']").find(".on").attr("data-cid");
		cName = ccName + "" + $("div[name='versions']").find(".on").html() ;
		cVersion = $("div[name='versions']").attr("data-value");
		//alert(cId+":"+cName);
	}
	title = "投保信息"
	urlParm.cId = cId;
	urlParm.cName = cName;
	urlParm.cPrem = cPrem;
	urlParm.title = title;
	urlParm.leftIco = "1";
	urlParm.rightIco = "0";
	urlParm.downIco = "0"
	urlParm.calChoices = calChoices;
	urlParm.cPieces = cPieces;
	urlParm.cVersion = cVersion;
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	if( roleType == "00" || roleType == "" ){
		window.location.href = base.url + "weixin/wxusers/html/users/phoneValidate.html?jsonKey="+jsonStr+"&fromtype=cancerWechat&openid="+openid;
	}else{
		window.location.href = "insure.html?jsonKey="+jsonStr;
	}
}
//跳转到健康告知页面
function toHealthHtml(){
	if($("div[name='versions']").length != 0){
		cId = $("div[name='versions']").find(".on").attr("data-cid");
		cName = ccName + "" + $("div[name='versions']").find(".on").html() ;
		cVersion = $("div[name='versions']").attr("data-value");
		//alert(cId+":"+cName);
	}
	title = "健康告知"
	urlParm.cId = cId;
	urlParm.cName = cName;
	urlParm.cPrem = cPrem;
	urlParm.title = title;
	urlParm.leftIco = "1";
	urlParm.rightIco = "0";
	urlParm.downIco = "0"
	urlParm.calChoices = calChoices;
	urlParm.cPieces = cPieces;
	urlParm.cVersion = cVersion;
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	if( roleType == "00" || roleType == "" ){
		window.location.href = base.url + "weixin/wxusers/html/users/phoneValidate.html?jsonKey="+jsonStr+"&fromtype=cancerHealthWechat&openid="+openid;
	}else{
		window.location.href = "healthNotice.html?jsonKey="+jsonStr;
	}
}

//跳转到商品列表页
function toCommodityList(){	
	urlParm.title = "商品列表";
	urlParm.leftIco = "1";
	urlParm.rightIco = "0";
	urlParm.downIco = "0"
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/insurance/main/commodityList.html?jsonKey="+jsonStr;
}
//跳转到合同条款
function toHetongDemo(obj){
	urlParm.title = "合同样张";
	urlParm.leftIco = "1";
	urlParm.rightIco = "0";
	urlParm.downIco = "0";
	urlParm.picurl = $(obj).attr("data-url");
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/agreement/hetong.html?jsonKey="+jsonStr;
}
function shareHandle(){
	//var shareList = getProductShare(ccId);
	var title = ccName;
	var desc  = shareDesc ;	
	var shareurl = base.url+"tongdaoApp/html/share/kongbai.html?mobile="+mobile+'&ccId='+ccId+'&type=2';
	var picUrl = getProductSharePic(ccId);
	shareMethod(shareurl,title,desc,"baodan",picUrl);		
};
function backlast(){
	sysback();
}
