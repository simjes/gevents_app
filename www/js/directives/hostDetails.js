angular.module('hostDetails', [])
    .directive('hostDetails', function() {
        return {
            restrict: 'E',
            scope: {
                host: '='
            },
            templateUrl: '../templates/directives/hostDetails.html',
            replace: false
        }
    });