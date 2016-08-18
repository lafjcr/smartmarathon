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

.factory('$localizationService', [function () {
    var stringsCollection = [
        {
            Language: "en",
            Resources:
            {
                Menu_SM_Title: "Smart Marathon",
                Menu_SM_Subtitle: "Race strategy calculator",
                Menu_GSSI_Title: "GSSI",
                Menu_GSSI_Subtitle: "Nutrition calculator",
                Menu_AboutSM_Title: "About Smart Marathon",
                Menu_AboutSM_Subtitle: "Theory explanation",
                Menu_Contact_Title: "Contact",
                Menu_Language_Title: "Language",
                Menu_Metric_Title: "Metric units",
                SM_Title: "Smart Marathon",
                SM_Instructions: "Fill your goal time and classify each split according race altimetry",
                SM_GoalTime: "GOAL TIME",
                SM_GoalPace: "GOAL PACE",
                SM_MinKm: "min/km",
                SM_MinMile: "min/mile",
                SM_Distance: "DISTANCE",
                SM_YourDistance: "YOUR DISTANCE",
                SM_Event: "EVENT",
                SM_Km: "KM",
                SM_Mile: "M",
                SM_Altimetry: "ALTIMETRY",
                SM_Pace: "PACE",
                SM_Time: "TIME",
                GSSI_Title: "GSSI Nutrition Calculator",
                GSSI_Parameters: "PARAMETERS",
                GSSI_Gender: "GENDER",
                GSSI_Select: "-- SELECT --",
                GSSI_Female: "Female",
                GSSI_Male: "Male",
                GSSI_Age: "AGE",
                GSSI_Years: "years",
                GSSI_Height: "HEIGHT",
                GSSI_Cms: "cms",
                GSSI_Weight: "WEIGHT",
                GSSI_Kgs: "kgs",
                GSSI_Pounds: "pounds",
                GSSI_TimeSpent: "TIME SPENT RUNNING",
                GSSI_Minutes: "minutes",
                GSSI_AvgPaceRun: "AVG PACE OF YOUR RUN",
                GSSI_MinKm: "min/km",
                GSSI_MinMile: "min/mile",
                GSSI_ActiveLevel: "ACTIVE LEVEL OUTSIDE RUNNING",
                GSSI_NotVeryActive: "Not Very Active",
                GSSI_Moderate: "Moderate",
                GSSI_VeryActive: "Very Active",
                GSSI_Results: "RESULTS",
                GSSI_BurningCalories: "Burning Calories",
                GSSI_WithoutRunning: " without running",
                GSSI_FromRunning: " from running",
                GSSI_TotalDay: " total for the day",
                GSSI_RecommendedDiet: "\"Typical\" Recommended Runner's diet",
                GSSI_GramsCarbo: " grams of carbohydrate",
                GSSI_GramsFat: " grams of fat",
                GSSI_GramsProtein: " grams of protein"
            }
        },
        {
            Language: "es",
            Resources:
            {
                Menu_SM_Title: "Smart Marathon",
                Menu_SM_Subtitle: "Calcula tu estrategia de carrera",
                Menu_GSSI_Title: "GSSI",
                Menu_GSSI_Subtitle: "Calculadora nutricional",
                Menu_AboutSM_Title: "Sobre Smart Marathon",
                Menu_AboutSM_Subtitle: "Explicación teórica",
                Menu_Contact_Title: "Contáctame",
                Menu_Language_Title: "Idioma",
                Menu_Metric_Title: "Unidades métricas",
                SM_Title: "Smart Marathon",
                SM_Instructions: "Ingrese su tiempo meta y clasifique cada split de acuerdo a la altimetría de la carrera",
                SM_GoalTime: "TIEMPO META",
                SM_GoalPace: "PASO META",
                SM_MinKm: "min/km",
                SM_MinMile: "min/milla",
                SM_Distance: "DISTANCIA",
                SM_YourDistance: "TU DISTANCIA",
                SM_Event: "EVENTO",
                SM_Km: "KM",
                SM_Mile: "M",
                SM_Altimetry: "ALTIMETRIA",
                SM_Pace: "PASO",
                SM_Time: "TIEMPO",
                GSSI_Title: "GSSI Calculadora Nutricional",
                GSSI_Parameters: "PARAMETROS",
                GSSI_Gender: "GENERO",
                GSSI_Select: "-- SELECCIONE --",
                GSSI_Female: "Mujer",
                GSSI_Male: "Hombre",
                GSSI_Age: "EDAD",
                GSSI_Years: "años",
                GSSI_Height: "ALTURA",
                GSSI_Cms: "cms",
                GSSI_Weight: "PESO",
                GSSI_Kgs: "kgs",
                GSSI_Pounds: "libras",
                GSSI_TimeSpent: "TIEMPO DE CORRIDA",
                GSSI_Minutes: "minutos",
                GSSI_AvgPaceRun: "PASO PROMEDIO",
                GSSI_MinKm: "min/km",
                GSSI_MinMile: "min/milla",
                GSSI_ActiveLevel: "NIVEL DE ACTIVIDAD SIN CORRER",
                GSSI_NotVeryActive: "No muy Activo",
                GSSI_Moderate: "Moderado",
                GSSI_VeryActive: "Muy Activo",
                GSSI_Results: "RESULTADOS",
                GSSI_BurningCalories: "Gasto de Calorías",
                GSSI_WithoutRunning: " sin correr",
                GSSI_FromRunning: " corriendo",
                GSSI_TotalDay: " total del día",
                GSSI_RecommendedDiet: "Dieta \"Típica\" Recomendada para el Corredor",
                GSSI_GramsCarbo: " gramos de carbohidratos",
                GSSI_GramsFat: " gramos de grasa",
                GSSI_GramsProtein: " gramos de proteina"
            }
        }
    ]

    var _languages = [
        { Value: "en", Text: "English" },
        { Value: "es", Text: "Español" }
    ]

    var _getStrings = function (language) {
        if (language === undefined || language === "")
            language = "en";
        var result = {};
        for (var i = 0; i < stringsCollection.length; i++) {
            if (stringsCollection[i].Language === language) {
                result = stringsCollection[i].Resources;
                break;
            }
        }
        return result;
    }

    var serviceFactory = {};
    serviceFactory.getStrings = _getStrings;
    serviceFactory.languages = _languages;
    return serviceFactory;
}])

.service('BlankService', [function () {

}]);