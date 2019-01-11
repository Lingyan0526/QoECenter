var mongoose = require('mongoose');
var NetworkSchema = require("../schemas/network.js")
var Network = mongoose.model('Network',NetworkSchema);

module.exports = Network;