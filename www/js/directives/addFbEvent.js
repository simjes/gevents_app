angular.module('eventAdderFacebook', [])
	.directive('eventAdderFacebook', function() {
		return {
			restrict: 'E',
			templateUrl: './templates/directives/addFbEvent.html',
			replace: false,
			controller: ['$scope', 'apiFactory', 'userFactory', function($scope, apiFactory, userFactory) { //factory for getting event info

			}]
		}
	});