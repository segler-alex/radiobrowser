var app = angular.module('RadioBrowserApp');

app.controller('CategoryController', function (radiobrowser, relLink) {
    var vm = this;

    vm.categories = [];

    function displayCategories() {
        radiobrowser.post(relLink.value, {
            "order": "stationcount",
            "reverse": true,
        }).then(function (data) {
            vm.categories = data.data;
        }, function (err) {
            console.log("error:" + err);
        });
    }

    displayCategories();
});
