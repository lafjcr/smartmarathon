angular.module('app.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

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
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };
})

.controller('PlaylistsCtrl', function ($scope) {
    $scope.playlists = [
      { title: 'Reggae', id: 1 },
      { title: 'Chill', id: 2 },
      { title: 'Dubstep', id: 3 },
      { title: 'Indie', id: 4 },
      { title: 'Rap', id: 5 },
      { title: 'Cowbell', id: 6 }
    ];
})

.controller('PlaylistCtrl', function ($scope, $stateParams) {
})

.controller('smartMarathonCtrl', function ($scope, $http, $smartMarathonService) {
    $scope.model = {
        InKms: true,
        GoalTime: {
            Hours: 0,
            Minutes: 0,
            Seconds: 0
        },
        ByGoalTime: true,
        PaceByKm: {
            Hours: 0,
            Minutes: 0,
            Seconds: 0
        },
        PaceByMile: {
            Hours: 0,
            Minutes: 0,
            Seconds: 0
        },
        Distance: "",
        SelectedDistance: "",
        RealDistance: 0,
        Event: {},
        Marathon: "",
        Splits: []
    }

    $scope.data = {
        Distances: [],
        Events: [],
        Hours: [],
        Minutes: [],
        Seconds: [],            
    }

    $scope.$watch('model.Event', function (newValue, oldValue) {
        if (newValue && newValue.Value) {
            $scope.model.Marathon = newValue.Value;
        }
    });

    $scope.$watch('model.Event', function (newValue, oldValue) {
        if (newValue && newValue.Value) {
            $scope.model.Marathon = newValue.Value;
        }
    });

    $scope.$watch('model.SelectedDistance', function (newValue, oldValue) {
        if (newValue && newValue.Value) {
            $scope.model.Distance = parseInt(newValue.Value);
        }
    });

    $scope.isCustomDistance = function () {
        return $scope.model.SelectedDistance.Value === "0";
    }

    $scope.loadEvents = function () {
        $smartMarathonService.loadEvents($scope.model.SelectedDistance.Value).then(function (response) {
            $scope.data.Events = response.data;
            setEvent();
            calculateSplits();
            $scope.loadSplits();
        });
    }

    $scope.loadSplits = function () {
        var selectedMarathon = $scope.model.Event;
        if (selectedMarathon && selectedMarathon.Value) {
            var marathonInfo = selectedMarathon.Value.split(';');

            if (marathonInfo != null && marathonInfo.length > 0) {
                var splitValuesK = marathonInfo[1].split(',');
                var splitValuesM = marathonInfo[2].split(',');

                angular.forEach(splitValuesK, function (item, key) {
                    $scope.model.Splits.Kilometers[key].Category = parseInt(item.trim());
                });

                angular.forEach(splitValuesM, function (item, key) {
                    $scope.model.Splits.Miles[key].Category = parseInt(item.trim());
                });

                $scope.refresh();
            }
        }
    }

    $scope.refresh = function (byGoalTime) {
        $scope.model.ByGoalTime = byGoalTime;
        $scope.refresh();
    }

    $scope.refresh = function () {
        calculateGoalTimeAndAvgPaces();
    }

    $scope.displayTime = function (time) {
        var result = "";

        var hours = time.Hours;
        var minutes = time.Minutes;
        var seconds = time.Seconds;

        if (minutes < 10) {
            minutes = "0" + minutes
        }
        if (seconds < 10) {
            seconds = "0" + seconds
        }
        result += minutes + ":" + seconds;
        if (hours > 0) {
            result = hours + ":" + result;
        }

//        if (hours > 11) {
//            result += " PM"
//        } else {
//            result += " AM"
//        }
        return result;
    }

    var init = function () {
        $smartMarathonService.init().then(function (response) {
            var data = response.data;
            $scope.data.Distances = data.Distances;
            $scope.model.Splits = data.Splits;
            //$scope.data.Events = data.Marathons;

            setSelectedDistance();
            //setEvent();
            $scope.loadEvents();
        });       
    }

    init();

    function setSelectedDistance() {
        if ($scope.model.SelectedDistance === "" || $scope.model.SelectedDistance === undefined) {
            $scope.model.SelectedDistance = $scope.data.Distances[0];
        }
        else
        {
            angular.forEach($scope.data.Distances, function (item, key) {
                if (item.Value === $scope.model.Distance) {
                    $scope.model.SelectedDistance = item;
                }
            });
        }
        //$scope.model.RealDistance = $scope.model.SelectedDistance.RealDistance;
        //$scope.loadEvents();
    }

    function setEvent() {
        angular.forEach($scope.data.Events, function (item, key) {
            if (item.Selected) {
                $scope.model.Event = item;
            }
        });
    }    

    function calculateGoalTimeAndAvgPaces() {
        if ($scope.model.ByGoalTime) {
            model = createAvgPacesModel();
        }
        else {
            model = createGoalTimeModel();
        }
        $smartMarathonService.calculateGoalTimeAndAvgPaces(model).then(function (response) {
            var data = response.data;
            $scope.model.PaceByKm.Minutes = data.PaceByKm.Minutes;
            $scope.model.PaceByKm.Seconds = data.PaceByKm.Seconds;
            $scope.model.PaceByMile.Minutes = data.PaceByMile.Minutes;
            $scope.model.PaceByMile.Seconds = data.PaceByMile.Seconds;
            $scope.model.GoalTime.Hours = data.GoalTime.Hours;
            $scope.model.GoalTime.Minutes = data.GoalTime.Minutes;
            $scope.model.GoalTime.Seconds = data.GoalTime.Seconds;
            calculateSplits();
        });
    }

    function calculateSplits() {
        $smartMarathonService.calculateSplits($scope.model).then(function (response) {
            var data = response.data;
            $scope.model.Splits = data.Splits;
        }, function (err) {          //second function "error"
            console.log(err);
        });
    }

    function createAvgPacesModel() {
        var model = {
            InKms: $scope.model.InKms,
            Distance: $scope.model.Distance,
            RealDistance: $scope.model.RealDistance,
            GoalTime: {
                "Hours": $scope.model.GoalTime.Hours,
                "Minutes": $scope.model.GoalTime.Minutes,
                "Seconds": $scope.model.GoalTime.Seconds
            }
        };
        return model;
    }

    function createGoalTimeModel() {
        var model = {
            InKms: $scope.model.InKms,
            Distance: $scope.model.Distance,
            RealDistance: $scope.model.RealDistance,
            PaceByKm: {
                "Hours": $scope.model.PaceByKm.Hours,
                "Minutes": $scope.model.PaceByKm.Minutes,
                "Seconds": $scope.model.PaceByKm.Seconds
            },
            PaceByMile: {
                "Hours": $scope.model.PaceByMile.Hours,
                "Minutes": $scope.model.PaceByMile.Minutes,
                "Seconds": $scope.model.PaceByMile.Seconds
            }
        };
        return model;
    }
})

.controller('gSSICtrl', function ($scope) {

})

.controller('aboutCtrl', function ($scope) {

})

.controller('contactCtrl', function ($scope) {

})
;
