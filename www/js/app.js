// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'geekeventsApp' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'geekeventsApp.controllers' is found in controllers.js
angular.module('geekeventsApp', ['ionic', 'geekeventsApp.controllers', 'geekeventsApp.directives.shortEvent', 'geekeventsApp.directives.eventDetails'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'MenuCtrl'
            })

            .state('app.allEvents', {
                url: '/allEvents',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/eventList.html'
                    }
                }
            })
            .state('app.localEvents', {
                url: '/localEvents',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/eventList.html'
                    }
                }
            })
            .state('app.gameEvents', {
                url: '/gameEvents',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/eventList.html'
                    }
                }
            })
            .state('app.cosplayEvents', {
                url: '/cosplayEvents',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/eventList.html'
                    }
                }
            })
            .state('app.boardEvents', {
                url: '/boardEvents',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/eventList.html'
                    }
                }
            })
            .state('app.otherEvents', {
                url: '/otherEvents',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/eventList.html'
                    }
                }
            });
  
  
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/allEvents');
    });
