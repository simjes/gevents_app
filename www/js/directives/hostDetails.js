angular.module('hostDetails', [])
    .directive('hostDetails', function() {
        return {
            restrict: 'E',
            scope: {
                host: '='
            },
            templateUrl: './templates/directives/hostDetails.html',
            replace: false

            //get host info here? or store with event(current)
        }
    });
