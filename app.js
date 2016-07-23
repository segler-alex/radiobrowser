angular.module('RadioBrowserApp', ["ui.router", "ui.bootstrap", "ui.bootstrap-slider"])
.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('info', {
      url: "/",
      templateUrl: "partials/start.html"
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
    .state('list', {
      url: "/list",
      templateUrl: "partials/list.html"
    });
});
