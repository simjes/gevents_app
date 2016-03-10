angular.module('geekeventsApp')
	.factory('apiFactory', ['$http', 'ApiEndpoint', function ($http, ApiEndpoint) {

		var apiFactory = {};

		apiFactory.getAllEvents = function () {
			return $http.get(ApiEndpoint.url + "/events");
		}

		return apiFactory;
	}]);