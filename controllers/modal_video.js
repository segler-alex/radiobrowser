angular.module('RadioBrowserApp').controller('ModalVideoInstanceCtrl', function ($scope, $uibModalInstance, video) {
    console.log("PARAM:" + JSON.stringify(video));
    $scope.result = video;
    
    var player = new Clappr.Player({source: video, parentId: "#player"});

    $scope.ok = function () {
        $uibModalInstance.close();
    };
});
