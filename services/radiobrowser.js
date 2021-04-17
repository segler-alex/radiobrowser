angular.module('RadioBrowserApp').factory('radiobrowser', ['$http', function radiobrowser($http) {
    var SERVER = "https://de1.api.radio-browser.info";
    var SERVERs = [
        "de1.api.radio-browser.info",
        "nl1.api.radio-browser.info",
        "fr1.api.radio-browser.info",
    ];
    var PROTOCOL = "https";
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

    function build_check_step_tree(list, parent) {
        let result = [];
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (item.parent_stepuuid === parent) {
                result.push(item);
                item.children = build_check_step_tree(list, item.stepuuid);
            }
        }
        return result;
    }

    function get_all_servers(relLink) {
        var jobs = [];
        for (var i = 0; i < SERVERs.length; i++) {
            var servername = "" + SERVERs[i];
            let job = $http.get(PROTOCOL + "://" + servername + relLink);
            jobs.push(job);
        }
        return Promise.all(jobs).then(function (results) {
            var list = [];
            for (var i = 0; i < SERVERs.length; i++) {
                list.push({
                    servername: SERVERs[i],
                    result: build_check_step_tree(results[i].data, null),
                });
            }
            return list;
        });
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

    function get_check_steps(uuid) {
        return get_all_servers('/json/checksteps?uuids=' + uuid).then(function (results) {
            return results;
        });
    }

    return {
        'getStats': getStats,
        'get': get,
        'post': post,
        get_changes,
        get_clicks,
        get_checks,
        get_check_steps,
    };
}]);
