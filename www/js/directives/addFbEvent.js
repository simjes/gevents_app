angular.module('eventAdderFacebook', [])
	.directive('eventAdderFacebook', function() {
		return {
			restrict: 'E',
			templateUrl: './templates/directives/addFbEvent.html',
			replace: false,
			controller: ['$scope', 'apiFactory', 'userFactory', function($scope, apiFactory, userFactory) { //factory for getting event info
				$scope.submitEvent = function(form) {
					console.log(form);
				};

				$scope.atleastOneType = function() {
					return $scope.lan || $scope.cosplay || $scope.board || $scope.other ? false : true; //if one is checked, required is false
				};

				//TODO: validate facebook info
				$scope.isValidFacebookEvent = function() {
					if ($scope.facebookLink) {
						return false;
					} else {
						return true;
					}
				};
			}]
		};
	});