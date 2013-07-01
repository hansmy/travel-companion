var wikiTools = {};
wikiTools.articles =[];


wikiTools.showWikiInfo=function (data){
    var article=null;
    var marker=null;
    for(var number in data.articles){
        article=data.articles[number];
        var latlng = new L.LatLng(article.lat, article.lng);
        wikiTools.articles.push(article);
        twitterTools.searchTwitter(article,latlng);
        //$("#content").append('<iframe src="' + article.mobileurl + '"></iframe>');
    }
 }
wikiTools.findNearestPOI=function(){
    //http://en.wikipedia.org/w/api.php?action=query&prop=coordinates&titles=Hammersmith%20Apollo
    //http://en.wikipedia.org/w/api.php?format=json&action=query&list=geosearch&gsradius=10000&format=json&gscoord=51.489363|-0.2237764
       //http://d3js.org/
    //http://de.wikivoyage.org/w/api.php
    //https://search.twitter.com/search.json?q=Apollo%20Hamersmith&geocode:37.786971,-0.2237764,25mi
    $.ajax({
        url: 'http://api.wikilocation.org/articles?lat=' + geoTools.latitude + '&lng=' + geoTools.longitude +'&limit=100&jsonp=?',
        type: 'GET',
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        jsonpCallback: 'wiki',
        success: wikiTools.showWikiInfo
    });
}