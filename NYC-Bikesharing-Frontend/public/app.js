
'use strict';
var webApp = angular.module('webApp',[
    'ui.router',
    'APIFetchController',
    'webApp.services'

]) .config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider ) {
        $urlRouterProvider.otherwise("/");
        $stateProvider

            .state("dashboard",{
                url : "/",
                templateUrl : "/partials/dashboard.html",
                controller:'dashboardCtrl'
            })


    }]);

angular.module('webApp.controllers',['ui.router','ngAnimate']);
angular.module('webApp.services',[]);
