// 存储访问视频详情页用户信息，与对应视频绑定
var mongoose = require('mongoose');
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var UserInfoSchema = new Schema({
	movie:[{
		type:ObjectId,
		ref:'Movie'}
	],
	clarity: { type:String, default:"0" },
	loadSpeed: { type:String, default:"0" },
	quality: { type:String, default:"0" },
	vcontent: { type:String, default:"0" },
	score5: String,
	browserType: { type:String, default:""},
	browserVersion: { type:String, default:""},
	userAgent: { type:String, default:""},
	cookieEnabled: { type:String, default:""},
	platform: { type:String, default:""},
	systemType: { type:String, default:""},
	pluginsCount: { type:String, default:""},
	plugins: { type:String, default:""},
	userLanguage: { type:String, default:""},
	javaEnabled: { type:String, default:""},
	flash: { type:String, default:""},
	screenWidth: { type:String, default:""},
	screenHeight: { type:String, default:""},
	color: { type:String, default:""},
	pixel: { type:String, default:""},
	ip: { type:String, default:""},
	address: { type:String, default:""},
	currentTime: { type:String, default:""},
	bufferTime: { type:String, default:""},
	playCount: { type:String, default:""},
	pauseCount: { type:String, default:""},
	fullOnCount: { type:String, default:""},
	fullOffCount: { type:String, default:""},

	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
})

UserInfoSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
})

UserInfoSchema.statics = {
	fetch:function(cb){
		return this
			.find({})
			.sort('-meta.updateAt')
			.exec(cb)
	},
	findById:function(id,cb){
		return this.findOne({_id:id})
			.exec(cb)
	},
	findByMovieId:function(movieId,cb){
		return this.find({movie : movieId})
			.exec(cb)
	}
}

module.exports = UserInfoSchema;