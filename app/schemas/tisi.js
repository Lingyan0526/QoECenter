var mongoose = require('mongoose');
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var TISISchema = new Schema({
	ti: Number,
	si: Number,
	movieCates:{
		type: ObjectId,
		ref: 'MovieCate'
	},
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

TISISchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
})

TISISchema.statics = {
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

module.exports = TISISchema;