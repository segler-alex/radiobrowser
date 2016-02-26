var app = angular.module('RadioBrowserApp');
app.controller('MainController', function($scope, $http, $sce) {
  $scope.bigTotalItems = 0;
  $scope.bigCurrentPage = 1;
  $scope.itemsPerPage = 10;
  $scope.countryList = [];
  $scope.playerItem = null;
  $scope.audioVolume = 1;
  $scope.editStation = null;
  var audio = null;

  $http.get('http://www.radio-browser.info/webservice/json/stats').then(function(data) {
    $scope.stats = data.data;
  }, function(err) {
    console.log("error:" + err);
  });

  $scope.edit = function(station) {
    console.log(JSON.stringify(station));
    $scope.editStation = station;
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

  $scope.vote = function(stationid) {
    $http.get('http://www.radio-browser.info/webservice/json/vote/' + stationid).then(function(data) {
      replaceStations(data.data);
      $scope.updateList();
    }, function(err) {
      console.log("error:" + err);
    });
  }

  $scope.clearList = function() {
    $scope.resultListFull = [];
    $scope.bigCurrentPage = 1;
    $scope.bigTotalItems = 0;
    $scope.updateList();
  }

  $scope.displayCountries = function() {
    $http.get('http://www.radio-browser.info/webservice/json/countries').then(function(data) {
      $scope.countryList = data.data;
      $scope.clearList();
    }, function(err) {
      console.log("error:" + err);
    });
  }

  $scope.displayByCountry = function(country) {
    $http.get('http://www.radio-browser.info/webservice/json/stations/bycountry/' + country).then(function(data) {
      $scope.countryList = [];
      $scope.resultListFull = data.data;
      $scope.bigCurrentPage = 1;
      $scope.bigTotalItems = data.data.length;
      $scope.updateList();
    }, function(err) {
      console.log("error:" + err);
    });
  }

  $scope.displayTopClick = function() {
    $http.get('http://www.radio-browser.info/webservice/json/stations/topclick/100').then(function(data) {
      $scope.resultListFull = data.data;
      $scope.bigCurrentPage = 1;
      $scope.bigTotalItems = data.data.length;
      $scope.updateList();
    }, function(err) {
      console.log("error:" + err);
    });
  }

  $scope.displayTopVote = function() {
    $http.get('http://www.radio-browser.info/webservice/json/stations/topvote/100').then(function(data) {
      $scope.resultListFull = data.data;
      $scope.bigCurrentPage = 1;
      $scope.bigTotalItems = data.data.length;
      $scope.updateList();
    }, function(err) {
      console.log("error:" + err);
    });
  }

  $scope.play = function(id) {
    // decode playlist
    var decodeUrl = "http://www.radio-browser.info/webservice/json/url/" + id;
    $http.get(decodeUrl).then(function(data) {
      if (data.data.length > 0) {
        var station = data.data[0];
        $scope.playerItem = station;
        PlayAudioStream(data.data[0].url);
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
    $http.get('http://www.radio-browser.info/webservice/json/stations/' + term).then(function(data) {
      $scope.resultListFull = data.data;
      $scope.bigCurrentPage = 1;
      $scope.bigTotalItems = data.data.length;
      $scope.updateList();
    }, function(err) {
      console.log("error:" + err);
    });
  };

  $scope.updateList = function() {
    $scope.resultList = $scope.resultListFull.slice(($scope.bigCurrentPage - 1) * $scope.itemsPerPage, ($scope.bigCurrentPage) * $scope.itemsPerPage);
  }

  $scope.getCountries = function(term) {
    return $http.get('http://www.radio-browser.info/webservice/json/countries/' + term, {}).then(function(response) {
      var items = response.data.map(function(item) {
        return item.value;
      });
      return items.slice(0, 5);
    });
  };

  $scope.getStates = function(term) {
    return $http.get('http://www.radio-browser.info/webservice/json/states/' + term, {}).then(function(response) {
      return response.data.slice(0, 5);
    });
  };

  $scope.getLanguages = function(term) {
    return $http.get('http://www.radio-browser.info/webservice/json/languages/' + term, {}).then(function(response) {
      var items = response.data.map(function(item) {
        return item.value;
      });
      return items.slice(0, 5);
    });
  };
});
