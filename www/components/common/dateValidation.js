angular.module('dateValidator', [])
	.directive('dateValidator', function() {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function($scope, $element, $attrs, ngModel) {
				//TODO: try to get it to work for both start and end date
				ngModel.$validators.dateValidation = function(modelValue, viewValue) {
					return new Date($scope.event.date_start) < new Date(modelValue);
				};
			}
		};
	});
