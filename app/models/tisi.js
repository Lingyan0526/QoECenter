var mongoose = require('mongoose');
var TISISchema = require("../schemas/tisi.js")
var TISI = mongoose.model('TISI',TISISchema);

module.exports = TISI;