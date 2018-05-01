angular.module('RadioBrowserApp').factory('audioplayer', ['$http', '$uibModal', function audioplayer($http, $uibModal) {
    var audioVolume = 1;
    var audio = null;
    var playerItem = null;
    var statusObject = {};
    var hlsObject = null;
    var video = null;

    function setVolume(volume) {
        if (audio) {
            audio.volume = volume;
            audioVolume = volume;
            updateStatus();
        }
        if (video) {
            video.volume = volume;
            audioVolume = volume;
            updateStatus();
        }
    }

    function stop() {
        console.log("stop();")
        if (audio) {
            playerItem = null;
            audio.pause();
            updateStatus();
        }
        if (hlsObject) {
            playerItem = null;
            hlsObject.destroy();
            hlsObject = null;
            updateStatus();
        }
    }

    function play(url, name, hls, video) {
        if (!video){
            playerItem = {
                'name': name,
                'hls': hls,
                'video': video
            };
        }
        console.log(JSON.stringify(playerItem));
        if (hls) {
            if (video){
                console.log("open");
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/video.html',
                    controller: 'ModalVideoInstanceCtrl',
                    resolve: {
                        video: function() {
                            return url;
                        }
                    }
                });
        
                modalInstance.result.then(function () {
                    console.log("closed");
                    stop();
                }, function () {
                    console.log("dismissed");
                    stop();
                });
            }else if (Hls.isSupported()) {
                if (!hlsObject) {
                    video = document.getElementById('video');
                    hlsObject = new Hls();
                    // bind them together
                    hlsObject.attachMedia(video);
                    // MEDIA_ATTACHED event is fired by hls object once MediaSource is ready
                    hlsObject.on(Hls.Events.MEDIA_ATTACHED, function () {
                        console.log("video and hls.js are now bound together !");
                        hlsObject.loadSource(url);
                        hlsObject.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                            console.log("manifest loaded, found " + data.levels.length + " quality level");
                            video.play();
                        });
                    });
                }
            }
        } else {
            if (audio !== null) {
                audio.src = url;
                audio.play();
            } else {
                audio = new Audio(url);
                audio.volume = audioVolume;
                audio.onplay = function () {
                    console.log("play ok");
                };
                audio.onerror = function (err) {
                    console.log("error on play");
                    console.error(err);
                    
                    if (!audio.src.endsWith(";")){
                        setTimeout(function(){
                            audio.pause();
                            audio.src = url + "/;";
                            audio.play();
                        },1);
                    }else{
                        setTimeout(function(){
                            stop();
                            alert("browser is not able to play station. please try with external player.");
                        },1);
                    }
                };
                audio.play();
            }
        }
        updateStatus();
    }

    function updateStatus() {
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
