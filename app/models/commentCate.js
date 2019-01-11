var mongoose = require('mongoose');
var MovieCateSchema = require("../schemas/movieCate.js")
var MovieCate = mongoose.model('MovieCate',MovieCateSchema);

module.exports = MovieCate;