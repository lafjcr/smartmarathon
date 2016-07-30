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

.factory('$smartMarathonCalculatorService', ['$http', function ($http) {
    var urls = {
        ServiceBase: 'http://smartmarathon.azurewebsites.net/{0}',
        Init: 'Home/Init',
        EventsByDistance: 'Home/EventsByDistance?distance={0}',
        CalculateGoalTimeAndAvgPaces: 'Home/CalculateGoalTimeAndAvgPaces',
        CalculateSplits: 'Home/CalculateSplits'
    };

    function getFullUrl(url, paramms) {
        var result = urls.ServiceBase.format(url.format(paramms));
        return result;
    }

    var serviceFactory = {};

    var _init = function () {
        var url = getFullUrl(urls.Init);
        return $http.post(url).then(function (response) {
            return response;
        });
    }

    var _loadEvents = function (distanceId) {
        var url = getFullUrl(urls.EventsByDistance, distanceId);
        return $http.get(url).then(function (response) {
            return response;
        });
    }

    var _calculateGoalTimeAndAvgPaces = function (data) {
        var url = getFullUrl(urls.CalculateGoalTimeAndAvgPaces);
        return $http.post(url, data).then(function (response) {
            return response;
        });
    }

    var _calculateSplits = function (data) {
        var url = getFullUrl(urls.CalculateSplits);
        return $http.post(url, data).then(function (response) {
            return response;
        });
    }

    serviceFactory.init = _init;
    serviceFactory.loadEvents = _loadEvents;
    serviceFactory.calculateGoalTimeAndAvgPaces = _calculateGoalTimeAndAvgPaces;
    serviceFactory.calculateSplits = _calculateSplits;
    return serviceFactory;
}])

.factory('$nutritionCalculatorService', ['$http', function ($http) {
    var urls = {
        //ServiceBase: 'http://smartmarathon-api.azurewebsites.net/api/{0}',
        ServiceBase: 'http://localhost:53238/api/{0}',
        Nutrition: 'Nutrition'
    };

    function getFullUrl(url, paramms) {
        var result = urls.ServiceBase.format(url.format(paramms));
        return result;
    }

    var serviceFactory = {};

    var _calculate = function (data) {
        var url = getFullUrl(urls.Nutrition);
        return $http.post(url, data).then(function (response) {
            return response;
        });
    }

    serviceFactory.calculate = _calculate;
    return serviceFactory;
}])

.service('BlankService', [function () {

}]);