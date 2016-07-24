var app = angular.module('RadioBrowserApp');

app.controller('ListController', function(radiobrowser, relLink) {
    var vm = this;

    var resultListFull = [];
    var itemsPerPage = 20;
    var audio = null;
    var playerItem = null;
    var bigTotalItems = 0;
    var bigCurrentPage = 1;

    function changeItemsPerPage(items) {
      itemsPerPage = items;
      updateList();
    }

    function updateList() {
        vm.resultList = resultListFull.slice((bigCurrentPage - 1) * itemsPerPage, (bigCurrentPage) * itemsPerPage);
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

    function displayList() {
        radiobrowser.get(relLink.value).then(function(data) {
            resultListFull = data.data;
            bigCurrentPage = 1;
            bigTotalItems = data.data.length;
            updateList();
        }, function(err) {
            console.log("error:" + err);
        });
    }

    function revertStation(stationid, changeid) {
        console.log("revertStation:" + stationid + "  " + changeid);
        radiobrowser.get('/webservice/json/revert/' + stationid + '/' + changeid).then(function(data) {
            clearList();
            if (data.data.ok === "true") {
                alert("undelete ok");
            } else {
                alert("could not undelete station:" + data.data.message);
            }
        }, function(err) {
            console.log("error:" + err);
        });
    };

    function play(id) {
        // decode playlist
        radiobrowser.get("/webservice/json/url/" + id).then(function(data) {
            if (data.data.length > 0) {
                var station = data.data[0];
                if (station.ok === "true") {
                    $scope.playerItem = station;
                    PlayAudioStream(station.url);
                }
            }
        }, function(err) {
            console.log("error:" + err);
            alert("could not find station");
        });
    }

    function PlayAudioStream(url) {
        // do play audio
        if (audio !== null) {
            audio.src = url;
            audio.play();
        } else {
            audio = new Audio(url);
            audio.volume = 1;
            audio.onplay = function() {
                console.log("play ok");
            };
            audio.onerror = function() {
                console.log("error on play");
                $scope.$apply(function() {
                    $scope.playerItem = null;
                    audio.pause();
                });
                alert("browser is not able to play station. please try with external player.");
            };
            audio.play();
        }
    }

    vm.resultList = [];

    vm.revertStation = revertStation;
    vm.vote = vote;
    vm.play = play;
    vm.changeItemsPerPage = changeItemsPerPage;

    displayList();
});
