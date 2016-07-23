angular.module('RadioBrowserApp').factory('radiobrowser', ['$http', function radiobrowser($http) {
    // const serverAdress = "http://localhost";
    const serverAdress = "http://www.radio-browser.info";

    function getStats() {
        return $http.get(serverAdress + '/webservice/json/stats');
    }

    return {
        'getStats': getStats
    };
}]);
