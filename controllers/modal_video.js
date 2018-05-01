angular.module('RadioBrowserApp').controller('ModalVideoInstanceCtrl', function ($scope, $uibModalInstance) {
    $scope.result = video;

    $scope.ok = function () {
        $uibModalInstance.close();
    };
});
