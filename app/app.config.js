'use strict';

angular
  .module('earthdawnApp')
  .config([
    '$locationProvider', 
    '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider
        .when('/talents', {template: '<talent-list></talent-list>'})
        .when('/talents/edit/:talentId', {template: '<talent-editor></talent-editor>'})
        .when('/spells', {template: '<spell-list></spell-list>'})
        .when('/sign-in', {template: '<sign-in></sign-in>'})
        .when('/roller', {template: '<roller></roller>'})
        .otherwise('/talents');
    }
]);