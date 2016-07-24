angular.module('RadioBrowserApp', ["ui.router", "ui.bootstrap", "ui.bootstrap-slider"])
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('info', {
                url: "/",
                templateUrl: "partials/info.html"
            })
            .state('countries', {
                url: "/countries",
                templateUrl: "partials/countries.html"
            })
            .state('languages', {
                url: "/languages",
                templateUrl: "partials/languages.html"
            })
            .state('tags', {
                url: "/tags",
                templateUrl: "partials/tags.html"
            })
            .state('codecs', {
                url: "/codecs",
                templateUrl: "partials/codecs.html"
            })
            .state('topclick', {
                url: "/topclick",
                templateUrl: "partials/list.html",
                resolve: {
                    relLink: function() {
                        return {
                            value: "/webservice/json/stations/topclick/100"
                        };
                    }
                },
                controller: "ListController as list"
            })
            .state('topvote', {
                url: "/topvote",
                templateUrl: "partials/list.html",
                resolve: {
                    relLink: function() {
                        return {
                            value: "/webservice/json/stations/topvote/100"
                        };
                    }
                },
                controller: "ListController as list"
            })
            .state('broken', {
                url: "/broken",
                templateUrl: "partials/list.html",
                resolve: {
                    relLink: function() {
                        return {
                            value: "/webservice/json/stations/broken/100"
                        };
                    }
                },
                controller: "ListController as list"
            })
            .state('deleted', {
                url: "/deleted",
                templateUrl: "partials/list.html",
                resolve: {
                    relLink: function() {
                        return {
                            value: "/webservice/json/stations/deleted"
                        };
                    }
                },
                controller: "ListController as list"
            })
            .state('improve', {
                url: "/improve",
                templateUrl: "partials/list.html",
                resolve: {
                    relLink: function() {
                        return {
                            value: "/webservice/json/stations/improvable/10"
                        };
                    }
                },
                controller: "ListController as list"
            })
            .state('lastchange', {
                url: "/lastchange",
                templateUrl: "partials/list.html",
                resolve: {
                    relLink: function() {
                        return {
                            value: "/webservice/json/stations/lastchange/100"
                        };
                    }
                },
                controller: "ListController as list"
            })
            .state('lastclick', {
                url: "/lastclick",
                templateUrl: "partials/list.html",
                resolve: {
                    relLink: function() {
                        return {
                            value: "/webservice/json/stations/lastclick/100"
                        };
                    }
                },
                controller: "ListController as list"
            });
    })
    .directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    });
