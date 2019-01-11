var mongoose = require('mongoose');
var DashSchema = require("../schemas/dash.js")
var DashInfo = mongoose.model('DashInfo',DashSchema);

module.exports = DashInfo;