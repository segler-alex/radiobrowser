var app = angular.module('RadioBrowserApp');

app.controller('MainController', function($scope, $http, $sce, $httpParamSerializerJQLike, $uibModal) {

    $scope.countryList = [];

    $scope.audioVolume = 1;

    $scope.tab = "home";

    $scope.edit = function(station) {
        console.log(JSON.stringify(station));
        $scope.setTab("editstation");
        $scope.editStation = station;
        $scope.updateSimiliar(station.name);
        $scope.updateImageList(station.homepage);
        if (station.tags.trim() === "") {
            $scope.editStation.tags_arr = [];
        } else {
            $scope.editStation.tags_arr = station.tags.split(',');
        }
    }

    function replaceStations(stationupdates) {
        for (var i = 0; i < stationupdates.length; i++) {
            var stationNew = stationupdates[i];
            replaceStation(stationNew);
        }
    }

    function replaceStation(stationNew) {
        for (var i = 0; i < $scope.resultListFull.length; i++) {
            var station = $scope.resultListFull[i];
            if (station.id === stationNew.id) {
                $scope.resultListFull.splice(i, 1, stationNew);
            }
        }
    }

    function getStationById(id) {
        for (var i = 0; i < $scope.resultListFull.length; i++) {
            var station = $scope.resultListFull[i];
            if (station.id === id) {
                return station;
            }
        }
        return null;
    }

    $scope.setTab = function(tab) {
        console.log("tab=" + tab);
        $scope.tab = tab;

        if (tab === "home") {
            $scope.clearList();
        }
        if (tab === "editstation") {
            $scope.clearList();
            $scope.editStation = {};
            $scope.editStation.homepage = "";
            $scope.editStation.favicon = "";
            $scope.editStation.country = "";
            $scope.editStation.language = "";
            $scope.editStation.tags = "";
            $scope.editStation.subcountry = "";
            $scope.editStation.tags_arr = [];
            $scope.similiarStations = [];
            $scope.imageList = [];
        }
        if (tab === "api") {
            $scope.clearList();
        }
        if (tab !== 'editstation') {
            $scope.editStation = null;
        }
    }

    $scope.clearList = function() {
        $scope.resultListFull = [];
        $scope.bigCurrentPage = 1;
        $scope.bigTotalItems = 0;
        $scope.updateList();
    }

    $scope.displayByCountry = function(country) {
        $http.get(serverAdress + '/webservice/json/stations/bycountryexact/' + encodeURIComponent(country)).then(function(data) {
            $scope.tab = "bycountry";
            $scope.countryList = [];
            $scope.resultListFull = data.data;
            $scope.bigCurrentPage = 1;
            $scope.bigTotalItems = data.data.length;
            $scope.updateList();
        }, function(err) {
            console.log("error:" + err);
        });
    }

    $scope.displayByState = function(state) {
        $http.get(serverAdress + '/webservice/json/stations/bystateexact/' + encodeURIComponent(state)).then(function(data) {
            $scope.countryList = [];
            $scope.resultListFull = data.data;
            $scope.bigCurrentPage = 1;
            $scope.bigTotalItems = data.data.length;
            $scope.updateList();
        }, function(err) {
            console.log("error:" + err);
        });
    }

    $scope.displayByLanguage = function(language) {
        $http.get(serverAdress + '/webservice/json/stations/bylanguageexact/' + encodeURIComponent(language)).then(function(data) {
            $scope.languageList = [];
            $scope.resultListFull = data.data;
            $scope.bigCurrentPage = 1;
            $scope.bigTotalItems = data.data.length;
            $scope.updateList();
        }, function(err) {
            console.log("error:" + err);
        });
    }

    $scope.displayByCodec = function(codec) {
        $http.get(serverAdress + '/webservice/json/stations/bycodecexact/' + encodeURIComponent(codec)).then(function(data) {
            $scope.tab = "bycodec";
            $scope.codecList = [];
            $scope.resultListFull = data.data;
            $scope.bigCurrentPage = 1;
            $scope.bigTotalItems = data.data.length;
            $scope.updateList();
        }, function(err) {
            console.log("error:" + err);
        });
    }

    $scope.displayByTag = function(tag) {
        $http.get(serverAdress + '/webservice/json/stations/bytagexact/' + encodeURIComponent(tag)).then(function(data) {
            $scope.tab = "bytag";
            $scope.tagList = [];
            $scope.tagListPopular = [];
            $scope.tagListNotPopular = [];
            $scope.resultListFull = data.data;
            $scope.bigCurrentPage = 1;
            $scope.bigTotalItems = data.data.length;
            $scope.updateList();
        }, function(err) {
            console.log("error:" + err);
        });
    }

    $scope.setVolume = function(volume) {
        if (audio) {
            audio.volume = volume;
        }
    }

    $scope.stopAudio = function() {
        if (audio) {
            $scope.playerItem = null;
            audio.pause();
        }
    }

    $scope.doSearch = function(term) {
        $http.get(serverAdress + '/webservice/json/stations/byname/' + encodeURIComponent(term)).then(function(data) {
            $scope.resultListFull = data.data;
            $scope.bigCurrentPage = 1;
            $scope.bigTotalItems = data.data.length;
            $scope.updateList();
            $scope.setTab('search');
        }, function(err) {
            console.log("error:" + err);
        });
    };

    $scope.getCodecs = function(term) {
        return $http.post(serverAdress + '/webservice/json/codecs/' + encodeURIComponent(term), {
            "order": "stationcount",
            "reverse": "true"
        }).then(function(response) {
            return response.data.slice(0, 5);
        });
    };

    $scope.getCountries = function(term) {
        return $http.post(serverAdress + '/webservice/json/countries/' + encodeURIComponent(term), {
            "order": "stationcount",
            "reverse": "true"
        }).then(function(response) {
            return response.data.slice(0, 5);
        });
    };

    $scope.getStates = function(term) {
        return $http.post(serverAdress + '/webservice/json/states/' + encodeURIComponent(term), {
            "order": "stationcount",
            "reverse": "true"
        }).then(function(response) {
            return response.data.slice(0, 5);
        });
    };

    $scope.getLanguages = function(term) {
        return $http.post(serverAdress + '/webservice/json/languages/' + encodeURIComponent(term), {
            "order": "stationcount",
            "reverse": "true"
        }).then(function(response) {
            return response.data.slice(0, 5);
        });
    };

    $scope.getTags = function(term) {
        return $http.post(serverAdress + '/webservice/json/tags/' + encodeURIComponent(term), {
            "order": "stationcount",
            "reverse": "true"
        }).then(function(response) {
            return response.data.slice(0, 5);
        });
    };



    $scope.getTagsArray = function(tags_string) {
        if (tags_string.trim() === "") {
            return [];
        }
        return tags_string.split(',');
    };
});
