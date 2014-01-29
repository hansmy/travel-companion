//Requier HashMap and Geohasher
var HashMap  = require('hashmap').HashMap,
  GeoHasher = require('geohasher'),
  HashSet = require('hashset-native');
//current users
var users = new HashMap();
//current areas
var areas = new HashMap();

var GeoManagerTwitter = function() {
  var resolution=4;

};
GeoManagerTwitter.prototype.init = function(resolution){
  //initial location
   var geohash = GeoHasher.encode(51.547, -0.0923);
   geohash = geohash.substr(0, resolution);
}
// Parses the specified text.
GeoManagerTwitter.prototype.containsArea = function(geohash) {
  if(areas.get(geohash)){
      return true;
  }
  return false;
};

GeoManagerTwitter.prototype.addArea = function(geohash, user) {
  if(!containsArea(geohash)){
    //new area and new set for user
    var areaUsers = new HashSet.string();
      areaUsers.add(user);
      areas.set(geohash,setAreaUsers);
      return true;
      
  }else{
      //get the area and add user

      var areaUsers=areas.get(geohash);
      if(!areaUsers.contains(user)){
        areaUsers.add(user)
        areas.set(geohash, areaUsers);
        return true;
      }
      // the user was already in the area
      return false;
      
  }
};

GeoManagerTwitter.prototype.getUserInArea= function(geohash){
  if(containsArea(geohash)){
    var areaUsers=areas.get(geohash);
    var it = areaUsers.iterator();
    var result=[]
      while (it.hasNext()) {
        result.push(it.next());
      }
    return result;
  }
  return null;
}

GeoManagerTwitter.prototype.removeArea = function(geohash) {
  if(containsArea(geohash)){
      var nUsers=areas.get(geohash);
      if(nUsers==1){
        //remove area
        areas.remove(geohash);
        return true;
      }else{
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

GeoManagerTwitter.prototype.formatTwitterBBox = function(geohash) {
        
        var box=GeoHasher.decode(geohash);
        var bottomleft=[box.latitude[0], box.longitude[1]];
        var topright=[box.latitude[1], box.longitude[0]];
        return bottomleft[1]+","+bottomleft[0]+","+topright[1]+","+topright[0];

}



// Export the GeoManagerTwitter constructor from this module.
module.exports = GeoManagerTwitter;