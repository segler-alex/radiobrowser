var app = angular.module('RadioBrowserApp');
app.controller('MainController', function($scope, $http) {
  $scope.doSearch = function(term){
    $http.get('http://www.radio-browser.info/webservice/json/stations/'+term).then(function(data){
      $scope.resultList = data.data;
    },function(err){
      console.log("error:"+err);
    });
  }
});
