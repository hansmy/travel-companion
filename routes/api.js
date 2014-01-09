
/*
 * GET users listing.
 */

exports.results = function(req, res) {
	//console.log(req);
	
};
var data = {"suggestions":[
						{"1": [ {	"first_name": "Jon",
						    		"last_name": "Snow",
						    		"email": "jon.snow@got.com",
						    		"password": "67f128a9012553cc2132747e83fe08d749d6bacfd313207d9f1be3fb0e1b62804c5477a84711926b672bd912bfec3c9e41ce89e6060aaea6b20b734036a8962e",
						    		"id": "1"
						  		}]
						},
  {"2": [{
    "first_name": "Arya",
    "last_name": "Stark",
    "email": "arya.stark@got.com",
    "password": "074bcd983bc6e39b1e6183c093ffb6d9357f540c9b9206f480af79012ee0c5c22785ca4428e83dc0fabb2af973ae2a930e78c9407f11cac2b59b373c8198a96f",
    "id": 2
	}
  ]
}], "key": 3};



exports.autocompletes = function(req, res) {
	//console.log(req);
	
	
};