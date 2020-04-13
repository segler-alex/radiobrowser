var app = angular.module('RadioBrowserApp');

app.controller('EditController', function (radiobrowser, $uibModal, $stateParams, $state, $http) {
    var vm = this;

    if ($stateParams.id) {
        console.log("edit station:" + $stateParams.id);
        radiobrowser.get('/json/stations/byid/' + $stateParams.id).then(function (data) {
            if (data.data.length > 0) {
                vm.editStation = data.data[0];
                vm.editStation.tags_arr = vm.editStation.tags.split(',');
                console.log("received station:" + JSON.stringify(vm.editStation));

                //updateImageList(vm.editStation.favicon);
                updateSimiliar(vm.editStation.name);
            }
        });
    }

    function deleteStation(stationid) {
        var r = confirm("Really delete station?");
        if (r == true) {
            console.log("deletestation:" + stationid);
            radiobrowser.get('/json/delete/' + stationid).then(function (data) {
                vm.editStation = null;
                if (data.data.ok === "true") {
                    alert("delete ok: " + stationid);
                } else {
                    alert("could not delete station:" + data.data.message);
                }
            }, function (err) {
                console.log("error:" + err);
            });
            $state.go('info');
        }
    }

    function open(sth) {
        console.log("open");
        var modalInstance = $uibModal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'templates/sendModal.html',
            controller: 'ModalInstanceCtrl',
            resolve: {
                items: function () {
                    return sth;
                }
            }
        });

        modalInstance.result.then(function () {
            console.log("closed");
        }, function () {
            console.log("dismissed");
        });
    }

    /*
    function updateImageList(url) {
        radiobrowser.post('/json/extract_images', {
            'url': url
        }).then(function (data) {
            vm.imageList = data.data;
            if (data.data.ok === "true") {
                vm.imageList = data.data.images;
            } else {
                vm.imageList = [];
            }
        }, function (err) {
            console.log("error:" + JSON.stringify(err));
        });
    }
    */

    function updateSimiliar(name) {
        radiobrowser.post('/json/stations/byname/' + name, {
            limit: 20
        }).then(function (data) {
            if (vm.editStation.id) {
                var stations = [];
                for (var i = 0; i < data.data.length; i++) {
                    var station = data.data[i];
                    if (station.id !== vm.editStation.id) {
                        stations.push(station);
                    }
                }
                vm.similiarStations = stations;
            } else {
                vm.similiarStations = data.data;
            }
        }, function (err) {
            console.log("error:" + err);
        });
    }

    function addTag(tag) {
        if (!vm.editStation.tags_arr) {
            vm.editStation.tags_arr = [];
        }
        tag = (""+tag).trim();
        if (tag !== ""){
            vm.editStation.tags_arr.splice(0, 0, tag);
            vm.editStation.tag = "";
        }
    }

    function removeTag(tag) {
        var index = vm.editStation.tags_arr.indexOf(tag);
        if (index !== -1) {
            vm.editStation.tags_arr.splice(index, 1);
        }
    }

    function addLanguage(language) {
        if (!vm.editStation.languages_arr) {
            vm.editStation.languages_arr = [];
        }
        language = (""+language).trim();
        if (language !== ""){
            vm.editStation.languages_arr.splice(0, 0, language);
            vm.editStation.language = "";
        }
    }

    function removeLanguage(language) {
        var index = vm.editStation.languages_arr.indexOf(language);
        if (index !== -1) {
            vm.editStation.languages_arr.splice(index, 1);
        }
    }

    function sendStation() {
        if (vm.editStation !== null) {
            vm.activeSending = true;
            console.log("---" + vm.editStation.id);
            vm.editStation.tags = "";
            if (vm.editStation.tags_arr) {
                vm.editStation.tags = vm.editStation.tags_arr.join(',');
            }
            if (vm.editStation.languages_arr) {
                vm.editStation.language = vm.editStation.languages_arr.join(',');
            }
            if (vm.editStation.country){
                vm.editStation.countrycode = vm.editStation.country.alpha2Code;
                vm.editStation.country = vm.editStation.country.name;
            }
            if (undefined === vm.editStation.id) {
                url = '/json/add';
            } else {
                url = '/json/edit/' + vm.editStation.id;
                vm.editStation.stationid = vm.editStation.id;
            }
            radiobrowser.post(url, vm.editStation).then(function (response) {
                console.log("ok:" + JSON.stringify(response));
                vm.editStation = null;
                vm.activeSending = false;
                vm.similiarStations = [];
                vm.imageList = [];
                open(response.data);
                $state.go("lastchange");
            }, function (err) {
                vm.activeSending = false;
                console.log("error:" + err);
            });
        }
    }

    function getCountries(term) {
        return $http.get('http://restcountries.eu/rest/v2/name/' + encodeURIComponent(term)).then(function (response) {
            return response.data.slice(0, 5);
        });
        /*
        return radiobrowser.post('/json/countries/' + encodeURIComponent(term), {
            "order": "stationcount",
            "reverse": "true"
        }).then(function (response) {
            return response.data.slice(0, 5);
        });
        */
    }

    function getStates(term) {
        return radiobrowser.post('/json/states/' + encodeURIComponent(term), {
            "order": "stationcount",
            "reverse": "true"
        }).then(function (response) {
            return response.data.slice(0, 5);
        });
    }

    function getLanguages(term) {
        return radiobrowser.post('/json/languages/' + encodeURIComponent(term), {
            "order": "stationcount",
            "reverse": "true"
        }).then(function (response) {
            return response.data.slice(0, 5);
        });
    }

    function getTags(term) {
        return radiobrowser.post('/json/tags/' + encodeURIComponent(term.toLowerCase()), {
            "order": "stationcount",
            "reverse": "true"
        }).then(function (response) {
            return response.data.slice(0, 5);
        });
    }

    vm.editStation = null;
    vm.activeSending = false;
    vm.similiarStations = [];
    vm.imageList = [];
    vm.editStation = {};

    vm.open = open;
    //vm.updateImageList = updateImageList;
    vm.updateSimiliar = updateSimiliar;
    vm.addTag = addTag;
    vm.removeTag = removeTag;
    vm.addLanguage = addLanguage;
    vm.removeLanguage = removeLanguage;
    vm.deleteStation = deleteStation;
    vm.sendStation = sendStation;

    vm.getCountries = getCountries;
    vm.getStates = getStates;
    vm.getLanguages = getLanguages;
    vm.getTags = getTags;
});
