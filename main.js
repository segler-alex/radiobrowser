var app = angular.module('RadioBrowserApp');

app.directive('ngEnter', function() {
  return function(scope, element, attrs) {
    element.bind("keydown keypress", function(event) {
      if (event.which === 13) {
        scope.$apply(function() {
          scope.$eval(attrs.ngEnter);
        });

        event.preventDefault();
      }
    });
  };
});

app.controller('MainController', function($scope, $http, $sce, $httpParamSerializerJQLike) {
  $scope.bigTotalItems = 0;
  $scope.bigCurrentPage = 1;
  $scope.itemsPerPage = 20;
  $scope.countryList = [];
  $scope.playerItem = null;
  $scope.audioVolume = 1;
  $scope.editStation = null;
  var audio = null;
  $scope.tab = "home";
  const serverAdress = "https://www.radio-browser.info";

  $http.get(serverAdress+'/webservice/json/stats').then(function(data) {
    $scope.stats = data.data;
  }, function(err) {
    console.log("error:" + err);
  });

  $scope.changeItemsPerPage = function(items) {
    $scope.itemsPerPage = items;
    $scope.updateList();
  }

  $scope.addTag = function(tag) {
    $scope.editStation.tags_arr.splice(0, 0, tag);
    $scope.editStation.tag = "";
  }

  $scope.removeTag = function(tag) {
    var index = $scope.editStation.tags_arr.indexOf(tag);
    if (index !== -1) {
      $scope.editStation.tags_arr.splice(index, 1);
    }
  }

  $scope.edit = function(station) {
    console.log(JSON.stringify(station));
    $scope.setTab("editstation");
    $scope.editStation = station;
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
    if (tab === "byclicks") {
      $scope.displayTopClick();
    }
    if (tab === "broken") {
      $scope.displayBroken();
    }
    if (tab === "improve") {
      $scope.displayImprove();
    }
    if (tab === "byvotes") {
      $scope.displayTopVote();
    }
    if (tab === "bycountry") {
      $scope.displayCountries();
    }
    if (tab === "bylanguage") {
      $scope.displayLanguages();
    }
    if (tab === "bycodec") {
      $scope.displayCodecs();
    }
    if (tab === "bytag") {
      $scope.displayTags();
    }
    if (tab === "latelychanged") {
      $scope.displayLastChanged();
    }
    if (tab === "latelyplayed") {
      $scope.displayLastPlayed();
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
    }
    if (tab === "api") {
      $scope.clearList();
    }
    if (tab !== 'editstation') {
      $scope.editStation = null;
    }
  }

  $scope.sendStation = function() {
    if ($scope.editStation !== null) {
      console.log("---" + $scope.editStation.id);
      $scope.editStation.tags = $scope.editStation.tags_arr.join(',');
      if (undefined === $scope.editStation.id) {
        url = serverAdress+'/webservice/add';
      } else {
        url = serverAdress+'/webservice/edit';
        $scope.editStation.stationid = $scope.editStation.id;
      }
      $http({
        url: url,
        method: 'POST',
        data: $httpParamSerializerJQLike($scope.editStation),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).success(function(response) {
        console.log("ok:" + response);
        $scope.editStation = null;
        $scope.clearList();
      });
    }
  }

  $scope.vote = function(stationid) {
    $http.get(serverAdress+'/webservice/json/vote/' + stationid).then(function(data) {
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
    $http.get(serverAdress+'/webservice/json/countries').then(function(data) {
      $scope.countryList = data.data;
      $scope.clearList();
    }, function(err) {
      console.log("error:" + err);
    });
  }

  $scope.displayLanguages = function() {
    $http.get(serverAdress+'/webservice/json/languages').then(function(data) {
      $scope.languageList = data.data;
      $scope.clearList();
    }, function(err) {
      console.log("error:" + err);
    });
  }

  $scope.displayCodecs = function() {
    $http.get(serverAdress+'/webservice/json/codecs').then(function(data) {
      $scope.codecList = data.data;
      $scope.clearList();
    }, function(err) {
      console.log("error:" + err);
    });
  }

  $scope.displayTags = function() {
    $http.get(serverAdress+'/webservice/json/tags').then(function(data) {
      $scope.tagList = data.data;
      $scope.tagListVeryPopular = [];
      $scope.tagListPopular = [];
      $scope.tagListNotPopular = [];

      for (var i = 0; i < $scope.tagList.length; i++) {
        var tag = $scope.tagList[i];
        if (tag.stationcount >= 10) {
          $scope.tagListVeryPopular.push(tag);
        } else if (tag.stationcount > 1) {
          $scope.tagListPopular.push(tag);
        } else {
          $scope.tagListNotPopular.push(tag);
        }
      }

      $scope.clearList();
    }, function(err) {
      console.log("error:" + err);
    });
  }

  $scope.displayByCountry = function(country) {
    $http.get(serverAdress+'/webservice/json/stations/bycountryexact/' + encodeURIComponent(country)).then(function(data) {
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
    $http.get(serverAdress+'/webservice/json/stations/bystateexact/' + encodeURIComponent(state)).then(function(data) {
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
    $http.get(serverAdress+'/webservice/json/stations/bylanguageexact/' + encodeURIComponent(language)).then(function(data) {
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
    $http.get(serverAdress+'/webservice/json/stations/bycodecexact/' + encodeURIComponent(codec)).then(function(data) {
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
    $http.get(serverAdress+'/webservice/json/stations/bytagexact/' + encodeURIComponent(tag)).then(function(data) {
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

  $scope.displayTopClick = function() {
    $http.get(serverAdress+'/webservice/json/stations/topclick/100').then(function(data) {
      $scope.resultListFull = data.data;
      $scope.bigCurrentPage = 1;
      $scope.bigTotalItems = data.data.length;
      $scope.updateList();
    }, function(err) {
      console.log("error:" + err);
    });
  }

  $scope.displayBroken = function() {
    $http.get(serverAdress+'/webservice/json/stations/broken/10').then(function(data) {
      $scope.resultListFull = data.data;
      $scope.bigCurrentPage = 1;
      $scope.bigTotalItems = data.data.length;
      $scope.updateList();
    }, function(err) {
      console.log("error:" + err);
    });
  }

  $scope.displayImprove = function() {
    $http.get(serverAdress+'/webservice/json/stations/improvable/10').then(function(data) {
      $scope.resultListFull = data.data;
      $scope.bigCurrentPage = 1;
      $scope.bigTotalItems = data.data.length;
      $scope.updateList();
    }, function(err) {
      console.log("error:" + err);
    });
  }

  $scope.displayTopVote = function() {
    $http.get(serverAdress+'/webservice/json/stations/topvote/100').then(function(data) {
      $scope.resultListFull = data.data;
      $scope.bigCurrentPage = 1;
      $scope.bigTotalItems = data.data.length;
      $scope.updateList();
    }, function(err) {
      console.log("error:" + err);
    });
  }

  $scope.displayLastChanged = function() {
    $http.get(serverAdress+'/webservice/json/stations/lastchange/100').then(function(data) {
      $scope.resultListFull = data.data;
      $scope.bigCurrentPage = 1;
      $scope.bigTotalItems = data.data.length;
      $scope.updateList();
    }, function(err) {
      console.log("error:" + err);
    });
  }

  $scope.displayLastPlayed = function() {
    $http.get(serverAdress+'/webservice/json/stations/lastclick/100').then(function(data) {
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
    var decodeUrl = serverAdress + "/webservice/json/url/" + id;
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
    $http.get(serverAdress+'/webservice/json/stations/byname/' + encodeURIComponent(term)).then(function(data) {
      $scope.resultListFull = data.data;
      $scope.bigCurrentPage = 1;
      $scope.bigTotalItems = data.data.length;
      $scope.updateList();
      $scope.setTab('search');
    }, function(err) {
      console.log("error:" + err);
    });
  };

  $scope.updateList = function() {
    $scope.resultList = $scope.resultListFull.slice(($scope.bigCurrentPage - 1) * $scope.itemsPerPage, ($scope.bigCurrentPage) * $scope.itemsPerPage);
  }

  $scope.getCodecs = function(term) {
    return $http.post(serverAdress+'/webservice/json/codecs/' + encodeURIComponent(term), {"order":"stationcount", "reverse":"true"}).then(function(response) {
      return response.data.slice(0, 5);
    });
  };

  $scope.getCountries = function(term) {
    return $http.post(serverAdress+'/webservice/json/countries/' + encodeURIComponent(term), {"order":"stationcount", "reverse":"true"}).then(function(response) {
      return response.data.slice(0, 5);
    });
  };

  $scope.getStates = function(term) {
    return $http.post(serverAdress+'/webservice/json/states/' + encodeURIComponent(term), {"order":"stationcount", "reverse":"true"}).then(function(response) {
      return response.data.slice(0, 5);
    });
  };

  $scope.getLanguages = function(term) {
    return $http.post(serverAdress+'/webservice/json/languages/' + encodeURIComponent(term), {"order":"stationcount", "reverse":"true"}).then(function(response) {
      return response.data.slice(0, 5);
    });
  };

  $scope.getTags = function(term) {
    return $http.post(serverAdress+'/webservice/json/tags/' + encodeURIComponent(term), {"order":"stationcount", "reverse":"true"}).then(function(response) {
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
