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
    var Garago = {
        curReq: {},
        logged: true,
        setCurrentRequest: function (inputData) {
            var me = this;
            me.curReq = {
                title: inputData.what[0],
                status: 'waiting for offers',
                offerCount: 0
            };
        }
    };

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


    /* REPAIRS PAGE */
    function repairLoadData(page) {
        var rep = Garago.curReq;
        console.log(myApp.template7Data);
        $$('.page[data-page="repair"] .current-repair-container').html(T7.templates.currentRepair(rep));
    };

    myApp.onPageInit('repair', function (page) {
       repairLoadData(page);
    });
    myApp.onPageReinit('repair', function (page) {
        repairLoadData(page);
    });


    /* NEW REQUEST */
    myApp.onPageInit('new-request', function (page) {
        // TODO: add popup for GPS loading
        initGeolocation();
        $$('.form-new-request-send').on('click', function () {
            console.log('I should send all');
            var inputData = $$("input:checked[name='repair-what'");
            console.log(inputData.length);
            var obj = {
                what: [],
                courtesyCar: false,
                when: {},
                where: ''
            };
            $$("input:checked[name='repair-what'").each(function () {
                obj.what.push(this.value);
            });
            if (obj.what.length <= 0) {
                myApp.alert('Nothing to repair !', 'Incomplete form');
                return ;
            }
            if ($$("input:checked[name='repair-courtesy'").length > 0) {
                obj.courtesyCar = true;
            }
            $$("input[type='date'").each(function () {
                obj.when[this.name] = this.value;
            });
            obj.where = $$('#map-address')[0].value;
            if ($$("textarea[name='details-text']")[0].value) {
                obj.details = $$("textarea[name='details-text']")[0].value;
            }

            Garago.setCurrentRequest(obj);
            console.log(inputData);
            console.log(obj);
            mainView.refreshPreviousPage();
            mainView.router.back({
                //reloadPrevious: true
            });
        });
    });


    function initGeolocation() {
        console.log('init geoloc');
        var successGeoloc = function (position) {
            var myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var map_options = {
                zoom: 12,
                center: myLatlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map_container = document.getElementById('map');
            var map = new google.maps.Map(map_container, map_options);
            var geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            geocoder.geocode({'latLng': latlng}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[2]) {
                        $$('#map-address')[0].value = results[2].formatted_address;
                    } else {
                        //alert('No results found');
                    }
                } else {
                    //alert('Geocoder failed due to: ' + status);
                }
            });
        };
        var failGeoloc = function () {
            console.log('failed geoloc');
        };

        if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successGeoloc, failGeoloc);
        } else {
            console.log('Geolocation is not supported');
        }
    };


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
            }, 2000);
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

        var logged = Garago.logged;

        if (!logged) {
            console.log('not logged');
            myApp.loginScreen();

            $$('.insurance-connect').on('click', function () {
                myApp.closeModal('.login-screen');
                loadingPage(function () {
                    garagoMenuPage();
                    garagoInfosPage();
                }, 1200);
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