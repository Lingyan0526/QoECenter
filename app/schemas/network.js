var mongoose = require('mongoose');
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var NetworkSchema = new Schema({
	bandwidth: String,
	timedelay: String,
	packetloss: String,
	mvWidth: String,
	mvHeight: String,
	fps: String,
	bps: String,
	unsharp: String,
	showdelay: {type:Number, default:0},
	movies:[{
		type:ObjectId,
		ref:'Movie'}
	],
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

NetworkSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
})

NetworkSchema.statics = {
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
	findByMovieId:function(movieId,cb){
		return this.find({movie : movieId})
			.exec(cb)
	}
}

module.exports = NetworkSchema;