var app = angular.module('RadioBrowserApp');

app.controller('ListController', function(radiobrowser, relLink, $stateParams) {
    var vm = this;

    var resultListFull = [];
    var itemsPerPage = 20;
    var audio = null;
    var playerItem = null;
    var bigTotalItems = 0;
    var bigCurrentPage = 1;

    var relLinkCorrected = relLink.value;

    if ($stateParams.tag) {
        relLinkCorrected = '/webservice/json/stations/bytagexact/' + encodeURIComponent($stateParams.tag);
    } else if ($stateParams.state) {
        relLinkCorrected = '/webservice/json/stations/bystateexact/' + encodeURIComponent($stateParams.state);
    } else if ($stateParams.country) {
        relLinkCorrected = '/webservice/json/stations/bycountryexact/' + encodeURIComponent($stateParams.country);
    } else if ($stateParams.language) {
        relLinkCorrected = '/webservice/json/stations/bylanguageexact/' + encodeURIComponent($stateParams.language);
    } else if ($stateParams.codec) {
        relLinkCorrected = '/webservice/json/stations/bycodecexact/' + encodeURIComponent($stateParams.codec);
    }

    // $scope.displayByLanguage = function(language) {
    //     $http.get(serverAdress + '/webservice/json/stations/bylanguageexact/' + encodeURIComponent(language)).then(function(data) {
    //         $scope.languageList = [];
    //         $scope.resultListFull = data.data;
    //         $scope.bigCurrentPage = 1;
    //         $scope.bigTotalItems = data.data.length;
    //         $scope.updateList();
    //     }, function(err) {
    //         console.log("error:" + err);
    //     });
    // }
    //
    // $scope.displayByTag = function(tag) {
    //     $http.get(serverAdress + '/webservice/json/stations/bytagexact/' + encodeURIComponent(tag)).then(function(data) {
    //         $scope.tab = "bytag";
    //         $scope.tagList = [];
    //         $scope.tagListPopular = [];
    //         $scope.tagListNotPopular = [];
    //         $scope.resultListFull = data.data;
    //         $scope.bigCurrentPage = 1;
    //         $scope.bigTotalItems = data.data.length;
    //         $scope.updateList();
    //     }, function(err) {
    //         console.log("error:" + err);
    //     });
    // }

    function changeItemsPerPage(items) {
        itemsPerPage = items;
        updateList();
    }

    function updateList() {
        vm.resultList = resultListFull.slice((bigCurrentPage - 1) * itemsPerPage, (bigCurrentPage) * itemsPerPage);
    }

    function clearList() {
        resultListFull = [];
        bigCurrentPage = 1;
        bigTotalItems = 0;
        updateList();
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
        radiobrowser.get(relLinkCorrected).then(function(data) {
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
