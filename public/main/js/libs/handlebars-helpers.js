Ember.Handlebars.helper('parseTweet',
function(text) {
    if(text==null|| text== undefined){
        text="";
    }
    var parsed = twttr.txt.autoLink(text);
    return new Handlebars.SafeString(parsed);
    });


Ember.Handlebars.helper('ago', function(date) {
    moment.fn.fromNowOrNow = function(a) {
                        if (Math.abs(moment().diff(this)) < 10000) {// 25 seconds before or after now
                            var m=moment(Math.abs(moment().diff(this))).twitter();
                            return 'just now';
                        }
                        return this.fromNow(a);
                    }
                    var timeAgo = moment(new Date(date));
                   return timeAgo.fromNowOrNow(true);
});
