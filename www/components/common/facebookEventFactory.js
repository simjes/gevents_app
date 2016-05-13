angular.module('geekeventsApp')
	.factory('facebookEventFactory', ['$http', 'userFactory', function($http, userFactory) {

		var facebookEventFactory = {};
		var facebookApi = "https://graph.facebook.com/v2.6/";

		facebookEventFactory.getEventDetails = function(eventId) {
			return $http.get(facebookApi + eventId + "?fields=name,cover,description,start_time,end_time,place,ticket_uri&access_token=" + userFactory.getUser().authResponse.accessToken);
		};


		return facebookEventFactory;
	}]);