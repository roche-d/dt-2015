/**
 * Created by roche_d on 11/05/15.
 */

// Initialize app
var myApp = new Framework7();

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

myApp.onPageInit('view-main', function (page) {

});

myApp.onPageInit('*', function (page) {
    console.log(page.name + ' initialized');
});

console.log('ok');
garagoRun();

function warnInternet() {
    myApp.addNotification({
        title: 'Garago',
        subtitle: 'New message from the Team',
        message: 'Please remember that this application needs an Internet connection !',
        media: '<img width="44" height="44" style="border-radius:100%" src="http://lorempixel.com/output/people-q-c-100-100-9.jpg">',
        onClose: function () {
            //myApp.alert('Notification closed');
        },
        onClick: function () {
            console.log('click');
        }
    });
};

function garagoRun() {
    warnInternet();

    var logged = false;

    if (!logged) {
        console.log('not logged');
        myApp.loginScreen();
    }
};