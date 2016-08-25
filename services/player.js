angular.module('RadioBrowserApp').factory('audioplayer', ['$http', function audioplayer($http) {
    var audioVolume = 1;
    var audio = null;
    var playerItem = null;
    var statusObject = {};

    function setVolume(volume) {
        if (audio) {
            audio.volume = volume;
            audioVolume = volume;
            updateStatus();
        }
    }

    function stop() {
        if (audio) {
            playerItem = null;
            audio.pause();
            updateStatus();
        }
    }

    function play(url, name) {
        playerItem = {
            'name': name
        };

        if (audio !== null) {
            audio.src = url;
            audio.play();
        } else {
            audio = new Audio(url);
            audio.volume = audioVolume;
            audio.onplay = function() {
                console.log("play ok");
            };
            audio.onerror = function() {
                console.log("error on play");
                playerItem = null;
                audio.pause();
                alert("browser is not able to play station. please try with external player.");
            };
            audio.play();
        }
        updateStatus();
    }

    function updateStatus(){
      statusObject.volume = audioVolume;
      statusObject.playerItem = playerItem;
    }

    function getStatusObject() {
        return statusObject;
    }

    function getIsActive() {
        return playerItem !== null;
    }

    return {
        'play': play,
        'setVolume': setVolume,
        'stop': stop,
        'getIsActive': getIsActive,
        'getStatusObject': getStatusObject
    };
}]);
