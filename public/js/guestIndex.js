var isPlay = false;
var ip = '';
var address = '';
var browserType = '';
var systemType = '';

var playCount = 0;
var pauseCount = 0;
var fullOnCount = 0;
var fullOffCount = 0;

window.onload=submitUserInfo();

function getBrowserInfo()
{
    var agent = navigator.userAgent.toLowerCase() ;

    var regStr_ie = /msie [\d.]+;/gi ;
    var regStr_ff = /firefox\/[\d.]+/gi ;
    var regStr_chrome = /chrome\/[\d.]+/gi ;
    var regStr_saf = /safari\/[\d.]+/gi ;
    //IE
    if(agent.indexOf("msie") > 0)
    {
        return agent.match(regStr_ie) ;
    }

    //firefox
    if(agent.indexOf("firefox") > 0)
    {
        return agent.match(regStr_ff) ;
    }

    //Chrome
    if(agent.indexOf("chrome") > 0)
    {
        return agent.match(regStr_chrome) ;
    }

    //Safari
    if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0)
    {
        return agent.match(regStr_saf) ;
    }

}

function checkOS() {
    var sUA=navigator.userAgent.toLowerCase();
    if(sUA.indexOf( 'win' ) !=-1){
         if(sUA.indexOf("nt 5.2")!=-1) {return "Windows 2003";}
         if((sUA.indexOf("nt 5.1")!=-1)||(sUA.indexOf("XP")!=-1)) {return "Windows XP"; }
         if((sUA.indexOf('nt 5.0')!=-1) || (sUA.indexOf('2000')!=-1)) {return 'Windows 2000';}
         if((sUA.indexOf("winnt")!=-1) || (sUA.indexOf("windows nt")!=-1)) {return "Windows NT";}
         if((sUA.indexOf("win98")!=-1) || (sUA.indexOf("windows 98")!=-1)) {return "Windows 98";}
         return "Windows";
    }
    if(sUA.indexOf('linux')!=-1) {return 'Linux';}
    if(sUA.indexOf("freebsd")!=-1) {return 'FreeBSD';}
    if(sUA.indexOf( 'x11' )!=-1) {return 'Unix';}
    if(sUA.indexOf('mac') != -1) {return "Mac"; }
    if(sUA.indexOf("sunos")!=-1) {return 'Sun OS';}
    if((sUA.indexOf("os/2")!=-1) || (navigator.appVersion.indexOf("OS/2")!=-1) || (sUA.indexOf("ibm-webexplorer")!=-1)) {return "OS 2"}
    if(navigator.platform == 'PalmOS' ) {return 'Palm OS'; }
    if((navigator.platform == 'WinCE' ) || ( navigator.platform == 'Windows CE' ) || ( navigator.platform == 'Pocket PC' ) ) {return 'Windows CE';}
    if(sUA.indexOf( 'webtv')!=-1) {return 'WebTV Platform'; }
    if(sUA.indexOf( 'netgem')!=-1) {return 'Netgem';}
    if(sUA.indexOf( 'opentv')!=-1) {return 'OpenTV Platform';}
    if(sUA.indexOf( 'symbian')!=-1) {return 'Symbian';}
    return "Unknown";
}

//获取插件所有的名称
function getPluginName() {
    var info = "";
    var plugins = navigator.plugins;
    if (plugins.length > 0) {
        for (i = 0; i < navigator.plugins.length; i++) {
            info += navigator.plugins[i].name + ";";
        }
    }
    return info;
}

//检查是否安装了某插件，如果安装了返回版本号
function checkePlugs(pluginname) {
    var f = "-"
    var plugins = navigator.plugins;
    if (plugins.length > 0) {
        for (i = 0; i < navigator.plugins.length; i++) {
            if (navigator.plugins[i].name.indexOf(pluginname) >= 0) {
                f = navigator.plugins[i].description.split(pluginname)[1];
                return f;
                break;
            }
        }
    }
    return false;
}

function submitUserInfo(){
	var id = "1";
	// console.log("submitUserInfo id = " + id);
	// var url = 'http://chaxun.1616.net/s.php?type=ip&output=json&callback=?&_='+Math.random();
	// $.getJSON(url, function(data){
	// 	//$("#b").html("显示：IP【"+data.Ip+"】 地址【"+data.Isp+"】 浏览器【"+data.Browser+"】 系统【"+data.OS+"】");
	// 	console.log('－－－ browserType = ' + browserType);
	// 	console.log('－－－ systemType = ' + systemType);
	// 	ip = data.Ip;
	// 	address = data.Isp;
	// 	browserType = data.Browser;
	// 	systemType = data.OS;
	// 	console.log('－－－ ip = ' + ip);
	// 	console.log('－－－ address = ' + address);
	// 	console.log('－－－ browserType = ' + browserType);
	// 	console.log('－－－ systemType = ' + systemType);
	// 	submitUserInfo1(id, ip, address);
	// });

    $.getScript('http://pv.sohu.com/cityjson?ie=utf-8', function(){
        // alert('IP: '+returnCitySN.cip+'; 城市：'+returnCitySN.cname);
        ip = returnCitySN.cip;
        address = returnCitySN.cname;
        submitUserInfo1(id, ip, address);
    });

}

function submitUserInfo1(id, ip, address){
	var browserType = getBrowserInfo();
	var browserVersion = (browserType+"").replace(/[^0-9.]/ig,""); 
	var userAgent = navigator.userAgent; 
	var cookieEnabled = navigator.cookieEnabled; // 返回用户浏览器是否启用了cookie
	var platform = navigator.platform;
	var systemType = checkOS();
	var pluginsCount = navigator.plugins.length;
	var plugins = getPluginName();
	var userLanguage = navigator.language; // 用户在自己的操作系统上设置的语言（火狐没有）
	var javaEnabled = navigator.javaEnabled();
	var flash = checkePlugs('Shockwave Flash');
	var screenWidth = window.screen.width;
	var screenHeight = window.screen.height;
	var color = window.screen.colorDepth;
	var pixel = window.screen.pixelDepth;


	console.log('id = ' + id);
	console.log('browserType = ' + browserType);
	console.log('browserVersion = ' + browserVersion);
	console.log('userAgent = ' + userAgent);
	console.log('cookieEnabled = ' + cookieEnabled);
	console.log('platform = ' + platform);
	console.log('systemType = ' + systemType);
	console.log('pluginsCount = ' + pluginsCount);
	console.log('plugins = ' + plugins);
	console.log('userLanguage = ' + userLanguage);
	console.log('javaEnabled = ' + javaEnabled);
	console.log('flash = ' + flash);
	console.log('screenWidth = ' + screenWidth);
	console.log('screenHeight = ' + screenHeight);
	console.log('color = ' + color);
	console.log('pixel = ' + pixel);
	console.log('ip = ' + ip);
	console.log('address = ' + address);


	var datas = {
		'id': id,
		'browserType': browserType,
		'browserVersion': browserVersion,
		'userAgent': userAgent,
		'cookieEnabled': cookieEnabled,
		'platform': platform,
		'systemType': systemType,
		'pluginsCount': pluginsCount,
		'plugins': plugins,
		'userLanguage': userLanguage,
		'javaEnabled': javaEnabled,
		'flash': flash,
		'screenWidth': screenWidth,
		'screenHeight': screenHeight,
		'color': color,
		'pixel': pixel,
		'ip': ip,
		'address': address,
	};
	$.ajax({
        url: '/homepage/submitUserInfo',
        type: 'post',
        //data: "id="+id+"&clarity="+clarity+"&loadSpeed="+loadSpeed+"&quality="+quality,
        data: datas,
        cache: false,
        success: function(data) {
            if(data.result == 1){
            	// $('#commentModal one').text("Thanks for your ratings");
            	// $('#commentModal').modal('show');
            	//location.href="/guestIndex";
            	// setTimeout(close(), 1000);  
            }
        },
        // error: function() {
        //     $('#commentModal one').text("Error! Please retry!");
        //    	$('#commentModal').modal('show');
        // }
    });
}

function close() {
	location.href="/guestIndex";
}