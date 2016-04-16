angular.module('geekeventsApp.controllers', [])
	.controller('MenuCtrl', ['$scope', '$state', '$ionicHistory', 'apiFactory', '$cordovaGeolocation', 'userFactory', '$ionicLoading', '$rootScope',
		function($scope, $state, $ionicHistory, apiFactory, $cordovaGeolocation, userFactory, $ionicLoading, $rootScope) {

			$scope.menuOptions = [{
				menuText: 'All Events',
				state: 'app.allEvents'
			}, {
				menuText: 'Local Events',
				state: 'app.localEvents'
			}, {
				menuText: 'Gaming Events',
				state: 'app.gameEvents'
			}, {
				menuText: 'Cosplay Events',
				state: 'app.cosplayEvents'
			}, {
				menuText: 'Board Game Events',
				state: 'app.boardEvents'
			}, {
				menuText: 'Other Events',
				state: 'app.otherEvents'
			}];

			$scope.headline = "All Events";
			$scope.eventList = {};
			$scope.currentMonthYear = "";
			$scope.loggedIn = userFactory.isLoggedIn();
			$scope.facebookevent = true;


			$scope.getEvents = function(state) {
				switch (state) {
					case 'app.allEvents':
						apiFactory.getAllEvents().success(function(result) {
							$scope.eventList = result;
							$ionicLoading.hide();
						});
						break;
					case 'app.localEvents':
						$cordovaGeolocation.getCurrentPosition().then(function(pos) {
							//cordova mixes lng and lat?.
							apiFactory.getLocalEvents({
								lng: pos.coords.latitude,
								lat: pos.coords.longitude
							}).success(function(result) {
								$scope.eventList = result;
								$ionicLoading.hide();
							});
						});
						break;
					case 'app.gameEvents':
						getEventsByType('lan');
						break;
					case 'app.cosplayEvents':
						getEventsByType('cosplay');
						break;
					case 'app.boardEvents':
						getEventsByType('board');
						break;
					case 'app.otherEvents':
						getEventsByType('other');
						break;
				}
			};

			$scope.goToPage = function(state) {
				//changing page dosnt look good atm, fix it.
				if (state != $state.current.name) {
					if (state != "app.addEvent") {
						$ionicLoading.show({
							template: '<ion-spinner icon="ripple" class="spinner-calm"></ion-spinner> </br> Loading events'
						});
					}
					$scope.eventList = {};
					$ionicHistory.nextViewOptions({
						disableBack: true
					});
					setTitle(state);
					$scope.getEvents(state);
					$state.go(state);
				}
			};

			function setTitle(state) {
				if (state === "app.addEvent") {
					$scope.headline = "Add new event";
				} else {
					for (var item in $scope.menuOptions) {
						if ($scope.menuOptions[item].state === state) {
							$scope.headline = $scope.menuOptions[item].menuText;
							return;
						}
					}

				}
			}

			$scope.isThisCurrentState = function(state) {
				return state == $state.current.name;
			};

			function getEventsByType(type) {
				apiFactory.getEventsByType(type).success(function(result) {
					$scope.eventList = result;
					$ionicLoading.hide();
				});
			}

			$scope.newMonth = function(date) {
				var dateObj = new Date(date);

				if ($scope.currentMonthYear === "") {
					$scope.currentMonthYear = new Date(date);
					return true;
				} else if (dateObj.getFullYear() === $scope.currentMonthYear.getFullYear() && dateObj.getMonth() === $scope.currentMonthYear.getMonth()) {
					return false;
				} else {
					$scope.currentMonthYear = new Date(date);
					return true;
				}
			};

			$scope.facebookSignOut = function() {
				facebookConnectPlugin.logout(function() {
						//successfully logged out
						userFactory.setLoginStatus(false);
						userFactory.setUser({});
						if ($state.current.name === "app.addEvent") {
							$scope.goToPage('app.allEvents'); //this is not working
						}
					},
					function(fail) {
						//could not log out
					});
			};

			$scope.$watch(function() {
				return userFactory.loggedIn;
			}, function(newVal, oldVal) {
				$scope.loggedIn = newVal;
			});

			//This should never happen as the button to go to addEvent state is not shown when not logged in.
			//If this is not the case and it does happen -> goes to last state, but with no content loaded. Fix later?
			$rootScope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error) {
				if (error === "Not Authorized") {
					$state.go(fromState);
				}
			});
		}
	])

.controller('DetailsCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
	$scope.initDetails = function() {
		$scope.selectedEvent = $stateParams.eventInfo;
	};
}])

//make separate file, read more about facebook login
.controller('LoginCtrl', ['$scope', '$state', '$q', 'userFactory', '$ionicLoading', function($scope, $state, $q, userFactory, $ionicLoading) {
	$scope.loggedIn = userFactory.isLoggedIn();

	$scope.$watch(function() {
		return userFactory.loggedIn;
	}, function(newVal, oldVal) {
		$scope.loggedIn = newVal;
	});

	$scope.isLoggedIn = function() {
		if (userFactory.getUser().userID !== undefined) {
			userFactory.setLoginStatus(true);
		} else {
			userFactory.setLoginStatus(false);
		}
	};

	var fbLoginSuccess = function(response) {
		if (!response.authResponse) {
			userFactory.setLoginStatus(false);
			fbLoginError("Cannot find the authResponse");
			return;
		}

		var authResponse = response.authResponse;

		getFacebookProfileInfo(authResponse)
			.then(function(profileInfo) {
				userFactory.setUser({
					authResponse: authResponse,
					userID: profileInfo.id,
					name: profileInfo.name,
					email: profileInfo.email,
					picture: "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
				});
				$ionicLoading.hide();
				userFactory.setLoginStatus(true);
			}, function(fail) {
				// Fail get profile info
				userFactory.setLoginStatus(false);
				console.log('profile info fail', fail);
			});

	};

	// This is the fail callback from the login method
	var fbLoginError = function(error) {
		console.log('fbLoginError', error);
		$ionicLoading.hide();
		userFactory.setLoginStatus(false);
	};

	// This method is to get the user profile info from the facebook api
	var getFacebookProfileInfo = function(authResponse) {
		var info = $q.defer();

		facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
			function(response) {
				console.log(response);
				info.resolve(response);
			},
			function(response) {
				console.log(response);
				info.reject(response);
			}
		);
		return info.promise;
	};



	//check if logged in on startup, set loggedIn accordingly
	$scope.facebookSignIn = function() {
		facebookConnectPlugin.getLoginStatus(function(success) {
			if (success.status === 'connected') {
				// The user is logged in and has authenticated your app, and response.authResponse supplies
				// the user's ID, a valid access token, a signed request, and the time the access token
				// and signed request each expire
				console.log('getLoginStatus', success.status);

				// Check if we have our user saved
				var user = userFactory.getUser('facebook');

				if (!user.userID) {
					getFacebookProfileInfo(success.authResponse)
						.then(function(profileInfo) {
							// For the purpose of this example I will store user data on local storage
							userFactory.setUser({
								authResponse: success.authResponse,
								userID: profileInfo.id,
								name: profileInfo.name,
								email: profileInfo.email,
								picture: "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
							});
							userFactory.setLoginStatus(true);
						}, function(fail) {
							// Fail get profile info
							console.log('profile info fail', fail);
						});
				} else {
					userFactory.setLoginStatus(true);
				}
			} else {
				// If (success.status === 'not_authorized') the user is logged in to Facebook,
				// but has not authenticated your app
				// Else the person is not logged into Facebook,
				// so we're not sure if they are logged into this app or not.

				console.log('getLoginStatus', success.status);

				$ionicLoading.show({
					template: 'Logging in...'
				});

				// Ask the permissions you need. You can learn more about
				// FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
				facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
			}
		});
	};


}]);