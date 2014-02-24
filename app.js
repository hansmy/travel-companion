/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes'), api = require('./routes/api'), http = require('http'), twitter = require('ntwitter'), path = require('path');
GeoHasher = require('geohasher');
var GeoManagerTwitter=require('./lib/geomanager');

// Flag for new geohash
var newgeohash = false;
var app = express();
/*
 * CORSS Configuration
 */
var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization, X-Mindflash-SessionID');
	// intercept OPTIONS method
	if ('OPTIONS' == req.method) {
		res.send(200);
	} else {
		next();
	}
};
//Configuration Express Server
app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(allowCrossDomain);
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
	app.use(express.errorHandler());
});

//app.get('/', routes.index);

var server = http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
	//

	/*eventEmitter.emit('new-twitter-location', {
		//location : '-0.1125,51.5071,-0.0923,51.5473'
		location : geomanager.formatTwitterLocationQuery()
	});*/
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
	access_token_secret : '79xtH7JohguP4qY2FRCfeGyFzWvP79YCJLINej9QB0A',
	search_base : 'https://api.twitter.com/1.1/search'
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

//Fixing Bug on ntwitter
twitter.prototype.search = function(q, params, callback) {

	if ( typeof params === 'function') {
		callback = params;
		params = null;
	}
	var merge = function merge(defaults, options) {
		defaults = defaults || {};
		if (options && typeof options === 'object') {
			var keys = Object.keys(options);
			for (var i = 0, len = keys.length; i < len; i++) {
				var k = keys[i];
				if (options[k] !== undefined)
					defaults[k] = options[k];
			}
		}
		return defaults;
	}
	if ( typeof callback !== 'function') {
		throw 'FAIL: INVALID CALLBACK.';
		return this;
	}
	//question tweets search
	var url = this.options.search_base + '/tweets.json';
	console.log(url);
	params = merge(params, {
		q : q
	});
	this.get(url, params, callback);
	return this;
}
/***********************************************************************/
/*			GeoManagerModule
/***********************************************************************/
var geoManager= new GeoManagerTwitter(io);

io.sockets.on('connection', function(socket) {
	console.log('client connected');
	

	socket.on('getLiveTweets', function(data) {
		//create a user in the map, with an observable collection
		// for each geohash area in the map
			// create an observer
			// areaObservableCollection <-- observer
			// userObservableCollection <-- user
		console.log(' client asking for live tweets for' + data.query);
		//if client is in a new location.
			//set flag to true
			//buffer results
		
		var neighbors = data.query;
		//new areas
		//geomanager.checkingNewLocationQuery(neighbors, newgeohash);
		/*
		var newAreas=geomanager.getNewAreas(neighbors);
		//if there are new areas
		console.log('New Areas: ' + newAreas.toString());
		if(newAreas.length>0){
			newgeohash = true;
			geomanager.addBufferAreas(newAreas);
		}
		*/

		geoManager.getLiveTweetsByLocation('user1',neighbors);
	});

	
	socket.on('tweet',function(data){
		console.log("Tweet...");
	});

	socket.on('getTweetsBySearch', function(data) {
		console.log('client asking for searching tweets for' + data.query);
		twit.search(data.query, {
			count : 100
		}, function(err, twitdata) {
			console.log(err);
			socket.emit('twitter-search', twitdata);
			socket.emit('twitter-done');
		});
	});

});

//****************************************************************/
//
//	Custom Events
//
//****************************************************************/


/*
var geoEmitter = new EventEmitter();

var source = Rx.Observable.fromEvent(geoEmitter, 'new-twitter-location');
*/
//var subscription = source.subscribe(function(filter) {
	console.log("Creating the stream with Twitter")
	//console.log('data: ' + filter);
	//Filtering Streams
	twit.stream('statuses/filter', {
		//'locations' : filter.location
		locations:'-180,-90,180,90'
	}, function(stream) {

		var idInterval;
		//twit.stream('statuses/filter', {'locations':'180,-90,180,90'}, function(stream) {
		stream.on('data', function(tweet) {
			
			//io.sockets.volatile.emit('tweet', data);
			//socket.volatile.emit('tweet', data);
			var geo = tweet.geo ? tweet.geo : (tweet.retweeted_status ? tweet.retweeted_status.geo : null);
 					if(geo==null) return false;
 					
 					var geohash=GeoHasher.encode(geo.coordinates[0], geo.coordinates[1]);
 						geohash = geohash.substr(0, that.resolution);

			if(geoManager.containsArea(geohash)){
					geoManager.onNext(tweet);
				}

		});

		stream.on('end', function(response) {
			// Handle a disconnection
		});
		stream.on('destroy', function(response) {
			// Handle a 'silent' disconnection from Twitter, no end/error event fired
			//io.sockets.volatile.emit('twitter-done');
			// when destroy newlocation
			console.log("destroy");
			/*
			geomanager.flushBufferAreas();
			console.log(geomanager.formatTwitterLocationQuery());
			eventEmitter.emit('new-twitter-location', {
				location : geomanager.formatTwitterLocationQuery()
			});
			newgeohash = false;
			geomanager.createBufferAreas();
			**/


		});
		// After 20 seconds, the applicattion checks if there is a new location
		/*
		idInterval = setInterval(function() {
			//checks whether there is new user in untrack geohash area
			console.log("There new locations to track:" + newgeohash);
			if (newgeohash) {
				stream.emit('destroy');
				//remove interval
				clearInterval(idInterval);
				
			}
		}, 20000);*/
	});

//});
////http://localhost:3000/api/results/q=macacu&geocode=-22.912214,-43.230182,1km&lang=pt&result_type=recent
app.get('/api/results', function(req, res) {
	
	var geocode = req.query.lat + "," + req.query.lng + "," + req.query.radio;
	//console.log(twit);
	twit.search("", {
		"geocode" : geocode,
		count : 10,
		result_type : "recent"
	}, function(err, data) {
		console.log("data");
		console.log(err);
		console.log(data);
		var results = [];
		if(data!=undefined){
		var statuses = data.statuses;
		statuses.forEach(function(tweet) {

			var geo = tweet.geo ? tweet.geo : (tweet.retweeted_status ? tweet.retweeted_status.geo : null);

			if (!tweet.retweeted_status) {
				//console.log(tweet);

			}
			if (geo) {
				console.log(tweet.created_at);
				var date=new Date(tweet.created_at);
			console.log(date);
				results.push({
					id : tweet.id,
					user : tweet.user.screem_name,
					text : tweet.text,
					lat : geo.coordinates[0],
					lng : geo.coordinates[1],
					tweet : tweet,
					timestamp:date.getTime()
				});
			}

		});
		}
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

app.get('/', function(req, res) {
	res.send("Hello Cybertron!")
});
app.get('/insecticons.json', function(req, res) {
	res.writeHead(200, {
		'Content-Type' : 'application/json'
	});
	res.write(JSON.stringify({
		insecticons : ["Shrapnel", "Bombshell", "Kickback"]
	}));
	res.end();
});

