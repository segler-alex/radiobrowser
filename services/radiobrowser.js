angular.module('RadioBrowserApp').factory('radiobrowser', ['$http', function radiobrowser($http) {
    function getStats() {
        return $http.get('/webservice/json/stats');
    }

    function post(relLink, data) {
        return $http.post(relLink, data);
    }

    function get(relLink) {
        return $http.get(relLink);
    }

    return {
        'getStats': getStats,
        'get': get,
        'post': post,
    };
}]);
