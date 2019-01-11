var Index = require('../app/controllers/index')
var MovieCate = require('../app/controllers/movieCate')
var Movie = require('../app/controllers/movie')
var UserInfo = require('../app/controllers/userInfo')
var UserInfoNoVideo = require('../app/controllers/userInfoPage')
var User = require('../app/controllers/user')
var Comment = require('../app/controllers/comment')
var Dash = require('../app/controllers/dash')

module.exports = function(app){
	
	//index
	app.get('/', Index.index)
	app.get('/lingyanzhang',Index.resume)
	app.get('/movieList',Index.movieList)
	app.get('/guestIndex',Index.guestIndex)
	app.get('/guestIndex/:cateId',Index.guestIndex)
	app.get('/aboutus',Index.aboutus)
	app.get('/dash',Index.dash)
	app.get('/moreabout',Index.moreabout)
	app.get('/movie/:id',Movie.detail)
	app.post('/movie/submitScore', Movie.submitScore)
	app.post('/movie/submitUserInfo', UserInfo.submitUserInfo)
	app.post('/movie/mvUpload', Movie.mvUpload)
	app.post('/movie/baseMovieUpload', Movie.baseMovieUpload)
	app.post('/movie/saveNetworkStatus', Movie.saveNetworkStatus)
	app.post('/movie/uploadBaseMvStatus', Movie.uploadBaseMvStatus)

	app.get('/movie/comment/:id',User.signinRequired, Movie.showComment)
	app.get('/movie/userInfo/:id',User.signinRequired, UserInfo.showUserInfo)

	app.post('/homepage/submitUserInfo', UserInfoNoVideo.submitUserInfo)
	app.get('/page/userInfo/:id',User.signinRequired, UserInfoNoVideo.showUserInfo)
	app.get('/page/userInfo/detail/:infoId', User.signinRequired,UserInfoNoVideo.userInfoDetail)
	app.get('/gl/movie/getHomePagePVInfo', User.signinRequired,UserInfoNoVideo.getHomePagePVInfo)
	app.get('/gl/movie/getUserPagePVInfo', User.signinRequired,UserInfoNoVideo.getUserPagePVInfo)
	app.get('/visit/:name', User.signinRequired, UserInfoNoVideo.downloadPagePVInfo)
	
	//work category gl
	app.get('/gl/movieCate', User.signinRequired, MovieCate.cateList)
	app.get('/gl/movieCate/add',User.signinRequired, MovieCate.cateAdd)
	app.get('/gl/movieCateInfo/:id', User.signinRequired, MovieCate.cateInfo)
	app.post('/gl/movieCate/save',User.signinRequired, MovieCate.cateSave)
	app.get('/gl/movieCate/update/:id',User.signinRequired, MovieCate.update)
	app.delete('/gl/movieCate/delete/:id',User.adminRequired, MovieCate.delete)

	//comment
	app.get('/gl/comment/detail/:movieId/:commentId', User.signinRequired,Comment.commentDetail)
	app.get('/gl/userInfo/detail/:movieId/:infoId', User.signinRequired,UserInfo.userInfoDetail)

	app.get('/movie/covers/:name', Movie.movieCover)
	app.get('/movie/covers/:path/:name', Movie.movieCover)

	app.get('/admin/qiniu/upToken', Movie.qiniuUpload)

	app.get('/gl/movieInfo/:id', User.signinRequired, Movie.movieInfo)
	app.get('/gl/movie', User.signinRequired, Movie.list)
	app.get('/gl/movie/add', User.signinRequired, Movie.add)
	app.post('/gl/movie/save', User.signinRequired, Movie.save)
	app.post('/gl/movie/update/:id', User.signinRequired, Movie.update)
	app.get('/gl/movie/setparams/:id', User.signinRequired, Movie.setParameter)
	app.delete('/gl/movie/delete/:id', User.adminRequired, Movie.delete)
	app.get('/gl/setNetwork/:id', User.signinRequired, Movie.setNetwork)
	app.post('/gl/movie/saveNetwork', User.signinRequired, Movie.saveNetwork)
	app.get('/gl/movie/analysis/:path1/:name', User.signinRequired, Movie.analysisFileDownload)
	app.get('/gl/movie/analysis/:path1/:path2/:name', User.signinRequired, Movie.analysisFileDownload)
	app.get('/gl/movie/analysis/:path1/:path2/:path3/:name', User.signinRequired, Movie.analysisFileDownload)
	app.get('/gl/movie/analysisList/:path', User.signinRequired, Movie.analysisFileList)
	app.get('/gl/movie/createVideosInfomation', User.signinRequired, Movie.createVideosInfomation)
	app.get('/gl/movieInfos/:name',User.signinRequired, Movie.downloadVideosInfomation)
	app.get('/gl/movie/getVideoComments/:id', User.signinRequired, Comment.getVideoComments)
	app.get('/gl/movie/getAllComments', User.signinRequired, Comment.getAllComments)
	app.get('/gl/commentsInfo/:name',User.signinRequired, Comment.downloadComments)

	//dash
	app.get('/gl/dash', User.signinRequired, Dash.list)
	app.get('/gl/dash/add', User.signinRequired, Dash.add)
	app.post('/gl/dash/mvUpload', Dash.mvUpload)
	app.post('/gl/dash/uploadBaseMvStatus', Dash.uploadBaseMvStatus)
	app.post('/gl/dash/save', User.signinRequired, Dash.save)
	app.delete('/gl/dash/delete/:id', User.signinRequired, Dash.delete)
	app.get('/gl/dash/setparams/:id', User.signinRequired, Dash.setParameter)
	app.get('/gl/dash/setDashParams/:id', User.signinRequired, Dash.setDashParameter)
	app.post('/gl/dash/saveNetworkStatus', Dash.saveNetworkStatus)
	app.post('/gl/dash/saveDashStatus', Dash.saveDashStatus)
	app.post('/gl/dash/saveNetwork', User.signinRequired, Dash.saveNetwork)
	app.post('/gl/dash/saveDashParameter', User.signinRequired, Dash.saveDashParameter)

	// //user
	app.get('/user/update/:id',User.signinRequired, User.update);
	app.delete('/user/delete/:id',User.adminRequired, User.delete);
	app.post('/user/signup',User.signup);
	app.get('/user/list',User.signinRequired, User.userlist);
	app.post('/user/signin',User.signin);
	app.get('/user/logout',User.logout);
	app.get('/signin',User.showSignin);
	app.get('/signup',User.showSignup);

	app.get('/404',Index.do404)
	app.get('*',Index.do404)

}
