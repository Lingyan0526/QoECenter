var express = require('express');
var path = require('path');
var port = process.env.PORT || 80;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
var compression = require('compression');
var schedule = require("node-schedule");
//var crawler = require("./app/controllers/crawler.js");
var https = require('https')
var fs = require('fs')
var options = {
	key: fs.readFileSync('./app/214192511000713.key'),
	cert: fs.readFileSync('./app/214192511000713.pem')
}


var dbUrl = 'mongodb://root:passW0rd_root@localhost:29019/dongdong';
mongoose.connect(dbUrl);

var app = express();	//start view
app.use(compression());
app.set('view engine','jade');
app.set('views','./app/views/pages');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(session({
    secret: 'mybolg',
    Store: new MongoStore({
    		url: dbUrl,
    		collection:'sessions'
    })
}))

app.locals.moment = require('moment')
app.use(express.static(path.join(__dirname,'public'),{maxAge:7*24*60*60*1000}));
require('./config/routes.js')(app);
app.listen(port);
console.log("-----app.js-----http server started on port : "+port );
https.createServer(options, app).listen(443);
console.log("-----app.js-----https server started on port : 443");

