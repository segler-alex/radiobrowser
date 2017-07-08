var app = angular.module('RadioBrowserApp');

app.controller('SearchController', function($scope, $state) {
    var vm = this;

    vm.search = {
      complex: true,
    };

    function doComplexSearch(){
        console.log(vm.search);
        $state.go('searchresult', vm.search);
    }

    vm.doComplexSearch = doComplexSearch;
});
