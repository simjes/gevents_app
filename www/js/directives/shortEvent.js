angular.module('shortEvent', [])
    .directive('shortEvent', function() {
        return {
            restrict: 'E',
            scope: {
                event: '='
            },
            templateUrl: '../templates/directives/shortEvent.html',
            replace: false,
            controller: ['$scope', '$state', '$ionicHistory', 'apiFactory', function($scope, $state, $ionicHistory, apiFactory) {
                $scope.getEventDetails = function(eventId) {
                    apiFactory.getEventDetails(eventId).success(function(result) {
                        $state.go('app.eventDetails');
                        console.log(result);
                    });
                }
            }]
        }
    });