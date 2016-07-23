angular.module('RadioBrowserApp', ["ui.router", "ui.bootstrap", "ui.bootstrap-slider"])
.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('info', {
      url: "/",
      templateUrl: "partials/start.html"
    })
    .state('list', {
      url: "/list",
      templateUrl: "partials/list.html"
    });
});
