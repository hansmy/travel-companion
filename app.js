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

var data={
  "1": {
    "first_name": "Jon",
    "last_name": "Snow",
    "email": "jon.snow@got.com",
    "password": "67f128a9012553cc2132747e83fe08d749d6bacfd313207d9f1be3fb0e1b62804c5477a84711926b672bd912bfec3c9e41ce89e6060aaea6b20b734036a8962e",
    "id": "1"
  },
  "2": {
    "first_name": "Arya",
    "last_name": "Stark",
    "email": "arya.stark@got.com",
    "password": "074bcd983bc6e39b1e6183c093ffb6d9357f540c9b9206f480af79012ee0c5c22785ca4428e83dc0fabb2af973ae2a930e78c9407f11cac2b59b373c8198a96f",
    "id": 2
  },
  "3": {
    "first_name": "Sansa",
    "last_name": "Stark",
    "email": "sansa.stark@got.com",
    "password": "074bcd983bc6e39b1e6183c093ffb6d9357f540c9b9206f480af79012ee0c5c22785ca4428e83dc0fabb2af973ae2a930e78c9407f11cac2b59b373c8198a96f",
    "id": 3
  },
  "4": {
    "first_name": "Catelyn",
    "last_name": "Stark",
    "email": "catelyn.stark@got.com",
    "password": "074bcd983bc6e39b1e6183c093ffb6d9357f540c9b9206f480af79012ee0c5c22785ca4428e83dc0fabb2af973ae2a930e78c9407f11cac2b59b373c8198a96f",
    "id": 4
  },
  "5": {
    "first_name": "Eddard",
    "last_name": "Stark",
    "email": "eddard.stark@got.com",
    "password": "074bcd983bc6e39b1e6183c093ffb6d9357f540c9b9206f480af79012ee0c5c22785ca4428e83dc0fabb2af973ae2a930e78c9407f11cac2b59b373c8198a96f",
    "id": 5
  },
  "6": {
    "first_name": "Tyrion",
    "last_name": "Lannister",
    "email": "tyrion.lannister@got.com",
    "password": "074bcd983bc6e39b1e6183c093ffb6d9357f540c9b9206f480af79012ee0c5c22785ca4428e83dc0fabb2af973ae2a930e78c9407f11cac2b59b373c8198a96f",
    "id": 6
  },
  "7": {
    "first_name": "Jaime",
    "last_name": "Lannister",
    "email": "jaime.lannister@got.com",
    "password": "074bcd983bc6e39b1e6183c093ffb6d9357f540c9b9206f480af79012ee0c5c22785ca4428e83dc0fabb2af973ae2a930e78c9407f11cac2b59b373c8198a96f",
    "id": 7
  },
  "8": {
    "first_name": "Peter",
    "last_name": "Baelish",
    "email": "petyr.baelish@got.com",
    "password": "074bcd983bc6e39b1e6183c093ffb6d9357f540c9b9206f480af79012ee0c5c22785ca4428e83dc0fabb2af973ae2a930e78c9407f11cac2b59b373c8198a96f",
    "id": 8
  },
  "9": {
    "first_name": "Jorah",
    "last_name": "Mormont",
    "email": "jorah.mormont@got.com",
    "password": "074bcd983bc6e39b1e6183c093ffb6d9357f540c9b9206f480af79012ee0c5c22785ca4428e83dc0fabb2af973ae2a930e78c9407f11cac2b59b373c8198a96f",
    "id": 9
  },
  "10": {
    "first_name": "Robb",
    "last_name": "Stark",
    "email": "robb.stark@got.com",
    "password": "074bcd983bc6e39b1e6183c093ffb6d9357f540c9b9206f480af79012ee0c5c22785ca4428e83dc0fabb2af973ae2a930e78c9407f11cac2b59b373c8198a96f",
    "id": 10
  },
  "11": {
    "first_name": "Tywin",
    "last_name": "Lannister",
    "email": "tywin.lannister@got.com",
    "password": "074bcd983bc6e39b1e6183c093ffb6d9357f540c9b9206f480af79012ee0c5c22785ca4428e83dc0fabb2af973ae2a930e78c9407f11cac2b59b373c8198a96f",
    "id": 11
  },
  "key": 12
}

app.get('/api/autocomplete/:query', function(req, res) {
	//console.log(req);
		res.json(data);
		
	}
});
//app.get('/api/search', api.search);
