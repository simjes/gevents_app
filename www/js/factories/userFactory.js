angular.module('geekeventsApp')
	.factory('userFactory', [function($http, ApiEndpoint) {

		var userFactory = {
			loggedIn: false
		};

		userFactory.isLoggedIn = function() {
			return userFactory.loggedIn;
		}

		userFactory.setLoginStatus = function(state) {
			userFactory.loggedIn = state;
		}

		userFactory.setUser = function(user_data) {
			window.localStorage.facebook_user = JSON.stringify(user_data);
		}

		userFactory.getUser = function() {
			return JSON.parse(window.localStorage.facebook_user || '{}');
		}

		return userFactory;
	}]);