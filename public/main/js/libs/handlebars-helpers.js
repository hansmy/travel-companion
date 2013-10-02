Ember.Handlebars.helper('parseTweet',
function(text) {
    if(text==null|| text== undefined){
        text="";
    }
    var parsed = twttr.txt.autoLink(text);
    return new Handlebars.SafeString(parsed);
    });

/*
Ember.Handlebars.registerHelper('parseTweet',
function(propertyPath, options) {
    var tweet;
    if (!options) {
        options = propertyPath;
        tweet = options.contexts[0].text;
    } else {
        tweet = options.contexts[0].get(propertyPath);
    }
    var parsed = twttr.txt.autoLink(tweet);
    return new Handlebars.SafeString(parsed);
});

Ember.Handlebars.registerHelper('ago',
function(propertyName, options) {
    var timestamp = Ember.get(options.contexts[0]);
    if (options.hash.isSeconds) {
        // the given property represents seconds since UNIX epoch, so we multiply
        // by 1000 to get the date in milliseconds since UNIX epoch
        timestamp *= 1000;
    }
    return moment(new Date(timestamp)).fromNow();
});
*/