$(function(){
	cityListResponse();//所在位置列表
});

function  cityListResponse(){
	var url = base.url + 'position/getAllPosition.do';
	var reqData = {
		'head':{
			'channel':'02',
			'userCode':mobile,
			'transTime':$.getTimeStr(),
			'transToken':''			
		},
		'body':{
			'systemFlag':'ios'			
		}
	}
	$.reqAjaxs( url, reqData, cityListCallback );
}

function cityListCallback(data){
	console.log(data);
	if( data.statusCode == '000000' ){
		var positions = data.returns.positions;
		var posLength = positions.length;
		for( var i = 0; i < posLength; i++ ){
			var groupName = positions[i].groupName;
			var entities  = positions[i].entities;
			if( entities.length != 0 ){
				$("#listUl").append('<li><h2 class="index-list-anchor">'+groupName+'</h2><ul id="cityGrounp'+i+'"></ul></li>');
				for( var j = 0; j < entities.length; j++ ){
					$('#cityGrounp'+i).append('<li class="index-list-item border-bottom-1px" data-provinceid="'+entities[j].provinceId+'" data-cityid="'+entities[j].cityId+'" data-agentid="'+entities[j].agentId+'" data-cityname="'+entities[j].cityName+'" data-provinname="'+entities[j].provinceName+'" onclick="saveLocation(this)" >'+entities[j].cityName+'</li>');
				}
			}			
		}
	}
}


function saveLocation(obj){
	agentId = $(obj).attr('data-agentid');
	provinceCode = $(obj).attr('data-provinceid');
	cityCode = $(obj).attr('data-cityid');
	var provinname = $(obj).attr('data-provinname');
	var cityname = escape($(obj).attr('data-cityname'));
   if($.isNull(customerId)){
	   var parmWechat = '?cusId=&mobile=&roletype=00&openid=' + openid + '&agentId='+agentId+'&cityName='+cityname+'&cityCode='+cityCode +'&provinceCode='+provinceCode;
	   window.location.href = base.url + 'weixin/insuranceMall/mall/insuranceMall.html' + parmWechat;
	   return false;
   }
	var url = base.url + "customer/updateCityInfo.do";
	var reqData = {
			'head':{
				'channel':'02',
				'userCode':mobile,
				'transTime':$.getTimeStr(),
				'transToken':''			
			},
			'body':{
				'customerId'   : customerId,
				'agentId'      : $(obj).attr('data-agentid'),
				'provinceCode' : $(obj).attr('data-provinceid'),
				'provinceName' : $(obj).attr('data-provinname'),
				'cityCode'     : $(obj).attr('data-cityid'),
				'cityName'     : $(obj).attr('data-cityname')
			}	
	}
	
	$.reqAjaxsFalse( url, reqData, saveLocationCallback  );
}

function saveLocationCallback(data){
	if( data.statusCode == "000000" ){
		//?cusId=812&mobile=13852291705&roletype=01&openid=ohNt9vx44UP2EnqzE6_C2dOXZQ4Q
		var parmWechat = '?cusId=' + customerId
				+ '&mobile=' + mobile
				+ '&roletype=' + roleType
				+ '&openid=' + openid
		window.location.href = base.url + 'weixin/insuranceMall/mall/insuranceMall.html' + parmWechat;
	}
}















