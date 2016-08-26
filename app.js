angular.module('RadioBrowserApp', ["ui.router", "ui.bootstrap", "ui.bootstrap-slider"])
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('info', {
                url: "/",
                templateUrl: "partials/info.html"
            })
            .state('faq', {
                url: "/faq",
                templateUrl: "partials/faq.html"
            })
            .state('add', {
                url: "/add",
                templateUrl: "partials/edit.html",
                controller: "EditController as edit"
            })
            .state('edit', {
                url: "/edit/:id",
                templateUrl: "partials/edit.html",
                controller: "EditController as edit"
            })

        // display categories
        .state('countries', {
                url: "/countries",
                templateUrl: "partials/countries.html",
                resolve: {
                    relLink: function() {
                        return {
                            value: "/webservice/json/countries"
                        };
                    }
                },
                controller: "CategoryController as category"
            })
            .state('languages', {
                url: "/languages",
                templateUrl: "partials/languages.html",
                resolve: {
                    relLink: function() {
                        return {
                            value: "/webservice/json/languages"
                        };
                    }
                },
                controller: "CategoryController as category"
            })
            .state('tags', {
                url: "/tags",
                templateUrl: "partials/tags.html",
                resolve: {
                    relLink: function() {
                        return {
                            value: "/webservice/json/tags"
                        };
                    }
                },
                controller: "TagController as tags"
            })
            .state('codecs', {
                url: "/codecs",
                templateUrl: "partials/codecs.html",
                resolve: {
                    relLink: function() {
                        return {
                            value: "/webservice/json/codecs"
                        };
                    }
                },
                controller: "CategoryController as category"
            })

        // display stations by category
        .state('byname', {
                url: "/byname/:name",
                templateUrl: "partials/list.html",
                resolve: {
                    relLink: function() {
                        return {
                            value: ""
                        };
                    }
                },
                controller: "ListController as list"
            })
            .state('bylanguage', {
                url: "/bylanguage/:language",
                templateUrl: "partials/list.html",
                resolve: {
                    relLink: function() {
                        return {
                            value: ""
                        };
                    }
                },
                controller: "ListController as list"
            })
            .state('bycountry', {
                url: "/bycountry/:country",
                templateUrl: "partials/list.html",
                resolve: {
                    relLink: function() {
                        return {
                            value: ""
                        };
                    }
                },
                controller: "ListController as list"
            })
            .state('bytag', {
                url: "/bytag/:tag",
                templateUrl: "partials/list.html",
                resolve: {
                    relLink: function() {
                        return {
                            value: ""
                        };
                    }
                },
                controller: "ListController as list"
            })
            .state('bycodec', {
                url: "/bycodec/:codec",
                templateUrl: "partials/list.html",
                resolve: {
                    relLink: function() {
                        return {
                            value: ""
                        };
                    }
                },
                controller: "ListController as list"
            })
            .state('bystate', {
                url: "/bystate/:state",
                templateUrl: "partials/list.html",
                resolve: {
                    relLink: function() {
                        return {
                            value: ""
                        };
                    }
                },
                controller: "ListController as list"
            })

        // display specialized lists of stations
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
