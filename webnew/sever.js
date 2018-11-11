const http = require('http');
const express = require('express');
const expressSession = require('express-session');
//const cookieParser = require('cookie-parser');
const ejs = require('ejs');
//const routes = require('./app.js');
const app = express();
http.Server(app).listen(8081);

var index = require('./routes/index.js');
var home = require('./routes/home.js');
var information = require('./routes/information.js');
var newEvent = require('./routes/newEvent.js');


app.engine('.html', ejs.__express);
app.set('view engine', 'html');
//app.use(cookieParser());
app.use(expressSession({secret:'abcdefg',saveUninitialized: true,
    resave: true}));
app.set('views', __dirname + '/ejs');
app.use(express.static(__dirname + '/public'));

app.use('/', index);
app.use('/home', home);
app.use('/information',information)
app.use('/newEvent',newEvent)



var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('exchange');
