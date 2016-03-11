angular.module('geekeventsApp')
	.factory('apiFactory', ['$http', 'ApiEndpoint', function ($http, ApiEndpoint) {

		var apiFactory = {};

		apiFactory.getAllEvents = function () {
			return $http.get(ApiEndpoint.url + "/events");
		}
        
        apiFactory.getEventsByType = function (type) {
			return $http.get(ApiEndpoint.url + "/events?type=" + type);
		}
        
        //TODO: get local events
        //add events

        apiFactory.getEventDetails = function (eventId) {
            return $http.get(ApiEndpoint.url + "/events/" + eventId);
        }

		return apiFactory;
	}]);