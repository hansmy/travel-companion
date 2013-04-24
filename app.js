
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
  consumer_key: 'Uhy8TvwtpYywzG1VzBesaQ',
    consumer_secret: 'jtNYZBP4icsEe1mTdgLzzylR2hUFxNjHKSVTSKXE7U',
    access_token_key: '240243946-Kq9OU8vdhRisEVaXWMAdBZDpON4YZkCww3zWGnwG',
    access_token_secret: 'Vz5RsCplEUFXI4FTL26gvDSLjusGOCZnKanQtFsJXpI'
});
//51.527264,  -0.10247  
//twit.stream('statuses/filter', {'locations':'-0.18,51.59,-0.05,50.80'}, function(stream) {
//twit.stream('statuses/filter', {'locations':'-0.19,52.55,-0.01,50.48'}, function(stream) {
/*twit.stream('statuses/filter', {'locations':'180,-90,180,90'}, function(stream) {
    stream.on('data', function (data) {
       io.sockets.volatile.emit('tweet', data);
    });
});*/

twit.stream('statuses/filter', {'locations':'-0.1025,51.5271,-0.1023,51.5273'}, function(stream) {
    stream.on('data', function (data) {
         io.sockets.volatile.emit('tweet', data);
    });
});



