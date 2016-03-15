angular.module('geekeventsApp.controllers', [])
    .controller('MenuCtrl', ['$scope', '$ionicModal', '$timeout', '$state', '$ionicHistory', 'apiFactory', '$cordovaGeolocation', '$ionicPopup',
        function($scope, $ionicModal, $timeout, $state, $ionicHistory, apiFactory, $cordovaGeolocation, $ionicPopup) {

            $scope.menuOptions = [
                { menuText: 'All Events', state: 'allEvents' },
                { menuText: 'Local Events', state: 'localEvents' },
                { menuText: 'Gaming Events', state: 'gameEvents' },
                { menuText: 'Cosplay Events', state: 'cosplayEvents' },
                { menuText: 'Board Game Events', state: 'boardEvents' },
                { menuText: 'Other Events', state: 'otherEvents' }
            ]

            $scope.currentState = "allEvents"; //rootScope this?
            $scope.headline = "All";
            $scope.eventList = {};
            $scope.loggedIn = false;

            $scope.getEvents = function(state) {
                switch (state) {
                    case 'allEvents':
                        $scope.headline = "All";
                        apiFactory.getAllEvents().success(function(result) {
                            $scope.eventList = result;
                        });
                        break;
                    case 'localEvents':
                        $scope.headline = "Local";
                        $cordovaGeolocation.getCurrentPosition().then(function(pos) {
                            //cordova mixes lng and lat?.
                            apiFactory.getLocalEvents({ lng: pos.coords.latitude, lat: pos.coords.longitude }).success(function(result) {
                                $scope.eventList = result;
                            });
                        });
                        break;
                    case 'gameEvents':
                        $scope.headline = "Game";
                        getEventsByType('lan');
                        break;
                    case 'cosplayEvents':
                        $scope.headline = "Cosplay";
                        getEventsByType('cosplay');
                        break;
                    case 'boardEvents':
                        $scope.headline = "Board Game";
                        getEventsByType('board');
                        break;
                    case 'otherEvents':
                        $scope.headline = "Other";
                        getEventsByType('other');
                        break;
                }
            }

            $scope.goToPage = function(state) {
                if (state != $scope.currentState) {
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go('app.' + state);
                    $scope.currentState = state;
                    $scope.getEvents(state);
                }
            }

            $scope.isThisCurrentState = function(state) {
                return state == $scope.currentState;
            }

            function getEventsByType(type) {
                apiFactory.getEventsByType(type).success(function(result) {
                    $scope.eventList = result;
                });
            }

            $scope.currentMonthYear = "";
            $scope.newMonth = function(date) {
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
            }

            //check if logged in on startup, set loggedIn accordingly
            $scope.facebookSignIn = function() {
                $scope.loggedIn = true;
            }

            $scope.facebookSignOut = function() {
                $scope.loggedIn = false;
            }


        }])
    .controller('DetailsCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
        $scope.initDetails = function() {
            $scope.selectedEvent = $stateParams.eventInfo;
        }
    }])
    .controller('FilterCtrl', ['$scope', function($scope) {



    }]);
