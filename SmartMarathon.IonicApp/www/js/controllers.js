angular.module('app.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $window, $localizationService) {

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

    $scope.isMetric = true;

    $scope.isMetricChanged = function (value) {
        $scope.$broadcast("isMetricChanged", { newValue: value });
    };    

    $scope.languages = $localizationService.languages;
    $scope.language = $scope.languages[1];
    $scope.strings = {};

    $scope.isEnglish = function () {
        return $scope.language === "en" || $scope.language.Value === "en";
    };

    $scope.setLanguage = function (language) {
        $scope.language = language.Value;
        $scope.strings = $localizationService.getStrings($scope.language);
    };

    function getBrowserLanguage() {
        var browserLanguage = $window.navigator.language || $window.navigator.userLanguage;
        browserLanguage = browserLanguage.split('-')[0];
        return browserLanguage;
    }

    var init = function () {
        //$scope.language = getBrowserLanguage();
        $scope.strings = $localizationService.getStrings($scope.language.Value);
    }

    init();
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

.controller('smartMarathonCalculatorCtrl', function ($scope, $smartMarathonCalculatorService) {
    $scope.model = {
        InKms: $scope.$parent.isMetric,
        GoalTimeTestValue: new Date(0, 0),
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
        IsMetric: $scope.$parent.isMetric,
        Distances: [],
        Events: [],
        Hours: [],
        Minutes: [],
        Seconds: [],            
    }

    $scope.$on("isMetricChanged", function (event, options) {
        $scope.data.IsMetric = options.newValue;
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
        $smartMarathonCalculatorService.loadEvents($scope.model.SelectedDistance.Value).then(function (response) {
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
        $smartMarathonCalculatorService.init().then(function (response) {
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
        $smartMarathonCalculatorService.calculateGoalTimeAndAvgPaces(model).then(function (response) {
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
	$scope.model.InKms = $scope.data.IsMetric;
        $smartMarathonCalculatorService.calculateSplits($scope.model).then(function (response) {
            var data = response.data;
            $scope.model.Splits = data.Splits;
        }, function (err) {          //second function "error"
            console.log(err);
        });
    }

    function createAvgPacesModel() {
        var model = {
            InKms: $scope.data.IsMetric,
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
            InKms: $scope.data.IsMetric,
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

.controller('nutritionCalculatorCtrl', function ($scope, $nutritionCalculatorService) {
    $scope.model = {
        Gender: null,
        GenderSelected: null,
        Age: 0,
        Height: 0,
        Weight: 0,
        ActiveLevel: null,
        ActiveLevelSelected: null,
        TimeSpent: 0,
        AvgPace: 0        
    }

    $scope.isValid = function() {
        if (($scope.model.GenderSelected !== null && $scope.model.GenderSelected !== undefined)
            && ($scope.model.ActiveLevelSelected !== null && $scope.model.ActiveLevelSelected !== undefined))
            return true;
        return false;
    }

    $scope.data = {
        IsMetric: $scope.$parent.isMetric,
        Genders: [
            { Value: "0", Text: $scope.$parent.strings.GSSI_Female },
            { Value: "1", Text: $scope.$parent.strings.GSSI_Male },
        ],
        ActiveLevels: [
            { Value: "0", Text: $scope.$parent.strings.GSSI_NotVeryActive },
            { Value: "1", Text: $scope.$parent.strings.GSSI_Moderate },
            { Value: "2", Text: $scope.$parent.strings.GSSI_VeryActive },
        ]
    }
    
    $scope.results = {
        CaloriesBurned: {
            WithoutRunning: 0,
            FromRunning: 0,
            Total: 0
        },
        RunnersDiet: {
            Carbohydrates: 0,
            Fat: 0,
            Protein: 0
        }
    }

    $scope.$on("isMetricChanged", function (event, options) {
        $scope.data.IsMetric = options.newValue;
    });

    $scope.calculate = function () {
        if ($scope.isValid()) {
            $scope.model.IsMetric = $scope.data.IsMetric;
            $scope.model.Gender = $scope.model.GenderSelected.Value;
            $scope.model.ActiveLevel = $scope.model.ActiveLevelSelected.Value;
            $nutritionCalculatorService.calculate($scope.model).then(function (response) {
                $scope.results = response.data;
            }, function (err) {          //second function "error"
                console.log(err);
            });
        }
    }


    var init = function () {
    }

    init();
})

.controller('aboutCtrl', function ($scope) {

})

.controller('contactCtrl', function ($scope) {

})
;
