
/**
 * Module dependencies.
 */

var express = require('express');
//var routes = require('./routes');
var routes = require('./routes/index');
var http = require('http');
var path = require('path');
var ejs = require('ejs');
var exec = require('child_process').exec;
var less = require('./config/less2css');
var apidao = require('./routes/api');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());

//合并less
var public_style = path.join(__dirname, "public/style");
less.merger(path.join(public_style, 'less'), path.join(public_style, 'css'));

exec("node r.js -o build.js");

app.get('/', routes.index);


//api接口
apidao.apilist(app);


var server = http.createServer(app),
	ip = '127.0.0.1',
	port = '5051';

server.listen(port, ip, function(){
    console.log("Server running at http://" + ip + ":" + port);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//module.exports = app;
