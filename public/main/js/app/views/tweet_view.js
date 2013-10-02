App.TweetView = Ember.View.extend({
    tagName: 'div',
    classNames: ['thumbnail section'],
   // classNameBindings: 'isSelected',
    templateName: 'tweet',

    /*isSelected: function() {
        return this.get('content.id') === this.get('controller.controllers.photosSelectedPhoto.content.id');
    }.property('controller.controllers.photosSelectedPhoto.content', 'content')
*/

	tweetUrl: function() {
			
			var tweet =this.get('content.tweet');
	     	var user = tweet.user.screen_name;
	        return 'http://twitter.com/'+user;
	       // return 'http://twitter.com/#!/%@/status/%@'.fmt(user, id);
	}.property(),
    tweetProfileImage: function() {
		var tweet =this.get('content.tweet');
   		var profile_image = tweet.user.profile_image_url_https;
   		return profile_image;
   }.property(),
   tweetText: function() {
		var tweet =this.get('content.tweet');
   		var text = tweet.text;
   		return text;
   }.property()


});