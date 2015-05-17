/**
 * Created by roche_d on 11/05/15.
 */

    /*template7Data: {
     'page:repair': {
     title: 'Brakes Check'
     }*/

(function (Framework7, $$, T7, GaragoApi) {
    'use strict';

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
    }

    // Initialize app
    var myApp = new Framework7({
        template7Pages: true,
        precompileTemplates: true
    });
    var Garago = {
        curReq: {},
        logged: false,
        api: GaragoApi,
        setCurrentRequest: function (inputData) {
            var me = this;
        }
    };

    myApp.popup('.popup-loading');

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
        //console.log('car manager ?')
    });

    myApp.onPageInit('info', function (page) {
        $$(".field-contract-number")[0].innerHTML = Garago.contract;
    });


    /* REPAIRS PAGE */
    function repairLoadData(page) {
        console.log('load data ' + Garago.contract);
        Garago.api.getCurrentRequest(Garago.contract, function (data) {
            console.log('req ok');
            Garago.curReq = data.req;
            $$('.page[data-page="repair"] .current-repair-container').html(T7.templates.currentRepair(data.req));
            console.log('req ok');
            console.log(data);

            $$('#repair-more-information').on('click', function () {
                console.log(data.req);
                mainView.router.load({
                    template: Template7.templates.moreInfo,
                    context: data.req
                });
            });
        }, function (err) {
            Garago.curReq = {};
            console.log('impossible to get the current req ' + err.msg);
        });

        //var rep = Garago.curReq;
        //console.log(myApp.template7Data);
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
            myApp.popup('.popup-loading');
            var inputData = $$("input:checked[name='repair-what']");

            var obj = {
                what: [],
                courtesyCar: false,
                when: {},
                where: ''
            };
            $$("input:checked[name='repair-what']").each(function () {
                obj.what.push(this.value);
            });
            if (obj.what.length <= 0) {
                myApp.alert('Nothing to repair !', 'Incomplete form');
                myApp.closeModal('.popup-loading');
                return ;
            }
            if ($$("input:checked[name='repair-courtesy']").length > 0) {
                obj.courtesyCar = true;
            }
            $$("input[type='date']").each(function () {
                obj.when[this.name] = this.value;
            });
            obj.where = $$('#map-address')[0].value;
            if ($$("textarea[name='details-text']")[0].value) {
                obj.details = $$("textarea[name='details-text']")[0].value;
            }


            Garago.api.pushRequest(Garago.contract, JSON.stringify(obj), function (data) {

                mainView.refreshPreviousPage();
                myApp.closeModal('.popup-loading');
                mainView.router.back({});

            }, function (err) {
                myApp.closeModal('.popup-loading');
                myApp.alert('There was a communication failure with the server, please try again.', 'Error');
            });
        });
    });


    /* GEOLOCATION */
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

    myApp.onPageInit('info', function (page) {
        $$('.garago-page-info .next-step').on('click', function () {
            console.log('plop');
            //mainView.router.load({pageName: 'index'});
            mainView.router.back({});
        });
    });

    function garagoInfosPage() {
        mainView.router.load({pageName: 'info'});
    }

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

    /* LOCAL STORAGE */
    if(typeof(Storage) !== "undefined") {
        if (localStorage && localStorage.contractNumber && localStorage.contractNumber.length > 0) {
            Garago.api.login(localStorage.contractNumber, function (data) {
                Garago.logged = true;
                Garago.contract = data.contract;
                garagoRun();
            }, function (err) {

            });
        } else {
            Garago.logged = false;
            garagoRun();
        }
    } else {
        myApp.alert('Impossible to save data on your device !', 'No saving possible');
    }

    /* MAIN ENTRY POINT */
    function garagoRun() {

        var logged = Garago.logged;
        myApp.closeModal('.popup-loading');

        if (!logged) {
            console.log('not logged');
            myApp.loginScreen();

            /* CONNECTION TO SERVER */
            $$('.insurance-connect').on('click', function () {
                var textNumber = $$("input[name='cnumber']")[0].value;
                if (!(textNumber && textNumber.length > 0)) return;
                Garago.api.login(textNumber, function(data) {
                    Garago.contract = data.contract;
                    console.log('success to log online, contract : ' + data.contract);
                    if (localStorage) {
                        localStorage.contractNumber = data.contract;
                    }
                    myApp.closeModal('.login-screen');
                    loadingPage(function () {
                        garagoMenuPage();
                        garagoInfosPage();
                    }, 1200);
                }, function (err) {
                    myApp.alert('Please check your connection and try again', 'Impossible to log in');
                });
            });
        } else {
            garagoMenuPage();
        }
    }

} (Framework7, Dom7, Template7, GaragoApi));