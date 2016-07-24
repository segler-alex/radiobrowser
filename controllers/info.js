var app = angular.module('RadioBrowserApp');

app.controller('InfoController', function(radiobrowser) {
    var vm = this;

    updateStats();

    function updateStats() {
        radiobrowser.getStats().then(function(data) {
            vm.stats = data.data;
        }, function(err) {
            console.log("error:" + err);
        });
    }

    vm.updateStats = updateStats;
});
