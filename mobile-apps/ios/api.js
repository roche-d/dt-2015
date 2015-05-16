/**
 * Created by roche_d on 16/05/15.
 */

(function (Framework7, $$) {
'use strict';

    //"http://127.0.0.1:8080"

    var GaragoApi = {
        url: "http://garago.cleverapps.io",
        login: function (contract, success, error) {
            $$.post(this.url + '/api/login', {contract: contract}, function (data) {
                data = JSON.parse(data);
                console.log(data);
                if (data.res) {
                    success(data.data);
                } else {
                    error(data.data);
                }
            });
        },
        getCurrentRequest: function (contract, success, error) {
            $$.get(this.url + '/api/currentRequest', {contract: contract}, function (data) {
                data = JSON.parse(data);
                if (data.res) {
                    success(data.data);
                } else {
                    error(data.data);
                }
            });
        },
        pushRequest: function (contract, request, success, error) {
            $$.post(this.url + '/api/pushRequest', {contract: contract, request: request}, function (data) {
                data = JSON.parse(data);
                if (data.res) {
                    success(data.data);
                } else {
                    error(data.data);
                }
            });
        }
    };

    var req = function (path, success, error, retry) {
        retry = retry || 0;
        return $$.ajax({
            url: GaragoApi.url + path,
            success: success,
            error: function (xhr) {
                    error(xhr);
            }
        });
    };

    window.GaragoApi = GaragoApi;
} (Framework7, Dom7));