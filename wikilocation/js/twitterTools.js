var twitterTools = {};
twitterTools.latlng = null;

twitterTools.searchTwitter = function (article, position) {
    //validate geoinfo is different from the previous  marker

    if (!twitterTools.latlng || twitterTools.latlng
        && Math.abs(twitterTools.latlng.lat - article.lat) + Math.abs(twitterTools.latlng.lng - article.lng) > 0.0000005) {

        twitterTools.latlng = new L.LatLng(position.lat, position.lng);
        var marker = new TwitterMarker(article);
        marker.setLatLng(twitterTools.latlng);
        marker.addTo(geoTools.map);
		var text = "<a href=" + article.url + ">" + article.title + "</a>";
		marker.bindPopup(text);
    }
}




function TwitterMarker(article) {
    var searchKeyWord = article.title;

    var geocode = article.lat + "," + article.lng + ",25mi";

   /* this.on('click', function (e) {
        //open popup;

        $.ajax({
            context: this,
            url: 'http://localhost:3000/api/search/' + searchKeyWord,
            type: 'GET',
            async: false,
            contentType: "application/json",
            dataType: 'jsonp',
            //jsonpCallback: 'tweet',
            success: function (data) {
                this.showTweet(data, article)
            }
        });

    });*/
}

TwitterMarker.prototype = new L.Marker();
TwitterMarker.prototype.showTweet = function (a, article) {
    //e.target._latlng
    var popup = new TwitterPopUp(a.results);
    popup.setLatLng(new L.LatLng(article.lat, article.lng));
    popup.openOn(geoTools.map);

}

function TwitterPopUp(opt) {

    if (!opt || !opt.length) {
        this.setContent("No tiene tweets");
    } else {
        this.count = opt.length;
        this.crnt = 0;
        this.id = TwitterPopUp.tweets.push(this);
        this.aTweets = opt;
        var strTweet = this.buildTwitterHTML(opt[0]);
        this.setContent(strTweet);
    }
}

TwitterPopUp.prototype = new L.popup({offset: new L.Point(1, -35)});
TwitterPopUp.tweets = [];


TwitterPopUp.prototype.buildTwitterHTML = function (twt) {
    var str;
    if (twt.from_user_name) {
        str = "<span><img style='float: left' src='" + twt.profile_image_url + "' />" +
            "<b>" + twt.from_user_name + "</b><br/><a href ='http://twitter.com/"
            + twt.from_user + "'>@" + twt.from_user + "</a><br/> "
            + twt.location + "</span>"
            + "<p>" + twt.text + "</p>";

        if (this.count > 1) {

            str += "<span style='absolute; bottom: 0; right: 0px; width:80px'>";
            if (this.crnt != 0) str += "<a href='javascript:TwitterPopUp.tweets[" + (this.id - 1) + "].prev();'>&lt;</a> ";
            str += (this.crnt + 1) + " of " + this.count;
            if (this.crnt < (this.count - 1)) str += "<a href='javascript:TwitterPopUp.tweets[" + (this.id - 1) + "].next();'>&gt;</a> ";
            str += "</span>"
        }
    } else {
        str = "The 25 Miles radius around this point did not message this value";
    }
    return str;
}
TwitterPopUp.prototype.next = function () {
    this.setContent(this.buildTwitterHTML(this.aTweets[++this.crnt]));
    //this.openOn(this.map);
    return false;
}

TwitterPopUp.prototype.prev = function () {
    this.setContent(this.buildTwitterHTML(this.aTweets[--this.crnt]));
    //this.openOn(this.map);
    return false;

}
