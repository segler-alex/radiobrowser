angular.module('RadioBrowserApp').controller('ModalVideoInstanceCtrl', function ($scope, $uibModalInstance, video) {
    console.log("VIDEO:" + JSON.stringify(video));
    $scope.result = video;
    var player = null;

    function play(){
        player = new Clappr.Player({parentId: "#player_clappr", autoPlay: true, source: video});
        //player.resize({height: 360, width: 640});
    }

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    play();
});
