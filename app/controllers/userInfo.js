var Movie = require("../models/movie")
var UserInfo = require("../models/userInfo");
var MovieCate = require("../models/movieCate")
var _ = require('underscore');

exports.userInfoDetail = function(req,res){
	console.log("-----contr/UserInfo.js--- UserInfo detail function")
	var movieId = req.params.movieId;
	var infoId = req.params.infoId;
	Movie.findById(movieId,function(err,Movie){
		if(err){console.log(err);}
		UserInfo.findById(infoId,function(err,info){
			if(err){
				console.log(err);
			}
			console.log(JSON.stringify(info));
			res.render('movieCommentDetail',{
				commentInfo: info,
				movie: Movie
			});
		});
	});
}

exports.showUserInfo = function(req,res){
	console.log("-----contr/UserInfo.js--- showUserInfo function")
	var id = req.params.id;

	console.log("detail get params id="+id);
	
	Movie.findById(id,function(err,Movie){
		if(err){
			console.log(err);
			res.render('404',{});
		}
		else{
			MovieCate.fetch(function(err,mCates){
				if(err){console.log(err)}	
				UserInfo.findByMovieId(Movie.id, function(err,userinfo){
					console.log("movie userinfo : " + JSON.stringify(userinfo));
					userinfo = userinfo.reverse();
					res.render('movieUserInfoList',{
						comments: userinfo,
						movie: Movie,
						mCates: mCates
					});
				})
			})
		}
	});
}

exports.submitUserInfo = function(req,res){
	console.log("-----contr/UserInfo.js--- submitUserInfo function")

	//var oid = req.body.Movie._id;
	//console.log("oid = " + oid);
	var id = req.body.id;

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
	var currentTime = req.body.currentTime;
	var bufferTime = req.body.bufferTime;
	var playCount = req.body.playCount;
	var pauseCount = req.body.pauseCount;
	var fullOnCount = req.body.fullOnCount;
	var fullOffCount = req.body.fullOffCount;
	
	console.log("id = " + id);
	if(id){

		_userInfo = new UserInfo({
			movie: id,
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
			address: address,
			currentTime: currentTime,
			bufferTime: bufferTime,
			playCount: playCount,
			pauseCount: pauseCount,
			fullOnCount: fullOnCount,
			fullOffCount: fullOffCount
		})

		_userInfo.save(function(err,userInfo){
			if(err){
				console.log(err);
			}else{
				Movie.update({_id:id},{$inc:{pv1:1}},function(err){
					if(err){console.log(err);}
				})
				console.log("userInfo saved succeed!");
				// res.json({result : 1});
			}
		})		
	}else{
	}
}