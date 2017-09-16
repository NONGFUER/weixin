/**
 * @maweiwei
 * 底部操作
 */
var publicpath = "../../imgs/public/"
$(function(){
	$("#footer_home img").attr("src",publicpath + "dh_home.png");
	$("#footer_product img").attr("src",publicpath + "dh_productsgray.png");
	$("#footer_club img").attr("src",publicpath + "dh_clubgray.png");
	$("#footer_personal img").attr("src",publicpath + "dh_persongray.png");
	$(".footer_sub span").removeClass("dh_active");
	$("#footer_home span").addClass("dh_active");
	/*	  点击首页*/
	$("#footer_home").on("tap",function(){
		$("#footer_home img").attr("src",publicpath + "dh_home.png");
		$("#footer_product img").attr("src",publicpath + "dh_productsgray.png");
		$("#footer_club img").attr("src",publicpath + "dh_clubgray.png");
		$("#footer_personal img").attr("src",publicpath + "dh_persongray.png");
		$(".footer_sub span").removeClass("dh_active");
		$("#footer_home span").addClass("dh_active");
	  	/*window.footer_personallocation.href="../hb/hb_blacklist.html?flag=1";*/
	});
	/*  点击产品*/
	 $("#footer_product").on("tap",function(){
		$("#footer_home img").attr("src",publicpath + "dh_homegray.png");
		$("#footer_product img").attr("src",publicpath + "dh_products.png");
		$("#footer_club img").attr("src",publicpath + "dh_clubgray.png");
		$("#footer_personal img").attr("src",publicpath + "dh_persongray.png");
		$(".footer_sub span").removeClass("dh_active");
		$("#footer_product span").addClass("dh_active");
	 });
	/* 点击俱乐部 */
	 $("#footer_club").on("tap",function(){
		$("#footer_home img").attr("src",publicpath + "dh_homegray.png");
		$("#footer_product img").attr("src",publicpath + "dh_productsgray.png");
		$("#footer_club img").attr("src",publicpath + "dh_club.png");
		$("#footer_personal img").attr("src",publicpath + "dh_persongray.png");
		$(".footer_sub span").removeClass("dh_active");
		$("#footer_club span").addClass("dh_active");
	 });
	  /* 点击我的 */
	 $("#footer_personal").on("tap",function(){
		$("#footer_home img").attr("src",publicpath + "dh_homegray.png");
		$("#footer_product img").attr("src",publicpath + "dh_productsgray.png");
		$("#footer_club img").attr("src",publicpath + "dh_clubgray.png");
		$("#footer_personal img").attr("src",publicpath + "dh_person.png");
		$(".footer_sub span").removeClass("dh_active");
		$("#footer_personal span").addClass("dh_active");
	 });
});