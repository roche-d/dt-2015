/**
 * Created by roche_d on 11/05/15.
 */

    /*template7Data: {
     'page:repair': {
     title: 'Brakes Check'
     }*/

(function (Framework7, $$, T7) {
    'use strict';

    // Initialize app
    var myApp = new Framework7({
        template7Pages: true,
        precompileTemplates: true
    });

// Add view
    var mainView = myApp.addView('.view-main', {
        // Because we want to use dynamic navbar, we need to enable it for this view:
        dynamicNavbar: true,
        domCache: true
    });

    myApp.onPageInit('view-main', function (page) {
        console.log('coucou');
    });

    myApp.onPageInit('*', function (page) {
        console.log(page.name + ' initialized');
    });

    myApp.onPageInit('car-manager', function (page) {
        console.log('coucou');
    });

    myApp.onPageInit('repair', function (page) {
        var rep = {
            title: 'Grosse rep',
            status: 'waiting for confirmation',
            offerCount: 0
        };
        $$('.page[data-page="repair"] .current-repair-container').html(T7.templates.currentRepair(rep));
        console.log('coucou');
    });


    garagoRun();

    function warnInternet() {
        myApp.addNotification({
            title: 'Garago',
            subtitle: 'New message from the Team',
            message: 'Please remember that this application needs an Internet connection !',
            media: '<img width="44" height="44" style="border-radius:100%" src="../img/logo-only.png">',
            onClose: function () {
                //myApp.alert('Notification closed');
            },
            onClick: function () {
                console.log('click');
            }
        });
    };

    myApp.onPageInit('info', function (page) {
        $$('.garago-page-info .next-step').on('click', function () {
            console.log('plop');
            //mainView.router.load({pageName: 'index'});
            mainView.router.back({});
        });
    });

    function garagoInfosPage() {
        mainView.router.load({pageName: 'info'});
    };

    function loadingPage(cb, loading) {
        if (loading) {
            myApp.popup('.popup-loading');
            setTimeout(function () {
                myApp.closeModal('.popup-loading');
                cb();
            }, loading);
        } else {
            cb();
        }
    }

    function garagoMenuPage() {
        $$('#car-manager').on('click', function () {
            loadingPage(function () {
                mainView.router.load({pageName: 'car-manager'});
            }, 200);
        });

        $$('#repairs').on('click', function () {
            loadingPage(function () {
                mainView.router.load({pageName: 'repair'});
            });
        });

        $$('#deals').on('click', function () {
            loadingPage(function () {
                mainView.router.load({pageName: 'deals'});
            });
        });

        $$('#knowledge-center').on('click', function () {
            loadingPage(function () {
                mainView.router.load({pageName: 'knowledge-center'});
            });
        });

        $$('#claim').on('click', function () {
            loadingPage(function () {
                mainView.router.load({pageName: 'claim'});
            });
        });
    };

    function garagoRun() {

        var logged = false;

        if (!logged) {
            console.log('not logged');
            myApp.loginScreen();

            $$('.insurance-connect').on('click', function () {
                myApp.closeModal('.login-screen');
                loadingPage(garagoInfosPage);
            });
        } else {
            garagoMenuPage();
            return ;
            loadingPage(function () {
                //mainView.router.load({pageName: 'index'});
            });
        }
    };

} (Framework7, Dom7, Template7));