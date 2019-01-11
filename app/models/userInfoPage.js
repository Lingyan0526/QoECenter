var mongoose = require('mongoose');
var UserInfoNoVideoSchema = require("../schemas/userInfoPage.js")
var UserInfoNoVideo = mongoose.model('UserInfoNoVideo',UserInfoNoVideoSchema);

module.exports = UserInfoNoVideo;