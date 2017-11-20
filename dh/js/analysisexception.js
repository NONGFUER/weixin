
// 过滤无效语言 以及符号
function exception_filter(content)
{
	content = exception_replace(content,"保费计算失败");
	content = exception_replace(content,"自动报价规则提示");
	content = exception_replace(content,"(车险部规则打回)");
	content = exception_replace(content,"PICS投保查询异常");
	content = exception_replace(content,"PICS投保查询平台查询失败");
	content = exception_replace(content,"PICSException");
	content = exception_replace(content,"渠道接口管理平台提示");
	content = exception_replace(content,"PICSException");
	content = exception_replace(content,"PICSException");

	content = exception_replace(content,"PICS交互");
	content = exception_replace(content,"_交强险");
	content = exception_replace(content,"_商业险");
	content = exception_replace(content,"（）");
	content = exception_replace(content,"");

	content = content.replace(/\[\d*\]/g,"");
	content = content.replace(/\(\)/g,"");
	content = content.replace(/null/ig, "");
	
	return content;
}

// 替换文本的内部方法
function exception_replace(content,keyword)
{
	var pattern = new RegExp("(\s)?" + keyword + "(\s)?(：|:|;|；|！|!|。)?(\s)?","g");
	return content.replace(pattern,"");
}

// 翻译文本内容 为 人类可以看懂的文字
function exception_translate(content)
{
	var translates = new Array();
	translates.push('{"keyword":"禁止投保车损险","info":"未查到上年度保单,车辆禁止投保车损险,请不要勾选车损险!"}');
	translates.push('{"keyword":"新车业务","info":"车辆为新车业务,暂不能投保!"}');
	translates.push('{"keyword":"参考VIN码第10位","info":"车辆识别代码与车辆注册日期不符,请按照行驶证信息填写!"}');
	translates.push('{"keyword":"车主名称与上张保单不一致","info":"车主姓名与上年度保单不一致,请按照行驶证信息填写!"}');
	translates.push('{"keyword":"未获取到终保日期","info":"未能找到车辆信息,请按照行驶证信息填写!"}');
	translates.push('{"keyword":"三者险必保","info":"车辆需要购买第三者责任险,请勾选第三者责任险!"}');
	translates.push('{"keyword":"日期必须在当前日期的规定时间范围","info":"未到可以投保车辆保险的日期,请明日再试!"}');
	translates.push('{"keyword":"选择交商组合","info":"请选择交强险和商业险组合投保!"}');
	translates.push('{"keyword":"非本市号牌 ","info":"车辆暂不能异地投保,请修改投保地区!"}');
	translates.push('{"keyword":"非小型新能源汽车号牌","info":"车辆非小型新能源汽车号牌,请核实车牌号!"}');
	translates.push('{"keyword":"未匹配到交管车辆信息","info":"车辆识别代码有误,请按照行驶证信息填写!"}');
	translates.push('{"keyword":"销售业务员信息","info":"投保车辆的城市未开通此业务!"}');
	translates.push('{"keyword":"划痕限额1w","info":"投保车辆只能投保1万以下划痕险!"}');
	translates.push('{"keyword":"划痕限额2k","info":"投保车辆只能投保２千以下划痕险!"}');
	translates.push('{"keyword":"新增设保险","info":"投保车辆不能投保新增设保险!"}');
	translates.push('{"keyword":"精神损害险","info":"投保车辆不能投保精神损害险!"}');
	translates.push('{"keyword":"非营运车使用车损险免赔","info":"投保车辆不能进行此项投保!"}');
	translates.push('{"keyword":"该车已在天安保险公司存在预确认记录","info":"此车在车险平台已锁定，请致电天安财险公司予以处理：95505!"}');
	translates.push('{"keyword":"险别itemKindLit","info":"请勾选投保险种!"}');
	
    content = content.replace(/，/g,",");
    content = content.replace(/。/g,".");

    for (var index = 0;index < translates.length;index++)
	{
		var json = JSON.parse(translates[index]);
		var keyword = json.keyword;
		var info = json.info;
		if(content.indexOf(keyword) != -1)
			return info;
	}

	content = exception_translatematch(content);

	return content;
}

// 需要从文本中提取内容 的翻译
function exception_translatematch(content)
{
    var plateno = exception_match(content,"车牌号(.*)的保单发生重复投保");
    if(plateno != "") return "车牌号" + plateno + "已投保,请为其他车辆投保！";

    var carmodelold = exception_match(content,"您选择的车型(.*)不在投保查询");
    if(carmodelold == "")carmodelold = exception_match(content,"用户录入为(.*),");
    var carmodelnew = exception_match(content,"查询返回为(.*),");
    if(carmodelnew == "")carmodelnew = exception_match(content,"平台返回为(.*)");

    if(carmodelold != "" && carmodelnew != "")
	{
		//字母开头
        if(/^[a-zA-Z0-9_-]+.*$/.test(carmodelnew)){
            return "您选择的车辆型号<br/>[" + carmodelold + "]<br/>与车辆识别代码不一致，报价失败。";
        }else{
        	var pos = carmodelnew.indexOf("-");
            if(pos != -1) carmodelnew = carmodelnew.substring(0,pos);
            return "您选择的车辆型号<br/>[" + carmodelold + "]<br/>与车辆识别代码不一致，报价失败。<br/>请选择下面车辆型号重新报价。<br/>[" + carmodelnew + "]";
        }   
	}
    return content;
}

// 从格式化的文本中 获得 车型 搜索内容
function exception_getcarmodelkey(content)
{
    if(content.indexOf("与车辆识别代码不一致") == -1) return "";

    var carmodelkey = content.replace(/.*\[(.*)\].*/, '$1');
    carmodelkey = exception_carmodelkey(carmodelkey);

    return carmodelkey;
}

// 获取文本中内容的内部方法
function exception_match(content,keyword)
{
	var pattern = new RegExp(keyword);
	return pattern.exec(content) != null?pattern.exec(content)[1]:"";
}

// 获得品牌型号搜索关键字
function exception_carmodelkey(carmodelold)
{

	var keys = carmodelold.split(/\s/g);
	if(keys.length <= 2) return carmodelold;
	return keys[0] + " " + keys[1];
}
