var ctrlModule = angular.module('geekeventsApp.controllers');
  ctrlModule.controller('DetailsCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
    $scope.initDetails = function() {
      $scope.selectedEvent = $stateParams.eventInfo;
    };
  }]);
