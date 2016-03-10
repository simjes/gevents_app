angular.module('geekeventsApp.directives.shortEvent', [])
.directive('shortEvent', function () {
    return {
        restrict: 'E',
        scope: {
            event: '='
        },
        templateUrl: '../templates/directives/shortEvent.html',
        replace: false
    }
});