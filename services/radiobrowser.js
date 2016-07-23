angular.module('RadioBrowserApp').factory('radiobrowser', ['$http', function radiobrowser($http) {
    // const serverAdress = "http://localhost";
    const serverAdress = "http://www.radio-browser.info";

    function getStats() {
        return $http.get(serverAdress + '/webservice/json/stats');
    }

    function post(relLink, data) {
        return $http.post(serverAdress + relLink, data);
    }

    return {
        'getStats': getStats,
        'post': post
    };
}]);
