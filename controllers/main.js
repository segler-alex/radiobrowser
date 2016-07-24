var app = angular.module('RadioBrowserApp');

app.controller('MainController', function($scope, $http) {

    $scope.setTab = function(name) {
        $scope.tab = name;
    }

    $scope.doSearch = function(term) {
        $http.get(serverAdress + '/webservice/json/stations/byname/' + encodeURIComponent(term)).then(function(data) {
            $scope.resultListFull = data.data;
            $scope.bigCurrentPage = 1;
            $scope.bigTotalItems = data.data.length;
            $scope.updateList();
            $scope.setTab('search');
        }, function(err) {
            console.log("error:" + err);
        });
    };
});
