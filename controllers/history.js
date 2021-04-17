var app = angular.module('RadioBrowserApp');

app.controller('HistoryController', function (radiobrowser, $stateParams, $http) {
    var vm = this;

    vm.list_changes = [];
    vm.list_clicks = [];
    vm.list_checks = [];
    vm.station = null;
    vm.map_exact = false;

    var marker = null;
    var mymap = null;

    function show_map(latlng, exact){
        if (!mymap){
            vm.map_exact = exact;
            var bounds = L.latLngBounds(latlng, latlng);
            var zoom = 10;
            if (!exact){
                zoom = 5;
            }
            mymap = L.map('mapid_show', {
                dragging: false,
                maxBounds: bounds,
            }).setView(latlng, zoom);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png ', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18,
                tileSize: 256,
            }).addTo(mymap);
            if (exact){
                marker = L.marker(latlng).addTo(mymap);
            }
        }
    }

    if ($stateParams.id) {
        radiobrowser.get_station($stateParams.id).then(function (data) {
            vm.station = data;

            if (vm.station && vm.station.geo_lat && vm.station.geo_long){
                var latlng = L.latLng(vm.station.geo_lat, vm.station.geo_long);
                show_map(latlng, true);
                return null;
            }else{
                console.log("no exact information available");
                return $http.get('https://restcountries.eu/rest/v2/alpha/' + vm.station.countrycode);
            }
        }).then(function (countryinfo){
            if (countryinfo && countryinfo.data){
                console.log("got country info",countryinfo.data.latlng);
                var latlng = L.latLng(countryinfo.data.latlng);
                show_map(latlng, false);
            }
        });

        radiobrowser.get_changes($stateParams.id).then(function (data) {
            vm.list_changes = data;
            vm.list_changes.sort(listSorter);
            vm.list_changes = computeDiffs(vm.list_changes);
        });

        radiobrowser.get_clicks($stateParams.id, 86400).then(function (data) {
            vm.list_clicks = data;
            chart.reset();
            chart.data.datasets[0].data = clicks_to_buckets(vm.list_clicks);
            chart.update();
        });

        radiobrowser.get_checks($stateParams.id).then(function (data) {
            vm.list_checks = data.reverse();
        });
    }

    function clicks_to_buckets(list) {
        let buckets = [];
        let now_unix = Date.now() / 1000;

        for (var i = 0; i < 24; i++) {
            buckets[i] = 0;
        }

        for (var item of list) {
            var item_unix = item.clicktimestamp.getTime() / 1000;
            var bucket = Math.floor((now_unix - item_unix) / 3600);
            if (bucket < 24){
                buckets[bucket] += 1;
            }
        }
        return buckets.reverse();
    }

    var ctx = document.getElementById('myChart').getContext('2d');
    var labels = [];
    for (var i = 23; i > 0; i--) {
        labels.push("-" + i + "h");
    }
    labels.push("now");
    var chart = new Chart(ctx, {
        type: 'bar',

        data: {
            labels,
            datasets: [{
                label: 'Clicks in the last 24 hours',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgb(255, 99, 132)',
                data: []
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });


    function listSorter(item1, item2) {
        return item1.lastchangetime - item2.lastchangetime;
    }

    var keys = ["name", "url", "homepage", "favicon", "tags", "countrycode", "country", "state", "language"];

    function computeDiff(before, after) {
        var diff = {};
        before = before || {};
        after = after || {};
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (before[key] !== after[key]) {
                diff[key] = "'" + before[key] + "' -> '" + after[key] + "'";
            }
        }
        return JSON.stringify(diff, null, ' ');
    }

    function computeDiffs(list) {
        for (var i = 0; i < list.length; i++) {
            list[i].diff = computeDiff(list[i - 1], list[i]);
        }
        return list;
    }
});
