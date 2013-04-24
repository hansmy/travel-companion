
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , twitter = require('ntwitter')
  , path = require('path');

var app = express();
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

//var port  = process.env.PORT || 5000;
//var server = app.listen(port);


app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
//app.get('/users', user.list);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
var io = require('socket.io').listen(server);
io.configure(function () { 
  //io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 1); 
});
/****************************************************************/
/*
/*          Twitter Connection
/*
/****************************************************************/


var twit = new twitter({
  consumer_key: '4gSOBLNKoe4mzmzbJJnyPQ',
    consumer_secret: 'KJ5PEMySOVEcYwZLNkgK3ps5SsITnvL6pIK02canYH0',
    access_token_key: '240243946-Dcbgw1xwkus1wht3BjJpdi9L6aBW9192pTBBRYs6',
    access_token_secret: '79xtH7JohguP4qY2FRCfeGyFzWvP79YCJLINej9QB0A'
});
//51.527264,  -0.10247  
//twit.stream('statuses/filter', {'locations':'-76.83,3.11,-76.12,3.61'}, function(stream) {
twit.stream('statuses/filter', {'locations':'-0.11247,51.537264,-0.09247,51.517264'}, function(stream) {
    stream.on('data', function (data) {
       io.sockets.volatile.emit('tweet', data);
    });
});

