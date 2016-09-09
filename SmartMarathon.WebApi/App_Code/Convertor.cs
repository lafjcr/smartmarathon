using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SmartMarathon.WebApi.Code
{
    public static class Convertor
    {
        private const double PoundsToKgsConversionFactor = 0.454;
        private const int HourMinutes = 60;
        private const double MilesToKmsConversionFactor = 1.609344;

        public static double PoundsToKgs(double pounds)
        {
            var result = pounds * PoundsToKgsConversionFactor;
            return result;
        }
        public static double KgsToPounds(double kgs)
        {
            var result = kgs / PoundsToKgsConversionFactor;
            return result;
        }


        public static double MinutesPerMileToMinutesPerKm(double minutes)
        {
            var milesPerHour = PaceToSpeed(minutes);
            var kmsPerHour = milesPerHour * MilesToKmsConversionFactor;
            var result = SpeedToPace(kmsPerHour);
            return result;
        }

        public static double PaceToSpeed(double minutes)
        {
            var result = (1 / minutes) * HourMinutes;
            return result;
        }

        public static double SpeedToPace(double kmsPerHour)
        {
            var result = (1 / kmsPerHour) * HourMinutes;
            return result;
        }
    }
}