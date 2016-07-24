var app = angular.module('RadioBrowserApp');

app.controller('MainController', function($scope, $http, $sce, $httpParamSerializerJQLike, $uibModal) {
  $scope.bigTotalItems = 0;
  $scope.bigCurrentPage = 1;
  $scope.countryList = [];
  $scope.playerItem = null;
  $scope.audioVolume = 1;
  var audio = null;
  $scope.tab = "home";
  // const serverAdress = "http://localhost";
  const serverAdress = "http://www.radio-browser.info";

  $scope.changeItemsPerPage = function(items) {
    $scope.itemsPerPage = items;
    $scope.updateList();
  }

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
    if (tab === "byclicks") {
    }
    if (tab === "broken") {
    }
    if (tab === "deleted") {
    }
    if (tab === "improve") {
    }
    if (tab === "byvotes") {
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
    }
    if (tab === "latelyplayed") {
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

  $scope.displayCountries = function() {
    $http.post(serverAdress+'/webservice/json/countries', {"order":"value"}).then(function(data) {
      $scope.countryList = data.data;
      $scope.clearList();
    }, function(err) {
      console.log("error:" + err);
    });
  }

  $scope.displayLanguages = function() {
    $http.post(serverAdress+'/webservice/json/languages', {"order":"value"}).then(function(data) {
      $scope.languageList = data.data;
      $scope.clearList();
    }, function(err) {
      console.log("error:" + err);
    });
  }

  $scope.displayCodecs = function() {
    $http.post(serverAdress+'/webservice/json/codecs', {"order":"value"}).then(function(data) {
      $scope.codecList = data.data;
      $scope.clearList();
    }, function(err) {
      console.log("error:" + err);
    });
  }

  $scope.displayTags = function() {
    $http.post(serverAdress+'/webservice/json/tags', {"order":"value"}).then(function(data) {
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

    $scope.play = function(id) {
    // decode playlist
    var decodeUrl = serverAdress + "/webservice/json/url/" + id;
    $http.get(decodeUrl).then(function(data) {
      if (data.data.length > 0){
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

  $scope.revertStation = function(stationid,changeid) {
    console.log("revertStation:"+stationid+"  "+changeid);
    $http.get(serverAdress+'/webservice/json/revert/'+stationid+'/'+changeid).then(function(data) {
      $scope.clearList();
      if (data.data.ok === "true"){
          alert("undelete ok");
      }else{
          alert("could not undelete station:"+data.data.message);
      }
      $scope.setTab("home");
    }, function(err) {
      console.log("error:" + err);
    });
  };

  $scope.getTagsArray = function(tags_string) {
    if (tags_string.trim() === "") {
      return [];
    }
    return tags_string.split(',');
  };
});
