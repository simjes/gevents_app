angular.module('geekeventsApp.controllers', [])
	.controller('MenuCtrl', ['$scope', '$ionicModal', '$timeout', '$state', '$ionicHistory', 'apiFactory', '$cordovaGeolocation', '$ionicPopup',
		function($scope, $ionicModal, $timeout, $state, $ionicHistory, apiFactory, $cordovaGeolocation, $ionicPopup) {

			$scope.menuOptions = [{
				menuText: 'All Events',
				state: 'allEvents'
			}, {
				menuText: 'Local Events',
				state: 'localEvents'
			}, {
				menuText: 'Gaming Events',
				state: 'gameEvents'
			}, {
				menuText: 'Cosplay Events',
				state: 'cosplayEvents'
			}, {
				menuText: 'Board Game Events',
				state: 'boardEvents'
			}, {
				menuText: 'Other Events',
				state: 'otherEvents'
			}]

			$scope.currentState = "allEvents"; //rootScope this?
			$scope.headline = "All";
			$scope.eventList = {};
			$scope.currentMonthYear = "";

			$scope.getEvents = function(state) {
				switch (state) {
					case 'allEvents':
						$scope.headline = "All";
						apiFactory.getAllEvents().success(function(result) {
							$scope.eventList = result;
						});
						break;
					case 'localEvents':
						$scope.headline = "Local";
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
						$scope.headline = "Game";
						getEventsByType('lan');
						break;
					case 'cosplayEvents':
						$scope.headline = "Cosplay";
						getEventsByType('cosplay');
						break;
					case 'boardEvents':
						$scope.headline = "Board Game";
						getEventsByType('board');
						break;
					case 'otherEvents':
						$scope.headline = "Other";
						getEventsByType('other');
						break;
				}
			}

			$scope.goToPage = function(state) {
				if (state != $scope.currentState) {
					$ionicHistory.nextViewOptions({
						disableBack: true
					});
					$state.go('app.' + state);
					$scope.currentState = state;
					$scope.getEvents(state);
				}
			}

			$scope.isThisCurrentState = function(state) {
				return state == $scope.currentState;
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
		}
	])

.controller('DetailsCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
	$scope.initDetails = function() {
		$scope.selectedEvent = $stateParams.eventInfo;
	}
}])

.controller('LoginCtrl', ['$scope', '$state', '$q', 'userFactory', '$ionicLoading', function($scope, $state, $q, userFactory, $ionicLoading) {
	$scope.loggedIn = false;

	$scope.isLoggedIn = function() {
        alert(userFactory.getUser().name)
		if (userFactory.getUser().name !== undefined) {
			$scope.loggedIn = true;
		} else {
			$scope.loggedIn = false;
		}
	}

	var fbLoginSuccess = function(response) {
		if (!response.authResponse) {
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
				$state.go('app.allEvents');
			}, function(fail) {
				// Fail get profile info
				console.log('profile info fail', fail);
			});
		$scope.loggedIn = true;
	};

	// This is the fail callback from the login method
	var fbLoginError = function(error) {
		console.log('fbLoginError', error);
		$ionicLoading.hide();
		$scope.loggedIn = false;
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
							$state.go('app.allEvents');
						}, function(fail) {
							// Fail get profile info
							console.log('profile info fail', fail);
						});
				} else {
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

	$scope.facebookSignOut = function() {
		$scope.loggedIn = false;
        userFactory.setUser({});

        alert(userFactory.getUser().name)
		facebookConnectPlugin.logout(function() {

				$state.go('app.allEvents');
			},
			function(fail) {});
	}
}]);
