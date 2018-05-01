angular.module('RadioBrowserApp').controller('ModalVideoInstanceCtrl', function ($scope, $uibModalInstance, video) {
    console.log("VIDEO:" + JSON.stringify(video));
    $scope.result = video;
    
    var player = new Clappr.Player({parentId: "#player_clappr"});
    player.load(video, 'application/vnd.apple.mpegurl', true);
    player.resize({height: 360, width: 640})

    $scope.ok = function () {
        $uibModalInstance.close();
    };
});
