using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SmartMarathon.WebApi.Models
{
    public class NutritionRequestModel
    {
        public bool IsMetric { get; set; }
        public Gender Gender { get; set; }
        public int Age { get; set; }
        /// <summary>
        /// Expected centimeters as unit
        /// </summary>
        public int Height { get; set; }
        public double Weight { get; set; }
        public ActiveLevel ActiveLevel { get; set; }
        /// <summary>
        /// Expected minutes as unit
        /// </summary>
        public int TimeSpent { get; set; }
        /// <summary>
        /// Expected minutes as unit (no seconds)
        /// </summary>
        public double AvgPace { get; set; }
    }

    public class NutritionResponseModel
    {
        public CaloriesBurned CaloriesBurned { get; set; }
        public RunnersDiet RunnersDiet { get; set; }
    }

    public class CaloriesBurned
    {
        public int WithoutRunning { get; set; }
        public int FromRunning { get; set; }
        public int Total { get { return WithoutRunning + FromRunning; } }
    }

    public class RunnersDiet
    {
        public int Carbohydrates { get; set; }
        public int Fat { get; set; }
        public int Protein { get; set; }
    }

    public enum Gender
    {
        Female = 0,
        Male = 1
    }

    public enum ActiveLevel
    {
        NotVeryActive = 0,
        Moderate = 1,
        VeryActive = 2
    }
}