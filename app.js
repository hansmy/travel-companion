/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes'), api = require('./routes/api'), http = require('http'), twitter = require('ntwitter'), path = require('path');

var app = express();
//app.enable("jsonp callback");
app.configure(function() {
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

app.configure('development', function() {
	app.use(express.errorHandler());
});

app.get('/', routes.index);

var server = http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});
var io = require('socket.io').listen(server);
io.configure(function() {
	//io.set("transports", ["xhr-polling"]);
	io.set("polling duration", 1);
});
/****************************************************************/
/*
 /*          Twitter Connection
 /*
 /****************************************************************/
/**Production- TravelCompanionApp on Twitter*/
var twit = new twitter({
	consumer_key : 'YzhG1i9X0NsxLpLYuvDLcw',
	consumer_secret : '4PfUoWiMnLQ0GTM6gRGGGl1vxUwyWOEJksDeELMUc',
	access_token_key : '240243946-Dcbgw1xwkus1wht3BjJpdi9L6aBW9192pTBBRYs6',
	access_token_secret : '79xtH7JohguP4qY2FRCfeGyFzWvP79YCJLINej9QB0A'
});

/**Development- AmbiecitiesApp on Twitter**/
/*
twit = new twitter({
	consumer_key : 'cMEy1pyWtlcqwet3dJZErw',
	consumer_secret : '0B0P5ptETBvgXmgiqUjVmEplt75P6a8QTcBO7xcizG0',
	access_token_key : '240243946-8CvFbfNKW1p934JmOdiovKx7Y4m9yicDdqoy02mU',
	access_token_secret : 'vUV2IjnDwzSERugR949RvUmeQmm7drU0upfzeKI08s'
});
/***************************************************/
//51.527264,  -0.10247
//twit.stream('statuses/filter', {'locations':'-76.83,3.11,-76.12,3.61'}, function(stream) {
twit.stream('statuses/filter', {
	'locations' :'-0.1125,51.5071,-0.0923,51.5473'
}, function(stream) {

	//twit.stream('statuses/filter', {'locations':'180,-90,180,90'}, function(stream) {
	stream.on('data', function(data) {
		io.sockets.volatile.emit('tweet', data);
	});
});

app.get('/api/search/:query', function(req, res) {
	//console.log(req);

	var key_term = req.params.query;
	if (key_term) {
		console.log(key_term);
		console.log(twit);
		twit.search(key_term, {}, function(err, data) {
			//res.json(data);
			res.jsonp(data);

		});
	}
});
//app.get('/api/search', api.search);
