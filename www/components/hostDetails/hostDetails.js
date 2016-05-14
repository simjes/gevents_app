angular.module('hostDetails', [])
    .directive('hostDetails', function() {
        return {
            restrict: 'E',
            scope: {
                host: '='
            },
            templateUrl: 'components/hostDetails/hostDetails.html',
            replace: false,
            controller: ['$scope', function($scope) {
                $scope.openExternal = function (page) {
                    window.open(page, '_system');
                };
            }]
            //get host info here? or store with event(current)
        };
    });
