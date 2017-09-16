$(function(){
	/**页面滑动设置*/
	$.setscrollarea("accprice_index");
	var str = window.location.search;
	str = str.substr(9, str.length);
	str = UrlDecode(str);
	parm = JSON.parse(str);
	cxSessionId = parm.body.cxSessionId;
	var url = base.url + "cx/getAllInfo.do";
	var data = {
		"sessionId" : cxSessionId,// 车险投保唯一流水号
	};
	$.toAjaxs(url, data, $.loadData);
	
	/**--返回--*/
	$(".h_back,.backDown").unbind("tap").bind("tap",function() {
		window.location.href="quote.html"+window.location.search;
	});
})
$.loadData=function(param){
	param = eval("(" + param + ")");
    if (param != null || param != "") {
		console.log(param)
		if (param.status.statusCode == "000000") {
			if (param.cxInfo != null) {
				// 总保费
				$("#summoney").html("￥"+ $.formatNumOfTwo(param.cxInfo.cxOffer.totalpremium));// ￥7200.00

				
				var businessPre=param.cxInfo.cxOffer.businessPre;
				var jqxPre=param.cxInfo.cxOffer.jqxPre;//交强险
				var vehicletaxPre=param.cxInfo.cxOffer.vehicletaxPre;//车船税
				// 商业险保费
				$("#busmoney").html("￥"+$.formatNumOfTwo(businessPre));// 6000.00
				if(businessPre!=0){
					//起保时间
					$("#bus_start_date").val(timeFormatDate(param.cxInfo.cxOffer.businessBegindate.time, 'yyyy-MM-dd'))
					//起保时间
					$("#businessBegindate").html(timeFormatDate(param.cxInfo.cxOffer.businessBegindate.time, 'yyyy-MM-dd'))
					//终保时间时间
					$("#businessEnddate").html(timeFormatDate(param.cxInfo.cxOffer.businessEnddate.time, 'yyyy-MM-dd'))
				    $("#busTime,#syDate").show();
				}
				// 交强险总保费
				$("#jqxmoney").html("￥"+$.formatNumOfTwo(jqxPre+vehicletaxPre));// 900.00
				if(jqxPre!=0){
					//起保时间
					$("#start_date").val(timeFormatDate(param.cxInfo.cxOffer.jqxBegindate.time, 'yyyy-MM-dd'))
					// 交强险保费
					$("#jqxPre").html("￥"+$.formatNumOfTwo(jqxPre));// 900.00
					//起保时间
					$("#jqxBegindate").html(timeFormatDate(param.cxInfo.cxOffer.jqxBegindate.time, 'yyyy-MM-dd'))
					//终保时间时间
					$("#jqxEnddate").html(timeFormatDate(param.cxInfo.cxOffer.jqxEnddate.time, 'yyyy-MM-dd'))
					$("#jqxTr,#jqxTime,#jqDate").show();
				}
				if(vehicletaxPre!=0){
					//车船税
					$("#vehicletaxPre").html("￥"+$.formatNumOfTwo(vehicletaxPre));// 900.00
					$("#vehicletaxTr").show();
				}
				
				//交强险风险等级
				$("#jqpj").html(changeLevel(param.cxInfo.cxOrder.elrLevelCtp));
				//商业险风险等级
				$("#sypj").html(changeLevel(param.cxInfo.cxOrder.elrLevelCom));
				
				
				function PriceMes(policyTypeFlag, policyname, price, baoeName, coverage) {
					this.policyTypeFlag = policyTypeFlag;
					this.policyname = policyname;
					this.price = price;
					this.baoeName = baoeName;
					this.coverage = coverage;
				}
                var cxRiskInfoList=param.cxRiskInfoList;
				var policyarray = new Array();
				if (cxRiskInfoList != null || cxRiskInfoList != "") {
					// 主险报价
					for ( var i = 0; i < cxRiskInfoList.main.length; i++) {
						var priceMes = new PriceMes("01", cxRiskInfoList.main[i].name,
							cxRiskInfoList.main[i].pre, cxRiskInfoList.main[i].flag,
							cxRiskInfoList.main[i].coverage);
						policyarray.push(priceMes);
					}
					// 附加险报价
					for ( var i = 0; i < cxRiskInfoList.add.length; i++) {
						var priceMes = new PriceMes("02", cxRiskInfoList.add[i].name,
								cxRiskInfoList.add[i].pre, cxRiskInfoList.add[i].flag,
								cxRiskInfoList.add[i].coverage);
						policyarray.push(priceMes);
					}
					// 不计免赔报价
					for ( var i = 0; i < cxRiskInfoList.all.length; i++) {
						var priceMes = new PriceMes("03", cxRiskInfoList.all[i].name,
								cxRiskInfoList.all[i].pre, cxRiskInfoList.all[i].flag,
								cxRiskInfoList.all[i].coverage);
						policyarray.push(priceMes);
					}
				}
				var str='';
				for ( var i = 0; i < policyarray.length; i++) {
					str+='<tr>';
					var duty_name=policyarray[i].policyname;
					var producingarea=parm.body.producingarea;//车型产地  进口车、合资车、国产车
					if(duty_name=="玻璃单独破碎险"){
						if(producingarea=="进口车") {
							duty_name=duty_name+" （进口）";
						}else{
							duty_name=duty_name+" （国产）";
						}
					}
					str+='<td class="jqxLittleTitle">'+duty_name+'</td>';
					str+='<td class="jqxBotton">';
					if (policyarray[i].policyTypeFlag !="03") {//主险 附加险
						if (policyarray[i].coverage.length > 1) {
							str+='<div class="jqxBotton2">保额：';
							if((policyarray[i].coverage).indexOf("元/座") >=0){
								str += "" + policyarray[i].coverage + "</div></td>";
							}else{
								str += "" + policyarray[i].coverage + "元</div></td>";
							}
						} else {
							str+='<div class="jqxBotton2">投保';
						}
					}else{
						str+='<div class="jqxBotton3">投保';
					}
					str+='</div>';
					str+='</td>';
					str+='<td class="jqxLittleFee">￥'+policyarray[i].price+'</td>';
					str+='</tr>';
				}
				$("#cxRisk").append(str);
			}
		} else {
			modelAlert(param.status.statusMessage);
		}
	} else {
		modelAlert("查询订单信息异常！");
	}
}


