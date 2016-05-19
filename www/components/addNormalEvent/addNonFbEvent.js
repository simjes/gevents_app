angular.module('eventAdder', [])
	.directive('eventAdder', function() {
		return {
			restrict: 'E',
			templateUrl: 'components/addNormalEvent/addNonFbEvent.html',
			replace: false,
			controller: ['$scope', 'apiFactory', 'userFactory', '$http', function($scope, apiFactory, userFactory, $http) {
				//TODO: use stock photo if user does not provide one
				$scope.submitEvent = function(form) {
					var userInfo = userFactory.getUser();
					var event = {
						name: $scope.eventName,
						type: getTypes(),
						description: $scope.description,
						date_start: $scope.startDate,
						date_end: $scope.endDate,
						img: $scope.imageLink,
						web_link: $scope.ticketLink,
						address: {
							street: $scope.locationStreet,
							zip_code: $scope.locationZip,
							city: $scope.locationCity
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
					getCoordinates(event.address).success(function(result) {
						console.log(result);
						if (result.status === "OK") {
							event.loc = [result.results[0].geometry.location.lat, result.results[0].geometry.location.lng];
						}
						apiFactory.addEvent(event).success(function (addResult) {
							console.log(addResult);
						});
					});
				};

				$scope.atleastOneType = function() {
					return $scope.lan || $scope.cosplay || $scope.board || $scope.other ? false : true; //if one is checked, required is false
				};

				function getCoordinates(address) {
					//make factory?
					return $http.get('http://maps.google.com/maps/api/geocode/json?address=' + address.zip_code + '+' + address.city + '+' + address.street);
				}

				function getTypes() {
					var types = [];
					if ($scope.lan) types.push("lan");
					if ($scope.cosplay) types.push("cosplay");
					if ($scope.board) types.push("board");
					if ($scope.other) types.push("other");
					return types;
				}
			}]
		};
	});
