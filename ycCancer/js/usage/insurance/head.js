// 全局常量
/*全局常量*/
var CERTIFICATENO_LENGTH = 18;
var COMMODITYCOMBINE_ID ={
		"MCAN" : "1",
		"PMCAN": "1",
		"FCAN" : "2",
		"PFCAN": "2",
		"BCAN" : "3",
		"PBCAN": "3",
		"JXJS" : "6",	//锦绣吉顺
	    "QCWY" : "7",	//全车无忧
	    "JKJR" : "8",	//健康佳人
	    "JKAX" : "9",	//健康安享
	    "LLHM" : "10",	//邻里和睦	    
	    "SWFR" : "11",	//商务飞人
	    "XPXSX": "12",   //码上长大(省心版)
	    "XPXAX": "12",   //码上长大(省心版)
	    "GHX"  : "14"
	}
var COMMODITY_ID ={
		"MCAN" : "1",
		"PMCAN": "2",
		"FCAN" : "3",
		"PFCAN": "4",
		"BCAN" : "5",
		"PBCAN": "6",
		"JXJS" : "9",	//锦绣吉顺
	    "QCWY" : "10",	//全车无忧
	    "JKJR" : "11",	//健康佳人
	    "JKAX" : "12",	//健康安享
	    "LLHM" : "13",	//邻里和睦	    
	    "SWFR" : "14",	//商务飞人
	    "XPXSX": "15",    //码上长大(省心版)
	    "XPXAX": "16"    //码上长大(安心版)
	}

var ajaxStatus = {
    success : "000000",
    relogin : "123456"
} 

var message = {
    requestFail : "网络好像开小差了呢，请设置给力一点儿网络吧！",
    phoneNull   : "手机号不能为空！",
    nameNull    : "姓名不能为空！",
    phoneError  : "手机号格式不正确！",
    nameError   : "姓名必须为汉字！"
}
var requestUrl = {
	//系统时间
	getServeTimeUrl      : base.url + 'communal/getServiceTime.do',
    //线下产品模块    
    cusAndAgenInfoUrl    : base.url + 'customerBasic/getCustomerAndAgentInfo.do',              // //APP用户及客户经理信息查询@gxj
    liveProductInfoUrl   : base.url + 'offlineCommodityComDetail/getOfflineComComDetail.do',   //(完成)APP产品模块线下产品详情查询 @gxj
    commodityListUrl     : base.url + 'commodityCombination/getCommodityList.do',              //APP产品模块商品列表查询 @gxj
    commissionInfoUrl    : base.url + 'commodityCombination/getCommodityCommissionInfos.do',   //APP产品模块产品条款佣金比例列表查询 @gxj
    cusInsConsultantUrl  : base.url + 'cusInsuranceConsultant/getCusInsuranceConsultant.do',   //（完成）APP产品模块线下产品详情页保险顾问查询 @gxj
    addYuyueInfoUrl      : base.url + 'yuyue/addYuyueInfo.do',                                 //（完成）预约新增 @gxj
    //线上产品模块
    onlineProductInfoUrl : base.url + 'product/getOnlineProductDetail.do',
    calOptionsUrl        : base.url + 'cal/getCalOptions.do',   //根据商品组合id查询保费试算项@chengcheng
    calDoUrl             : base.url + 'cal/cal.do',             //根据保费试算项进行保费试算@chengcheng
    //线上投保模块
    //ecard投保
    ecardInsure          : base.url + 'ecard/toubao.do',     //投保接口@mjp
    ecardPay             : base.url + 'ecard/pay.do',        //投保支付@mjp
    ecardPayBack         : base.url + 'ecard/payBack.do',    //投保地区查询@mjp
    defalultArea  		 : base.url + "ecard/selectDefaulInsuredArea.do",  //@mjp  默认地区
    chooseArea			 : base.url + "ecard/selectAreaByParams.do",		//@mjp 选择地区
    //防癌险投保
    cancerInsure         : base.url + 'cancerRisk/toubao.do',     //防癌险投保接口@cc
    cancerPay            : base.url + 'cancerRisk/pay.do',      //防癌险支付@cc
    cancerPayBack        : base.url + 'cancerRisk/payBack.do',//投保地区查询@cc
    //挂号险投保
    ghxProductInfo		 : base.url + 'ghxProduct/yianGhxProductInfo.do',//@wxw
    ghxAddOrder			 : base.url + 'ghxOrder/addOrder.do',			//@wxw
    ghxPay				 : base.url + 'ghxOrder/pay.do',				//@wxw
    //健康告知
    heathTold			 : base.url + 'commodityCombination/getHealthTold.do',//@gxj
    notice				 : base.url + 'commodityCombination/getNotice.do'//@gxj
}
//全局变量
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));

var isComing    = urlParm.isComing ? urlParm.isComing : "";			//即将上线

var mobile      = urlParm.mobile;                //"18900001111";  //urlParm.mobile;//用户手机号
var customerId  = urlParm.customerId;            //"8";            //urlParm.customerId;//用户id
var name		= urlParm.name;					 //姓名
var idAuth		= urlParm.idAuth;				 //是否实名
var idNo		= urlParm.idNo;					 //身份证号
var roleType    = urlParm.roleType;              //"04";				//urlParm.roleType用户角色
var transToken  = urlParm.transToken;//"40d1ef064f3259d6501dc15e69fb8d1c"//urlParm.transToken;			 //
var ccId        = urlParm.ccId;                  //"3";             //urlParm.ccId;商品组合id
var ccCode      = urlParm.ccCode;                //"00400003";      //urlParm.ccCode;商品组合code
var cCode       = urlParm.cCode;				 //
var cId			= urlParm.cId + "";					 //
var cityCode    = urlParm.cityCode;              //"220001"			//urlParm.cityCode	市代码
var	provinceCode= urlParm.provinceCode;          //"220000"			//	urlParm.provinceCode	省代码
var cName = urlParm.cName ? urlParm.cName : "";
var ccName = urlParm.ccName ? urlParm.ccName : "";
var cPrem = urlParm.cPrem ? urlParm.cPrem : "";
var cPieces	= urlParm.cPieces ? urlParm.cPieces : "1";
var cVersion = urlParm.cVersion ? urlParm.cVersion : "01";
var coverage = "";
var title = "";
var leftIco = "";
var rightIco = "";

var shareDesc = "";
var shareTitle = "";

//挂号线
var ghxDicChannel = urlParm.ghxDicChannel ? urlParm.ghxDicChannel : "";
var ghxDicCode = urlParm.ghxDicCode ? urlParm.ghxDicCode : "";
var ghxRemark = urlParm.ghxRemark ? urlParm.ghxRemark : "";
var isA = urlParm.isA ? urlParm.isA : "0";
var fumuFlag = urlParm.fumuFlag ? urlParm.fumuFlag : "0";
var peiouFlag = urlParm.peiouFlag ? urlParm.peiouFlag : "0";
var zinvFlag = urlParm.zinvFlag ? urlParm.zinvFlag : "0";
var qitaFlag = urlParm.qitaFlag ? urlParm.qitaFlag : "0";
var banbenFlag = urlParm.banbenFlag ? urlParm.banbenFlag : "01";
// 18	18900001111				王晓伟

// 1	00400001	天安防癌险（男神版）
// 2	00400002	天安防癌险（女神版）
// 3	00400003	天安防癌险（少儿版）
// 4	00600001	弘康安溢保两全保险
// 5	00600002	弘康安盈保年金保险
// 6	00400004	锦绣吉顺
// 7	00400005	锦程交通意外险
// 8	00400006	健康佳人（佳丽福）
// 9	00400007	健康安享
// 10	00400008	“邻里和睦”家财综合保障计划
// 11	00400009	商务飞人（精英版）
// 12	00400010	天安“码上长大”学平险
// 13	00400011	天安车险
// 14	00500001	挂号服务费用补偿保险
// 101	00900001	富德人寿富康宝年金保险
// 102	00300001	华夏福临门年金保险（2015铂金版）
// 103	00300002	华夏健康人生重大疾病保险
// 104	00100001	泰康乐安康终身重大疾病保险
// 105	00100002	泰康乐行综合意外保障计划
// 106	00100003	泰康乐鑫两全保险（分红型）
// 107	00200001	阳光人寿健康保终身恶性肿瘤疾病保险
// 108	00200002	阳光人寿金喜连连年金保险
// 109	00200003	阳光人寿康世宁终身重大疾病保险
// 110	00200004	阳光人寿孝顺保恶性肿瘤疾病保险
// 111	01000001	恒大恒久健康终身重大疾病保险（2017版）
// 112	01000002	恒大金财人生保险计划（分红型）
// 113	01000003	恒大千万护航两全保险产品计划
// 114	01000004	恒大鑫福
// 118	004000011	天安防癌险（男神版）
// 119	004000022	天安防癌险（女神版）
// 120	004000032	天安防癌险（少儿版）
var PRODUCT_SHARE = {
		"MCAN" : "男性百万恶性肿瘤险-直付100万，全球抗癌疾病保险，15元起,"+name+"为你推荐男性百万恶性肿瘤险。",		
		"FCAN" : "女性百万恶性肿瘤险-直付100万，全球抗癌疾病保险，70元起,"+name+"为你推荐女性百万恶性肿瘤险。",		
		"BCAN" : "少儿百万恶性肿瘤险-直付100万，全球抗癌疾病保险，50元起,"+name+"为你推荐少儿百万恶性肿瘤险。",
		"JKJR" : '健康佳人女性专属肿瘤保-100万保额，确诊直赔30万，含高额住院津贴，意外医疗保障',//健康佳人
		"JKAX" : '健康安享重疾险-100万保额，30种重疾，60天超短等待期',							//健康安享
		"QCWY" : '全车无忧驾乘意外险-50万保额，为您提供驾乘人员安全的全面保障！',				//全车无忧
		"LLHM" : '“邻里和睦”家财综合保障计划-200万保额，家财综合保障计划全面守护您的家',		//邻里和睦
		"JXJS" : '锦绣吉顺综合意外险-18万保额，每天不到3毛钱，为您提供全面意外伤害保障',		//锦绣吉顺
		"SWFR" : '商务飞人航空意外险-500万元保额，1年无限次飞行，不限国内或国际航班'			//商务飞人		
}
var PRODUCT_PICURL ={
		"BASE" : base.url + "tongdaoApp/image/share/tongdaoic.png",
		"MCAN" : base.url + "tongdaoApp/image/share/fangainan.png",
		"FCAN" : base.url + "tongdaoApp/image/share/fangainv.png",
		"BCAN" : base.url + "tongdaoApp/image/share/fangaihai.png",
		"JKJR" : base.url + "tongdaoApp/image/share/jkjr.png",	//健康佳人
		"JKAX" : base.url + "tongdaoApp/image/share/jkax.png",	//健康安享
		"QCWY" : base.url + "tongdaoApp/image/share/qcwy.png",	//全车无忧
		"LLHM" : base.url + "tongdaoApp/image/share/llhm.png",	//邻里和睦
		"JXJS" : base.url + "tongdaoApp/image/share/jxjs.png",	//锦绣吉顺
		"SWFR" : base.url + "tongdaoApp/image/share/swfr.png"	//商务飞人
}
//根据不同的产品获取分享信息
function getProductSharePic(productCode){
	var picUrl = "";
	if( productCode == COMMODITYCOMBINE_ID.JKJR ){
		picUrl = PRODUCT_PICURL.JKJR;
	}else if( productCode == COMMODITYCOMBINE_ID.JKAX ){
		picUrl = PRODUCT_PICURL.JKAX;
	}else if( productCode == COMMODITYCOMBINE_ID.LLHM ){
		picUrl = PRODUCT_PICURL.LLHM;
	}else if( productCode == COMMODITYCOMBINE_ID.QCWY ){
		picUrl = PRODUCT_PICURL.QCWY;
	}else if( productCode == COMMODITYCOMBINE_ID.JXJS ){
		picUrl = PRODUCT_PICURL.JXJS;
	}else if( productCode == COMMODITYCOMBINE_ID.SWFR ){
		picUrl = PRODUCT_PICURL.SWFR;
	}else if( productCode == COMMODITYCOMBINE_ID.MCAN ){
		picUrl = PRODUCT_PICURL.MCAN;
	}else if( productCode == COMMODITYCOMBINE_ID.FCAN ){
		picUrl = PRODUCT_PICURL.FCAN;
	}else if( productCode == COMMODITYCOMBINE_ID.BCAN ){
		picUrl = PRODUCT_PICURL.BCAN;
	}else{
		picUrl = PRODUCT_PICURL.BASE;
	}	
	return picUrl;
}
//根据不同的产品获取分享信息
function getProductShare(productCode){
	var shareContent = "";
	if( productCode == COMMODITYCOMBINE_ID.JKJR ){
		shareContent = PRODUCT_SHARE.JKJR;
	}else if( productCode == COMMODITYCOMBINE_ID.JKAX ){
		shareContent = PRODUCT_SHARE.JKAX;
	}else if( productCode == COMMODITYCOMBINE_ID.LLHM ){
		shareContent = PRODUCT_SHARE.LLHM;
	}else if( productCode == COMMODITYCOMBINE_ID.QCWY ){
		shareContent = PRODUCT_SHARE.QCWY;
	}else if( productCode == COMMODITYCOMBINE_ID.JXJS ){
		shareContent = PRODUCT_SHARE.JXJS;
	}else if( productCode == COMMODITYCOMBINE_ID.SWFR ){
		shareContent = PRODUCT_SHARE.SWFR;
	}else if( productCode == COMMODITYCOMBINE_ID.MCAN ){
		shareContent = PRODUCT_SHARE.MCAN;
	}else if( productCode == COMMODITYCOMBINE_ID.FCAN ){
		shareContent = PRODUCT_SHARE.FCAN;
	}else if( productCode == COMMODITYCOMBINE_ID.BCAN ){
		shareContent = PRODUCT_SHARE.BCAN;
	}else {
		shareContent = "产品名称-产品描述"
	}
	var shareList = shareContent.split("-");
	return shareList;
}