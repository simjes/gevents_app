angular.module('geekeventsApp.controllers', [])

    .controller('MenuCtrl', ['$scope', '$ionicModal', '$timeout', '$state', '$ionicHistory', 'apiFactory',
        function($scope, $ionicModal, $timeout, $state, $ionicHistory, apiFactory) {

            $scope.menuOptions = [
                {
                    menuText: 'All Events',
                    state: 'allEvents'
                },
                {
                    menuText: 'Local Events',
                    state: 'localEvents'
                },
                {
                    menuText: 'Gaming Events',
                    state: 'gameEvents'
                },
                {
                    menuText: 'Cosplay Events',
                    state: 'cosplayEvents'
                },
                {
                    menuText: 'Board Game Events',
                    state: 'boardEvents'
                },
                {
                    menuText: 'Other Events',
                    state: 'otherEvents'
                }
            ]
            $scope.currentState = "allEvents";
            $scope.headline = "All";
            $scope.eventList = {};

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
                        //TODO: get local events
                        $scope.eventList = {};
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
                    console.log(result);
                });
            }

            // With the new view caching in Ionic, Controllers are only called
            // when they are recreated or on app start, instead of every page change.
            // To listen for when this page is active (for example, to refresh data),
            // listen for the $ionicView.enter event:
            //$scope.$on('$ionicView.enter', function(e) {
            //});

            // Form data for the login modal
            $scope.loginData = {};

            // Create the login modal that we will use later
            $ionicModal.fromTemplateUrl('templates/login.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal = modal;
            });

            // Triggered in the login modal to close it
            $scope.closeLogin = function() {
                $scope.modal.hide();
            };

            // Open the login modal
            $scope.login = function() {
                $scope.modal.show();
            };

            // Perform the login action when the user submits the login form
            $scope.doLogin = function() {
                console.log('Doing login', $scope.loginData);

                // Simulate a login delay. Remove this and replace with your login
                // code if using a login system
                $timeout(function() {
                    $scope.closeLogin();
                }, 1000);
            };
        }])
        .controller('DetailsCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
            $scope.initDetails = function() {
                $scope.selectedEvent = $stateParams.eventInfo;
            }
        }]);
