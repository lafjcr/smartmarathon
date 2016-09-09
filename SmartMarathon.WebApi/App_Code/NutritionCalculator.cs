using SmartMarathon.WebApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SmartMarathon.WebApi.Code
{
    public class NutritionCalculator
    {
        private NutritionRequestModel data;
        public NutritionResponseModel Result { get; internal set; }

        public NutritionCalculator(NutritionRequestModel data)
        {
            this.data = data;
            Calculate();
        }

        private void Calculate()
        {
            Result = new NutritionResponseModel();
            UnitConversion();
            CalculateCalories();
            CalculateRunnersDiet();
        }

        private void UnitConversion()
        {
            if (!data.IsMetric)
            {
                data.Weight = Convertor.PoundsToKgs(data.Weight);
                data.AvgPace = Convertor.MinutesPerMileToMinutesPerKm(data.AvgPace);
            }
        }

        private void CalculateCalories()
        {
            Result.CaloriesBurned = new CaloriesBurned()
            {
                WithoutRunning = CalculateCaloriesWithoutRunning(),
                FromRunning = CalculateCaloriesFromRunning()
            };
        }

        private int CalculateCaloriesWithoutRunning()
        {
            var genderValue = data.Gender == Gender.Male ? 5 : -161;
            var result = genderValue + (10 * data.Weight) + (6.25 * data.Height) - (5 * data.Age);
            result = ApplyActiveLevel(result, data.ActiveLevel);
            return Convert.ToInt32(Math.Round(result, 0));
        }

        private double ApplyActiveLevel(double calories, ActiveLevel activeLevel)
        {
            var result = 0d;
            switch (activeLevel)
            {
                case ActiveLevel.NotVeryActive:
                    {
                        result = calories * 1.4;
                        break;
                    }
                case ActiveLevel.Moderate:
                    {
                        result = calories * 1.8;
                        break;
                    }
                case ActiveLevel.VeryActive:
                    {
                        result = calories * 2.4;
                        break;
                    }
            }
            return result;
        }

        private int CalculateCaloriesFromRunning()
        {
            var kmsPerHour = Convertor.PaceToSpeed(data.AvgPace);
            var distanceValue = 0.0395 + (0.00327 * kmsPerHour) + (0.000455 * kmsPerHour) + 0.00701;
            var weightInPounds = data.IsMetric ? Convertor.KgsToPounds(data.Weight) : data.Weight;
            var result = (distanceValue * 0.621371192) * data.TimeSpent * weightInPounds;
            return Convert.ToInt32(Math.Round(result, 0));
        }

        private void CalculateRunnersDiet()
        {
            Result.RunnersDiet = new RunnersDiet()
            {
                Carbohydrates = CalculateCarbohydrates(Result.CaloriesBurned.Total),
                Fat = CalculateFat(Result.CaloriesBurned.Total),
                Protein = CalculateProtein(Result.CaloriesBurned.Total),
            };
        }

        private int CalculateCarbohydrates(int calories)
        {
            var result = calories * 0.57 / 4;
            return Convert.ToInt32(Math.Round(result, 0));
        }

        private int CalculateFat(int calories)
        {
            var result = calories * 0.3 / 9;
            return Convert.ToInt32(Math.Round(result, 0));
        }

        private int CalculateProtein(int calories)
        {
            var result = calories * 0.13 / 4;
            return Convert.ToInt32(Math.Round(result, 0));
        }
    }
}