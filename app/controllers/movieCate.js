var MovieCate = require("../models/movieCate")
var Movie = require("../models/movie")
var TISI = require("../models/tisi");
var child_process = require('child_process');
var processor = require('process');
var _ = require('underscore');

var r_tisis = [];
var r_movies = [];

exports.cateList = function(req,res){
	console.log("-----contr/MovieCate.js--- cateList function")
	MovieCate.fetch(function(err,movieCates){
		if(err){
			coonsole.log(err);
		}
		console.log(JSON.stringify(movieCates));

		for (var i = movieCates.length - 1; i >= 0; i--) {
			if (movieCates[i].title == "DASH") {
				// movieCates.remove(i);
				movieCates.splice(i,1);
				break;
			}
		}

		res.render('movieCateList',{
			movieCates: movieCates
		});
	})
}

exports.cateAdd = function(req,res){
	console.log("-----contr/MovieCate.js--- cateAdd function")
	res.render('movieCateAdd',{
		movieCate:{
			title:"",
			ti:"",
			si:""
		}
	})
}

exports.cateSave = function(req,res){
	console.log("-----contr/MovieCate.js--- cateSave function")
	var title = req.body.title;
	var tisiArr = req.body.tisiArr;
	for (var i = tisiArr.length - 1; i >= 0; i--) {
		console.log(i + " = " + tisiArr[i]);
	}
	console.log("title = " + title);
	console.log("tisiArr = " + tisiArr);
	console.log("tisiArr[0] = " + tisiArr[0]);
	console.log("tisiArr[0].ti = " + tisiArr[0].ti);
	console.log("tisiArr[0].si = " + tisiArr[0].si);

	var tiSum = 0, siSum = 0, avTi = 0, avSi = 0;
	for (var i = tisiArr.length - 1; i >= 0; i--) {
		tiSum += parseFloat(tisiArr[i].ti);
		siSum += parseFloat(tisiArr[i].si);
	}

	console.log("tiSum = " + tiSum);
	console.log("siSum = " + siSum);
	console.log("tisiArr.length = " + tisiArr.length);

	if (tisiArr.length > 0) {
		avTi = tiSum/tisiArr.length;
		avSi = siSum/tisiArr.length;
	}

	console.log("avTi = " + avTi);
	console.log("avSi = " + avSi);

	var _MovieCate = new MovieCate({
		title: title,
		ti: avTi,
		si: avSi,
		updateAt: new Date()
	});

	_MovieCate.save(function(err,category){
		if(err){console.log(err);}
		if (tisiArr.length == 0) {
			res.redirect('/gl/movieCate');
			return;
		}
		var tisis = [];
		console.log("category = " + JSON.stringify(category));
		for (var i = tisiArr.length - 1; i >= 0; i--) {
			var _tisi = new TISI({
				ti:tisiArr[i].ti,
				si:tisiArr[i].si,
				movieCates:category._id,
				updateAt: new Date()
			});
			_tisi.save(function(err, tisi){
				if(err){console.log(err);}
				console.log("tisi = " + JSON.stringify(tisi));
				tisis.push(tisi._id);

				console.log("i = " + i);
				console.log("i == 0 = " + (i == 0));
				if (tisis.length == tisiArr.length) {
					category.tisis = tisis;
					console.log("tisis = " + tisis);
					category.save(function(err,MovieCate2){
						console.log("MovieCate2 = " + JSON.stringify(MovieCate2));
						if(err){console.log(err);}
						res.redirect('/gl/movieCate')
					});
				}	
			});
		}
		
	});
}

exports.update = function(req,res){
	console.log("-----contr/MovieCate.js--- update function")
	var oid = req.params.id;

	if(oid){
		MovieCate.findById(oid,function(err,MovieCate){
			if(err){console.log(err);}
			Movie.findByCateId(oid, function(err, movies){
				if(err){console.log(err);}
				console.log("movies = " + movies);
				var temp = [];
				for (var j = 0; j < movies.length; j++) {
					temp[j] = movies[j]._id;
				}
				MovieCate.movies = temp;
				console.log("temp = " + temp);
				MovieCate.save(function(err,category){
					if(err){console.log(err);}
					console.log("update success");
				});
			});
		});
	}
}

function updateCate() {
	console.log("-----contr/updateCate.js--- updateCate function")
	MovieCate.fetch(function(err,mCates){
		if(err){
			coonsole.log(err);
		}
		for (var i = mCates.length - 1; i >= 0;) {
			Movie.findByCateId(mCates[i]._id, function(err, movies){
				console.log("movies = " + movies);
				var temp = [];
				for (var j = 0; j < movies.length; j++) {
					temp[j] = movies[j]._id;
				}
				mCates[i].movies = temp;
				console.log("i = " + i);
				console.log("temp = " + temp);
				i--;
			})
		}
		
	})	
}

exports.delete = function(req,res){
	console.log("-----contr/MovieCate.js--- delete function")
	var cateid = req.params.id;
	if(cateid){
		MovieCate.findById(cateid, function(err, MovieCate) {
			if (!MovieCate) {
				return;
			}
			var movies = MovieCate.movies;
			for (var i = movies.length - 1; i >= 0; i--) {
				var id = movies[i];
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
					Movie.remove({_id:id},function(err,Movie){
						if(err){console.log("err = " + err)}
					})
				});
			}

			MovieCate.remove({_id:cateid},function(err,MovieCate){
				if(err){console.log("err = " + err)}
				else{
					res.json({success:1})
				}
			});
		})
	}
}

exports.cateInfo = function(req,res){
	r_tisis.splice(0,r_tisis.length);
	r_movies.splice(0,r_movies.length);
	console.log("-----contr/MovieCate.js--- cateInfo function")
	var id = req.params.id;
	if(id){
		MovieCate.findById(id,function(err,MovieCate){
			if(err){console.log("err = " + err)};
			console.log("MovieCate = " + JSON.stringify(MovieCate));

			TISI.findByCateId(id,function(err, tisis){
				if(err){console.log("err = " + err)};
				console.log("tisis = " + JSON.stringify(tisis));

				Movie.findByCateId(id,function(err,movies){
					if(err){console.log("err = " + err)};
					console.log("movies = " + JSON.stringify(movies));

					res.render('movieCateInfo',{
						movieCate: MovieCate,
						tisis: tisis,
						movies: movies
					});
				});
			});
		});
	}
}

// exports.cateInfo = function(req,res){
// 	r_tisis.splice(0,r_tisis.length);
// 	r_movies.splice(0,r_movies.length);
// 	console.log("-----contr/MovieCate.js--- cateInfo function")
// 	var id = req.params.id;
// 	if(id){
// 		MovieCate.findById(id,function(err,MovieCate){
// 			console.log("movieCateInfo = " + JSON.stringify(MovieCate));
// 			var tisis = MovieCate.tisis;
// 			var movies = MovieCate.movies;
// 			if (tisis.length == 0 && movies.length == 0) {
// 				res.render('movieCateInfo',{
// 					movieCate: MovieCate,
// 					tisis: tisis,
// 					movies: movies
// 				});
// 			} else if(tisis.length == 0 && movies.length != 0) {
// 				for (var j = MovieCate.movies.length - 1; j >= 0; j--) {
// 					Movie.findById(movies[j],function(err,movie){
// 						if(err){console.log("err = " + err)}
// 						r_movies.push(movie);

// 						console.log("r_tisis.length = " + r_tisis.length);
// 						if (r_movies.length == movies.length) {
// 							res.render('movieCateInfo',{
// 								movieCate: MovieCate,
// 								tisis: r_tisis,
// 								movies: r_movies
// 							});
// 						}
// 					});
					
// 				}
// 			} else if(tisis.length != 0 && movies.length == 0) {
// 				for (var i = tisis.length - 1; i >= 0; i--) {
// 					TISI.findById(tisis[i],function(err,tisi){
// 						if(err){console.log("err = " + err)}
// 						r_tisis.push(tisi);

// 						console.log("tisi = " + JSON.stringify(tisi));
// 						console.log("r_tisis.length = " + r_tisis.length);
// 						console.log("MovieCate.tisis.length == r_tisis.length = " + (MovieCate.tisis.length == r_tisis.length));
// 						if (MovieCate.tisis.length == r_tisis.length) {
// 							res.render('movieCateInfo',{
// 								movieCate: MovieCate,
// 								tisis: r_tisis,
// 								movies: r_movies
// 							});
// 						}
// 					});
// 				}

// 			} else {
// 				for (var i = tisis.length - 1; i >= 0; i--) {
// 					TISI.findById(tisis[i],function(err,tisi){
// 						if(err){console.log("err = " + err)}
// 						r_tisis.push(tisi);

// 						console.log("tisi = " + JSON.stringify(tisi));
// 						console.log("r_tisis.length = " + r_tisis.length);
// 						console.log("MovieCate.tisis.length == r_tisis.length = " + (MovieCate.tisis.length == r_tisis.length));
// 						if (MovieCate.tisis.length == r_tisis.length) {
// 							console.log("MovieCate.movies.length = " + MovieCate.movies.length);
							
// 							for (var j = MovieCate.movies.length - 1; j >= 0; j--) {
// 								console.log("j = " + j);
// 								Movie.findById(movies[j],function(err,movie){
// 									if(err){console.log("err = " + err)}
// 									r_movies.push(movie);
// 									console.log("r_tisis.length = " + r_tisis.length);
// 									console.log("movie = " + JSON.stringify(movie));
// 									if (r_movies.length == movies.length) {
// 										res.render('movieCateInfo',{
// 											movieCate: MovieCate,
// 											tisis: r_tisis,
// 											movies: r_movies
// 										});
// 									}
// 								});
								
// 							}
// 						}
// 					});
// 				}
// 			}
// 		})
// 	}
// }

