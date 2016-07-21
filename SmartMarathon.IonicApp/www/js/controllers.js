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
    $scope.model =
        {
            InKms: false,
            GoalTime:
                {
                    Hours: "",
                    Minutes: "",
                    Seconds: ""
                },
            PaceByKm:
                {
                    Minutes: "",
                    Seconds: ""
                },
            PaceByMile:
                {
                    Minutes: "",
                    Seconds: ""
                },
            Distance: "",
            RealDistance: "",
            Event: "",
            Splits: {}
        }
    $scope.data =
        {
            Distances: [],
            Events: [],
            Hours: [],
            Minutes: [],
            Seconds: [],            
        }
    $scope.isCustomDistance = function () {
        return $scope.model.Distance.Id === "0";
    }
    $scope.loadEvents = function () {
        $smartMarathonService.loadEvents($scope.model.Distance.Id).then(function (response) {
            $scope.data.Events = response.data;
            angular.forEach($scope.data.Events, function (item, key) {
                if (item.Selected) {
                    $scope.model.Event = item;
                }
            });
        });
    }
    $scope.calculateGoalTimeAndAvgPaces = function (byGoalTime) {
        if (byGoalTime) {
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
        });
    }

    var init = function () {
        $scope.data.Distances = [
            { Id: "42", Title: "Marathon", RealDistance: "42.195" },
            { Id: "30", Title: "30K", RealDistance: "30" },
            { Id: "21", Title: "Half Marathon", RealDistance: "21.097" },
            { Id: "10", Title: "10K", RealDistance: "10" },
            { Id: "5", Title: "5K", RealDistance: "5" },
            { Id: "0", Title: "Other", RealDistance: "0" },
        ];
        if ($scope.model.Distance === "") {
            $scope.model.Distance = $scope.data.Distances[0];
            $scope.model.RealDistance = $scope.model.Distance.RealDistance;
            $scope.loadEvents();
        }
    }

    init();

    function createAvgPacesModel() {
        var model = {
            InKms: true,
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
            InKms: true,
            Distance: $scope.model.Distance,
            RealDistance: $scope.model.RealDistance,
            PaceByKm: {
                "Minutes": $scope.model.PaceByKm.Minutes,
                "Seconds": $scope.model.PaceByKm.Seconds
            },
            PaceByMile: {
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
