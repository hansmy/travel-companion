//Requier HashMap and Geohasher
var HashMap = require('hashmap').HashMap, GeoHasher = require('geohasher');
var Rx = require('rx'), EventEmitter = require('events').EventEmitter;

//var hashes = require('hashes');


var GeoManagerTwitter = function(ws) {
	this.geoEmitter = new EventEmitter();
	this.ws=ws;
	//size of the geohash
	this.resolution = 4;
	//current users, with subscription and hashmap of their location
	this.users = new HashMap();
	//current areas with time
	this.areas = new HashMap();
	//subject
	this.subjects = {};
	subscription = null;
	this.init();

};

GeoManagerTwitter.prototype.getNeighbors = function(geohash){
	neighbors = {};
			neighbors.top = GeoHasher.calculateAdjacent(geohash, 'top').substr(0, this.resolution);
			neighbors.bottom = GeoHasher.calculateAdjacent(geohash, 'bottom').substr(0, this.resolution);
			neighbors.right = GeoHasher.calculateAdjacent(geohash, 'right').substr(0, this.resolution);
			neighbors.left = GeoHasher.calculateAdjacent(geohash, 'left').substr(0, this.resolution);
			neighbors.topleft = GeoHasher.calculateAdjacent(neighbors.left, 'top').substr(0, this.resolution);
			neighbors.topright = GeoHasher.calculateAdjacent(neighbors.right, 'top').substr(0, this.resolution);
			neighbors.bottomright = GeoHasher.calculateAdjacent(neighbors.right, 'bottom').substr(0, this.resolution);
			neighbors.bottomleft = GeoHasher.calculateAdjacent(neighbors.left, 'bottom').substr(0, this.resolution);
	return neighbors;
}

GeoManagerTwitter.prototype.init = function(resolution) {
	//initial location
	var geohash = GeoHasher.encode(51.547, -0.0923);
	console.log("Resolution :" + this.resolution);
	geohash = geohash.substr(0, this.resolution);
	this.addArea(geohash, "");
	this.createBufferAreas();
	console.log(this.formatTwitterLocationQuery());

	this.source = Rx.Observable.fromEvent(this.geoEmitter, 'newtweet');
	//it's possible to filter based on the areas hashmap
	var neighbors=this.getNeighbors(geohash);
	this.getLiveTweetsByLocation("user1", neighbors);
}
// Contains Area
GeoManagerTwitter.prototype.containsArea = function(geohash) {
	return this.areas.get(geohash) != null;
}
//
GeoManagerTwitter.prototype.getNewAreas = function(neighbors) {
	var result = [];
	for (key in neighbors) {

		if (!this.containsArea(neighbors[key])) {
			console.log("New Area: " + key + " : " + neighbors[key]);
			result.push(neighbors[key]);
		}
	}
	return result;

	// return the array of new geohashes or null when there aren't new geohash areas
};

GeoManagerTwitter.prototype.createBufferAreas = function() {
	buffer = new Rx.ReplaySubject();
	that = this;
	subscription = buffer.flatMap(function(x) {
		//return the observable from array
		return x;
	}).filter(function(geohash) {
		console.log('Filter: ' + geohash.toString() + ":" + (!that.containsArea(geohash)).toString());
		return !that.containsArea(geohash);
	}).subscribe(function(geohash) {
		console.log('Next: ' + geohash.toString());
		that.addArea(geohash, "");
	}, function(err) {
		console.log('Error: ' + err);
	}, function() {
		console.log('Completed');
	});
};

GeoManagerTwitter.prototype.addBufferAreas = function(arrayGeoHashes) {
	console.log(arrayGeoHashes);

	buffer.onNext(Rx.Observable.fromArray(arrayGeoHashes));
};

GeoManagerTwitter.prototype.flushBufferAreas = function() {
	buffer.onCompleted();
	buffer.dispose();
	subscription.dispose();

};

GeoManagerTwitter.prototype.addArea = function(geohash, user) {
	if (!this.containsArea(geohash)) {
		//new area and new set for user
		//var areaUsers = new HashSet.string();
		//areaUsers.add(user);
		this.areas.set(geohash, user);
		return true;

	} else {
		//get the area and add user

		// the user was already in the area
		return false;

	}
};

GeoManagerTwitter.prototype.onNext=function(data){
		//console.log("On Next");
		this.geoEmitter.emit('newtweet', data);

};


 GeoManagerTwitter.prototype.getTwitterObserver = function() {
 	that=this;
 var observer = Rx.Observer.create(
    function (data) {
        console.log('Observer on Next: ' + data);
        //console.log(data);
        //console.log(that.ws);
        that.ws.sockets.volatile.emit('tweet', data);
    },
    function (err) {
        console.log('Error: ' + err);   
    },
    function () {
        console.log('Completed');   
    }
);

 return observer;
 };
GeoManagerTwitter.prototype.createSubcription = function(neighbors){
	var observer=this.getTwitterObserver();
 			that=this;
 			
	var  subscription=this.source.filter(
 				function(tweet){
 					
 					var geo = tweet.geo ? tweet.geo : (tweet.retweeted_status ? tweet.retweeted_status.geo : null);
 					if(geo==null) return false;
 					
 					var geohash=GeoHasher.encode(geo.coordinates[0], geo.coordinates[1]);
 						geohash = geohash.substr(0, that.resolution);

 					for (key in neighbors) {
 						//console.log(geohash+','+neighbors[key])
 						if(geohash==neighbors[key]){
 							console.log("Filter");
 							return true;					
 						}
					}
					return false;
 				}


 			).subscribe(observer);

	return subscription;
}

 GeoManagerTwitter.prototype.getLiveTweetsByLocation = function(user,neighbors) {
 		var subscription=null;
 		var newAreas=this.getNewAreas(neighbors);
 		this.addBufferAreas(newAreas);

 			var userStatus=null;
 		if(this.containsUser(user)){
 			//
 			console.log("User already in");
 			var value=this.users.get(user);

 			if(this.userIsNewNeighborhood(value.neighborhood,neighbors)){

 			preSubscription=value.subscription;
 			
 			preSubscription.dispose();
 			console.log("Dispose");
 			subscription=this.createSubcription(neighbors);
 			userStatus={'subscription': subscription, 'neighborhood': this.getNeighborhood(neighbors)};
 			this.users.set(user, userStatus);
 			
 			}else{
 				console.log("User is still in the same location");
 			}


 		}else{ 			
 			console.log("New User");
 			subscription=this.createSubcription(neighbors);
 			userStatus={'subscription': subscription, 'neighborhood': this.getNeighborhood(neighbors)};
 			this.addUser(user,userStatus);
 		}
 }

GeoManagerTwitter.prototype.getNeighborhood=function(neighbors){
					var neighborhood = new  HashMap();
					for (i in neighbors) {
						neighborhood.set(neighbors[i],"");
					}
					return  neighborhood;
}

GeoManagerTwitter.prototype.userIsNewNeighborhood=function(past,neighbors){

					for (i in neighbors) {
 						
	 					if(past.get(neighbors[i])==null){
	 						console.log("New Location")
	 						return true;					
	 					}
						
					}
					return false;
}
// Contains User
GeoManagerTwitter.prototype.containsUser = function(user) {
	return this.users.get(user) != null;
}

GeoManagerTwitter.prototype.addUser = function(user, subscription) {
	if (!this.containsUser(user)) {
		//new area and new set for user
		//var areaUsers = new HashSet.string();
		//areaUsers.add(user);
		this.users.set(user, subscription);
		return true;

	} else {
		//get the area and add user

		// the user was already in the area
		return false;

	}
};








/*
 GeoManagerTwitter.prototype.removeArea = function(geohash) {
 if (containsArea(geohash)) {
 var nUsers = areas.get(geohash);
 if (nUsers == 1) {
 //remove area
 areas.remove(geohash);
 return true;
 } else {
 //substract users
 nUsers--;
 areas.set(geohash, rUsers);
 return true;
 }
 }
 return false;
 };

 GeoManagerTwitter.prototype.containsUser = function(user, neighbors) {

 //todo
 };
 GeoManagerTwitter.prototype.addUser = function(user, neighbors) {

 };
 GeoManagerTwitter.prototype.getUserAreas = function(user) {

 };
 GeoManagerTwitter.prototype.addUpdate = function(user, neighbors) {

 //todo
 //user new

 };

 GeoManagerTwitter.prototype.removeUser = function(user) {

 //todo
 };
 */

GeoManagerTwitter.prototype.formatTwitterBBox = function(geohash) {
	var box = GeoHasher.decode(geohash);
	var decimal = 2;
	var bottomleft = [box.latitude[0].toFixed(decimal), box.longitude[0].toFixed(decimal)];
	var topright = [box.latitude[1].toFixed(decimal), box.longitude[1].toFixed(decimal)];
	return bottomleft[1] + "," + bottomleft[0] + "," + topright[1] + "," + topright[0];

}
GeoManagerTwitter.prototype.formatTwitterLocationQuery = function() {
	//
	var query = "";
	that = this;
	this.areas.forEach(function(users, area) {
		query += that.formatTwitterBBox(area) + ',';
	});

	return query.substr(0, query.length - 1);

}
// Export the GeoManagerTwitter constructor from this module.
module.exports = GeoManagerTwitter;
