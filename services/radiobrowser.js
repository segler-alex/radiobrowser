angular.module('RadioBrowserApp').factory('radiobrowser', ['$http', function radiobrowser($http) {
    var SERVER = "https://de1.api.radio-browser.info";
    //var SERVER = "http://localhost:8080";

    function getStats() {
        return $http.get(SERVER + '/json/stats');
    }

    function post(relLink, data) {
        console.log("relLink POST:",relLink);
        return $http.post(SERVER + relLink, data);
    }

    function get(relLink) {
        console.log("relLink GET:",relLink);
        return $http.get(SERVER + relLink);
    }

    return {
        'getStats': getStats,
        'get': get,
        'post': post,
    };
}]);
