var app = angular.module('RadioBrowserApp');

app.controller('EditController', function(radiobrowser, $uibModal) {
    var vm = this;

    vm.deleteStation = function(stationid) {
        console.log("deletestation:" + stationid);
        $http.get(serverAdress + '/webservice/json/delete/' + stationid).then(function(data) {
            $scope.editStation = null;
            $scope.clearList();
            if (data.data.ok === "true") {
                alert("delete ok");
            } else {
                alert("could not delete station:" + data.data.message);
            }
        }, function(err) {
            console.log("error:" + err);
        });
    };

    function open(sth) {
        console.log("open");
        var modalInstance = $uibModal.open({
            animation: vm.animationsEnabled,
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            resolve: {
                items: function() {
                    return sth;
                }
            }
        });

        modalInstance.result.then(function() {
            console.log("closed");
        }, function() {
            console.log("dismissed");
        });
    };

    function updateImageList(url) {
        radiobrowser.post('/webservice/json/extract_images', {
            'url': url
        }).then(function(data) {
            vm.imageList = data.data;
            if (data.data.ok === "true") {
                vm.imageList = data.data.images;
            } else {
                vm.imageList = [];
            }
        }, function(err) {
            console.log("error:" + JSON.stringify(err));
        });
    }

    function updateSimiliar(name) {
        radiobrowser.post('/webservice/json/stations/byname/' + name, {
            limit: 20
        }).then(function(data) {
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
        }, function(err) {
            console.log("error:" + err);
        });
    }

    function addTag(tag) {
        vm.editStation.tags_arr.splice(0, 0, tag);
        vm.editStation.tag = "";
    }

    function removeTag(tag) {
        var index = vm.editStation.tags_arr.indexOf(tag);
        if (index !== -1) {
            vm.editStation.tags_arr.splice(index, 1);
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
            if (undefined === vm.editStation.id) {
                url = '/webservice/json/add';
            } else {
                url = '/webservice/json/edit/' + vm.editStation.id;
                vm.editStation.stationid = vm.editStation.id;
            }
            radiobrowser.post(url, vm.editStation).then(function(response) {
                console.log("ok:" + JSON.stringify(response));
                vm.editStation = null;
                vm.clearList();
                vm.activeSending = false;
                vm.similiarStations = [];
                vm.imageList = [];
                vm.open(response);
            }, function(err) {
                console.log("error:" + err);
            });
        }
    }

    function getCodecs(term) {
        return $http.post(serverAdress + '/webservice/json/codecs/' + encodeURIComponent(term), {
            "order": "stationcount",
            "reverse": "true"
        }).then(function(response) {
            return response.data.slice(0, 5);
        });
    };

    function getCountries(term) {
        return $http.post(serverAdress + '/webservice/json/countries/' + encodeURIComponent(term), {
            "order": "stationcount",
            "reverse": "true"
        }).then(function(response) {
            return response.data.slice(0, 5);
        });
    };

    function getStates(term) {
        return $http.post(serverAdress + '/webservice/json/states/' + encodeURIComponent(term), {
            "order": "stationcount",
            "reverse": "true"
        }).then(function(response) {
            return response.data.slice(0, 5);
        });
    };

    function getLanguages(term) {
        return $http.post(serverAdress + '/webservice/json/languages/' + encodeURIComponent(term), {
            "order": "stationcount",
            "reverse": "true"
        }).then(function(response) {
            return response.data.slice(0, 5);
        });
    };

    function getTags(term) {
        return $http.post(serverAdress + '/webservice/json/tags/' + encodeURIComponent(term), {
            "order": "stationcount",
            "reverse": "true"
        }).then(function(response) {
            return response.data.slice(0, 5);
        });
    };

    vm.editStation = null;
    vm.activeSending = false;
    vm.similiarStations = [];
    vm.imageList = [];

    vm.open = open;
    vm.updateImageList = updateImageList;
    vm.updateSimiliar = updateSimiliar;
});
