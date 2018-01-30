var app = angular.module('RadioBrowserApp');

app.controller('HistoryController', function(radiobrowser, $stateParams) {
    var vm = this;

    vm.list = [];

    if ($stateParams.id) {
        radiobrowser.get('/webservice/json/stations/changed/' + $stateParams.id).then(function(data) {
            vm.list = data.data;
            vm.list.sort(listSorter);
            computeDiffs();
        });
    }

    function listSorter(item1, item2){
        return new Date(item1.lastchangetime) - new Date(item2.lastchangetime);
    }

    var keys = ["name", "url", "homepage", "favicon", "tags", "country", "state", "language"];

    function computeDiff(before, after){
        var diff = {};
        before = before || {};
        after = after || {};
        for (var i=0;i<keys.length;i++){
            var key = keys[i];
            if (before[key] !== after[key]){
                diff[key] = "'"+before[key]+"' -> '"+after[key]+"'";
            }
        }
        return JSON.stringify(diff,null,' ');
    }

    function computeDiffs(){
        for (var i=0;i<vm.list.length;i++){
            vm.list[i].diff = computeDiff(vm.list[i-1], vm.list[i]);
        }
    }
});
