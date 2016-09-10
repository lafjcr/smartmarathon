angular.module('app.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $window, $localizationService, $localStorage) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.loading = false;

    $scope.isMetric = $localStorage.isMetric !== undefined ? $localStorage.isMetric : true;

    $scope.isMetricChanged = function (value) {
        $localStorage.isMetric = value;
        $scope.$broadcast("isMetricChanged", { newValue: value });
    };    

    $scope.languages = $localizationService.languages;
    $scope.language = $localStorage.language !== undefined ? $localizationService.getLanguage($localStorage.language) : $scope.languages[1];
    $scope.strings = {};

    $scope.isEnglish = function () {
        return $scope.language === "en" || $scope.language.Value === "en";
    };

    $scope.setLanguage = function (language) {
        $localStorage.language = $scope.language = language.Value;
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

.controller('smartMarathonCalculatorCtrl', function ($scope, $smartMarathonCalculatorService, $printerService) {
    $scope.model = {
        InKms: $scope.$parent.isMetric,
        GoalTimeValue: new Date(0, 0),
        GoalTime: {
            Hours: 0,
            Minutes: 0,
            Seconds: 0
        },
        ByGoalTime: true,
        PaceByKmValue: new Date(0, 0),
        PaceByKm: {
            Hours: 0,
            Minutes: 0,
            Seconds: 0
        },
        PaceByMileValue: new Date(0, 0),
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
        $scope.$parent.loading = true;
        $smartMarathonCalculatorService.loadEvents($scope.model.SelectedDistance.Value).then(function (response) {
            $scope.data.Events = response.data;
            setEvent();
            calculateSplits();
            $scope.loadSplits();
            $scope.$parent.loading = false;
        }, function (err) {          //second function "error"
            var msg = $scope.$parent.strings.App_ConectionError;
            alert(msg + "\nError " + err.status + ": " + err.statusText + "\nUrl: " + err.config.url);
            console.log("Error " + err.status + ": " + err.statusText + "\nUrl: " + err.config.url);
            $scope.$parent.loading = false;
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

    $scope.goalTimeChanged = function (value) {
        $scope.model.ByGoalTime = true;
        $scope.model.GoalTime = goalTimeToTimeSpan(value);
        $scope.refresh();
    }

    $scope.goalPaceChanged = function (value) {
        $scope.model.ByGoalTime = false;
        $scope.model.PaceByKm = goalPaceToTimeSpan(value);
        $scope.model.PaceByMile = goalPaceToTimeSpan(value);
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

    $scope.checkRealDistanceZeroValue = function () {
        if ($scope.model.RealDistance === 0) {
            $scope.model.RealDistance = '';
        }
    }

    $scope.print = function () {
        var printElement = document.getElementById("smartMarathonCalculatorView");
        $printerService.print(printElement);
    }

    var init = function () {
        $scope.$parent.loading = true;
        $smartMarathonCalculatorService.init().then(function (response) {
            var data = response.data;
            $scope.data.Distances = data.Distances;
            $scope.model.Splits = data.Splits;
            //$scope.data.Events = data.Marathons;

            setSelectedDistance();
            //setEvent();
            $scope.loadEvents();
            $scope.$parent.loading = false;
        }, function (err) {          //second function "error"
            var msg = $scope.$parent.strings.App_ConectionError;
            alert(msg + "\nError " + err.status + ": " + err.statusText + "\nUrl: " + err.config.url);
            console.log("Error " + err.status + ": " + err.statusText + "\nUrl: " + err.config.url);
            $scope.$parent.loading = false;
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
        $scope.$parent.loading = true;
        $smartMarathonCalculatorService.calculateGoalTimeAndAvgPaces(model).then(function (response) {
            var data = response.data;
            $scope.model.PaceByKm.Minutes = data.PaceByKm.Minutes;
            $scope.model.PaceByKm.Seconds = data.PaceByKm.Seconds;
            //$scope.model.PaceByKmValue.setHours(data.PaceByKm.Minutes);
            //$scope.model.PaceByKmValue.setMinutes(data.PaceByKm.Seconds);
            $scope.model.PaceByKmValue = new Date(0, 0, 0, data.PaceByKm.Minutes, data.PaceByKm.Seconds, 0, 0);
            $scope.model.PaceByMile.Minutes = data.PaceByMile.Minutes;
            $scope.model.PaceByMile.Seconds = data.PaceByMile.Seconds;
            //$scope.model.PaceByMileValue.setHours(data.PaceByMile.Minutes);
            //$scope.model.PaceByMileValue.setMinutes(data.PaceByMile.Seconds);
            $scope.model.PaceByMileValue = new Date(0, 0, 0, data.PaceByMile.Minutes, data.PaceByMile.Seconds, 0, 0);
            $scope.model.GoalTime.Hours = data.GoalTime.Hours;
            $scope.model.GoalTime.Minutes = data.GoalTime.Minutes;
            $scope.model.GoalTime.Seconds = data.GoalTime.Seconds;
            //$scope.model.GoalTimeValue.setHours(data.GoalTime.Hours);
            //$scope.model.GoalTimeValue.setMinutes(data.GoalTime.Minutes);
            //$scope.model.GoalTimeValue.setSeconds(data.GoalTime.Seconds);
            $scope.model.GoalTimeValue = new Date(0, 0, 0, data.GoalTime.Hours, data.GoalTime.Minutes, data.GoalTime.Seconds, 0);
            calculateSplits();
            $scope.$parent.loading = false;
        }, function (err) {          //second function "error"
            var msg = $scope.$parent.strings.App_ConectionError;
            alert(msg + "\nError " + err.status + ": " + err.statusText + "\nUrl: " + err.config.url);
            console.log("Error " + err.status + ": " + err.statusText + "\nUrl: " + err.config.url);
            $scope.$parent.loading = false;
        });
    }

    function calculateSplits() {
        $scope.model.InKms = $scope.data.IsMetric;
        $scope.$parent.loading = true;
        $smartMarathonCalculatorService.calculateSplits($scope.model).then(function (response) {
            var data = response.data;
            $scope.model.Splits = data.Splits;
            $scope.$parent.loading = false;
        }, function (err) {          //second function "error"
            var msg = $scope.$parent.strings.App_ConectionError;
            alert(msg + "\nError " + err.status + ": " + err.statusText + "\nUrl: " + err.config.url);
            console.log("Error " + err.status + ": " + err.statusText + "\nUrl: " + err.config.url);
            $scope.$parent.loading = false;
        });
    }

    function createAvgPacesModel() {
        var model = {
            InKms: $scope.data.IsMetric,
            Distance: $scope.model.Distance,
            RealDistance: $scope.model.RealDistance,
            GoalTime: {
                "Hours": $scope.model.GoalTimeValue.getHours(),
                "Minutes": $scope.model.GoalTimeValue.getMinutes(),
                "Seconds": $scope.model.GoalTimeValue.getSeconds(),
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
                "Hours": 0,
                "Minutes": $scope.model.PaceByKmValue.getHours(),
                "Seconds": $scope.model.PaceByKmValue.getMinutes()
            },
            PaceByMile: {
                "Hours": 0,
                "Minutes": $scope.model.PaceByMileValue.getHours(),
                "Seconds": $scope.model.PaceByMileValue.getMinutes()
            }
        };
        return model;
    }

    function goalTimeToTimeSpan(dateValue) {
        var result = {
            "Hours": dateValue.getHours(),
            "Minutes": dateValue.getMinutes(),
            "Seconds": dateValue.getSeconds()
        }
        return result;
    }

    function goalPaceToTimeSpan(dateValue) {
        var result = {
            "Hours": 0,
            "Minutes": dateValue.getHours(),
            "Seconds": dateValue.getMinutes()
        }
        return result;
    }
})

.controller('nutritionCalculatorCtrl', function ($scope, $nutritionCalculatorService, $printerService) {
    $scope.model = {
        Gender: null,
        GenderSelected: null,
        Age: 0,
        Height: 0,
        Weight: 0,
        ActiveLevel: null,
        ActiveLevelSelected: null,
        TimeSpent: 0,
        AvgPace: 0,
        AvgPaceValue: new Date(0, 0)
    }

    $scope.isValid = function() {
        if (($scope.model.GenderSelected !== null && $scope.model.GenderSelected !== undefined)
            && ($scope.model.ActiveLevelSelected !== null && $scope.model.ActiveLevelSelected !== undefined)
            && ($scope.model.Age !== 0 && $scope.model.Height !== 0 && $scope.model.Weight !== 0 && $scope.model.TimeSpent !== 0 && $scope.model.AvgPace != 0))
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

    $scope.avgPaceValueChanged = function (value) {
        $scope.model.AvgPace = value.getHours() + (value.getMinutes() / 60);
        $scope.calculate();
    }

    $scope.calculate = function () {
        if ($scope.isValid()) {
            $scope.model.IsMetric = $scope.data.IsMetric;
            $scope.model.Gender = $scope.model.GenderSelected.Value;
            $scope.model.ActiveLevel = $scope.model.ActiveLevelSelected.Value;
            $scope.$parent.loading = true;
            $nutritionCalculatorService.calculate($scope.model).then(function (response) {
                $scope.results = response.data;
                $scope.$parent.loading = false;
            }, function (err) {          //second function "error"
                var msg = $scope.$parent.strings.App_ConectionError;
                alert(msg + "\nError " + err.status + ": " + err.statusText + "\nUrl: " + err.config.url);
                console.log("Error " + err.status + ": " + err.statusText + "\nUrl: " + err.config.url);
                $scope.$parent.loading = false;
            });
        }
    }

    $scope.checkAgeZeroValue = function () {
        if ($scope.model.Age === 0) {
            $scope.model.Age = '';
        }
    }

    $scope.checkHeightZeroValue = function () {
        if ($scope.model.Height === 0) {
            $scope.model.Height = '';
        }
    }

    $scope.checkWeightZeroValue = function () {
        if ($scope.model.Weight === 0) {
            $scope.model.Weight = '';
        }
    }

    $scope.checkTimeSpentZeroValue = function () {
        if ($scope.model.TimeSpent === 0) {
            $scope.model.TimeSpent = '';
        }
    }

    $scope.print = function () {
        var printElement = document.getElementById("gssiCalculatorView");
        $printerService.print(printElement);
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
