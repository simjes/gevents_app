angular.module('geekeventsApp.controllers', [])
  .controller('DetailsCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
    $scope.initDetails = function() {
      $scope.selectedEvent = $stateParams.eventInfo;
    };
  }]);
