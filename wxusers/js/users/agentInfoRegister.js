var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
var customerId = urlParm.customerId;//"812";//
var mobile     = urlParm.phone; //"13852291705";//
var transToken = "";//"b16e2692964b9887e1133604a11cc1cc";//
var idNo	   = urlParm.ID;//"32068119940124621X";//
var name	   = urlParm.name;    //"吴赛杰";//
//var base = {
//		url : "http://td-sit.ta-by.com/tongdaoPlatform/"
//}
var requestUrl = {
		saveInfoUrl  : base.url + 'agent/saveAgent.do',   //@zkl 保存代理人信息
		queryInfoUrl : base.url + 'agent/agentQuery.do',   //@zkl 代理人信息查询
		isWhiteUrl   : base.url + 'agent/isWhite.do',	  //@zkl 引荐人信息查询
		bankListUrl  : base.url + 'bank/bankList.do',		//@zkl 银行列表
		provinceUrl  : base.url + 'bank/provinceCitys.do',	//@zkl	银行所在地区列表
		bankSubsUrl  : base.url + 'bank/bankSubs.do'		//@zkl   支行列表
}
$(function(){
	$.setscroll();
	$("#agentName").val(name);
	$("#agentMobile").val(mobile);
	$("#agentIdNo").val(idNo);
	queryInfoRequest();
	
	//点击出来可选下拉框
	openDicMuiList("agentEdu", "bx_education", "", true);//学历	
	openDicMuiList("agentNation", "bx_nation", "", true);//民族		
	openDicMuiList("agentPolity", "bx_politics", "", true);//政治面貌
	
	bankListRequest();
//	getBankAreaListRequest( "BOC" )
//	getBankSubsList( "ABC", "1400", "1404" );
	saveInfoBind();
//	isWhiteRequest();
	$("#agentBankArea").unbind("tap").bind("tap",function(){
		if($.isNull($("#agentBank").val())){
			modelAlert("请先选择开户行");
			return false;
		}
	});
	$("#agentBankName").unbind("tap").bind("tap",function(){
		if($.isNull($("#agentBank").val())){
			modelAlert("请先选择开户行");
			return false;
		}
		if($.isNull($("#agentBankArea").val())){
			modelAlert("请先选择开户行所属区域");
			return false;
		}
	});
});

//查询代理人信息
function queryInfoRequest(){
	var url = requestUrl.queryInfoUrl;
	var sendJson = {
			"head":{
				"channel": "02",
		        "userCode": mobile,
		        "transTime": $.getTimeStr(),
		        "transToken":transToken
			},
			"body":{
				"customerId" : customerId,
				"type"		 : "1"
			}
	}
	$.reqAjaxs( url, sendJson, queryInfoCallBack );
}

function queryInfoCallBack( data ){
	console.log(data);
	if( data.statusCode == "000000" ){
		var agentInfo = data.returns.agentInfo;
		$("#agentArea").attr( "data-agentid",agentInfo.agentId);
		$("#agentWhite").val(agentInfo.recommendAgentCode);
		$("#agentWhite").attr( "data-name",agentInfo.recommendAgentName);
		$("#agentWhite").attr( "data-mobile",agentInfo.recommendAgentMobile);
		$("#agentWhite").attr( "data-idno",agentInfo.recommendAgentIdno);
		$("#agentWhite").attr( "data-tcode",agentInfo.teamNo);		//归属团队代码
		$("#agentWhite").attr( "data-tname",agentInfo.teamInfo);			//归属团队名称
		$("#agentArea").attr( "data-provicecode",agentInfo.workProvinceCode );		//省代码
		$("#agentArea").attr( "data-provicename",agentInfo.workProvinceName);		//省名称
		$("#agentArea").attr( "data-citycode",agentInfo.workCityCode);		//市代码
		$("#agentArea").attr( "data-cityname",agentInfo.workCityName);		//市名称
		$("#agentArea").val(agentInfo.workProvinceName +" "+agentInfo.workCityName);
		var nationStr = agentInfo.nation.split(',');
		var educationStr = agentInfo.education.split(',');
		var polityStr = agentInfo.politicalLandscape.split(',');
		$("#agentNation").attr("name",nationStr[0]);		//民族
		$("#agentNation").val(nationStr[1]);
		$("#agentEdu").attr("name",educationStr[0]);		//学历
		$("#agentEdu").val(educationStr[1]);
		$("#agentPolity").attr("name",polityStr[0]);		//政治面貌
		$("#agentPolity").val(polityStr[1]);
		$("#agentBank").attr("data-code",agentInfo.bankCode);	//开户总行代码
		$("#agentBank").attr("data-name",agentInfo.bankName);	//开户总行名称
		$("#agentBank").val(agentInfo.bankName);
		$("#agentBankArea").attr("data-pcode",agentInfo.bankPrivinceCode);	//开户银行所在省代码
		$("#agentBankArea").attr("data-pname",agentInfo.bankPrivinceName); 	//开户银行所在省名称		
		$("#agentBankArea").attr("data-ccode",agentInfo.bankCityCode); 	//开户银行所在市代码
		$("#agentBankArea").attr("data-cname",agentInfo.bankCityName); 	//开户银行所在市名称
		$("#agentBankArea").val(agentInfo.bankPrivinceName +" "+agentInfo.bankCityName);
		$("#agentBankName").attr("data-code",agentInfo.bankSubCode); 	//开户行代码
		$("#agentBankName").attr("data-name",agentInfo.bankSubName); 	//开户行名称
		$("#agentBankName").val(agentInfo.bankSubName);
		$("#agentAccount").val(agentInfo.certificateCode); 	//银行卡号
	}else{
		
	}
}

//查询推荐人信息查询
function isWhiteRequest(obj){
	var whiteCode = $(obj).val();
	if($.isNull(whiteCode)){
		modelAlert("请先填写推荐人工号！");
		return false;
	}
	var url = requestUrl.isWhiteUrl;
	var sendJson = {
			"head":{
				"channel": "02",
		        "userCode": mobile,
		        "transTime": $.getTimeStr(),
		        "transToken":transToken
			},
			"body":{
				"customerId" : customerId,
				"recommendId": whiteCode
			}
	}
	$.reqAjaxs( url, sendJson, isWhiteCallBack );
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
		$("#agentWhite").attr( "data-name", whiteName );
		//$("#agentWhite").attr( "data-code", recommendCode);
		$("#agentWhite").attr( "data-mobile", recommendMobile );
		$("#agentWhite").attr( "data-idno", recommendIdno );
		$("#agentWhite").attr( "data-tcode", teamCode );
		$("#agentWhite").attr( "data-tname", teamName );
		
		$("#agentArea").attr( "data-agentid", comcode );		
		$("#agentArea").val( reComProvinceName + " "+ reComCityName );
		$("#agentArea").attr( "data-provicename", reComProvinceName );
		$("#agentArea").attr( "data-cityname", reComCityName );
		$("#agentArea").attr( "data-provicecode", reComProvinceCode );
		$("#agentArea").attr( "data-citycode", reComCityCode );
				
	}else{
		modelAlert(data.statusMessage);
		$("#agentArea").attr( "data-agentid", "" );		
		$("#agentArea").val("");
		$("#agentArea").attr( "data-provicename", "" );
		$("#agentArea").attr( "data-cityname", "" );
		$("#agentArea").attr( "data-provicecode", "" );
		$("#agentArea").attr( "data-citycode", "" );
		return false;
	}
}

//银行
function bankListRequest(){
	var url = requestUrl.bankListUrl;
	var sendJson = {
			"head":{
				"channel": "02",
		        "userCode": mobile,
		        "transTime": $.getTimeStr(),
		        "transToken":transToken
			},
			"body":{
				
			}
	}
	$.reqAjaxs( url, sendJson, bankListCallBack );
}

//
function bankListCallBack( data ){
	$("#agentBank").unbind("tap").bind("tap",function(){
		var paramlist = data.returns.bankList;
		var selectPicker = new mui.PopPicker();	
		selectPicker.setData(paramlist);
		selectPicker.show(function(items) {
			var bankCode = items[0].value;
			var bankName = items[0].text;
			$("#agentBank").val(bankName);
			$("#agentBank").attr("data-name",bankName);
			$("#agentBank").attr("data-code",bankCode);
			
			$("#agentBankArea").attr("data-pcode","");			
			$("#agentBankArea").attr("data-ccode","");
			$("#agentBankArea").attr("data-pname","");			
			$("#agentBankArea").attr("data-cname","");
			$("#agentBankArea").val("");
			
			$("#agentBankName").val("");
			$("#agentBankName").attr("data-name","");
			$("#agentBankName").attr("data-code","");
			getBankAreaListRequest( bankCode );
		})
	})
}

//获取区域
function getBankAreaListRequest( bankCode ){
	if($.isNull(bankCode)){
		modelAlert("请先选择开户银行");
		return false;
	}	
	var url = requestUrl.provinceUrl;
	var sendJson = {
			"head":{
				"channel": "02",
		        "userCode": mobile,
		        "transTime": $.getTimeStr(),
		        "transToken":transToken
			},
			"body":{
				"bankCode" : bankCode
			}
	}
	$.reqAjaxs( url, sendJson, getBankAreaListCallBack );
}

function getBankAreaListCallBack(data){
	$("#agentBankArea").unbind("tap").bind("tap",function(){
		var bankCode=$("#agentBank").attr("data-code");
		
		var bankquyuPicker = new mui.PopPicker({layer:2});
		bankquyuPicker.setData(data.returns.provinceCitys);
		bankquyuPicker.show(function(items) {
			var pcode = items[0].value;
			var pname = items[0].text;
			var ccode = items[1].value;
			var cname = items[1].text;
			$("#agentBankArea").attr("data-pcode",pcode);			
			$("#agentBankArea").attr("data-ccode",ccode);
			$("#agentBankArea").attr("data-pname",pname);			
			$("#agentBankArea").attr("data-cname",cname);
			$("#agentBankArea").val(pname+" "+cname);
			
			$("#agentBankName").val("");
			$("#agentBankName").attr("data-name","");
			$("#agentBankName").attr("data-code","");
			getBankSubsList( bankCode, pcode, ccode );
		});
	})
}

//获取支行名
function getBankSubsList( bankCode, pcode, ccode ){
	if($.isNull(pcode) || $.isNull(ccode)){
		modelAlert("请先选择开户行所属区域");
		return false;
	}
	var url = requestUrl.bankSubsUrl;
	var sendJson = {
			"head":{
				"channel": "02",
		        "userCode": mobile,
		        "transTime": $.getTimeStr(),
		        "transToken":transToken
			},
			"body":{
				"bankCode" : bankCode,
				"bankProvinceCode" : pcode,
				"bankCityCode" : ccode
			}
	}
	$.reqAjaxs( url, sendJson, getBankSubsListCallBack );
}

function getBankSubsListCallBack(data){
	$("#agentBankName").unbind("tap").bind("tap",function(){
		var paramlist = data.returns.bankSubs;
		var selectPicker = new mui.PopPicker();		
		selectPicker.setData(paramlist);
		selectPicker.show(function(items) {
			var bankSubName = items[0].text;
			var bankSubCode = items[0].value;
			$("#agentBankName").val(bankSubName);
			$("#agentBankName").attr("data-name",bankSubName);
			$("#agentBankName").attr("data-code",bankSubCode);
		})
	})
}
//保存代理人信息
function saveAgentInfoRequest(formData){
	var url = requestUrl.saveInfoUrl;
	var sendJson = {
			"head":{
				"channel": "02",
		        "userCode": mobile,
		        "transTime": $.getTimeStr(),
		        "transToken":transToken
			},
			"body":{
				"customerId"          : customerId,
				"mobile"			  : mobile,
				
				"agentId"			  : formData.agentId,			//机构编码	
				"recommendAgentCode"  : formData.recomWcode,		//推荐人工号		
				"recommendAgentName"  : formData.recomWname,		//推荐人姓名
				"recommendAgentMobile": formData.recomWphon,		//推荐人手机号
				"recommendAgentIdno"  : formData.agentWidno,		//推荐人身份证
				"teamNo"			  : formData.agentTcode,
				"teamInfo"            : formData.agentTname,
				
				"workProvinceCode"    : formData.agentPcode,		//省代码
				"workProvinceName"    : formData.agentPname,		//省名称
				"workCityCode"        : formData.agentCcode,		//市代码
				"workCityName"		  : formData.agentCname,		//市名称
									
				"nation"			  : formData.agentNation,		//民族
				"education"           : formData.agentEdu,			//学历
				"politicalLandscape"  : formData.agentPolity,		//政治面貌
				
				"bankCode"			  : formData.agentBankCode,
				"bankName"			  : formData.agentBankName,
				"bankPrivinceCode"    : formData.agentBankPcode,	//开户银行所在省代码
				"bankPrivinceName"    : formData.agentBankPname, 	//开户银行所在省名称
				"bankCityCode"        : formData.agentBankCcode, 	//开户银行所在市代码
				"bankCityName"        : formData.agentBankCname, 	//开户银行所在市名称
				"bankSubCode"         : formData.agentBankScode, 	//开户行代码
				"bankSubName"         : formData.agentBankSname, 	//开户行名称
				"certificateCode"     : formData.agentAccount    	//银行卡号				
			} 
		}
	$.reqAjaxs( url, sendJson, saveInfoCallBack );
}

//回调
function saveInfoCallBack( data ){
	if( data.statusCode == "000000" ){
		window.location.href = "addImage.html?jsonKey="+getUrlQueryString("jsonKey");
	}
}

//绑定下一步按钮
function saveInfoBind(){
	$("#confirm").unbind('tap').bind('tap',function(){
		var formData = getFormData();
		saveAgentInfoRequest(formData);
	});
}


//获取表单信息
function getFormData(){
	var formData = {};
	
	var agentId    = $("#agentArea").attr( "data-agentid");
	var recomWcode = $("#agentWhite").val();
	var recomWname = $("#agentWhite").attr( "data-name");
	var recomWphon = $("#agentWhite").attr( "data-mobile");
	var agentWidno = $("#agentWhite").attr( "data-idno");
	var agentTcode = $("#agentWhite").attr( "data-tcode");		//归属团队代码
	var agentTname = $("#agentWhite").attr( "data-tname");			//归属团队名称
	var agentPcode = $("#agentArea").attr( "data-provicecode" );		//省代码
	var agentPname = $("#agentArea").attr( "data-provicename");		//省名称
	var agentCcode = $("#agentArea").attr( "data-citycode");		//市代码
	var agentCname = $("#agentArea").attr( "data-cityname");		//市名称
						
	var agentNation = $("#agentNation").attr("name");		//民族
	var agentEdu    = $("#agentEdu").attr("name");		//学历
	var agentPolity = $("#agentPolity").attr("name");		//政治面貌
	
	var agentBankCode  = $("#agentBank").attr("data-code");	//开户总行代码
	var agentBankName  = $("#agentBank").attr("data-name");	//开户总行名称
	var agentBankPcode = $("#agentBankArea").attr("data-pcode");	//开户银行所在省代码
	var agentBankPname = $("#agentBankArea").attr("data-pname"); 	//开户银行所在省名称
	var agentBankCcode = $("#agentBankArea").attr("data-ccode"); 	//开户银行所在市代码
	var agentBankCname = $("#agentBankArea").attr("data-cname"); 	//开户银行所在市名称
	var agentBankScode = $("#agentBankName").attr("data-code"); 	//开户行代码
	var agentBankSname = $("#agentBankName").attr("data-name"); 	//开户行名称
	var agentAccount = $("#agentAccount").val(); 	//银行卡号
	
	////////////////////////////////////////////////////
	if ($.isNull(recomWcode)) {
		modelAlert("推荐人工号不能为空！");
		return false;
	}
	if($.isNull(agentPcode) || $.isNull(agentCcode)){
		modelAlert("入职地区不能为空！");
		return false;
	}
	if($.isNull(agentNation)){
		modelAlert("民族不能为空！");
		return false;
	}
	if($.isNull(agentEdu)){
		modelAlert("学历不能为空！");
		return false;
	}
	if($.isNull(agentPolity)){
		modelAlert("政治面貌不能为空！");
		return false;
	}
	if($.isNull(agentBankCode)){
		modelAlert("开户银行不能为空！");
		return false;
	}
	if($.isNull(agentBankPcode) || $.isNull(agentBankCcode)){
		modelAlert("所属区域不能为空！");
		return false;
	}
	if($.isNull(agentBankScode)){
		modelAlert("支行名称不能为空！");
		return false;
	}
	if($.isNull(agentAccount)){
		modelAlert("银行卡号不能为空！");
		return false;
	}
	formData.agentId = agentId;
	formData.recomWcode = recomWcode;
	formData.recomWname = recomWname;
	formData.recomWphon = recomWphon;
	formData.agentWidno = agentWidno;
	formData.agentTcode = agentTcode;
	formData.agentTname = agentTname;
	formData.agentPcode = agentPcode;		//省代码
	formData.agentPname = agentPname;		//省名称
	formData.agentCcode = agentCcode;		//市代码
	formData.agentCname = agentCname;		//市名称
						
	formData.agentNation = agentNation;		//民族
	formData.agentEdu    = agentEdu;		//学历
	formData.agentPolity = agentPolity;		//政治面貌
	
	formData.agentBankCode  = agentBankCode;	//开户总行代码
	formData.agentBankName  = agentBankName;	//开户总行名称
	formData.agentBankPcode = agentBankPcode;	//开户银行所在省代码
	formData.agentBankPname = agentBankPname; 	//开户银行所在省名称
	formData.agentBankCcode = agentBankCcode; 	//开户银行所在市代码
	formData.agentBankCname = agentBankCname; 	//开户银行所在市名称
	formData.agentBankScode = agentBankScode; 	//开户行代码
	formData.agentBankSname = agentBankSname; 	//开户行名称
	formData.agentAccount   = agentAccount  	//银行卡号	
	return formData;
}
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#order_index").height(Scrollheight + "px");
	mui("#order_index").scroll();
};
function backlast(){
	sysback();
}