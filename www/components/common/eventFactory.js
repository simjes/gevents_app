angular.module('geekeventsApp')
	.factory('apiFactory', ['$http', 'ApiEndpoint', function($http, ApiEndpoint) {

		var apiFactory = {};

		apiFactory.getAllEvents = function() {
			return $http.get(ApiEndpoint.url + "/events");
		};

		apiFactory.getEventsByType = function(type) {
			return $http.get(ApiEndpoint.url + "/events?type=" + type);
		};

		apiFactory.getLocalEvents = function(coords) {
			return $http.get(ApiEndpoint.url + "/events?lng=" + coords.lng + "&lat=" + coords.lat);
		};


		//add events
		apiFactory.addEvent = function(eventInfo) {
			return $http.post(ApiEndpoint.url + "/events", JSON.stringify(eventInfo));
		};

		apiFactory.getEventDetails = function(eventId) {
			return $http.get(ApiEndpoint.url + "/events/" + eventId);
		};

		return apiFactory;
	}]);
