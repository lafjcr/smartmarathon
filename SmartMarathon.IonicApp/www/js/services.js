'use strict';

String.prototype.format = function () {
    var str = this;
    for (var i = 0; i < arguments.length; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        str = str.replace(reg, arguments[i]);
    }
    return str;
}

angular.module('app.services', [])

.factory('BlankFactory', [function () {

}])

.factory('$smartMarathonService', ['$http', '$q', function ($http, $q) {

    var urls = {
        ServiceBase: 'http://smartmarathon.azurewebsites.net/{0}',
        EventsByDistance: 'Home/EventsByDistance?distance={0}',
        CalculateGoalTimeAndAvgPaces: 'Home/CalculateGoalTimeAndAvgPaces'
    };

    function getFullUrl(url, paramms) {
        var result = urls.ServiceBase.format(url.format(paramms));
        return result;
    }

    var serviceFactory = {};

    var _loadEvents = function (distanceId) {
        var url = getFullUrl(urls.EventsByDistance, distanceId);
        return $http.get(url).then(function (response) {
            return response;
        });
    }

    var _calculateGoalTimeAndAvgPaces = function (model) {
        var url = getFullUrl(urls.CalculateGoalTimeAndAvgPaces);
        return $http.post(url, model).then(function (response) {
            return response;
        });
    }

    serviceFactory.loadEvents = _loadEvents;
    serviceFactory.calculateGoalTimeAndAvgPaces = _calculateGoalTimeAndAvgPaces;
    return serviceFactory;
}])

.service('BlankService', [function () {

}]);