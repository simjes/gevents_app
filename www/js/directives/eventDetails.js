angular.module('geekeventsApp.directives.eventDetails', [])
.directive('eventDetails', function () {
    return {
        restrict: 'E',
        scope: {
            event: '='
        },
        templateUrl: '../templates/directives/eventDetails.html',
        replace: false
    }
});