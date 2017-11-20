document.write("<script language='javascript' src='js/analysisexception.js' ></script>");

function saveRiskServer(callback)
{
    // 方法定义
    var fun = function(result){
        //转保验证码
        if (result.statusCode == "888888") {
            setRiskData("checkflag",result.returns.checkDto.checkFlag|| "");         // 0：交强险转保验证码  1：商业险转保验证码
            setRiskData("checksequenceno",result.returns.checkDto.querySequenceNo|| "");  // 商业险投保查询码
            setRiskData("checkimg",result.returns.checkDto.checkCode|| "");

            // 提示完后  需要重新 进行提交
            showCheckDialog(function(event){
                var checkcode = event.value;
                setRiskData("checkcode",checkcode);
                saveRiskServer(callback);
            });
            return;
        }
        //变更套餐提示
        if (result.statusCode == "999999") {
            // 这里 会先提示一个 关于变更套餐的提示
            muiAlert(result.statusMessage,function(){
                // 不需要做任何提示
                if((result.returns.isBefore || "") != "")
                {
                    // 需要提示  并按照 是否有上一张保单  提示不同内容
                    var lastflag = result.returns.isBefore == "1"?"true":"false";    // 是否查询到前一张投保单
                    var lastendday = result.returns.yesterday || "";                 // 上一年车险到期日
                    var lastbeginday = result.returns.today || "";                   // 这一年车险起保日

                    setRiskData("lastflag",lastflag);
                    setRiskData("lastendday",lastendday);
                    setRiskData("lastbeginday",lastbeginday);

                    // 提示完 后就 回调了
                    showLastDialog(callback);
                    return;
                }
                callback();
            });
            return ;
        }
        if (result.statusCode == "000000") {
            // 不需要做任何提示
            if((result.returns.isBefore || "") != "")
            {
                // 需要提示  并按照 是否有上一张保单  提示不同内容
                var lastflag = result.returns.isBefore == "1"?"true":"false";    // 是否查询到前一张投保单
                var lastendday = result.returns.yesterday || "";                 // 上一年车险到期日
                var lastbeginday = result.returns.today || "";                   // 这一年车险起保日

                setRiskData("lastflag",lastflag);
                setRiskData("lastendday",lastendday);
                setRiskData("lastbeginday",lastbeginday);

                // 提示完 后就 回调了
                showLastDialog(callback);
                return;
            }
            callback();
            return;
        }
        if (result.statusCode != "000000") {
            // 清空 验证 信息
            setRiskData("checkflag","");
            setRiskData("checksequenceno","");
            setRiskData("checkimg","");
            setRiskData("checkcode","");

            // 判断 是否需要重新 搜索 品牌型号
            var exception = exception_translate(exception_filter(result.statusMessage));
            var carmodelkey = exception_getcarmodelkey(exception);
            muiAlert(exception,function (){
                if(isEmpty(carmodelkey)) return;

                setViewData("brandmodelname",carmodelkey);
                window.location.href = "insurebrandmodel.html";
            });
            return;
        }
    };

    var randomno = getViewData("randomno");
    var sessionid = getViewData("sessionid");
    var provincecode = getViewData("provincecode");
    var checkno = getViewData("checkno");
    var checkcode = getViewData("checkcode");
    var tradeno = getViewData("checktradeno");
    var risk = getStorageData("risk");

    if(!isFake)
        ServiceSend.saveRiskInfo(randomno,sessionid,provincecode,checkno,checkcode,tradeno,risk,fun);
    else
        $.get("data/saveriskinfodata.json",fun);
}

function showCheckDialog(callback)
{
    var checkflag = getRiskData("checkflag");
    var checkimg = getRiskData("checkimg");

    var title,placeolder;           // 0：交强险转保验证码  1：商业险转保验证码
    if(checkflag == "0") title = "交强险转保验证码";
    if(checkflag == "1") title = "商业险转保验证码";

    // checkimg = "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";
    // title = "交强险转保验证码";

    placeolder = "请输入转保码注意区分0 1 2 o l z";
    title += "<br/><br/>";

    var img = $("<img class='checkimg' alt='验证码图片' src='" + "data:image/png;base64," + checkimg + "'>");

    mui.prompt("",placeolder,title,['确定'],callback);
    $('.mui-popup-text').html(img);
}

function showLastDialog(callback)
{
    var lastflag = getRiskData("lastflag");
    var lastendday = getRiskData("lastendday");
    var lastbeginday = getRiskData("lastbeginday");
    var begindate = addDate(1).Format("yyyy-MM-dd");

    var content = "车险行业平台未能查到您的上一保单结束时间,请仔细核实起保时间,防止车辆脱保。";
    
    if(lastflag == "true" && !isEmpty(lastendday) && !isEmpty(lastbeginday))
    {
    	content = "车险行业平台查到您的上一年车险将于 <span style='color:#f11018'>${lastendday}</span> 到期,为了避免重复投保, 系统自动将您的车险生效日期更新为<span style='color:#f11018'>${lastbeginday}</span>。";
        content = content.replace("${lastendday}",lastendday);
        content = content.replace("${lastbeginday}",lastbeginday);
    }
    muiAlert(content,callback);
}