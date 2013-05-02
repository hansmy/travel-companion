
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
  consumer_key: 'InirzwROIcYjwOX30rOcAA',
    consumer_secret: 'f7uZUwbrLK1TCEY5QXkCFK5ciCXWaQqiDs9c44k',
    access_token_key: '240243946-Kq9OU8vdhRisEVaXWMAdBZDpON4YZkCww3zWGnwG',
    access_token_secret: 'Vz5RsCplEUFXI4FTL26gvDSLjusGOCZnKanQtFsJXpI'
});
//51.527264,  -0.10247  
//twit.stream('statuses/filter', {'locations':'-76.83,3.11,-76.12,3.61'}, function(stream) {
twit.stream('statuses/filter', {'locations':'-0.1125,51.5071,-0.0923,51.5473'}, function(stream) {

//twit.stream('statuses/filter', {'locations':'180,-90,180,90'}, function(stream) {
    stream.on('data', function (data) {
       io.sockets.volatile.emit('tweet', data);
    });
});



