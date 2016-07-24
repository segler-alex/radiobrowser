angular.module('RadioBrowserApp').factory('audioplayer', ['$http', function audioplayer($http) {
    var audioVolume = 1;
    var audio = null;
    var playerItem = null;

    function setVolume(volume) {
        if (audio) {
            audio.volume = volume;
        }
    }

    function stop() {
        if (audio) {
            playerItem = null;
            audio.pause();
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
            audio.volume = 1;
            audio.onplay = function() {
                console.log("play ok");
            };
            audio.onerror = function() {
                console.log("error on play");
                $scope.$apply(function() {
                    playerItem = null;
                    audio.pause();
                });
                alert("browser is not able to play station. please try with external player.");
            };
            audio.play();
        }
    }

    return {
        'play': play,
        'setVolume': setVolume,
        'stop': stop
    };
}]);
