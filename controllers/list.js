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
        relLinkCorrected = '/json/stations/search?' + items.join('&');
    } else if ($stateParams.tag) {
        relLinkCorrected = '/json/stations/bytagexact/' + encodeURIComponent($stateParams.tag);
    } else if ($stateParams.state) {
        relLinkCorrected = '/json/stations/bystateexact/' + encodeURIComponent($stateParams.state);
    } else if ($stateParams.country) {
        relLinkCorrected = '/json/stations/bycountryexact/' + encodeURIComponent($stateParams.country);
    } else if ($stateParams.language) {
        relLinkCorrected = '/json/stations/bylanguageexact/' + encodeURIComponent($stateParams.language);
    } else if ($stateParams.codec) {
        relLinkCorrected = '/json/stations/bycodecexact/' + encodeURIComponent($stateParams.codec);
    } else if ($stateParams.name) {
        relLinkCorrected = '/json/stations/byname/' + encodeURIComponent($stateParams.name);
    }

    function changeItemsPerPage(items) {
        vm.itemsPerPage = items;
        updateList();
    }

    function updateList() {
        vm.resultList = resultListFull.slice((vm.bigCurrentPage - 1) * vm.itemsPerPage, (vm.bigCurrentPage) * vm.itemsPerPage);
    }

    function vote(station) {
        radiobrowser.get('/json/vote/' + station.stationuuid).then(function (data) {
            if (data.data.ok === true) {
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

    function play(station) {
        // decode playlist
        radiobrowser.get("/json/url/" + station.stationuuid).then(function (data) {
            var stationReal = data.data;
            if (stationReal.ok === true) {
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

    vm.vote = vote;
    vm.play = play;
    vm.changeItemsPerPage = changeItemsPerPage;
    vm.getTagsArray = getTagsArray;
    vm.updateList = updateList;

    var SERVER = "https://de1.api.radio-browser.info";
    
    vm.playlistPLS = SERVER + relLinkCorrected.replace(/json/, 'pls');
    vm.playlistM3U = SERVER + relLinkCorrected.replace(/json/, 'm3u');
    vm.playlistXSPF = SERVER + relLinkCorrected.replace(/json/, 'xspf');
    vm.playlistCSV = SERVER + relLinkCorrected.replace(/json/, 'csv');

    displayList();
});
