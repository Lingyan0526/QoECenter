var mongoose = require('mongoose');
var UserInfoSchema = require("../schemas/userInfo.js")
var UserInfo = mongoose.model('UserInfo',UserInfoSchema);

module.exports = UserInfo;