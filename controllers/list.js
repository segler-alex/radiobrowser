var app = angular.module('RadioBrowserApp');

app.controller('ListController', function(radiobrowser, audioplayer, relLink, $stateParams, $state) {
    var vm = this;

    var resultListFull = [];
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
    } else if ($stateParams.name) {
        relLinkCorrected = '/webservice/json/stations/byname/' + encodeURIComponent($stateParams.name);
    }

    function changeItemsPerPage(items) {
        vm.itemsPerPage = items;
        updateList();
    }

    function updateList() {
        vm.resultList = resultListFull.slice((vm.bigCurrentPage - 1) * vm.itemsPerPage, (vm.bigCurrentPage) * vm.itemsPerPage);
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
            vm.bigCurrentPage = 1;
            vm.bigTotalItems = data.data.length;
            updateList();
        }, function(err) {
            console.log("error:" + err);
        });
    }

    function revertStation(stationid, changeid) {
        console.log("revertStation:" + stationid + "  " + changeid);
        radiobrowser.get('/webservice/json/revert/' + stationid + '/' + changeid).then(function(data) {
            $state.go('lastchange');
            if (data.data.ok === "true") {
                alert("undelete ok");
            } else {
                alert("could not undelete station:" + data.data.message);
            }
        }, function(err) {
            console.log("error:" + err);
        });
    }

    function play(station) {
        // decode playlist
        if (station.hls === '1'){
            alert('unable to play hls streams in the browser, please use an external player like VLC');
            return;
        }
        radiobrowser.get("/webservice/v2/json/url/" + station.id).then(function(data) {
            var station = data.data;
            if (station.ok === "true") {
                audioplayer.play(station.url, station.name);
            }
        }, function(err) {
            console.log("error:" + err);
            alert("could not find station");
        });
    }

    function distinct(list) {
        var result = [];
        for (var i = 0; i < list.length; i++) {
            if (result.indexOf(list[i]) < 0) {
                result.push(list[i]);
            }
        }
        return result;
    }

    function getTagsArray(tags_string) {
        if (tags_string.trim() === "") {
            return [];
        }
        return distinct(tags_string.split(','));
    }

    vm.editStation = null;
    vm.resultList = [];
    vm.itemsPerPage = 20;
    vm.bigCurrentPage = 1;
    vm.bigTotalItems = 0;

    vm.revertStation = revertStation;
    vm.vote = vote;
    vm.play = play;
    vm.changeItemsPerPage = changeItemsPerPage;
    vm.getTagsArray = getTagsArray;
    vm.updateList = updateList;

    displayList();
});
