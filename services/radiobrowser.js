angular.module('RadioBrowserApp').factory('radiobrowser', ['$http', function radiobrowser($http) {
    var SERVER = "https://de1.api.radio-browser.info";
    //var SERVER = "http://localhost:8080";

    function getStats() {
        return $http.get(SERVER + '/json/stats');
    }

    function post(relLink, data) {
        return $http.post(SERVER + relLink, data);
    }

    function get(relLink) {
        return $http.get(SERVER + relLink);
    }

    function get_changes(uuid) {
        return get('/json/stations/changed/' + uuid).then(function (data) {
            var list_changes = data.data;
            for (var i = 0; i < list_changes.length; i++) {
                list_changes[i].lastchangetime = new Date(list_changes[i].lastchangetime.replace(" ", "T") + "Z");
                list_changes[i].lastchangetime_locale = new Date(list_changes[i].lastchangetime).toLocaleString();
            }
            return list_changes;
        });
    }

    function get_clicks(uuid, seconds) {
        return get('/json/clicks/' + uuid + "?seconds=" + seconds).then(function (data) {
            var list_clicks = data.data;
            for (var i = 0; i < list_clicks.length; i++) {
                list_clicks[i].clicktimestamp = new Date(list_clicks[i].clicktimestamp.replace(" ", "T") + "Z");
                list_clicks[i].clicktimestamp_locale = new Date(list_clicks[i].clicktimestamp).toLocaleString();
            }
            return list_clicks;
        });
    }

    function get_checks(uuid) {
        return get('/json/checks/' + uuid).then(function (data) {
            var list_checks = data.data;
            for (var i = 0; i < list_checks.length; i++) {
                list_checks[i].timestamp = new Date(list_checks[i].timestamp.replace(" ", "T") + "Z");
                list_checks[i].timestamp_locale = new Date(list_checks[i].timestamp).toLocaleString();
            }
            return list_checks;
        });
    }

    return {
        'getStats': getStats,
        'get': get,
        'post': post,
        get_changes,
        get_clicks,
        get_checks,
    };
}]);
