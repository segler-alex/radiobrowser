var app = angular.module('RadioBrowserApp');

app.controller('PlayerController', function(audioplayer) {
    var vm = this;

    vm.playerStatus = audioplayer.getStatusObject();
    vm.stop = audioplayer.stop;
    vm.setVolume = audioplayer.setVolume;
});
