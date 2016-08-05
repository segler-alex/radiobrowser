var app = angular.module('RadioBrowserApp');

app.controller('MainController', function($scope, $state) {

    $scope.setTab = function(name) {
        $scope.tab = name;
    }

    $scope.doSearch = function(term) {
        $state.go('byname', {
            'name': term
        });
    };
});
