var app = angular.module('RadioBrowserApp');

app.controller('ListController', function(radiobrowser, relLink) {
    var vm = this;

    vm.resultList = [];
    vm.resultListFull = [];
    vm.itemsPerPage = 20;

    function updateList() {
        vm.resultList = vm.resultListFull.slice((vm.bigCurrentPage - 1) * vm.itemsPerPage, (vm.bigCurrentPage) * vm.itemsPerPage);
    }

    function vote(station) {
        radiobrowser.get('/webservice/json/vote/' + station.id).then(function(data) {
            if (data.data.ok === "true") {
                station.votes = parseInt(station.votes) + 1;
            } else {
                alert("could not vote for station: " + data.data.message);
            }
            updateList();
        }, function(err) {
            console.log("error:" + err);
        });
    }

    function displayList(){
      radiobrowser.get(relLink.value).then(function(data) {
          vm.resultListFull = data.data;
          vm.bigCurrentPage = 1;
          vm.bigTotalItems = data.data.length;
          updateList();
      }, function(err) {
          console.log("error:" + err);
      });
    }

    displayList();
});
