$(function(){

	//商业险条款
	$("#businessbtn").unbind("tap").bind("tap",function(){
		window.location.href="businessprotocal.html";
	})
	//交强险条款
	$("#jqxbtn").unbind("tap").bind("tap",function(){
		window.location.href="jqxprotocal.html";
	})

    if(isApp() == 'yes')
    {
        $("#header").hide();
        $("#main").css("margin-top","-25px");
    }
    else
    {
        $("#header").show();
        $("#main").css("margin-top","25px");
    }
});