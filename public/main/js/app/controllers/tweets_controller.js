//Collection
App.searchResults = App.ArrayController.create({
	content : [],
	_idCache : {},

	addTweet : function(tweet) {
		var id = tweet.get("id");
		if ( typeof this._idCache[id] === "undefined") {
			this.pushObject(tweet);
			this._idCache[id] = tweet.id;
		}
	}
}); 