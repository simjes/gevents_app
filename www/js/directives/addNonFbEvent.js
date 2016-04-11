angular.module('eventAdder', [])
	.directive('eventAdder', function() {
		return {
			restrict: 'E',
			templateUrl: './templates/directives/addNonFbEvent.html',
			replace: false,
			controller: ['$scope', 'apiFactory', function($scope, apiFactory, userFactory) {

			}]
		}
	});