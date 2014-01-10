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
	'locations' : '-0.1125,51.5071,-0.0923,51.5473'
}, function(stream) {

	//twit.stream('statuses/filter', {'locations':'180,-90,180,90'}, function(stream) {
	stream.on('data', function(data) {
		io.sockets.volatile.emit('tweet', data);
	});
});
// API
//http://localhost:3000/api/results/q=macacu&geocode=-22.912214,-43.230182,1km&lang=pt&result_type=recent

app.get('/api/results', function(req, res) {
	//console.log(req.query);
	//console.log(req);

	var geocode = req.query.lat + "," + req.query.lng + "," + req.query.radio;
	
	twit.search("", {
		"geocode" : geocode,
		count : 10,
		result_type : "recent"
	}, function(err, data) {
	
		var statuses = data.statuses;
		var results = [];

		statuses.forEach(function(tweet) {

			var geo = tweet.geo ? tweet.geo : (tweet.retweeted_status ? tweet.retweeted_status.geo : null);
			
			if (!tweet.retweeted_status) {
				console.log(tweet);

			}
			if (geo) {
				results.push({
					id : tweet.id,
					user : tweet.user.screem_name,
					text : tweet.text,
					lat : geo.coordinates[0],
					lng : geo.coordinates[1],
					tweet : tweet
				});
			}

		});

		//console.log(statuses);
		res.jsonp({
			"result" : results
		});

	});

});

var data = {
	"autocomplete" : [{
		id : 1,
		first_name : "Jon",
		last_name : "Snow",
		email : "jon.snow@got.com",
		password : "67f128a9012553cc2132747e83fe08d749d6bacfd313207d9f1be3fb0e1b62804c5477a84711926b672bd912bfec3c9e41ce89e6060aaea6b20b734036a8962e"
	}, {
		id : 2,
		first_name : "Arya",
		last_name : "Stark",
		email : "arya.stark@got.com",
		password : "074bcd983bc6e39b1e6183c093ffb6d9357f540c9b9206f480af79012ee0c5c22785ca4428e83dc0fabb2af973ae2a930e78c9407f11cac2b59b373c8198a96f"

	}]
};

app.get('/api/autocompletes/:query', function(req, res) {
	res.json(data);
});
app.get('/api/autocompletes', function(req, res) {
	res.json(data);
});
//Router API
//app.get('/api/results', api.results);
//app.get('/api/results/q=:q?&geocode=:geocode?&lang=:lang?&result_type=:result_type?&count=:count?', api.results);
app.get('/api/results?latitude=:lat?&longitude=:lng?&radio=:radio?', api.results);
app.get('/api/autocompletes', api.autocompletes);
app.get('/api/autocompletes/:query', api.autocompletes);
