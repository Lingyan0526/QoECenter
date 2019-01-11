var mongoose = require('mongoose');
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var DashSchema = new Schema({
	kinds: {type:Number, default:0},
	minBit: {type:Number, default:500},
	maxBit: {type:Number, default:2000},
	audioBit: {type:Number, default:128},
	segsize: {type:Number, default:3}
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

DashSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
})

DashSchema.statics = {
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

module.exports = DashSchema;