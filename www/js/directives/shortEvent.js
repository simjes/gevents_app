angular.module('geekeventsApp.directives', [])
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