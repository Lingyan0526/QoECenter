var UserInfoNoVideo = require("../models/userInfoPage");
var nodeExcel = require('excel-export');
var fs = require('fs');  //node.js核心的文件处理模块
var _ = require('underscore');

exports.userInfoDetail = function(req,res){
	console.log("-----contr/UserInfoPage.js--- UserInfo detail function")
	var infoId = req.params.infoId;
	UserInfoNoVideo.findById(infoId,function(err,info){
		if(err){
			console.log(err);
		}
		console.log(JSON.stringify(info));
		res.render('pageUserInfoDetail',{
			commentInfo: info,
			movie: {title:info.pagename}
		});
	});
}

exports.showUserInfo = function(req,res){
	console.log("-----contr/UserInfoPage.js--- showUserInfo function")
	var id = req.params.id;

	var title = "home page";
	if (id == "1") {
		title = "video list page";
	}

	console.log("detail get params id="+id + " title = " + title);
	
	UserInfoNoVideo.findByPageId(id,function(err,infos){
		if(err){
			console.log(err);
			res.render('404',{});
		}
		else{
			console.log("infos.length = " + infos.length);
			console.log(JSON.stringify(infos));
			res.render('pageUserInfoList',{
				comments: infos,
				title: title
			});
		}
	});
}

function exportExcel(headers, rows) {
	var conf ={};
    conf.name = "mysheet";
    conf.cols = [];
    for(var i = 0; i < headers.length; i++){
        var col = {};
        col.caption = headers[i].caption;
        col.type = headers[i].type;
        conf.cols.push(col);
    }
    conf.rows = rows;
    var result = nodeExcel.execute(conf);
    return result;
}

//创建homepage访问量文件
exports.getHomePagePVInfo = function(req, res) {
	console.log("---------controllers/getHomePagePVInfo---------function-----");
	var headers = [
		{caption:'Page Name',type:'string',width:20},
	 	{caption:'IP',type:'string',width:20},
	 	{caption:'Address',type:'string',width:20},
	 	{caption:'Browser Type',type:'string',width:20},
	 	{caption:'Browser Version',type:'string',width:20},
	 	{caption:'userAgent',type:'string',width:40},
	 	{caption:'cookieEnabled',type:'string',width:10},
	 	{caption:'javaEnabled',type:'string',width:10},
	 	{caption:'platform',type:'string',width:15},
	 	{caption:'systemType',type:'string',width:15},
	 	{caption:'pluginsCount',type:'string',width:15},
	 	{caption:'plugins',type:'string',width:15},
	 	{caption:'userLanguage',type:'string',width:15},
	 	{caption:'flash',type:'string',width:15},
	 	{caption:'screenWidth',type:'string',width:15},
	 	{caption:'screenHeight',type:'string',width:15},
	 	{caption:'colorDepth',type:'string',width:40},
	 	{caption:'pixelDepth',type:'string',width:40}];

	 var rows = [];
	 var x = 0;
	 var id = "0";
	 UserInfoNoVideo.findByPageId(id,function(err,infos){
	 	if(err){
			console.log(err);
		}

		// console.log("movies = " + movies);

		for (var i = 0; i < infos.length; i++) {
			var temp_row = [];
			temp_row[0] = "Home Page";
			temp_row[1] = infos[i].ip;
			temp_row[2] = infos[i].address;
			temp_row[3] = infos[i].browserType;
			temp_row[4] = infos[i].browserVersion;
			temp_row[5] = infos[i].userAgent;
			temp_row[6] = infos[i].cookieEnabled;
			temp_row[7] = infos[i].javaEnabled;
			temp_row[8] = infos[i].platform;
			temp_row[9] = infos[i].systemType;
			temp_row[10] = infos[i].pluginsCount;
			temp_row[11] = infos[i].plugins;
			temp_row[12] = infos[i].userLanguage;
			temp_row[13] = infos[i].flash;
			temp_row[14] = infos[i].screenWidth;
			temp_row[15] = infos[i].screenHeight;
			temp_row[16] = infos[i].color;
			temp_row[17] = infos[i].pixel;
			rows[i] = temp_row;
			// console.log("temp_row = " + temp_row);
		}

		// console.log("rows = " + rows);
		var result = exportExcel(headers,rows);
		var filePath = "homepageVisitInfo.xlsx";
		fs.writeFile(filePath, result, 'binary',function(err){
			if(err){
				console.log(err);
			}
			console.log("create homepageVisitInfo.xlsx success!");
			res.json({success:1});
		});
	});
}

//创建userpage访问量文件
exports.getUserPagePVInfo = function(req, res) {
	console.log("---------controllers/getHomePagePVInfo---------function-----");
	var headers = [
		{caption:'Page Name',type:'string',width:20},
	 	{caption:'IP',type:'string',width:20},
	 	{caption:'Address',type:'string',width:20},
	 	{caption:'Browser Type',type:'string',width:20},
	 	{caption:'Browser Version',type:'string',width:20},
	 	{caption:'userAgent',type:'string',width:40},
	 	{caption:'cookieEnabled',type:'string',width:10},
	 	{caption:'javaEnabled',type:'string',width:10},
	 	{caption:'platform',type:'string',width:15},
	 	{caption:'systemType',type:'string',width:15},
	 	{caption:'pluginsCount',type:'string',width:15},
	 	{caption:'plugins',type:'string',width:15},
	 	{caption:'userLanguage',type:'string',width:15},
	 	{caption:'flash',type:'string',width:15},
	 	{caption:'screenWidth',type:'string',width:15},
	 	{caption:'screenHeight',type:'string',width:15},
	 	{caption:'colorDepth',type:'string',width:40},
	 	{caption:'pixelDepth',type:'string',width:40}];

	 var rows = [];
	 var x = 0;
	 var id = "1";
	 UserInfoNoVideo.findByPageId(id,function(err,infos){
	 	if(err){
			console.log(err);
		}

		// console.log("movies = " + movies);

		for (var i = 0; i < infos.length; i++) {
			var temp_row = [];
			temp_row[0] = "Guest Index Page";
			temp_row[1] = infos[i].ip;
			temp_row[2] = infos[i].address;
			temp_row[3] = infos[i].browserType;
			temp_row[4] = infos[i].browserVersion;
			temp_row[5] = infos[i].userAgent;
			temp_row[6] = infos[i].cookieEnabled;
			temp_row[7] = infos[i].javaEnabled;
			temp_row[8] = infos[i].platform;
			temp_row[9] = infos[i].systemType;
			temp_row[10] = infos[i].pluginsCount;
			temp_row[11] = infos[i].plugins;
			temp_row[12] = infos[i].userLanguage;
			temp_row[13] = infos[i].flash;
			temp_row[14] = infos[i].screenWidth;
			temp_row[15] = infos[i].screenHeight;
			temp_row[16] = infos[i].color;
			temp_row[17] = infos[i].pixel;
			rows[i] = temp_row;
			// console.log("temp_row = " + temp_row);
		}

		// console.log("rows = " + rows);
		var result = exportExcel(headers,rows);
		var filePath = "userpageVisitInfo.xlsx";
		fs.writeFile(filePath, result, 'binary',function(err){
			if(err){
				console.log(err);
			}
			console.log("create userpageVisitInfo.xlsx success!");
			res.json({success:1});
		});
	});
}

//下载homepage访问信息
exports.downloadPagePVInfo = function(req,res){	
	console.log("-----downloadPagePVInfo----------------")
	var name = req.params.name;
	var filePath = "./" + name;

 	var stats = fs.statSync(filePath); 
	
	console.log("file : " + filePath);
 	console.log("stats.isFile() : " + stats.isFile());
 	
 	if(stats.isFile()){
  		res.writeHead(200, {
   			'Content-Type': 'application/octet-stream',
	   		'Content-Disposition': 'attachment; filename='+name,
	   		'Content-Length': stats.size
	  	});
	  	fs.createReadStream(filePath).pipe(res);
 	} else {
  		res.end(404);
 	}
}

exports.submitUserInfo = function(req,res){
	console.log("-----contr/UserInfoPage.js--- submitUserInfo function")

	//var oid = req.body.Movie._id;
	//console.log("oid = " + oid);
	var pageid = req.body.id;
	var pagename = "";
	if (pageid == "0") {
		pagename = "home page";
	} else {
		pagename = "video list page";
	}

	var browserType = req.body.browserType;
	var browserVersion = req.body.browserVersion;
	var userAgent = req.body.userAgent;
	var cookieEnabled = req.body.cookieEnabled;
	var platform = req.body.platform;
	var systemType = req.body.systemType;
	var pluginsCount = req.body.pluginsCount;
	var plugins = req.body.plugins;
	var userLanguage = req.body.userLanguage;
	var javaEnabled = req.body.javaEnabled;
	var flash = req.body.flash;
	var screenWidth = req.body.screenWidth;
	var screenHeight = req.body.screenHeight;
	var color = req.body.color;
	var pixel = req.body.pixel;
	var ip = req.body.ip;
	var address = req.body.address;
	
	console.log("pageid = " + pageid);

	_userInfo = new UserInfoNoVideo({
		pageid: pageid,
		pagename: pagename,
		browserType: browserType,
		browserVersion: browserVersion,
		userAgent: userAgent,
		cookieEnabled: cookieEnabled,
		platform: platform,
		systemType: systemType,
		pluginsCount: pluginsCount,
		plugins: plugins,
		userLanguage: userLanguage,
		javaEnabled: javaEnabled,
		flash: flash,
		screenWidth: screenWidth,
		screenHeight: screenHeight,
		color: color,
		pixel: pixel,
		ip: ip,
		address: address
	});

	_userInfo.save(function(err,userInfo){
		if(err){
			console.log(err);
		}else{
			console.log("userInfo in homepage or listpage saved succeed!");
			// res.json({result : 1});
		}
	});
}