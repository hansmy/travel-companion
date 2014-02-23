Ember.Handlebars.helper('imageProfile',
function(tweet) {
    if(tweet!=null){
    var urlUser= 'http://twitter.com/'+tweet.user.screen_name;
    var profile_image ="<a href='"+urlUser+"' target='_blank' class='pull-left'>";
   profile_image+="<img class='media-object' src='"+tweet.user.profile_image_url_https+"''>";
   profile_image+="</a>";
    console.log(profile_image);
            
    return new Handlebars.SafeString(profile_image);
}
    });

Ember.Handlebars.helper('headerTweet',function  (tweet) {
      if(tweet!=null){
    var urlUser= 'http://twitter.com/'+tweet.user.screen_name;
    var header = "<a href='"+urlUser+"' target='_blank'>@"+tweet.user.screen_name +"</a>";
  return new Handlebars.SafeString(header);   
  }    
});

Ember.Handlebars.helper('parseTweet',
function(text) {
    if(text==null|| text== undefined){
        text="";
    }
    var parsed = twttr.txt.autoLink(text,{target:'_blank'});
    
    return new Handlebars.SafeString(parsed);
    });

Ember.Handlebars.helper('ago', function(date) {
    moment.fn.fromNowOrNow = function(a) {
                        if (Math.abs(moment().diff(this)) < 20000) {// 25 seconds before or after now
                            var m=moment(Math.abs(moment().diff(this))).twitter();
                            return 'just now';
                        }
                        return this.fromNow(a);
                    }
                    var timeAgo = moment(new Date(date));
                   return timeAgo.fromNowOrNow(true);
});
