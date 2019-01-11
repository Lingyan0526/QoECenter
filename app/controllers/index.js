var Movie = require("../models/movie")
var MovieCate = require("../models/movieCate")
var markdown = require('markdown').markdown
var mark = require('marked')

exports.index = function(req,res){
	console.log("-----contr/index.js--- index function")
	res.render('index');

	// var page = parseInt(req.query.p,10) || 0
	// var count = 20
	// var index = page * count

	// Movie.fetch(function(err,movies){
	// 	if(err){
	// 		coonsole.log(err);
	// 	}
	// 	MovieCate.fetch(function(err,mCates){
	// 		res.render('index',{
	// 			movies: movies,
	// 			mCates: mCates
	// 		});
			
	// 	})
		
	// })
}

exports.resume = function(req,res){
	console.log("-----contr/index.js--- resume function")
	res.render('resume');
}

exports.aboutus = function(req,res){
	console.log("-----contr/index.js--- aboutus function")
	res.render('aboutus');
}

// dash test
exports.dash = function(req,res){
	console.log("-----contr/index.js--- aboutus function")
	res.render('dash');
}

exports.moreabout = function(req,res){
	console.log("-----contr/index.js--- moreabout function")
	res.render('moreAbout');
}

exports.guestIndex = function(req,res){
	console.log("-----contr/guestIndex.js--- guestIndex function")

	var page = parseInt(req.query.p,10) || 0
	var count = 20
	var index = page * count

	var cateId = req.params.cateId;

	if (cateId) {
		console.log("movies which are cateId = " + cateId);
		MovieCate.fetch(function(err,mCates){
			if(err){
				console.log(err);
			}
			Movie.findByCateId(cateId, function(err, movies){
				res.render('guestIndex',{
					movies: movies,
					mCates: mCates
				});
			})
		})	
	} else {
		console.log("all movies");
		Movie.fetch(function(err,movies){
			if(err){
				console.log(err);
			}
			var temp_movies = [], indexs = [], x = 0;

			if (movies.length>20) {
				while(temp_movies.length<20){
					var i = Math.floor(Math.random()*movies.length);
					console.log("i = " + i);
					if (indexs.indexOf(i) == -1) {
						indexs[x] = i;
						temp_movies[x] = movies[i];
						x++;
					}
				}
			} else {
				temp_movies = movies;
			}
			
			
			MovieCate.fetch(function(err,mCates){
				res.render('guestIndex',{
					movies: temp_movies,
					mCates: mCates
				});
				
			})
			
		})
	}

	
}

exports.movieList = function(req,res){
	console.log("-----contr/movieList.js--- movieList function")

	console.log("all movies");
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err);
		}
		res.end(JSON.stringify(movies));
	})
	
}

exports.loadNav = function(req,res){
	WorkCate.fetch(function(err,cates){
			if(err){console.log(err)}	
			/*res.render('index',{
				cates:cates
			});*/
		/*next(cates);*/
		})
}

// exports.showNewPost = function(req,res){
// 	console.log("-----contr/index.js--- showNewPost function")
// 	var id = req.params.id;

// 	Work.findById(id,function(err,work){
// 		if(err){console.log(err);}
// 		if(!work){
// 			res.redirect('/life/detail?id='+id)
// 		}else{
// 			res.redirect('/work/'+id)
// 		}
// 	})
// }

// exports.funny = function(req,res){
// 	console.log("-----contr/index.js--- funny function")
// 	WorkCate.fetch(function(err,wCates){
// 		if(err){console.log(err)}	
// 		LifeCate.fetch(function(err,lCates){
// 			if(err){console.log(err)}
// 			res.render('funny',{
// 				wCates:wCates,
// 				lCates:lCates,
// 			});
// 		})
// 	})
// }

// exports.search = function(req,res){
// 	var q = req.query.q
//   	var page = parseInt(req.query.p, 10) || 0
//   	var count = 10
//   	var index = page * count

// 	Work
//       .find({title: new RegExp(q + '.*', 'i')})
//       .exec(function(err, works) {
//         if (err) {
//           console.log(err)
//         }
//         var results = works.slice(index, index + count)

//         function compare(propertyName) { 
// 			return function (object1, object2) { 
// 				var value1 = object1[propertyName]; 
// 				var value2 = object2[propertyName]; 
// 				if (value2 < value1) { 
// 					return -1; 
// 				} 
// 				else if (value2 > value1) { 
// 					return 1; 
// 				} 
// 				else { 
// 					return 0; 
// 				} 
// 			} 
// 		} 
//         var worksViewList = works;
// 		worksViewList.sort(compare("pv"));
// 		worksViewList = worksViewList.slice(0,10);
// 		for(var i = 0;i < worksViewList.length; i++){
// 			//works[i].content = markdown.toHTML(works[i].content).substring(0,280)
// 			if(worksViewList[i].title.length > 28){
// 				worksViewList[i].title = worksViewList[i].title.substring(0,28) + "..."
// 			}
// 		}

//         WorkCate.fetch(function(err,wCates){
// 			if(err){console.log(err)}	
// 			LifeCate.fetch(function(err,lCates){
// 				if(err){console.log(err)}
// 				NewPost.fetch(function(err,newPosts){
// 					res.render('searchResult',{
// 						listName: "热门文章",
// 						newPosts:newPosts,
// 						works:results,
// 						wCates:wCates,
// 						lCates:lCates,
// 						currentPage: parseInt(page)+1,
// 						totalPage: Math.ceil(works.length/count),
// 						query: 'q=' + q
// 					});
// 				})
// 			})
// 		})

//       })
// }

exports.do404 = function(req,res){
	res.render("404")
}
