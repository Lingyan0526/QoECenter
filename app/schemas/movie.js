var mongoose = require('mongoose');
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var MovieSchema = new Schema({
	title:String,
	content:String,
	pv:{
		type:Number,
		default:0
	},
	//pv1中间添加字段，用于标记存储的用户信息数
	pv1:{
		type:Number,
		default:0
	},
	pic: String,
	movie: String,
	dir: String,
	ti:String,
	si:String,
	edistance:{type:String, default:""},
	showdelay: {type:Number, default:0},
	comments: {type:Number, default:0},
	movieCates:{
		type: ObjectId,
		ref: 'MovieCate'
	},
	catesName: {type:String, default:""},
	duration: {type:String, default:""},
	pix_fmt: {type:String, default:""},
	size: {type:String, default:""},
	width: {type:String, default:""},
	height: {type:String, default:""},
	fps: {type:String, default:""},
	bps: {type:String, default:""},
	codec_name: {type:String, default:""},
	format_name: {type:String, default:""},
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

MovieSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
})

MovieSchema.statics = {
	fetch: function(cb){
		return this
			.find({})
			.sort('-meta.updateAt')
			.exec(cb)
	},
	findById: function(id,cb){
		return this.findOne({_id:id})
			.exec(cb)
	},
	findByCateId: function(id,cb){
		return this.find({movieCates:id})
			.exec(cb)
	},
	findCateById: function(id,cb){
		return this.findOne({_id:id}).populate('movieCates')
			.exec(cb)
	}
}

module.exports = MovieSchema;