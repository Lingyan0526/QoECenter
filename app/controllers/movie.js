var Movie = require("../models/movie")
var MovieCate = require("../models/movieCate")
var Comment = require("../models/comment");
var Network = require("../models/network")
var TISI = require("../models/tisi");
var markdown = require('markdown').markdown
var mark = require('marked')
var qiniu = require('qiniu')
var formidable = require('formidable');
var fs = require('fs');  //node.js核心的文件处理模块
var child_process = require('child_process');
var processor = require('process');
var moment = require('moment');
var glob = require('glob');
var nodeExcel = require('excel-export');
var UserInfo = require("../models/userInfo");
var UserInfoNoVideo = require("../models/userInfoPage");

var _ = require('underscore');

//关于进度条事件的全局变量
//saveNetwork相关
var saveNetNum = "1%";
var saveNetMsg = "ready...";
var saveNetDir="";

//upload baseMovie
var upBaseMvNum = "1%";
var upBaseMvMsg = "ready...";

var options = {
    encoding: 'utf8',
    timeout: 0,
    maxBuffer: 5000 * 1024, // 默认 200 * 1024
    killSignal: 'SIGTERM'
};

exports.list = function(req,res){
	console.log("-----contr/Movie.js--- list function")
	Movie.fetch(function(err,Movies){
		if(err){
			console.log(err);
		}

		var totalViews = 0, totalComments = 0, pv1 = 10;
		for (var i = Movies.length - 1; i >= 0; i--) {
			totalViews += Movies[i].pv;
			totalComments += Movies[i].comments;
			pv1 += Movies[i].pv1;
		}

		console.log("totalViews = " + totalViews);
		console.log("totalComments = " + totalComments);

		// if (Movies.length > 0) {
		// 	for (var i = 0; i < Movies.length - 1;) {
		// 		Comment.findByMovieId(Movies[i].id, function(err,comments){
		// 			if(err){console.log(err)}
		// 			console.log("movie comments length : " + comments.length);
		// 			// Movies[i].comments = comments.length;
		// 			if (comments.length>0) {
		// 				Movie.findById(comments[0].movie, function(err, movieA){
		// 					movieA.comments = comments.length;
		// 					movieA.save(function(err, movieB){
		// 						if(err){console.log(err)}
		// 						console.log("success saved!");
		// 					});
		// 				});
		// 			}
		// 		})
		// 		i++;
		// 		if (i == Movies.length) {
		// 			MovieCate.fetch(function(err,cates){
		// 				if(err){console.log(err)}	
		// 					res.render('movieList',{
		// 					movies:Movies,
		// 					cates:cates
		// 				});
		// 			})
		// 		}
		// 	}
		// }

		// console.log("moviesList = " + JSON.stringify(Movies));
		MovieCate.fetch(function(err,cates){
			if(err){console.log(err)}
			UserInfoNoVideo.findByHomePage(function(err,homeUsers){
				if(err){console.log(err)};
				console.log("----homeUsers : " + JSON.stringify(homeUsers));
				UserInfoNoVideo.findByListPage(function(err,listUsers){
					console.log("----listUsers : " + JSON.stringify(listUsers));
					res.render('movieList',{
						movies:Movies,
						cates:cates,
						totalViews:totalViews,
						totalComments:totalComments,
						pv1:pv1,
						homeUsers:homeUsers.length,
						listUsers:listUsers.length
					});
				});
			});
			// if(err){console.log(err)}	
			// res.render('movieList',{
			// 	movies:Movies,
			// 	cates:cates,
			// 	totalViews:totalViews,
			// 	totalComments:totalComments,
			// 	pv1:pv1
			// });
		})
		
	})
}

exports.add = function(req,res){
	console.log("-----contr/Movie.js--- Add function")
	MovieCate.find({},function(err,cates){
			res.render('movieAdd',
			{
				cates:cates,
				movie:{
					title:"",
					content:"",
					ti:"",
					si:"",
					edistance:"",
					movieCates:"",
					duration: "",
					pix_fmt: "",
					size: "",
					width: "",
					height: "",
					fps: "",
					bps: "",
					codec_name: "",
					format_name: ""
				}
			})
	})
}

exports.save = function(req,res){
	console.log("-----contr/Movie.js--- save function")

	//var oid = req.body.Movie._id;
	//console.log("oid = " + oid);
	var MovieObj = req.body.movie;
	console.log("MovieObj = " + MovieObj);
	var _Movie;

	console.log("----\n---\n----\n---MovieObj : " + JSON.stringify(MovieObj));

	if(MovieObj._id){
		var oid = req.body.movie._id;
		console.log("*******update Movie*******");
		Movie.findById(oid,function(err,Movie){
			if(err){console.log(err);}
			_Movie = _.extend(Movie,MovieObj);
			_Movie.save(function(err,Movie){
				if(err){console.log(err);}
				res.redirect('/gl/Movie')
			})
		})
	}else{
		MovieCate.findById(MovieObj.movieCates, function(err, cates) {
			console.log("*******add Movie*******");
			_Movie = new Movie({
				title:MovieObj.title,
				content:MovieObj.content,
				ti:MovieObj.ti,
				si:MovieObj.si,
				edistance:MovieObj.edistance,
				movieCates:MovieObj.movieCates,
				pic: MovieObj.pic,
				movie: MovieObj.movie,
				catesName: cates.title,
				duration: MovieObj.duration,
				pix_fmt: MovieObj.pix_fmt,
				size: MovieObj.size,
				width: MovieObj.width,
				height: MovieObj.height,
				fps: MovieObj.fps,
				bps: MovieObj.bps,
				codec_name: MovieObj.codec_name,
				format_name: MovieObj.format_name,
			});

			_Movie.save(function(err,Movie){
				if(err){console.log(err);}

				var category = _Movie.movieCates;
				console.log("category = " + category);
				MovieCate.findById(category,function(err,MovieCate){
					if(err){console.log(err);}
					MovieCate.movies.push(Movie._id)
					MovieCate.save(function(err,MovieCate2){
						if(err){console.log(err);}
						res.redirect('/gl/Movie')
					})
				})
			});
		});

	}
}

exports.setParameter = function(req,res){
	console.log("-----contr/Movie.js--- update function")
	var oid = req.params.id;

	Movie.findById(oid,function(err,Movie){
		if(err){
			console.log(err);
			res.render('404',{});
		}
		else{
			console.log("movie content : " + JSON.stringify(Movie));
			if(Movie.content){
				Movie.content = mark(Movie.content)
			}
			MovieCate.findById(Movie.movieCates,function(err,mCates){
				console.log("mCates : " + mCates);
				if(err){console.log(err)}
				Network.fetch(function(err,Networks){
					if(err){
						console.log(err);
					}

					var fps = Movie.fps;
					if (fps.indexOf("fps")>0) {
						fps = fps.substring(0, fps.indexOf("fps"));
						Movie.fps = fps;
					}

					var bps = Movie.bps;
					if (bps.indexOf("kbps")>0) {
						bps = bps.substring(0, bps.indexOf("kbps"));
						Movie.bps = bps;
					}

					console.log("movie info ----\n Movie : " + JSON.stringify(Movie));

				 	var network = Networks[0];
					network = {
						bandwidth: "",
						timedelay: "",
						packetloss: "",
						mvWidth: Movie.width,//mvInfo['streams'][0]['width'],
						mvHeight: Movie.height,//mvInfo['streams'][0]['height'],
						fps: Movie.fps,
						bps: Movie.bps,//Math.round(mvInfo['streams'][0]['bit_rate']/1000),
						unsharp: "1",
					}

					res.render('setNetwork',{
						movie: Movie,
						mCates: mCates,
						network : network
					});
				});
			});
		}
	});
}

exports.update = function(req,res){
	console.log("-----contr/Movie.js--- update function")
	var oid = req.params.id;
	var movie = req.body.movie;

	Movie.findById(oid,function(err,Movie){
		if(err){
			console.log(err);
			res.render('404',{});
		}
		else{
			console.log("movie content : " + JSON.stringify(Movie));
			if(Movie.content){
				Movie.content = mark(Movie.content)
			}
			Movie.title = movie.title;
			Movie.showdelay = movie.showdelay;
			Movie.content = movie.content;
			var newMovie = Movie;
			newMovie.save(function(err,Movie){
				console.log("Movie = " + JSON.stringify(Movie));
				if(err){console.log(err);}
				res.redirect('/gl/Movie')
			})
		}
	});
}

exports.delete = function(req,res){
	console.log("-----contr/Movie.js--- delete function")
	var id = req.params.id;
	console.log("id = "+id)
	if(id){
		Movie.findById(id,function(err,Movie){
			var currentPath = processor.cwd() + "/public/movie/";
			var arr = new Array();
		    arr = Movie.movie.split("/");
		    var file = arr[0];
		    var cmd = "rm -rf " + currentPath+file;

			console.log("srcMovie :\n" + Movie.movie);
			console.log("cmd :\n" + cmd);
			child = child_process.execSync(cmd,function(err,out) { 
			  	console.log(out);
			});
			MovieCate.findById(Movie.movieCates, function(err, cate){
				if(err){console.log("err = " + err)}
				console.log("cate.movies 1 = " + cate.movies);
				var index = cate.movies.indexOf(id);
				cate.movies.splice(index,1);
				console.log("cate.movies 2 = " + cate.movies);
				cate.save
				cate.save(function(err,MovieCate2){
					if(err){console.log(err);}
					Movie.remove({_id:id},function(err,Movie){
						if(err){console.log("err = " + err)}
						else{
							res.json({success:1})
						}
					});
				});
			});
			
		});
	}
}

exports.movieInfo = function(req,res){
	console.log("-----contr/Movie.js--- movieInfo function")
	var id = req.params.id;

	console.log("movieInfo get params id="+id);
	
	Movie.findById(id,function(err,Movie){
		if(err){
			console.log(err);
			res.render('404',{});
		}
		else{
			// calculateMovieInfo(Movie);
			// used to update comments for the movie
			// Comment.findByMovieId(id, function(err, comments){
			// 	if(err){ console.log(err); }
			// 	Movie.comments = comments.length;
			// 	Movie.save(function(err, movie){
			// 		if(err){ console.log(err); }
			// 		console.log("update comments of movie success!");
			// 	});
			// });
			// return;
			console.log("movie content : " + JSON.stringify(Movie));
			if(Movie.content){
				Movie.content = mark(Movie.content)
			}

			res.render('movieDetailForAdmin',{
				movie: Movie
			});
			return;

			MovieCate.fetch(function(err,mCates){
				if(err){console.log(err)}
				var category = '';
				for (var i = mCates.length - 1; i >= 0; i--) {
						if (mCates[i].id == Movie.movieCates){
							category = mCates[i].title;
						}
					}
				var cmd = "ffprobe -v quiet -print_format json -show_format -show_streams " + "./public/movie/" + Movie.movie;
				console.log("cmd /n/n" + cmd);
				child_process.exec(cmd, function(error, stdout, stderr) {
					console.log('stdout: ' + stdout);
					console.log('stderr: ' + stderr);
					if (error !== null) {
						console.log('exec error: ' + error);
					}

					var mvInfo = JSON.parse(stdout);
					var fps="";
					var arr = new Array();
				    arr = mvInfo['streams'][0]['r_frame_rate'].split("/");
				    if (arr.length>0) {
				    	fps = arr[0];
				    }

					var movieParas = {
						duration: mvInfo['streams'][0]['duration'],
						pix_fmt: mvInfo['streams'][0]['pix_fmt'],
						size: mvInfo['format']['size'],
						width: mvInfo['streams'][0]['width'],
						height: mvInfo['streams'][0]['height'],
						fps: fps + "fps",
						bps: Math.round(mvInfo['streams'][0]['bit_rate']/1000) + "kbps",
						codec_name: mvInfo['streams'][0]['codec_long_name'],
						format_name: mvInfo['format']['format_long_name'],
					}

					console.log("movieParas :" + movieParas);

					res.render('movieDetailForAdmin',{
						movie: Movie,
						category: category,
						params: movieParas
					});
				});	
			})
		}
	});
}


exports.detail = function(req,res){
	console.log("-----contr/Movie.js--- detail function")
	var id = req.params.id;

	console.log("detail get params id="+id);
	Movie.update({_id:id},{$inc:{pv:1}},function(err){
		if(err){console.log(err);}
	})
	
	Movie.findById(id,function(err,Movie){
		if(err){
			console.log(err);
			res.render('404',{});
		}
		else{
			console.log("movie content : " + JSON.stringify(Movie));
			if(Movie.content){
				Movie.content = mark(Movie.content)
			}
			
			MovieCate.fetch(function(err,mCates){
				if(err){console.log(err)}	
				res.render('movieDetail',{
					movie: Movie,
					mCates: mCates
				});
			})
		}
	});
}


//七牛key
qiniu.conf.ACCESS_KEY = "xrrdCWzDm3VQyVt58BQl1ZM_fx4Ar6qS79XyMAYo";
qiniu.conf.SECRET_KEY = "UHY_F_U94v1T6-tDJ_8OjxCXBqgu8d1ozwdvNMub";

exports.qiniuUpload = function(req,res, next){
	//七牛获取uptoken
	//七牛云存储
	console.log("***********************************");

    var myUptoken = new qiniu.rs.PutPolicy("dongdong");
    var token = myUptoken.token();
    //moment.locale('en');
    //var currentKey = moment(new Date()).format('YYYY-MM-DD--HH-mm-ss');
    res.header("Cache-Control", "max-age=0, private, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    if (token) {
        res.json({
            uptoken: token
            //sava_key :currentKey
        });
    }

}

exports.submitScore = function(req,res){
	console.log("-----contr/Movie.js--- submitScore function")

	//var oid = req.body.Movie._id;
	//console.log("oid = " + oid);
	var id = req.body.id;
	var vcontent = req.body.vcontent;
	var clarity = req.body.clarity;
	var loadSpeed = req.body.loadSpeed;
	var quality = req.body.quality;

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
	
	// if(clarity == 0 || loadSpeed == 0 || quality == 0){
	// 	res.json({result : 0});
	// }
	console.log("id = " + id);
	if(id){

		_Comment = new Comment({
			movie: id,
			vcontent: vcontent,
			clarity: clarity,
			loadSpeed: loadSpeed,
			quality: quality,
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

		console.log("new _Comment : " + JSON.stringify(_Comment));

		_Comment.save(function(err,comment){
			console.log("id2 = " + id);
			if(err){
				console.log("id3 = " + id);
				console.log(err);
				res.json({result : 0});
			}else{
				Movie.update({_id:id},{$inc:{comments:1}},function(err){
					if(err){console.log(err);}
				})
				res.json({result : 1});
				// Comment.findByMovieId(id, function(err, comments){
				// 	if(err){ console.log(err); }
				// 	Movie.findById(id, function(err, movie){
				// 		if(err){ console.log(err); }
				// 		movie.comments = comments.length;
				// 		movie.save(function(err, movie){
				// 			if(err){ console.log(err); }
				// 			res.json({result : 1});
				// 		});
				// 	});
				// });
			}
		})		
	}else{
		res.json({result : 0});
	}
}

exports.showComment = function(req,res){
	console.log("-----contr/Movie.js--- showComment function")
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
				Comment.findByMovieId(Movie.id, function(err,comments){
					console.log("movie comments : " + JSON.stringify(comments));
					comments = comments.reverse();
					res.render('movieCommentsList',{
						comments: comments,
						movie: Movie,
						mCates: mCates
					});
				})
			})
		}
	});
}

exports.setNetwork = function(req,res){
	console.log("-----contr/setNetwork.js--- setNetwork function")
	var id = req.params.id;
	
	Movie.findById(id,function(err,Movie){
		if(err){
			console.log(err);
			res.render('404',{});
		}
		else{
			if(Movie.content){
				Movie.content = mark(Movie.content)
			}
			MovieCate.fetch(function(err,mCates){
				if(err){console.log(err)}
				var network = Networks[0];
				if(network == null){
					console.log("network null");
					network = {
						bandwidth: "",
						timedelay: "",
						packetloss: ""
					}
				}	
				res.render('setNetwork',{
					movie: Movie,
					mCates: mCates,
					network : network
				});
			})
		}
	});
}


exports.saveNetwork = function(req,res){
	console.log("-----contr/Movie.js--- saveNetwork function")

	var movieObj = req.body.movie;
	var cateObj = req.body.mCates;
	var netObj = req.body.network;
	console.log("movieObj \n" + JSON.stringify(movieObj));
	console.log("cateObj \n" + JSON.stringify(cateObj));
	console.log("netObj \n" + JSON.stringify(netObj));

	var movieId = movieObj._id;

	if(movieId){
		Movie.findById(movieId,function(err,movieInfo){
			if(err) { 
				console.log(err); 
			}
			//saveNetEvent.emit("NetWorkSave", "25%");
			saveNetNum = "20%";
			saveNetMsg = "setting network parameters...";
			console.log(JSON.stringify(movieInfo));
			MovieCate.find(movieInfo.movieCates,function(err,cates){
				if(err){
					console.log(err);
				}
				Network.fetch(function(err,Networks){
					if(err){
						console.log(err);
					}

					var oldNet = {
						bandwidth: "",
						timedelay: "",
						packetloss: "",
						mvWidth: movieInfo.width,
						mvHeight: movieInfo.height,
						fps: movieInfo.fps,
						bps: movieInfo.bps,
						unsharp: "1",
					}

					var infoChanged = false;
					if (oldNet.mvWidth == netObj.mvWidth && oldNet.mvHeight == netObj.mvHeight && 
						oldNet.fps == netObj.fps && oldNet.bps == netObj.bps && oldNet.unsharp == netObj.unsharp 
						&& movieInfo.showdelay == movieObj.showdelay) {
						infoChanged = false;
					} else {
						infoChanged = true;
					}

					if (!(netObj.bandwidth > 0) && !(netObj.timedelay > 0) && !infoChanged){
						res.redirect('/gl/Movie');
						return;
					}

					var width = movieInfo.width;
					var height = movieInfo.height;
					var fps = movieInfo.fps;

					//设置了带宽，延时等网络参数，优先处理网络参数
					if ((netObj.bandwidth > 0 || netObj.timedelay > 0) && infoChanged) {
						netAndMovieInfoChanged(movieInfo, cates, Networks, movieObj, cateObj, netObj, oldNet, width, height, fps);
					} else if ((netObj.bandwidth > 0 || netObj.timedelay > 0) && !infoChanged) {
						netChanged(movieInfo, cates, Networks, movieObj, cateObj, netObj, width, height, fps);
					} else {
						MovieInfoChanged(movieInfo, cates, Networks, movieObj, cateObj, netObj, oldNet, width, height, fps);
					}
				});
			});
		});
	}

	return;
}

function netAndMovieInfoChanged(movieInfo, cates, Networks, movieObj, cateObj, netObj, oldNet, width, height, fps) {
	var currentPath, newPath;
	var newMovie;
	var cmd;
	var targetMovie, targetMovie1;
	var newPic;

	console.log("---------netAndMovieInfoChanged------------");
	newDir = mkdirNewPath();
	currentPath = processor.cwd() + "/public/movie/";
	newPath = currentPath + newDir;
	targetMovie = newDir + ".target.mp4";
	targetMovie1 = newDir + ".1.target.mp4"
	newMovie = newDir + "/" + targetMovie1;
	if (movieInfo.pic.indexOf("/") > -1) {
		var tempArr = movieInfo.pic.split("/");
		movieInfo.pic = tempArr[0] + "/" + tempArr[tempArr.length - 1];
		newPic = newDir + "/" + tempArr[tempArr.length - 1];
	} else {
		newPic = newDir + "/" + movieInfo.pic;
	}

	var moviePath = currentPath + movieInfo.movie;
	var picPath = currentPath + movieInfo.pic;

	//copy 源视频，配置文件到新生成的目录下
	var configPath = processor.cwd() + "/public/nsConfig/*";
	cmd = "cp -rf " + moviePath + " " + picPath + " " + configPath + " "+ newPath;

	var network = Networks[0]; 
	console.log("cmd :" + cmd);
	console.log("newMovie : " + newMovie);

	saveNetNum = "40%";
	saveNetMsg = "setting network parameters...";
	saveNetDir =  newDir;
	child = child_process.execSync(cmd, options, function(error, stdout, stderr) {
		flag = false;
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});

	//获取网络参数
	var bandwidthParas, timedelayParas;
	if (netObj.bandwidth > 0) {
		bandwidthParas = netObj.bandwidth + "Mb";
	} else {
		bandwidthParas = 1000 + "Mb";
	}

	if (netObj.timedelay > 0) {
		timedelayParas = netObj.timedelay + "ms";
	} else {
		timedelayParas = 0 + "ms";
	}

	//带宽，延时信息写入ns2的tcl文件
	var buffer = '\n\nset bandwidth ' + bandwidthParas +'\nset timedelay ' + timedelayParas +'\n\n';
	console.log("buffer = " + buffer);
	//读取文件
	var data = fs.readFileSync(newPath + '/header.tcl','utf-8');
	data += buffer;
	data += fs.readFileSync(newPath + '/tail.tcl','utf-8');  
	//写入文件
	fs.writeFileSync(newPath + '/be.tcl', data, 'utf-8');
	
	saveNetNum = "65%";
	saveNetMsg = "creating new video...";

	//字符串分割，拿出实际视频名称作为process.sh脚步的参数
	var arr = new Array();
    arr = movieInfo.movie.split("/");
	var srcMovie = arr[arr.length - 1];
	console.log("srcMovie :\n" + srcMovie);

	//ns2处理网络参数
	var nsCmd = "bash createMovie.sh " + newPath + " " + srcMovie + " " + targetMovie + " " + width + " " + height + " " + fps;
	console.log("nsCmd :\n" + nsCmd);
	child_process.execSync(nsCmd, options, function(error, stdout, stderr) {
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});

	saveNetNum = "70%";
	saveNetMsg = "creating new video...";

	//获取视频处理参数
	nsCmd = "ffmpeg -i " + newPath + "/" + targetMovie + " ";
	if (netObj && oldNet) {
		if (netObj.fps > 0 && netObj.fps != oldNet.fps) {
			nsCmd += "-r " + netObj.fps + " ";
		}

		if (netObj.bps > 0 &&netObj.bps != oldNet.bps) {
			nsCmd += "-b " + netObj.bps + "k ";
		}

		if (netObj.mvWidth > 0 && netObj.mvHeight > 0 && netObj.mvWidth != oldNet.mvWidth && netObj.mvHeight != oldNet.mvHeight) {
			nsCmd += "-s " + netObj.mvWidth + "*" + netObj.mvHeight + " ";
		}

		if (netObj.unsharp >=-2 && netObj.unsharp <= 5 && netObj.unsharp != oldNet.unsharp) {
			nsCmd += "-vf unsharp=5:5:" + netObj.unsharp + " ";
		}
	}

	//ffmpeg 处理视频属性参数
	nsCmd += newPath + "/" + targetMovie1;
	console.log("nsCmd :\n" + nsCmd);
	child_process.exec(nsCmd, options, function(error, stdout, stderr) {
		saveNetNum = "80%";
		saveNetMsg = "computing TI&SI value...";
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}

		//获取新视频的ti，si值
		var data=fs.readFileSync(newPath + "/result_tisi.csv","utf-8");  
		arr = data.split("\n");
		var maxTi, maxSi;
		for(i=0;i<arr.length-1;i++)
		{
			arr1 = arr[i].split(" ");
			for(j=0;j<arr1.length-1;j++) {
				if (arr1[0] == "maxTI") {
					maxTi = arr1[1];
				} else if (arr1[0] == "maxSI") {
					maxSi = arr1[1];
				}
			}
		    console.log("arr[" + i + "] = " + arr[i]);
		}
		console.log("maxTi : " + maxTi);
		console.log("maxSi : " + maxSi);

		//获取新视频的视频信息
		MovieCate.fetch(function(err, cates){
			saveNetNum = "90%";
			saveNetNum = "computing eDistance value......";
			console.log("cates = " + JSON.stringify(cates));
			var tiArr = [];
			var siArr = [];
			var catesIds = [];
			var ret = [];
			var x = 0, y = 0; 

			for(var i = 0, len = cates.length; i < len; i++){
				TISI.findByCateId(cates[i]._id, function(err, tisis){
					tiArr[x] = [];
					siArr[x] = [];
					if (tisis.length > 0) {
						catesIds[x] = tisis[0].movieCates;
					} else {
						catesIds[x] = 0;
					}
					
					for (var j = 0; j < tisis.length;  j++) {
						tiArr[x][j] = parseFloat(tisis[j].ti);
						siArr[x][j] = parseFloat(tisis[j].si);
					}

					if (tiArr.length == cates.length) {
						console.log("tiArr = " + JSON.stringify(tiArr));
						console.log("siArr = " + JSON.stringify(siArr));
						var resultObj = euclideanDistanceIndex(maxTi, maxSi, tiArr, siArr);
						var resultTypeId = catesIds[resultObj.index];

						var infopath = currentPath + "/" + newMovie;
						var infocmd = "ffprobe -v quiet -print_format json -show_format -show_streams " + infopath;
						child_process.exec(infocmd, function(error, stdout, stderr) {
							if (error !== null) {
								console.log('exec error: ' + error);
							}
							var mvInfo = JSON.parse(stdout);
							var fps="";
							var arr = new Array();
						    arr = mvInfo['streams'][0]['r_frame_rate'].split("/");
						    if (arr.length>0) {
						    	fps = arr[0];
						    }

							newMovieObj = new Movie({
								title:movieObj.title,
								content:movieObj.content,
								ti:maxTi,
								si:maxSi,
								edistance:resultObj.eDistance,
								movieCates:resultTypeId,
								pic: newPic,
								movie: newMovie,
								dir : newDir,
								showdelay: movieObj.showdelay,
								duration: mvInfo['streams'][0]['duration'],
								pix_fmt: mvInfo['streams'][0]['pix_fmt'],
								size: mvInfo['format']['size'],
								width: mvInfo['streams'][0]['width'],
								height: mvInfo['streams'][0]['height'],
								fps: fps + "fps",
								bps: Math.round(mvInfo['streams'][0]['bit_rate']/1000) + "kbps",
								codec_name: mvInfo['streams'][0]['codec_long_name'],
								format_name: mvInfo['format']['format_long_name'],
								catesName: movieInfo.catesName
							}); 
							
							newMovieObj.save(function(err,Movie){
								if(err){console.log(err);}

								var category = newMovieObj.movieCates;
								console.log("category = " + category);
								MovieCate.findById(category,function(err,MovieCate){
									if(err){console.log(err);}
									MovieCate.movies.push(Movie._id)
									MovieCate.save(function(err,MovieCate2){
										if(err){console.log(err);}
										saveNetNum = "100%";
										saveNetMsg = "Finished";
										//res.redirect('/gl/Movie');
									});
								});
							});
						});
					}
					x++;
				});
			}
		});
	});
}

function netChanged(movieInfo, cates, Networks, movieObj, cateObj, netObj, width, height, fps) {
	console.log("---------netChanged------------");
	var currentPath, newPath;
	var newMovie;
	var cmd;
	var targetMovie;
	var newPic;

	//生成新目录
	newDir = mkdirNewPath();
	currentPath = processor.cwd() + "/public/movie/";
	newPath = currentPath + newDir;
	targetMovie = newDir + ".target.mp4";
	newMovie = newDir + "/" + targetMovie;
	if (movieInfo.pic.indexOf("/") > -1) {
		var tempArr = movieInfo.pic.split("/");
		movieInfo.pic = tempArr[0] + "/" + tempArr[tempArr.length - 1];
		newPic = newDir + "/" + tempArr[tempArr.length - 1];
	} else {
		newPic = newDir + "/" + movieInfo.pic;
	}

	//copy 源视频，配置文件到新生成的目录下
	var moviePath = currentPath + movieInfo.movie;
	var picPath = currentPath + movieInfo.pic;
	var configPath = processor.cwd() + "/public/nsConfig/*";
	cmd = "cp -rf " + moviePath + " " + picPath + " " + configPath + " "+ newPath;

	var network = Networks[0]; 
	console.log("cmd :" + cmd);
	console.log("newMovie : " + newMovie);

	saveNetNum = "40%";
	saveNetMsg = "setting network parameters...";
	saveNetDir =  newDir;
	child = child_process.execSync(cmd, function(error, stdout, stderr) {
		flag = false;
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});

	//get network parameters
	var bandwidthParas, timedelayParas;
	if (netObj.bandwidth > 0) {
		bandwidthParas = netObj.bandwidth + "Mb";
	} else {
		bandwidthParas = 1000 + "Mb";
	}

	if (netObj.timedelay > 0) {
		timedelayParas = netObj.timedelay + "ms";
	} else {
		timedelayParas = 0 + "ms";
	}

	//create tcl script of ns2
	var buffer = '\n\nset bandwidth ' + bandwidthParas +'\nset timedelay ' + timedelayParas +'\n\n';
	console.log("buffer = " + buffer);
	//读取文件
	var data = fs.readFileSync(newPath + '/header.tcl','utf-8');
	data += buffer;
	data += fs.readFileSync(newPath + '/tail.tcl','utf-8');  
	//写入文件
	fs.writeFileSync(newPath + '/be.tcl', data, 'utf-8');
	
	saveNetNum = "65%";
	saveNetMsg = "creating new video...";

	//字符串分割，拿出实际视频名称作为process.sh脚步的参数
	var arr = new Array();
    arr = movieInfo.movie.split("/");
	var srcMovie = arr[arr.length - 1];
	console.log("srcMovie :\n" + srcMovie);

	//ns2 handle movie
	var nsCmd = "bash createMovie.sh " + newPath + " " + srcMovie + " " + targetMovie + " " + width + " " + height + " " + fps;
	console.log("nsCmd :\n" + nsCmd);
	child_process.exec(nsCmd, options, function(error, stdout, stderr) {
		saveNetNum = "80%";
		saveNetMsg = "creating new video...";
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}

		//get ti and si of new movie
		var data=fs.readFileSync(newPath + "/result_tisi.csv","utf-8");  
		arr = data.split("\n");
		var maxTi, maxSi;
		for(i=0;i<arr.length-1;i++)
		{
			arr1 = arr[i].split(" ");
			for(j=0;j<arr1.length-1;j++) {
				if (arr1[0] == "maxTI") {
					maxTi = arr1[1];
				} else if (arr1[0] == "maxSI") {
					maxSi = arr1[1];
				}
			}
		    console.log("arr[" + i + "] = " + arr[i]);
		}
		console.log("maxTi : " + maxTi);
		console.log("maxSi : " + maxSi);

		//get and save the information of new video
		MovieCate.fetch(function(err, cates){
			saveNetNum = "90%";
			saveNetNum = "computing eDistance value......";
			console.log("cates = " + JSON.stringify(cates));
			var tiArr = [];
			var siArr = [];
			var catesIds = [];
			var ret = [];
			var x = 0, y = 0; 
			for(var i = 0, len = cates.length; i < len; i++){
				TISI.findByCateId(cates[i]._id, function(err, tisis){
					tiArr[x] = [];
					siArr[x] = [];
					if (tisis.length > 0) {
						catesIds[x] = tisis[0].movieCates;
					} else {
						catesIds[x] = 0;
					}
					
					for (var j = 0; j < tisis.length;  j++) {
						tiArr[x][j] = parseFloat(tisis[j].ti);
						siArr[x][j] = parseFloat(tisis[j].si);
					}

					// == means a cate reach end
					if (tiArr.length == cates.length) {
						console.log("tiArr = " + JSON.stringify(tiArr));
						console.log("siArr = " + JSON.stringify(siArr));
						var resultObj = euclideanDistanceIndex(maxTi, maxSi, tiArr, siArr);
						var resultTypeId = catesIds[resultObj.index];

						var infopath = currentPath + "/" + newMovie;
						var infocmd = "ffprobe -v quiet -print_format json -show_format -show_streams " + infopath;
						child_process.exec(infocmd, function(error, stdout, stderr) {
							if (error !== null) {
								console.log('exec error: ' + error);
							}

							// 获取视频信息
							var mvInfo = JSON.parse(stdout);
							var fps="";
							var arr = new Array();
						    arr = mvInfo['streams'][0]['r_frame_rate'].split("/");
						    if (arr.length>0) {
						    	fps = arr[0];
						    }

							newMovieObj = new Movie({
								title:movieObj.title,
								content:movieObj.content,
								ti:maxTi,
								si:maxSi,
								edistance:resultObj.eDistance,
								movieCates:resultTypeId,
								pic: newPic,
								movie: newMovie,
								dir : newDir,
								showdelay: movieObj.showdelay,
								duration: mvInfo['streams'][0]['duration'],
								pix_fmt: mvInfo['streams'][0]['pix_fmt'],
								size: mvInfo['format']['size'],
								width: mvInfo['streams'][0]['width'],
								height: mvInfo['streams'][0]['height'],
								fps: fps + "fps",
								bps: Math.round(mvInfo['streams'][0]['bit_rate']/1000) + "kbps",
								codec_name: mvInfo['streams'][0]['codec_long_name'],
								format_name: mvInfo['format']['format_long_name'],
								catesName: movieInfo.catesName
							}); 
							
							newMovieObj.save(function(err,Movie){
								if(err){console.log(err);}
								var category = newMovieObj.movieCates;
								console.log("category = " + category);
								MovieCate.findById(category,function(err,MovieCate){
									if(err){console.log(err);}
									MovieCate.movies.push(Movie._id)
									MovieCate.save(function(err,MovieCate2){
										if(err){console.log(err);}
										saveNetNum = "100%";
										saveNetMsg = "Finished";
										//res.redirect('/gl/Movie');
									});
								});
							});
						});
					}
					x++;
				});
			}
		});

	});
}

function MovieInfoChanged(movieInfo, cates, Networks, movieObj, cateObj, netObj, oldNet, width, height, fps) {
	console.log("---------MovieInfoChanged------------");
	var currentPath, newPath;
	var newMovie;
	var cmd;
	var targetMovie;
	var newPic;

	//create new dir
	newDir = mkdirNewPath();
	currentPath = processor.cwd() + "/public/movie/";
	newPath = currentPath + newDir;
	targetMovie = newDir + ".target.mp4";
	newMovie = newDir + "/" + targetMovie;
	if (movieInfo.pic.indexOf("/") > -1) {
		var tempArr = movieInfo.pic.split("/");
		movieInfo.pic = tempArr[0] + "/" + tempArr[tempArr.length - 1];
		newPic = newDir + "/" + tempArr[tempArr.length - 1];
	} else {
		newPic = newDir + "/" + movieInfo.pic;
	}

	//copy src video , config script to new dir
	var moviePath = currentPath + movieInfo.movie;
	var picPath = currentPath + movieInfo.pic;
	var configPath = processor.cwd() + "/public/nsConfig/*";
	cmd = "cp -rf " + moviePath + " " + picPath + " " + configPath + " "+ newPath;

	var network = Networks[0]; 
	console.log("cmd :" + cmd);
	console.log("newMovie : " + newMovie);

	saveNetNum = "40%";
	saveNetMsg = "setting network parameters...";
	saveNetDir =  newDir;
	child = child_process.execSync(cmd, function(error, stdout, stderr) {
		flag = false;
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});
	
	saveNetNum = "65%";
	saveNetMsg = "creating new video...";

	//字符串分割，拿出实际视频名称作为process.sh脚步的参数
	var arr = new Array();
    arr = movieInfo.movie.split("/");
	var srcMovie = arr[arr.length - 1];
	console.log("srcMovie :\n" + srcMovie);

	//ffmepeg handle the video
	var nsCmd = "ffmpeg -i " + newPath + "/" + srcMovie + " ";
	if (netObj && oldNet) {
		if (netObj.fps > 0 && netObj.fps != oldNet.fps) {
			nsCmd += "-r " + netObj.fps + " ";
		}

		if (netObj.bps > 0 &&netObj.bps != oldNet.bps) {
			nsCmd += "-b " + netObj.bps + "k ";
		}

		if (netObj.mvWidth > 0 && netObj.mvHeight > 0 && netObj.mvWidth != oldNet.mvWidth && netObj.mvHeight != oldNet.mvHeight) {
			nsCmd += "-s " + netObj.mvWidth + "*" + netObj.mvHeight + " ";
		}

		if (netObj.unsharp >=-2 && netObj.unsharp <= 5 && netObj.unsharp != oldNet.unsharp) {
			nsCmd += "-vf unsharp=5:5:" + netObj.unsharp + " ";
		}
	}

	// exec ffmpeg
	nsCmd += newPath + "/" + targetMovie;
	console.log("nsCmd :\n" + nsCmd);
	child_process.exec(nsCmd, options, function(error, stdout, stderr) {
		saveNetNum = "80%";
		saveNetMsg = "creating new video...";
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}

		var cmd = "bash createAnalysisFiles.sh " + newPath + " " + srcMovie + " " + targetMovie + " " + width + " " + height;
		child_process.execSync(cmd, options, function(error, stdout, stderr) {
			console.log('stdout: ' + stdout);
			console.log('stderr: ' + stderr);
			if (error !== null) {
				console.log('exec error: ' + error);
			};
		});

		//get ti, si of the new video
		var data=fs.readFileSync(newPath + "/result_tisi.csv","utf-8");  
		arr = data.split("\n");
		var maxTi, maxSi;
		for(i=0;i<arr.length-1;i++)
		{
			arr1 = arr[i].split(" ");
			for(j=0;j<arr1.length-1;j++) {
				if (arr1[0] == "maxTI") {
					maxTi = arr1[1];
				} else if (arr1[0] == "maxSI") {
					maxSi = arr1[1];
				}
			}
		    console.log("arr[" + i + "] = " + arr[i]);
		}
		console.log("maxTi : " + maxTi);
		console.log("maxSi : " + maxSi);
		
		MovieCate.fetch(function(err, cates){
			saveNetNum = "90%";
			saveNetNum = "computing eDistance value......";
			console.log("cates = " + JSON.stringify(cates));
			var tiArr = [];
			var siArr = [];
			var catesIds = [];
			var ret = [];
			var x = 0, y = 0; 
			for(var i = 0, len = cates.length; i < len; i++){
				TISI.findByCateId(cates[i]._id, function(err, tisis){
					tiArr[x] = [];
					siArr[x] = [];
					if (tisis.length > 0) {
						catesIds[x] = tisis[0].movieCates;
					} else {
						catesIds[x] = 0;
					}
					
					for (var j = 0; j < tisis.length;  j++) {
						tiArr[x][j] = parseFloat(tisis[j].ti);
						siArr[x][j] = parseFloat(tisis[j].si);
					}

					if (tiArr.length == cates.length) {
						console.log("tiArr = " + JSON.stringify(tiArr));
						console.log("siArr = " + JSON.stringify(siArr));
						var resultObj = euclideanDistanceIndex(maxTi, maxSi, tiArr, siArr);
						// var resultTypeId = cates[resultObj.index]._id;
						var resultTypeId = catesIds[resultObj.index];

						var infopath = currentPath + "/" + newMovie;
						var infocmd = "ffprobe -v quiet -print_format json -show_format -show_streams " + infopath;
						child_process.exec(infocmd, function(error, stdout, stderr) {
							if (error !== null) {
								console.log('exec error: ' + error);
							}

							// 获取视频信息
							var mvInfo = JSON.parse(stdout);
							var fps="";
							var arr = new Array();
						    arr = mvInfo['streams'][0]['r_frame_rate'].split("/");
						    if (arr.length>0) {
						    	fps = arr[0];
						    }

							newMovieObj = new Movie({
								title:movieObj.title,
								content:movieObj.content,
								ti:maxTi,
								si:maxSi,
								edistance:resultObj.eDistance,
								movieCates:resultTypeId,
								pic: newPic,
								movie: newMovie,
								dir : newDir,
								showdelay: movieObj.showdelay,
								duration: mvInfo['streams'][0]['duration'],
								pix_fmt: mvInfo['streams'][0]['pix_fmt'],
								size: mvInfo['format']['size'],
								width: mvInfo['streams'][0]['width'],
								height: mvInfo['streams'][0]['height'],
								fps: fps + "fps",
								bps: Math.round(mvInfo['streams'][0]['bit_rate']/1000) + "kbps",
								codec_name: mvInfo['streams'][0]['codec_long_name'],
								format_name: mvInfo['format']['format_long_name'],
								catesName: movieInfo.catesName
							}); 
							
							newMovieObj.save(function(err,Movie){
								if(err){console.log(err);}
								var category = newMovieObj.movieCates;
								console.log("category = " + category);
								MovieCate.findById(category,function(err,MovieCate){
									if(err){console.log(err);}
									MovieCate.movies.push(Movie._id)
									MovieCate.save(function(err,MovieCate2){
										if(err){console.log(err);}
										saveNetNum = "100%";
										saveNetMsg = "Finished";
										//res.redirect('/gl/Movie');
									});
								});
							});
						});
					}
					x++;
				});
			}
		});

	});
}

exports.saveNetworkStatus = function(req,res){
	console.log("status :" + saveNetNum + "    msg :" + saveNetMsg + "   newDir : " + newDir);
	res.json({status : saveNetNum, msg : saveNetMsg, newDir : saveNetDir});
}

exports.movieCover = function(req,res){
	console.log("-----movieCover----------------")
	var name = req.params.name;
	var path = req.params.path;
	var filePath = "./public/movie/";

	if (path) {
		filePath += path + "/" + name;
		
	} else {
		filePath += name;
	}

	console.log("file : " + filePath);

	fs.readFile(filePath, "binary", function(error, file) {
		if(error) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            res.write(error + "\n");
            res.end();
        } else {
            res.writeHead(200, {"Content-Type": "image/png"});
            res.write(file, "binary");
            res.end();
        }
	});
}

exports.analysisFileDownload = function(req,res){
	console.log("-----analysisFileDownload----------------")
	var name = req.params.name;
	var path1 = req.params.path1;
	var path2 = req.params.path2;
	var path3 = req.params.path3;

	var filePath = "public/movie/";

	if (path1) {
		filePath += path1 + "/";

		if (path2) {
			filePath += path2 + "/"

			if (path3) {
				filePath += path3 + "/";
			}
		}
		
	} 

	filePath += name;

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

exports.analysisFileList  = function(req, res){
	console.log("-----analysisFileList----------------")
	var path = req.params.path;

	var pattern = "./public/movie/" + path + "/**/*.csv";

	console.log("pattern : " + pattern);
	//var pattern = "./public/movie/**/*.csv";
	glob(pattern, {nodir: true}, function (err, files) {
	    if(err) {
	        console.log(err);
	    }
	    else {
	        console.log(files);

	        var anaFiles = [];
	        for (var i = 0; i < files.length; i++) {
	        	var arr = files[i].split('./public/movie/');

	        	console.log("arr : " + arr);

	        	var name='';
	        	var file='';
	        	if (arr.length >=1) {
	        		if(arr[1].indexOf("psnr") > -1){
	        			name = "psnr";
	        		}
	        		else if(arr[1].indexOf("ssim") > -1){
	        			name = "ssim";
	        		}
	        		else if(arr[1].indexOf("mos") > -1){
	        			name = "mos";
	        		}
	        		else if(arr[1].indexOf("miv") > -1){
	        			name = "miv";
	        		} 
	        		else if(arr[1].indexOf("Delta") > -1){
	        			name = "Delta";
	        		}
	        		else if(arr[1].indexOf("MSAD") > -1){
	        			name = "MSAD";
	        		}
	        		else if(arr[1].indexOf("MSE") > -1){
	        			name = "MSE";
	        		}
	        		else if(arr[1].indexOf("VQM") > -1){
	        			name = "VQM";
	        		}
	        		else if(arr[1].indexOf("hist") > -1){
	        			name = "hist";
	        		}
	        		else {
	        			name = "Other"
	        		}

	        		anaFiles.push({name:name, file:arr[1]});
	        	}
	        }

	        console.log("anaFiles : " + anaFiles);
	        res.render('analysisFileList',{ files:anaFiles});
	    }
	});
}


exports.mvUpload = function(req, res){
	console.log("-----contr/Movie.js--- mvUpload function")
  	var message = '';
  	var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir = 'public/movie/';     //设置上传目录
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
  
  	upBaseMvNum = "15%";
	upBaseMvMsg = "upload...";
  	form.parse(req, function(err, fields, files) {
    	if (err) {
      		console.log(err);
      		res.json({result : 0});
    	}  
    	upBaseMvNum = "40%";
		upBaseMvMsg = "upload...";

	    var filename = files.resource.name;

	    // 对文件名进行处理，以应对上传同名文件的情况
	    var nameArray = filename.split('.');
	    var type = nameArray[nameArray.length-1];
	    var name = '';

	    for(var i=0; i<nameArray.length-1; i++) {
	        name = name + nameArray[i];
	    }
	    
	    var rand = Math.random()*100 + 900;
	    var num = parseInt(rand, 10);

	    var avatarName = name + num + '.' + type;
	    var picName = name + num + '.jpg';

	    var newPath = form.uploadDir + avatarName ;
	    fs.renameSync(files.resource.path, newPath);  //重命名
		var currentPath = processor.cwd();
		newPath = currentPath + "/" + newPath;
		var picPath = currentPath + "/" + form.uploadDir + picName;
		var newPathMp4 = currentPath + "/" + form.uploadDir + name + num + '.mp4';

		var yuvFile = "";
		var TISICMD = "";

		console.log("type : " + type);

		//非mp4,yuv格式的视频转换为可播放的mp4
		if (type != "mp4" && type != "yuv") {
			var cmdffprobe = "ffprobe -v quiet -print_format json -show_format -show_streams " + newPath;
			console.log("cmdffprobe /n/n" + cmdffprobe);
			child_process.exec(cmdffprobe, function(error, stdout, stderr) {
				if (error !== null) {
					console.log('exec error: ' + error);
				}

				var mvInfo = JSON.parse(stdout);
				var size = mvInfo['streams'][0]['width'] + "*" + mvInfo['streams'][0]['height'];

				var changeTypeCmd = "ffmpeg -i " + newPath + " -s " + size + " -pix_fmt yuv420p -vcodec h264 -acodec copy " + newPathMp4;
				console.log("changeTypeCmd /n/n" + changeTypeCmd);
				avatarName = name + num + '.mp4';
			    child_process.execSync(changeTypeCmd, function (error, stdout, stderr) {
				    console.log('stdout: ' + stdout);
				    console.log('stderr: ' + stderr);
				    if (error !== null) {
				      console.log('exec error: ' + error);
				    }
				});
			});
		} else if (type != "mp4" && type == "yuv") { //yuv格式的视频转换为可播放的mp4
			arr = newPath.split("+");
			var size = "352*288";
			if (arr.length > 0) {
				var tempStr = arr[1];
				var tempArr = tempStr.split("x");
				if (tempArr.length == 2) {
					size = tempArr[0] + "*" + tempArr[1];
				}
			}
			var changeTypeCmd = "ffmpeg -s " + size + " -pix_fmt yuv420p -i " + newPath + " -s " + size + " -pix_fmt yuv420p -vcodec h264 " + newPathMp4;
			console.log("changeTypeCmd :\n" + changeTypeCmd);
			avatarName = name + num + '.mp4';
		    child_process.execSync(changeTypeCmd, function (error, stdout, stderr) {
			    console.log('stdout: ' + stdout);
			    console.log('stderr: ' + stderr);
			    if (error !== null) {
			      console.log('exec error: ' + error);
			    }
			});
		}

		//视频截图
		var tempPath = newPath;
		if (type == "yuv") {
			tempPath = newPathMp4;
		}
	    var picCmd = "ffmpeg -i " + tempPath + " -y -f image2 -ss 00:00:00 -vframes 1 -s 352*288 " + picPath;
	    child_process.execSync(picCmd, function (error, stdout, stderr) {
		    console.log('stdout: ' + stdout);
		    console.log('stderr: ' + stderr);
		    if (error !== null) {
		      console.log('exec error: ' + error);
		    }
		});

	    //calculate ti , si of the video
		if (type !== "yuv") {
			upBaseMvNum = "60%";
			upBaseMvMsg = "format yuv...";
			var yuvFile = currentPath + "/" + form.uploadDir + name + num + ".yuv"; 
	    	var cmd = "ffmpeg -i " + newPath + " " + yuvFile;
	    	TISICMD = "TISI -i " + yuvFile + " -x 352 -y 288 -f 420";
	    	
	    	console.log("------------\ncmd = " + cmd);
	    	child = child_process.execSync(cmd, function (error, stdout, stderr) {
			    console.log('stdout: ' + stdout);
			    console.log('stderr: ' + stderr);
			    if (error !== null) {
			      console.log('exec error: ' + error);
			    }
			});
	    } else {
	    	TISICMD = "TISI -i " + newPath + " -x 352 -y 288 -f 420";
	    }

		console.log("-----------\n" + TISICMD + "\n-----------");
		upBaseMvNum = "70%";
		upBaseMvMsg = "computing TI&SI value...";

		var maxTI;
		var maxSI;
		child = child_process.exec(TISICMD, function (error, stdout, stderr) {
		    console.log('stdout: ' + stdout);
		    maxTI = getMaxTI(stdout);
			maxSI = getMaxSI(stdout);
			console.log('maxTI:\n' + maxTI);
			console.log('maxSI:\n' + maxSI);
		    console.log('stderr: ' + stderr);
		    if (error !== null) {
		      console.log('exec error: ' + error);
		    }

		    if (type != "mp4") {
		    	var yuvPath = currentPath + "/" + form.uploadDir + "*.yuv";
		    	var moviePath = newPath;
		    	child_process.exec("rm " + yuvPath + " " + moviePath, function (error, stdout, stderr) {
		    		if (error !== null) {
				      console.log('exec error: ' + error);
				    }
		    	});
		    }

			MovieCate.fetch(function(err, cates){
				upBaseMvNum = "90%";
				upBaseMvMsg = "computing eDistance value......";
				console.log("cates = " + JSON.stringify(cates));
				var tiArr = [];
				var siArr = [];
				var catesIds = [];
				var ret = [];
				var x = 0, y = 0; 

				if (cates.length == 0) {
					upBaseMvNum = "100%";
					upBaseMvMsg = "error: no vedio type is empty!";
					return;
				}
				for(var i = 0, len = cates.length; i < len; i++){
					TISI.findByCateId(cates[i]._id, function(err, tisis){
						tiArr[x] = [];
						siArr[x] = [];
						if (tisis.length > 0) {
							catesIds[x] = tisis[0].movieCates;
						} else {
							catesIds[x] = 0;
						}
						
						for (var j = 0; j < tisis.length;  j++) {
							tiArr[x][j] = parseFloat(tisis[j].ti);
							siArr[x][j] = parseFloat(tisis[j].si);
						}

						if (tiArr.length == cates.length) {
							console.log("tiArr = " + JSON.stringify(tiArr));
							console.log("siArr = " + JSON.stringify(siArr));
							var resultObj = euclideanDistanceIndex(maxTI, maxSI, tiArr, siArr);
							// var resultTypeId = cates[resultObj.index]._id;
							var resultTypeId = catesIds[resultObj.index];

							var infopath = currentPath + "/" + form.uploadDir + avatarName;
							var infocmd = "ffprobe -v quiet -print_format json -show_format -show_streams " + infopath;
							console.log("infocmd = " + infocmd);
							child_process.exec(infocmd, function(error, stdout, stderr) {
								if (error !== null) {
									console.log('exec error: ' + error);
								}

								console.log("stdout = " + stdout);

								// 获取视频信息
								var mvInfo = JSON.parse(stdout);
								var fps="";
								var arr = new Array();
							    arr = mvInfo['streams'][0]['r_frame_rate'].split("/");
							    if (arr.length>0) {
							    	fps = arr[0];
							    }

								var movieParas = {
									duration: mvInfo['streams'][0]['duration'],
									pix_fmt: mvInfo['streams'][0]['pix_fmt'],
									size: mvInfo['format']['size'],
									width: mvInfo['streams'][0]['width'],
									height: mvInfo['streams'][0]['height'],
									fps: fps + "fps",
									bps: Math.round(mvInfo['streams'][0]['bit_rate']/1000) + "kbps",
									codec_name: mvInfo['streams'][0]['codec_long_name'],
									format_name: mvInfo['format']['format_long_name'],
								}

								var params = {
									maxTI: maxTI,
									maxSI: maxSI,
									eDistance: resultObj.eDistance,
									typeId: resultTypeId,
									movieInfo: movieParas
								}

								upBaseMvNum = "100%";
								upBaseMvMsg = "success!";
								res.json({pic: picName ,result : avatarName, params : params});
							});
						}
						x++;
					});
				}
			});
		});
	});
}

//计算标准差
function standardDeviation(srcArr){
	var average = 0, len = srcArr.length, sum = 0;
	var count = 0;
	for (var i = 0; i < len; i++) {
		for(var j=0; j < srcArr[i].length; j++) {
			count++;
			average += srcArr[i][j];
		}
	}
	if (count!=0) {
		average = average / count;
	}

	if (count == 0 || count == 1)
		return average;
	
	console.log('average = ' + average);
	
	for (var i = 0; i < len; i++) {
		for(var j=0; j < srcArr[i].length; j++) {
			sum += (srcArr[i][j]-average) * (srcArr[i][j]-average);
		}
	}

	sdDeviation = Math.sqrt(sum/(count-1));
	console.log('sum = ' + sum);
	console.log('fangcha = ' + sum/(count-1));

	return sdDeviation;
}

//计算欧式距离
function euclideanDistanceIndex(newTI, newSI, tiArr, siArr){
	var len = tiArr.length, ditance = 0;
	var TI = standardDeviation(tiArr), SI = standardDeviation(siArr);
	console.log('TI = ' + TI + " , SI = " + SI);
	var index = 0;
	var eDistance = 1000000;

	for (var i = 0; i < len; i++) {
		var cateDis = 0;
		for (var j=0; j < tiArr[i].length; j++) {
			var sum = Math.pow((tiArr[i][j] - newTI) / TI, 2) + Math.pow((siArr[i][j] - newSI) / SI, 2);
			var tempDis = Math.sqrt(sum);
			cateDis += tempDis;
			if (j == tiArr[i].length-1) {
				cateDis = cateDis/tiArr[i].length;
				console.log('cateDis = ' + cateDis + ' ,i = ' + i);
				console.log('eDistance = ' + eDistance);
				if (eDistance>cateDis) {
					eDistance = cateDis;
					index = i;
					console.log('eDistance = ' + eDistance + ' ,index = ' + index);
				}
			}
		}
	}
	console.log('eDistance = ' + eDistance);

	var result = {
		index : index,
		eDistance : eDistance
	}
	return result;
}

//创建视频信息文件
exports.createVideosInfomation = function(req, res) {
	console.log("---------controllers/downloadVideosInfomation---------function-----");
	var headers = [
		{caption:'Video Name',type:'string',width:20},
	 	{caption:'TI',type:'number',width:10},
	 	{caption:'SI',type:'number',width:10},
	 	{caption:'Euclidean Distance',type:'number',width:30},
	 	{caption:'pv',type:'number',width:10},
	 	{caption:'Setup Time',type:'string',width:30},
	 	{caption:'Buffering Time',type:'number',width:25},
	 	{caption:'Type Name',type:'string',width:20},
	 	{caption:'Duration',type:'number',width:15},
	 	{caption:'Size',type:'string',width:15},
	 	{caption:'Width',type:'number',width:15},
	 	{caption:'Height',type:'number',width:15},
	 	{caption:'fps',type:'string',width:15},
	 	{caption:'bps',type:'string',width:15},
	 	{caption:'codec name',type:'string',width:15},
	 	{caption:'format name',type:'string',width:15},
	 	{caption:'Description',type:'string',width:40}];

	 var rows = [];
	 var x = 0;
	 Movie.fetch(function(err, movies){
	 	if(err){
			console.log(err);
		}

		// console.log("movies = " + movies);

		for (var i = 0; i < movies.length; i++) {
			var temp_row = [];
			temp_row[0] = movies[i].title;
			temp_row[1] = parseFloat(movies[i].ti);
			temp_row[2] = parseFloat(movies[i].si);
			temp_row[3] = parseFloat(movies[i].edistance);
			temp_row[4] = movies[i].pv;
			temp_row[5] = movies[i].meta.createAt.toString();
			temp_row[6] = movies[i].showdelay;
			temp_row[7] = movies[i].catesName;
			temp_row[8] = parseInt(movies[i].duration);
			temp_row[9] = parseInt(movies[i].size)/1000 + "KB";
			temp_row[10] = parseFloat(movies[i].width);
			temp_row[11] = parseFloat(movies[i].height);
			temp_row[12] = movies[i].fps;
			temp_row[13] = movies[i].bps;
			temp_row[14] = movies[i].codec_name;
			temp_row[15] = movies[i].format_name;
			temp_row[16] = movies[i].content;
			rows[i] = temp_row;
			// console.log("temp_row = " + temp_row);
		}

		// console.log("rows = " + rows);
		var result = exportExcel(headers,rows);
		var filePath = "videosInfomation.xlsx";
		fs.writeFile(filePath, result, 'binary',function(err){
			if(err){
				console.log(err);
			}
			console.log("create videosInfomation.xlsx success!");
			res.json({success:1});
		});
	});
}

//下载视频信息文件
exports.downloadVideosInfomation = function(req,res){
	console.log("-----analysisFileDownload----------------")
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

//无用函数
exports.baseMovieUpload = function(req, res){
	// console.log("-----contr/Movie.js--- baseMovieUpload function")
	// upBaseMvNum = "5%";
	// upBaseMvMsg = "正在上传视频...";
	//   var message = '';
	//   var form = new formidable.IncomingForm();   //创建上传表单
	//     form.encoding = 'utf-8';        //设置编辑
	//     form.uploadDir = 'public/baseMovie/';     //设置上传目录
	//     form.keepExtensions = true;     //保留后缀
	//     form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
	
	// upBaseMvNum = "15%";
	// upBaseMvMsg = "正在上传视频...";
	//   form.parse(req, function(err, fields, files) {
	//     if (err) {
	//       console.log(err);
	//       res.json({result : 0});
	//     }  
	//     upBaseMvNum = "40%";
	// 	upBaseMvMsg = "正在上传视频...";
	//     var filename = files.resource.name;

	//     // 对文件名进行处理，以应对上传同名文件的情况
	//     var nameArray = filename.split('.');
	//     var type = nameArray[nameArray.length-1];
	//     var name = '';
	//     for(var i=0; i<nameArray.length-1; i++){
	//         name = name + nameArray[i];
	//     }
	//     var rand = Math.random()*100 + 900;
	//     var num = parseInt(rand, 10);

	//     var avatarName = name + num +  '.' + type;

	//     var newPath = form.uploadDir + avatarName ;
	//     fs.renameSync(files.resource.path, newPath);  //重命名
	// 	var currentPath = processor.cwd();
	// 	newPath = currentPath + "/" + newPath;

	// 	var yuvFile = "";
	// 	var TISICMD = "";

	// 	console.log("type : " + type);

	// 	if (type !== "yuv") {
	// 		upBaseMvNum = "60%";
	// 		upBaseMvMsg = "正在将视频转换为yuv格式...";
	// 		var yuvFile = currentPath + "/" + form.uploadDir + name + num + ".yuv"; 
	//     	var cmd = "ffmpeg -i " + newPath + " " + yuvFile;
	//     	TISICMD = "TISI -i " + yuvFile + " -x 352 -y 288 -f 420";
	    	
	//     	console.log("------------\ncmd = " + cmd);
	//     	child = child_process.execSync(cmd, function (error, stdout, stderr) {
	// 		    console.log('stdout: ' + stdout);
	// 		    console.log('stderr: ' + stderr);
	// 		    if (error !== null) {
	// 		      console.log('exec error: ' + error);
	// 		    }
	// 		});
	//     } else {
	//     	TISICMD = "TISI -i " + newPath + " -x 352 -y 288 -f 420";
	//     }

	// 	console.log("-----------\n" + TISICMD + "\n-----------");
	// 	upBaseMvNum = "70%";
	// 	upBaseMvMsg = "正在计算TI，SI值...";

	// 	var maxTI;
	// 	var maxSI;
	// 	child = child_process.exec(TISICMD,
	// 	  function (error, stdout, stderr) {
	// 	    console.log('stdout: ' + stdout);
	// 	    maxTI = getMaxTI(stdout);
	// 		maxSI = getMaxSI(stdout);
	// 		console.log('maxTI:\n' + maxTI);
	// 		console.log('maxSI:\n' + maxSI);
	// 	    console.log('stderr: ' + stderr);
	// 	    if (error !== null) {
	// 	      console.log('exec error: ' + error);
	// 	    }

	// 	    var maxTISI = {
	// 			maxTI: maxTI,
	// 			maxSI: maxSI
	// 		}
	// 		upBaseMvNum = "100%";
	// 		upBaseMvMsg = "上传成功！";
	// 		res.json({result : avatarName, tisidata : maxTISI});
	// 	});
	//   });
}

exports.uploadBaseMvStatus = function(req,res){
	console.log("status :" + upBaseMvNum + "    msg :" + upBaseMvMsg);
	res.json({status : upBaseMvNum, msg : upBaseMvMsg});
}

function getMaxTI(data) {
    var lines = data.toString('ascii').split("\n");
    var cut, name, host;
    for (var i = 0, len = lines.length; i < len; i++) {
        cut = lines[i].split(' ');
        name = cut[0];
        if (name === 'maxTI') {
            if (cut[1] === undefined) {
                return '0';
            }
            host = cut[1].trim().toLowerCase();
            return host;
        }
    }
    return '0';
};

function getMaxSI(data) {
    var lines = data.toString('ascii').split("\n");
    var cut, name, host;
    for (var i = 0, len = lines.length; i < len; i++) {
        cut = lines[i].split(' ');
        name = cut[0];
        if (name === 'maxSI') {
            if (cut[1] === undefined) {
                return '0';
            }
            host = cut[1].trim().toLowerCase();
            return host;
        }
    }
    return '0';
};

function mkdirNewPath() {
	var timeDir = moment().format("YYYY-MM-DD.HH.mm.ss");
	var currentPath = processor.cwd();
	var newPath = currentPath + "/public/movie/" + timeDir;
	console.log(newPath);

	if (!fs.existsSync(newPath)) {
	 	fs.mkdirSync(newPath);  
		console.log('newPath目录创建成功');
		return timeDir;
	}
}

//插件，获取并存储之前上传的未存储视频信息的视频的信息
function calculateMovieInfo(Movie){
	console.log("calculateMovieInfo  ---------- in");
	var x = 0, y = 0; 
	var tiArr = [];
	var siArr = [];
	var catesIds = [];
	var catesNames = [];
	var ret = [];
	var currentPath = processor.cwd();

	var MMV = Movie;
	console.log("MMV = " + JSON.stringify(MMV));
	MovieCate.fetch(function(err, cates){
		console.log("MovieCate.fetch success!  ---------- " + cates.length);

		for(var i = 0, len = cates.length; i < len; i++){
			TISI.findByCateId(cates[i]._id, function(err, tisis){


				console.log("Movie = "+x+"  <-x" + JSON.stringify(tisis));
				tiArr[x] = [];
				siArr[x] = [];
				catesNames[x] = cates[x].title;
				if (tisis.length > 0) {
					catesIds[x] = tisis[0].movieCates;
				} else {
					catesIds[x] = 0;
				}
				
				for (var j = 0; j < tisis.length;  j++) {
					tiArr[x][j] = parseFloat(tisis[j].ti);
					siArr[x][j] = parseFloat(tisis[j].si);
					console.log(j+" <-j " + tiArr[x][j] + " " + siArr[x][j]);
				}
				
				console.log("tiArr = " + JSON.stringify(tiArr));
				console.log("siArr = " + JSON.stringify(siArr));

				if (tiArr.length == cates.length) {
					console.log("tiArr = " + JSON.stringify(tiArr));
					console.log("siArr = " + JSON.stringify(siArr));
					var resultObj = euclideanDistanceIndex(MMV.ti, MMV.si, tiArr, siArr);
					var resultTypeId = catesIds[resultObj.index];

					var infopath = currentPath + "/public/movie/" + MMV.movie;
					var infocmd = "ffprobe -v quiet -print_format json -show_format -show_streams " + infopath;
					child_process.exec(infocmd, function(error, stdout, stderr) {
						if (error !== null) {
							console.log('exec error: ' + error);
						}

						// 获取视频信息
						var mvInfo = JSON.parse(stdout);
						var fps="";
						var arr = new Array();
					    arr = mvInfo['streams'][0]['r_frame_rate'].split("/");
					    if (arr.length>0) {
					    	fps = arr[0];
					    }

					    MovieCate.findById(MMV.movieCates, function(err, Belongcate) {
							MMV.duration = mvInfo['streams'][0]['duration'];
							MMV.pix_fmt = mvInfo['streams'][0]['pix_fmt'];
							MMV.size = mvInfo['format']['size'];
							MMV.width = mvInfo['streams'][0]['width'];
							MMV.height = mvInfo['streams'][0]['height'];
							MMV.fps = fps + "fps";
							MMV.bps = Math.round(mvInfo['streams'][0]['bit_rate']/1000) + "kbps";
							MMV.codec_name = mvInfo['streams'][0]['codec_long_name'];
							MMV.format_name = mvInfo['format']['format_long_name'];
							MMV.edistance = resultObj.eDistance;
							MMV.catesName = Belongcate.title;

							MMV.save(function(err,Movie){
								// console.log("Movie = " + JSON.stringify(Movie));
								if(err){console.log(err);}
								console.log("success!  ---------- " + y);
							});

					    });
					});
				}
				x++;
			});
		}
	});
}
