var chaoFlag = '';
$(function(){
	mui('.mui-scroll-wrapper').scroll({
		deceleration: 0.0005 
	});
	queryShowInfo(customerId)
	loadArea()		//加载省市选择
	//loadChannel()	//
	//loadDot()
	//validateSalesManInfo()
	//queryShowInfo()
	$('#next').unbind('tap').bind('tap',function(){
		toInsuranceMall();
	});
	$('#isGou').unbind('tap').bind('tap',function(){
		if($(this).hasClass("on")){
			$(this).removeClass("on");
			$(this).find("img").attr("src","../../images/common/meigou.png");
			$(".baiy").show(1000);
		}else{
			$(this).addClass("on");
	        $(this).find("img").attr("src","../../images/common/gou.png");
	        $(".baiy").hide(1000);
	        $("#ywyCode").val(''); //业务员工号
			$("#ywyName").val(''); //业务员名称
			$("#ywyCompany").attr('name','');//业务员分公司
			$("#ywyCompany").val('');
			$("#ywySubPany").attr('name','');//业务员中支机构
			$("#ywySubPany").val('');
		}
	});
	$("#orgCityCode").unbind('tap').bind('tap',function(){
		if(!$("#orgProvinceCode").attr('name')){
			modelAlert('请先选择渠道所属省！');
			return false;
		}
	})
	$("#qdName").unbind('tap').bind('tap',function(){
		if(!$("#orgProvinceCode").attr('name')){modelAlert('请先选择渠道所属省！');return false;}
		if(!$("#orgCityCode").attr('name')){modelAlert('请先选择渠道所属市！！');return false;}
	})
	$("#qdDotName").unbind('tap').bind('tap',function(){
		if(!$("#orgProvinceCode").attr('name')){modelAlert('请先选择渠道所属省！');return false;}
		if(!$("#orgCityCode").attr('name')){modelAlert('请先选择渠道所属市！');return false;}
		if(!$("#qdName").attr('name')){modelAlert('请先选择渠道名称！');return false;}
	})
});

function queryShowInfo(customerId){
	var url = base.url + 'channel/queryShowInfo.do';
	var reqData = {
			'request':{
				"customerId" : customerId
			}
	}
	$.reqAjaxs( url, reqData, queryShowInfoCallback );
}

function queryShowInfoCallback(data){
	if( data.statusCode == '000000' ){
		var channelCustomerEdit     = data.returns.channelCustomerEdit;
		if(channelCustomerEdit){
			$("#qdDotName").attr('agentId',channelCustomerEdit.agentId);
			$("#ywyCode").val(channelCustomerEdit.bySalesmanCode); //业务员工号
			$("#ywyName").val(channelCustomerEdit.bySalesmanName); //业务员名称
			$("#ywyCompany").attr('name',channelCustomerEdit.bySalesmanOrgCode);//业务员分公司
			$("#ywyCompany").val(channelCustomerEdit.bySalesmanOrgName);
			$("#ywySubPany").attr('name',channelCustomerEdit.bySalesmanSubOrgCode);//业务员中支机构
			$("#ywySubPany").val(channelCustomerEdit.bySalesmanSubOrgName);
			
			$("#orgProvinceCode").attr('name',channelCustomerEdit.salesProvinceCode);			//渠道所属地区
			$("#orgProvinceCode").text(channelCustomerEdit.salesProvinceName);
			if(channelCustomerEdit.salesProvinceCode){
				loadArea(channelCustomerEdit.salesProvinceCode)
			}
			$("#orgCityCode").attr('name',channelCustomerEdit.salesCityCode);		//渠道所属地区
			$("#orgCityCode").text(channelCustomerEdit.salesCityName);
			if(channelCustomerEdit.salesCityCode){
				loadChannel(channelCustomerEdit.salesCityCode)
			}	
			$("#qdName").attr('name',channelCustomerEdit.salesChannelCode);			//渠道名称
			$("#qdName").text(channelCustomerEdit.salesChannelName);
			if(channelCustomerEdit.salesChannelCode){
				loadDot(channelCustomerEdit.salesChannelCode)
			}
			
			$("#qdDotName").attr('name',channelCustomerEdit.dotCode);			//渠道网点名称
			$("#qdDotName").text(channelCustomerEdit.dotName);
			$("#qdDotName").attr('isShow',channelCustomerEdit.isShow);
			$("#salesmanCode").val(channelCustomerEdit.salesmanCode);				//渠道员工工号
			$("#salesmanMobile").val(channelCustomerEdit.salesmanMobile);			//渠道员工名称
			$("#salesmanName").val(channelCustomerEdit.salesmanName);				//渠道员工手机号码
			$("#remark").val(channelCustomerEdit.remark);					//备注		
		}
	}else{
		modelAlert(data.statusMessage)
	}
}


//查询推荐人信息查询
function isWhiteRequest(obj){
	var whiteCode = $.trim($(obj).val());
	if($.isNull(whiteCode)){
		$("#ywyCode").val('');
		$("#ywyName").val( '' );
		$("#ywyCompany").val( '');
		$("#ywyCompany").attr("name", '');
		$("#ywySubPany").val( '');
		$("#ywySubPany").attr("name", '');
		return false;
	}
	var url = base.url + 'agent/isWhite.do';
	var sendJson = {
			"head":{
				"channel": "02",
		        "userCode": mobile,
		        "transTime": $.getTimeStr(),
		        "transToken":''
			},
			"body":{
				"customerId" : customerId,
				"recommendId": whiteCode
			}
	}
	$.reqAjaxsFalse( url, sendJson, isWhiteCallBack );
}

function isWhiteCallBack( data ){
	console.log(data);
	if( data.statusCode == "000000" ){
		var body         = data.returns;
		var coreWhiteDto = body.coreWhiteDto;		
		var whiteName         = coreWhiteDto.name;				//推荐人姓名
		//var recommendCode     = coreWhiteDto.recommendCode;		//推荐人代码
		var recommendMobile   = coreWhiteDto.mobile;			//推荐人手机号
		var recommendIdno     = coreWhiteDto.idNo;
		var reComProvinceCode = coreWhiteDto.provinceCode;	
		var reComProvinceName = coreWhiteDto.provinceName;
		var reComCityCode     = coreWhiteDto.cityCode;
		var reComCityName     = coreWhiteDto.cityName;
		var comcode           = coreWhiteDto.comcode;			//归属机构代码
		var teamCode          = coreWhiteDto.teamCode;			//归属团队代码
		var teamName		  = coreWhiteDto.teamName;			//归属团队名称
		$("#ywyName").val( whiteName );
		$("#ywyCompany").val(reComProvinceName );
		$("#ywyCompany").attr("name",reComProvinceCode);
		$("#ywySubPany").val(reComCityName);
		$("#ywySubPany").attr("name",reComCityCode);								
	}else{
		chaoFlag = 'chao'
		$("#ywyCode").val('');
		$("#ywyName").val( '' );
		$("#ywyCompany").val( '');
		$("#ywyCompany").attr("name", '');
		$("#ywySubPany").val( '');
		$("#ywySubPany").attr("name", '');
		modelAlert(data.statusMessage,'',chao);		
		return false;
	}
}

function loadArea(provincode){
	var url = base.url + 'channel/loadArea.do';
	var reqData = {'request':{'provinceCode':provincode}}
	if( $.isNull(provincode)){
		$.reqAjaxsFalse( url, reqData, loadPrivinceCallback );
	}else{
		$.reqAjaxsFalse( url, reqData, loadCityCallback );
	}
	
}
function loadPrivinceCallback(data){
	console.log(data);
	if( data.statusCode == "000000"){
		var lists = data.returns.list;
		$("#orgProvinceCode").unbind('tap').bind('tap',function(){
			var selectPicker = new mui.PopPicker();
			var popArray = [];
			for( var i = 0; i < lists.length; i++ ){
				var item ={ 
						"text":lists[i].name,
						"value":lists[i].code
						}
				popArray.push(item);
			}
			selectPicker.setData(popArray);
			selectPicker.show(function(item){
				$("#orgProvinceCode").text(item[0].text);
				$("#orgProvinceCode").attr('name',item[0].value);
				$("#orgCityCode").text('请选择');		//清空
				$("#orgCityCode").attr('name','');		//清空
				$("#qdName").text('请选择');				//清空
				$("#qdName").attr('name','');			//清空
				$("#qdDotName").text('请选择');			//清空
				$("#qdDotName").attr('name','');		//清空
				$("#qdDotName").attr('isShow','');
				loadArea(item[0].value)
			});
		});
		
	}else{
		modelAlert(data.statusMessage);
	}
}
function loadCityCallback(data){
	console.log("加载城市")
	console.log(data)
	if( data.statusCode == "000000"){	
		var lists = data.returns.list;
		$("#orgCityCode").unbind('tap').bind('tap',function(){
			if(!$("#orgProvinceCode").attr('name')){
				modelAlert('请先选择渠道所属省！');
				return false;
			}
			var selectPicker1 = new mui.PopPicker();
			var popArray = [];
			for( var i = 0; i < lists.length; i++ ){
				var item ={ 
						"text":lists[i].name,
						"value":lists[i].code
						}
				popArray.push(item);
			}
			selectPicker1.setData(popArray);
			selectPicker1.show(function(item){
				$("#orgCityCode").text(item[0].text);
				$("#orgCityCode").attr('name',item[0].value);
				$("#qdName").text('请选择');				//清空
				$("#qdName").attr('name','');			//清空
				$("#qdDotName").text('请选择');			//清空
				$("#qdDotName").attr('name','');		//清空
				$("#qdDotName").attr('isShow','');
				loadChannel(item[0].value)
			});
		});
	}else{
		modelAlert(data.statusMessage);
	}
}

function loadChannel(citycode){
	var url = base.url + 'channel/loadChannel.do';
	var reqData = {
			'request':{
				"cityCode" : citycode
			}
	}
	$.reqAjaxs( url, reqData, loadChannelCallback );
}

function loadChannelCallback(data){
	console.log("加载渠道")
	console.log(data)
	if( data.statusCode == "000000"){	
		var lists = data.returns.list;
		$("#qdName").unbind('tap').bind('tap',function(){
			if(!$("#orgProvinceCode").attr('name')){modelAlert('请先选择渠道所属省！');return false;}
			if(!$("#orgCityCode").attr('name')){modelAlert('请先选择渠道所属市！！');return false;}
			var selectPicker2 = new mui.PopPicker();
			var popArray = [];
			for( var i = 0; i < lists.length; i++ ){
				var item ={ 
						"text":lists[i].channelName,
						"value":lists[i].channelCode
						}
				popArray.push(item);
			}
			selectPicker2.setData(popArray);
			selectPicker2.show(function(item){
				$("#qdName").text(item[0].text);
				$("#qdName").attr('name',item[0].value);
				$("#qdDotName").text('请选择');			//清空
				$("#qdDotName").attr('name','');	//清空
				$("#qdDotName").attr('isShow','');
				$("#salesmanCode").val('');				//渠道员工工号
				$("#salesmanMobile").val('');			//渠道员工名称
				$("#salesmanName").val('');				//渠道员工手机号码
				loadDot(item[0].value)
			});
		});
	}else{
		modelAlert(data.statusMessage);
		return false;
	}
}

function loadDot(qdcode){
	var url = base.url + 'channel/loadDot.do';
	var reqData = {
			'request':{
				"cityCode":$("#orgCityCode").attr('name'),
				"channelCode" : qdcode
			}
	}
	$.reqAjaxs( url, reqData, loadDotCallback );
}

function loadDotCallback(data){
	if( data.statusCode == "000000"){	
		var lists = data.returns.list;
		$("#qdDotName").unbind('tap').bind('tap',function(){
			if(!$("#orgProvinceCode").attr('name')){modelAlert('请先选择渠道所属省！');return false;}
			if(!$("#orgCityCode").attr('name')){modelAlert('请先选择渠道所属市！');return false;}
			if(!$("#qdName").attr('name')){modelAlert('请先选择渠道名称！');return false;}
			var selectPicker2 = new mui.PopPicker();
			var popArray = [];
			for( var i = 0; i < lists.length; i++ ){
				var item ={ 
						"text":lists[i].dotName,
						"value":lists[i].dotCode,
						"isShow":lists[i].isShow,
						"agentId":lists[i].agentId
						}
				popArray.push(item);
			}
			selectPicker2.setData(popArray);
			selectPicker2.show(function(item){
				$("#qdDotName").text(item[0].text);
				$("#qdDotName").attr('name',item[0].value);
				$("#qdDotName").attr('agentId',item[0].agentId);
				$("#qdDotName").attr('isShow',item[0].isShow);
			});
		});
	}else{
		modelAlert(data.statusMessage);
		return false;
	}
}
//验证工号
function validateSalesManInfo(obj){
	if( $.trim($(obj).val()) == '' ){return false;}
	if(!$('#qdName').attr('name')){modelAlert('请先选择渠道！');return false;}
	if($("#qdDotName").attr('isShow') != '1'){return false;}
	var url = base.url + 'channel/validateSalesManInfo.do';
	var reqData = {
			'request':{
				"salesManCode" : $.trim($(obj).val()), // 工号
				"channelCode" : $('#qdName').attr('name')
			}
	}
	$.reqAjaxsFalse( url, reqData, validateSalesManInfoCallback );
}

function validateSalesManInfoCallback(data){
	if(data.statusCode == '000000'){
		if(JSON.stringify(data.returns) == '{}'){
			modelAlert('该渠道工号不存在！','',chao);
			$("#salesmanCode").val('');				//渠道员工工号
			$("#salesmanMobile").val('');			//渠道员工名称
			$("#salesmanName").val('');				//渠道员工手机号码
			chaoFlag = 'chao'
		}else{
			$('#salesmanMobile').val(data.returns.salesMan.salesmanMobile);
			$('#salesmanName').val(data.returns.salesMan.salesmanName);
		}		
	}else{
		chaoFlag = 'chao'
		$("#salesmanCode").val('');				//渠道员工工号
		$("#salesmanMobile").val('');			//渠道员工名称
		$("#salesmanName").val('');				//渠道员工手机号码
		modelAlert(data.statusMessage,'',chao);
		return false;
	}
	
}

function getFormData(){
	var formData = {};
	var agentId 				= $("#qdDotName").attr('agentId');
	var bySalesmanCode 			= $.trim($("#ywyCode").val()); //业务员工号
	var bySalesmanName 			= $("#ywyName").val(); //业务员名称
	var bySalesmanOrgCode 		= $("#ywyCompany").attr('name');//业务员分公司
	var bySalesmanOrgName 		= $("#ywyCompany").val();
	var bySalesmanSubOrgCode 	= $("#ywySubPany").attr('name');//业务员中支机构
	var bySalesmanSubOrgName 	= $("#ywySubPany").val();
	
	var salesProvinceCode 		= $("#orgProvinceCode").attr('name');			//渠道所属地区
	var salesProvinceName 		= $("#orgProvinceCode").text();
	var salesCityCode 			= $("#orgCityCode").attr('name');		//渠道所属地区
	var salesCityName 			= $("#orgCityCode").text();
	var salesChannelCode		= $("#qdName").attr('name');			//渠道名称
	var salesChannelName		= $("#qdName").text();
	var dotCode 				= $("#qdDotName").attr('name');			//渠道网点名称
	var dotName 				= $("#qdDotName").text();
	var isShow 				    = $("#qdDotName").attr('isShow');			//渠道网点名称
	var salesmanCode 			= $.trim($("#salesmanCode").val());				//渠道员工工号
	var salesmanMobile 			= $.trim($("#salesmanMobile").val());			//渠道员工名称
	var salesmanName 			= $.trim($("#salesmanName").val());				//渠道员工手机号码
	var remark					= $("#remark").val();					//备注
	
	if($.isNull(salesProvinceCode)){modelAlert('请选择渠道所属省');return false;}
	if($.isNull(salesCityCode)){modelAlert('请选择渠道所属市');return false;}
	if($.isNull(salesChannelCode)){modelAlert('请选择渠道名称');return false;}
	if($.isNull(dotCode)){modelAlert('请选择渠道网点名称');return false;}
	if($.isNull(salesmanMobile)){
		salesmanCode = '';
		salesmanMobile = '';
		salesmanName = '';
	}
	if($.isNull(bySalesmanName)&& !$.isNull(bySalesmanCode)){
		bySalesmanCode = '';
		modelAlert('该工号不存在！');
	}
	if($.isNull($('#ywyCode').val())){
		formData.byIsShow	= '0';
	}else{
		formData.byIsShow	= '1';
	}
	formData.isShow				  = isShow;
	formData.agentId 			  = agentId;
	formData.bySalesmanCode       = bySalesmanCode;
	formData.bySalesmanName       = bySalesmanName;
	formData.bySalesmanOrgCode    = bySalesmanOrgCode;
	formData.bySalesmanOrgName    = bySalesmanOrgName;
	formData.bySalesmanSubOrgCode = bySalesmanSubOrgCode;
	formData.bySalesmanSubOrgName = bySalesmanSubOrgName;
	
	formData.salesProvinceCode    = salesProvinceCode;
	formData.salesProvinceName    = salesProvinceName;
	formData.salesCityCode        = salesCityCode;
	formData.salesCityName        = salesCityName;
	formData.salesChannelCode     = salesChannelCode;
	formData.salesChannelName     = salesChannelName;
	formData.dotCode              = dotCode;
	formData.dotName              = dotName;
	formData.salesmanCode         = salesmanCode;
	formData.salesmanMobile       = salesmanMobile;
	formData.salesmanName         = salesmanName;
	formData.remark               = remark;
	
	return formData;
}

function saveShowInfo(){
	var formData = getFormData();
	var url = base.url + 'channel/saveShowInfo.do';
	formData.customerId = customerId;
	var reqData = {
			'request':formData
	}
	$.reqAjaxs( url, reqData, saveShowInfoCallback );
}

function saveShowInfoCallback(data){
	console.log(data)
	if(data.statusCode == '000000'){
		var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
			urlParm.provinceCode = $("#orgProvinceCode").attr('name');
			urlParm.cityCode = $("#orgCityCode").attr('name');
			urlParm.agentId = $("#qdDotName").attr('agentId');
			urlParm.salesChannels = $("#qdName").attr('name');
			urlParm.title = '保险商城';
			urlParm.rightIco = '6';			//出单二维码
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
		window.location.href = base.url + 'weixin/insureChannels/insuranceMall/insuranceMall.html?jsonKey=' + jsonStr;
	}
}

//跳转到下个页面
function toInsuranceMall(){
	if($('#isGou').hasClass("on")){
		
	}else{
		if($.isNull($("#ywyCode").val())){
			modelAlert("请填写渠道出单所属佰盈业务员工号");
			return false;
		}
		isWhiteRequest(document.getElementById('ywyCode'))		
	}
	
	if( $("#qdDotName").attr('isShow') == '1' ){
		validateSalesManInfo(document.getElementById('salesmanCode'))
	}	
	if(chaoFlag == 'chao'){
		return false;
	}
	saveShowInfo();
	
}
function chao(){
	chaoFlag = '';
}

//返回上一页
//app:返回渠道出单首页weixin/insureChannels/index.html 参数jsonkey
//分享：不显示或者关闭
//微信：返回渠道出单首页weixin/insureChannels/index.html	参数&字符参openid=ohNt9vx44UP2EnqzE6_C2dOXZQ4Q&mobile=12300000000&cusId=89884&roletype=01
function backlast(){
	if( entry == 'app' ){
		urlParm.title = '渠道出单';
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
		window.location.href = base.url + 'weixin/insureChannels/index.html?jsonKey='+jsonStr;
	}else if( entry == 'qudao'){
		window.location.href = base.url + 'weixin/insureChannels/index.html?openid='+openid+'&mobile='+mobile+'&cusId='+customerId+'&roletype='+roleType;
	}
}