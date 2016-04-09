angular.module('geekeventsApp.controllers', [])
	.controller('MenuCtrl', ['$scope', '$ionicModal', '$timeout', '$state', '$ionicHistory', 'apiFactory', '$cordovaGeolocation', '$ionicPopup', 'userFactory',
		function($scope, $ionicModal, $timeout, $state, $ionicHistory, apiFactory, $cordovaGeolocation, $ionicPopup, userFactory) {

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
			}]

			$scope.headline = "All Events";
			$scope.eventList = {};
			$scope.currentMonthYear = "";
			$scope.loggedIn = userFactory.isLoggedIn();

			$scope.getEvents = function(state) {
				switch (state) {
					case 'allEvents':
						apiFactory.getAllEvents().success(function(result) {
							$scope.eventList = result;
						});
						break;
					case 'localEvents':
						$cordovaGeolocation.getCurrentPosition().then(function(pos) {
							//cordova mixes lng and lat?.
							apiFactory.getLocalEvents({
								lng: pos.coords.latitude,
								lat: pos.coords.longitude
							}).success(function(result) {
								$scope.eventList = result;
							});
						});
						break;
					case 'gameEvents':
						getEventsByType('lan');
						break;
					case 'cosplayEvents':
						getEventsByType('cosplay');
						break;
					case 'boardEvents':
						getEventsByType('board');
						break;
					case 'otherEvents':
						getEventsByType('other');
						break;
				}
			}

			$scope.goToPage = function(state) {
				if (state != $state.current.name) {
					$ionicHistory.nextViewOptions({
						disableBack: true
					});
					$state.go(state);
					setTitle(state);
					$scope.getEvents(state);
				}
			}

			function setTitle(state) {
				console.log(state);
				if (state === "app.addEvent") {
					console.log("add event");
					$scope.headline = "Add new event"
				} else {
					$scope.menuOptions.forEach(function(item) {
						if (item.state === state) {
							$scope.headline = item.menuText;
							return;
						}
					});
				}
			}

			$scope.isThisCurrentState = function(state) {
				return state == $state.current.name;
			}

			function getEventsByType(type) {
				apiFactory.getEventsByType(type).success(function(result) {
					$scope.eventList = result;
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
			}

			$scope.facebookSignOut = function() {
				userFactory.setLoginStatus(false);
				userFactory.setUser({});
				facebookConnectPlugin.logout(function() {
						if ($state.current.name === "app.addEvent") {
							$scope.goToPage('app.allEvents'); //oppdaterer ikke title, ctrl tull?
						}
					},
					function(fail) {
						userFactory.setLoginStatus(false); //??
					});
			}

			$scope.$watch(function() {
				return userFactory.loggedIn;
			}, function(newVal, oldVal) {
				$scope.loggedIn = newVal;
			});
		}
	])

.controller('DetailsCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
	$scope.initDetails = function() {
		$scope.selectedEvent = $stateParams.eventInfo;
	}
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
	}

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
				$state.go('app.allEvents');
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
							$state.go('app.allEvents');
						}, function(fail) {
							// Fail get profile info
							//$scope.loggedIn = false;
							console.log('profile info fail', fail);
						});
				} else {
					userFactory.setLoginStatus(true);
					$state.go('app.allEvents');
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