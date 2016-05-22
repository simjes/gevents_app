angular.module('geekeventsApp', ['ionic', 'geekeventsApp.controllers', 'shortEvent', 'eventDetails', 'hostDetails', 'eventAdderFacebook', 'eventAdder', 'ngCordova', 'angularMoment', 'ngMessages', 'dateValidator'])
	.constant('ApiEndpoint', {
		url: 'http://51.174.85.200:3000/api' //TODO:  http://localhost:8100/api
	})
	.run(function($rootScope, $state, $stateParams, $ionicPlatform) {
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
		$ionicPlatform.ready(function() {
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
	.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('app', {
				url: '/app',
				abstract: true,
				templateUrl: 'components/menuPage/menu.html',
				controller: 'MenuCtrl'
			})
			.state('app.allEvents', {
				url: '/allEvents',
				views: {
					'menuContent': {
						templateUrl: 'components/common/eventList.html'
					}
				}
			})
			.state('app.localEvents', {
				url: '/localEvents',
				views: {
					'menuContent': {
						templateUrl: 'components/common/eventList.html'
					}
				}
			})
			.state('app.gameEvents', {
				url: '/gameEvents',
				views: {
					'menuContent': {
						templateUrl: 'components/common/eventList.html'
					}
				}
			})
			.state('app.cosplayEvents', {
				url: '/cosplayEvents',
				views: {
					'menuContent': {
						templateUrl: 'components/common/eventList.html'
					}
				}
			})
			.state('app.boardEvents', {
				url: '/boardEvents',
				views: {
					'menuContent': {
						templateUrl: 'components/common/eventList.html'
					}
				}
			})
			.state('app.otherEvents', {
				url: '/otherEvents',
				views: {
					'menuContent': {
						templateUrl: 'components/common/eventList.html'
					}
				}
			})
			.state('app.eventDetails', {
				url: '/eventDetails',
				params: {
					eventInfo: null
				},
				views: {
					'menuContent': {
						templateUrl: 'components/eventDetails/detailsOfEvent.html',
						controller: 'DetailsCtrl'
					}
				}
			})
			.state('app.addEvent', {
				url: '/addEvent',
				views: {
					'menuContent': {
						templateUrl: 'components/common/addEvent.html'
					}
				},
				/*resolve: { TODO: add this again
					security: ['$q', 'userFactory', function($q, userFactory) {
						if (!userFactory.isLoggedIn()) {
							return $q.reject("Not Authorized");
						}
					}]
				}*/
			});


		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/app/allEvents');
	});
