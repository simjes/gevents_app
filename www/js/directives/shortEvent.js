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
                        $state.go('app.eventDetails', {eventInfo: result});
                        console.log(result);
                    });
                }
                
                $scope.isType = function(type) {
                    if ($scope.event.type.indexOf(type) === -1) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }]
        }
    });