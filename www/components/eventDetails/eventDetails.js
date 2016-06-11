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

        $scope.createCalendarEvent = function() {
           window.plugins.calendar.createEventInteractively($scope.event.name,
             $scope.event.address.street + ", " + $scope.event.address.zip_code + " " + $scope.event.address.city,
             "",
             new Date($scope.event.date_start),
             new Date($scope.event.date_end),
             function() {
               console.log("Event created successfully");
             },function(err) {
               console.error("There was an error: " + err);
             });
        };

        $scope.openExternal = function(page) {
          window.open(page, '_system');
        };
      }]
    };
  });
