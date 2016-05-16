angular.module('geekeventsApp.controllers', [])
  .controller('MenuCtrl', ['$scope', '$state', '$ionicHistory', 'apiFactory', '$cordovaGeolocation', 'userFactory', '$ionicLoading', '$rootScope',
    function($scope, $state, $ionicHistory, apiFactory, $cordovaGeolocation, userFactory, $ionicLoading, $rootScope) {

      $scope.menuOptions = [{
        menuText: 'All Events',
        state: 'app.allEvents'
      }, {
        menuText: 'Local Events',
        state: 'app.localEvents'
      }, {
        menuText: 'Gaming Events',
        state: 'app.gameEvents'
      }, {
        menuText: 'Cosplay Events',
        state: 'app.cosplayEvents'
      }, {
        menuText: 'Board Game Events',
        state: 'app.boardEvents'
      }, {
        menuText: 'Other Events',
        state: 'app.otherEvents'
      }];

      $scope.headline = "All Events";
      $scope.eventList = [];
      $scope.currentMonthYear = "";
      $scope.loggedIn = userFactory.isLoggedIn();
      $scope.facebookevent = true;


      $scope.getEvents = function(state) {
        switch (state) {
          case 'app.allEvents':
            apiFactory.getAllEvents().success(function(result) {
              $scope.eventList = makeArray(result);
              $ionicLoading.hide();
            }).finally(function() {
              // Stop the ion-refresher from spinning
              $scope.$broadcast('scroll.refreshComplete');
            });
            break;
          case 'app.localEvents':
            $cordovaGeolocation.getCurrentPosition().then(function(pos) {
              //cordova mixes lng and lat?.
              apiFactory.getLocalEvents({
                lng: pos.coords.latitude,
                lat: pos.coords.longitude
              }).success(function(result) {
                $scope.eventList = makeArray(result);
                $ionicLoading.hide();
              }).finally(function() {
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
              });
            });
            break;
          case 'app.gameEvents':
            getEventsByType('lan');
            break;
          case 'app.cosplayEvents':
            getEventsByType('cosplay');
            break;
          case 'app.boardEvents':
            getEventsByType('board');
            break;
          case 'app.otherEvents':
            getEventsByType('other');
            break;
        }
      };

      $scope.goToPage = function(state) {
        //changing page dosnt look good atm, fix it.
        if (state != $state.current.name) {
          if (state != "app.addEvent") {
            $ionicLoading.show({
              template: '<ion-spinner icon="ripple" class="spinner-calm"></ion-spinner> </br> Loading events'
            });
          }
          $scope.eventList = [];
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          setTitle(state);
          $scope.getEvents(state);
          $state.go(state);
        }
      };

      function setTitle(state) {
        if (state === "app.addEvent") {
          $scope.headline = "Add new event";
        } else {
          for (var item in $scope.menuOptions) {
            if ($scope.menuOptions[item].state === state) {
              $scope.headline = $scope.menuOptions[item].menuText;
              return;
            }
          }

        }
      }

      $scope.isThisCurrentState = function(state) {
        return state == $state.current.name;
      };

      function getEventsByType(type) {
        apiFactory.getEventsByType(type).success(function(result) {
          $scope.eventList = makeArray(result);
          $ionicLoading.hide();
        }).finally(function() {
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        });
      }

      /*$scope.newMonth = function(date) {
        var dateObj = new Date(date);

        if ($scope.currentMonthYear === "") {
          $scope.currentMonthYear = new Date(date);
          return true;
        } else if (dateObj.getFullYear() === $scope.currentMonthYear.getFullYear() && dateObj.getMonth() === $scope.currentMonthYear.getMonth()) {
          return false;
        } else {
          $scope.currentMonthYear = new Date(date);
          return true;
        }
      };*/

      $scope.refreshEvents = function() {
        $scope.getEvents($state.current.name);
      };

      $scope.facebookSignOut = function() {
        facebookConnectPlugin.logout(function() {
            //successfully logged out
            userFactory.setLoginStatus(false);
            userFactory.setUser({});
            if ($state.current.name === "app.addEvent") {
              $scope.goToPage('app.allEvents'); //this is not working
            }
          },
          function(fail) {
            //could not log out
          });
      };

      function makeArray(result) {
        var resultArray = [];
        for (var i in result) {
          resultArray.push(result[i]);
        }
        return resultArray;
      }

      $scope.$watch(function() {
        return userFactory.loggedIn;
      }, function(newVal, oldVal) {
        $scope.loggedIn = newVal;
      });

      //This should never happen as the button to go to addEvent state is not shown when not logged in.
      //If this is not the case and it does happen -> goes to last state, but with no content loaded. Fix later?
      $rootScope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error) {
        if (error === "Not Authorized") {
          $state.go(fromState);
        }
      });
    }
  ]);
