angular.module('eventAdderFacebook', [])
	.directive('eventAdderFacebook', function() {
		return {
			restrict: 'E',
			templateUrl: 'components/addFbEvent/addFbEvent.html',
			replace: false,
			controller: ['$scope', 'apiFactory', 'userFactory', 'facebookEventFactory', function($scope, apiFactory, userFactory, facebookEventFactory) { //factory for getting event info
				var eventId = 0;

				//TODO: handle hosts
				$scope.submitEvent = function(form) {
					facebookEventFactory.getEventDetails(eventId).success(function(result) {
						var userInfo = userFactory.getUser();
						var event = {
							name: result.name,
							type: getTypes(),
							description: result.description,
							date_start: result.start_time,
							date_end: result.end_time,
							img: result.cover.source,
							fb_link: 'https://www.facebook.com/events/' + eventId,
							web_link: result.ticket_uri,
							address: {
								/*
								street: result.place.location.street,
								zip_code: result.place.location.zip,
								city: result.place.location.city*/
							},
							loc: [], //[result.place.location.latitude, result.place.location.longitude],
							price: $scope.price,
							hosts: [],
							uploader: {
								name: userInfo.name,
								fb_id: userInfo.userID,
								mail: userInfo.email
							}
						};

						if ($scope.price == null) {
							event.price = 0;
						}

						if (result.place) { //more checks ? will probably bug if address sucks
							event.address = {
								street: result.place.location.street,
								zip_code: result.place.location.zip,
								city: result.place.location.city
							};
							event.log = [result.place.location.latitude, result.place.location.longitude];
						}

						apiFactory.addEvent(event).success(function(result) {
							console.log(result);
						});
					});
				};

				function getTypes() {
					var types = [];
					if ($scope.lan) types.push("lan");
					if ($scope.cosplay) types.push("cosplay");
					if ($scope.board) types.push("board");
					if ($scope.other) types.push("other");
					return types;
				}

				$scope.atleastOneType = function() {
					return $scope.lan || $scope.cosplay || $scope.board || $scope.other ? false : true; //if one is checked, required is false
				};

				//TODO: validate facebook info
				$scope.isNotValidFacebookEvent = function() {
					if ($scope.facebookLink) {
						if ($scope.facebookLink.match(/events\/[0-9]/i) !== null || undefined) {
							eventId = $scope.facebookLink.match(/[0-9]{7,}/)[0]; //minimum id lenght?
							return false;
						}
					}
					return true;
				};
			}]
		};
	});
