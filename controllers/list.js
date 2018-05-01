var app = angular.module('RadioBrowserApp');

app.controller('ListController', function (radiobrowser, audioplayer, relLink, $stateParams, $state) {
    var vm = this;

    var resultListFull = [];
    var relLinkCorrected = relLink.value;

    console.log($stateParams);
    if ($stateParams.complex) {
        var items = [];
        if ($stateParams.name) {
            items.push('name=' + encodeURIComponent($stateParams.name));
        }
        if ($stateParams.country) {
            items.push('country=' + encodeURIComponent($stateParams.country));
        }
        if ($stateParams.state) {
            items.push('state=' + encodeURIComponent($stateParams.state));
        }
        if ($stateParams.tag) {
            items.push('tag=' + encodeURIComponent($stateParams.tag));
        }
        items.push('limit=' + encodeURIComponent('100'));
        relLinkCorrected = '/webservice/json/stations/search?' + items.join('&');
    } else if ($stateParams.tag) {
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
        radiobrowser.get('/webservice/json/vote/' + station.id).then(function (data) {
            if (data.data.ok === "true") {
                station.votes = parseInt(station.votes) + 1;
            } else {
                alert("could not vote for station: " + data.data.message);
            }
            updateList();
        }, function (err) {
            console.log("error:" + err);
        });
    }

    function displayList() {
        radiobrowser.get(relLinkCorrected).then(function (data) {
            resultListFull = data.data;
            vm.bigCurrentPage = 1;
            vm.bigTotalItems = data.data.length;
            updateList();
        }, function (err) {
            console.error(err);
        });
    }

    function revertStation(stationid, changeid) {
        console.log("revertStation:" + stationid + "  " + changeid);
        radiobrowser.get('/webservice/json/revert/' + stationid + '/' + changeid).then(function (data) {
            $state.go('lastchange');
            if (data.data.ok === "true") {
                alert("undelete ok");
            } else {
                alert("could not undelete station:" + data.data.message);
            }
        }, function (err) {
            console.log("error:" + err);
        });
    }

    function play(station) {
        // decode playlist
        radiobrowser.get("/webservice/v2/json/url/" + station.id).then(function (data) {
            var stationReal = data.data;
            if (stationReal.ok === "true") {
                var video = station.codec.indexOf(',') >= 0;
                audioplayer.play(stationReal.url, stationReal.name, parseInt(station.hls), video);
            }
        }, function (err) {
            console.log("error:" + err);
            alert("could not find station");
        });
    }

    function distinct(list) {
        var result = [];
        for (var i = 0; i < list.length; i++) {
            if (list[i].trim() === "") {
                continue;
            }
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

    vm.playlistPLS = relLinkCorrected.replace(/webservice\/json/, 'webservice/pls');
    vm.playlistM3U = relLinkCorrected.replace(/webservice\/json/, 'webservice/m3u');
    vm.playlistXSPF = relLinkCorrected.replace(/webservice\/json/, 'webservice/xspf');

    displayList();
});
