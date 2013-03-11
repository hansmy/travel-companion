var main = {};
main.reminders = null;
main.places = null;


main.refreshTravelCompanion = function() {
    main.loadApp();
}


main.makeEnabled = function() {

    $("#frontStatus").css("color", "black");
    $("#frontStatus").text("Connected to webinos");
}

main.loadApp = function() {
    main.makeEnabled();

}


$(document).ready(function () {
    main.refreshTravelCompanion();

});


