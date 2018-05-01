angular.module('RadioBrowserApp').controller('ModalVideoInstanceCtrl', function ($scope, $uibModalInstance, video) {
    console.log("PARAM:" + JSON.stringify(video));
    $scope.result = video;
    
    var player = new Clappr.Player({parentId: "#player_clappr"});
    player.load(video, 'application/vnd.apple.mpegurl', true);

    $scope.ok = function () {
        $uibModalInstance.close();
    };
});
