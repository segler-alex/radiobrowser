angular.module('RadioBrowserApp').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {
    console.log("PARAM:" + JSON.stringify(items));
    $scope.result = items;

    $scope.ok = function () {
        $uibModalInstance.close();
    };
});
