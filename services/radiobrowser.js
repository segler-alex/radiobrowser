angular.module('RadioBrowserApp').factory('radiobrowser', ['$http', '$location', '$log', function radiobrowser($http, $location, $log) {
    // const serverAdress = "http://localhost";
    var serverAdress = $location.protocol() + '://' + $location.host();

    $log.debug('Use serverAdress=' + serverAdress);

    function getStats() {
        return $http.get(serverAdress + '/webservice/json/stats');
    }

    function post(relLink, data) {
        return $http.post(serverAdress + relLink, data);
    }

    function get(relLink) {
        return $http.get(serverAdress + relLink);
    }

    function getServer() {
        return serverAdress;
    }

    return {
        'getStats': getStats,
        'get': get,
        'post': post,
        'getServer': getServer
    };
}]);
