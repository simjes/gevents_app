angular.module('shortEvent', [])
	.directive('shortEvent', function() {
		return {
			restrict: 'E',
			scope: {
				event: '='
			},
			templateUrl: 'components/shortEvent/shortEvent.html', //feil?
			replace: false,
			controller: ['$scope', '$state', '$ionicHistory', 'apiFactory', function($scope, $state, $ionicHistory, apiFactory) {
				$scope.getEventDetails = function(eventId) {
					apiFactory.getEventDetails(eventId).success(function(result) {
						$state.go('app.eventDetails', {
							eventInfo: result
						});
					});
				};

				$scope.isType = function(type) {
					return $scope.event.type.indexOf(type) === -1;
				};
			}]
		};
	});
