var mongoose = require('mongoose');
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var MovieCateSchema = new Schema({
	title: String,
	ti: String,
	si: String,
	tisis:[{
		type:ObjectId,
		ref:'TISI'}
	],
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

MovieCateSchema.pre('save',function(next){
	console.log("new ma?   " + this.isNew);
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	console.log("new schema meta = " + JSON.stringify(this.meta));
	next();
})

MovieCateSchema.statics = {
	fetch:function(cb){
		return this
			.find({})
			//.sort('meta.updateAt')
			.exec(cb)
	},
	findById:function(id,cb){
		return this.findOne({_id:id})
			.exec(cb)
	},
	findByTitle:function(title,cb){
		return this.findOne({title : title})
			.exec(cb)
	}
}

module.exports = MovieCateSchema;