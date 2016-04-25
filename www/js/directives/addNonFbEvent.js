angular.module('eventAdder', [])
	.directive('eventAdder', function() {
		return {
			restrict: 'E',
			templateUrl: './templates/directives/addNonFbEvent.html',
			replace: false,
			controller: ['$scope', 'apiFactory', function($scope, apiFactory, userFactory) {
				//TODO: get lat and lng from google maps from address.

				$scope.atleastOneType = function() {
					return $scope.lan || $scope.cosplay || $scope.board || $scope.other ? false : true; //if one is checked, required is false
				};
			}]
		};
	});
