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
                    if ($scope.event.type.indexOf(type) === -1) {
                        return false;
                    } else {
                        return true;
                    }
                };

                $scope.openExternal = function (page) {
                    window.open(page, '_system');
                };
            }]
        };
    });
