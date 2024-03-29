var ctrlModule = angular.module('geekeventsApp.controllers');
ctrlModule.controller('LoginCtrl', ['$scope', '$state', '$q', 'userFactory', '$ionicLoading', function($scope, $state, $q, userFactory, $ionicLoading) {
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
