var app = angular.module('RadioBrowserApp');

app.controller('TagController', function (radiobrowser, relLink) {
    var vm = this;

    vm.tags = [];

    function displayTags() {
        radiobrowser.post(relLink.value, {
            "order": "value",
        }).then(function (data) {
            vm.tagList = data.data;
            vm.tagListVeryPopular = [];
            vm.tagListPopular = [];
            vm.tagListNotPopular = [];

            for (var i = 0; i < vm.tagList.length; i++) {
                var tag = vm.tagList[i];
                if (tag.stationcount >= 10) {
                    vm.tagListVeryPopular.push(tag);
                } else if (tag.stationcount > 1) {
                    vm.tagListPopular.push(tag);
                } else {
                    vm.tagListNotPopular.push(tag);
                }
            }
        }, function (err) {
            console.log("error:" + err);
        });
    }

    displayTags();
});
