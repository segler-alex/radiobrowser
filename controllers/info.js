var app = angular.module('RadioBrowserApp');

app.controller('InfoController', function($http) {
    var vm = this;

    // const serverAdress = "http://localhost";
    const serverAdress = "http://www.radio-browser.info";

    updateStats();

    function updateStats() {
        $http.get(serverAdress + '/webservice/json/stats').then(function(data) {
            vm.stats = data.data;
        }, function(err) {
            console.log("error:" + err);
        });
    }

    vm.updateStats = updateStats;
});
