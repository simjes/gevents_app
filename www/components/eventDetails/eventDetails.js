angular.module('eventDetails', [])
    .directive('eventDetails', function() {
        return {
            restrict: 'E',
            scope: {
                event: '='
            },
            templateUrl: 'components/eventDetails/eventDetails.html',
            replace: false,
            controller: ['$scope', function($scope) {
                $scope.isType = function(type) {
                    return $scope.event.type.indexOf(type) !== -1;
                };

                $scope.openExternal = function (page) {
                    window.open(page, '_system');
                };
            }]
        };
    });
