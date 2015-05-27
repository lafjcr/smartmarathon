using SmartMarathon.App.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SmartMarathon.App.Code
{
    public class SplitsManager
    {
        private const double marathonDistanceInKms = 42.195;
        private const double marathonDistanceInMiles = 26.21875;
        private const double conversionFactor = 1.609344; // marathonDistanceInKms / marathonDistanceInMiles;

        public static SplitsModel Build(Distance distance)
        {
            var splits = new SplitsModel();
            splits.Kilometers = BuildSplits(true, distance);
            splits.Miles = BuildSplits(false, distance);
            return splits;
        }

        public static void Calculate(SmartMarathonData data)
        {
            data.RealDistance = data.Distance != Distance.K0 ? (data.InKms ? data.Distance.ToKilometers() : data.Distance.ToMiles()) : data.RealDistance;

            var distanceKms = data.InKms ? data.RealDistance : data.RealDistance.FromMilesToKilometers();
            var distanceMiles = data.InKms ? data.RealDistance.FromKilometersToMiles() : data.RealDistance;

            // Calculates avg pace
            data.PaceByKm = CalcuteAvgPace(distanceKms, data.GoalTime);
            data.PaceByMile = CalcuteAvgPace(distanceMiles, data.GoalTime);

            // Create splits
            data.Splits = data.Splits == null ? new SplitsModel() : data.Splits;

            // Build base splits
            data.Splits.Kilometers = BuildsSplits(true, distanceKms, data.GoalTime, data.Splits.Kilometers);
            data.Splits.Miles = BuildsSplits(false, distanceMiles, data.GoalTime, data.Splits.Miles);

            // Apply calculations to splits
            if (data.GoalTime.TotalSeconds != 0)
            {
                data.Splits.Kilometers.ForEach(item => CalcuteSplit(distanceKms, item, true));
                data.Splits.Miles.ForEach(item => CalcuteSplit(distanceMiles, item, false));
            }
        }

        public static void CalculateAvgPaces(AvgPacesModel data)
        {
            data.RealDistance = data.Distance != Distance.K0 ? (data.InKms ? data.Distance.ToKilometers() : data.Distance.ToMiles()) : data.RealDistance;

            var distanceKms = data.InKms ? data.RealDistance : data.RealDistance.FromMilesToKilometers();
            var distanceMiles = data.InKms ? data.RealDistance.FromKilometersToMiles() : data.RealDistance;

            var goalTime = new TimeSpan(data.GoalTime_Hours, data.GoalTime_Minutes, data.GoalTime_Seconds);

            // Calculates avg pace
            data.PaceByKm = CalcuteAvgPace(distanceKms, goalTime);
            data.PaceByMile = CalcuteAvgPace(distanceMiles, goalTime);
        }

        public static void CalculateGoalTime(GoalTimeModel data)
        {
            data.RealDistance = data.Distance != Distance.K0 ? (data.InKms ? data.Distance.ToKilometers() : data.Distance.ToMiles()) : data.RealDistance;
            
            var paceByKm = new TimeSpan(0, data.PaceByKm_Minutes, data.PaceByKm_Seconds);
            var paceByMile = new TimeSpan(0, data.PaceByMile_Minutes, data.PaceByMile_Seconds);
            var pace = data.InKms ? paceByKm : paceByMile;

            // Calculates goal time
            var goalTimeSeconds = pace.TotalSeconds * data.RealDistance;
            data.GoalTime = new TimeSpan(0, 0, Convert.ToInt32(goalTimeSeconds));
        }

        private static TimeSpan CalcuteAvgPace(Double distance, TimeSpan goalTime)
        {
            var result = new TimeSpan();
            if (distance > 0)
            {
                result = new TimeSpan(0, 0, Convert.ToInt32(Math.Truncate(goalTime.TotalSeconds / distance)));
            }
            return result;
        }

        private static List<SplitData> BuildSplits(bool inKms, Distance distance)
        {
            var realDistance = inKms ? distance.ToKilometers() : Math.Round(distance.ToMiles(), 1);
            return BuildsSplits(inKms, realDistance, new TimeSpan(), null);
        }

        private static List<SplitData> BuildsSplits(bool inKms, Double distance, TimeSpan goalTime, List<SplitData> originalSplits)
        {
            var splits = new List<SplitData>();
            var splitsCount = distance;
            var avgPace = CalcuteAvgPace(distance, goalTime).TotalSeconds;
            var splitFactor = inKms ? 1000 : conversionFactor;
            SplitData previous = null;
            double splitNo = 0;
            for (int i = 1; i < splitsCount; i++)
            {
                splitNo = i;
                var splitDistance = (splitNo - (previous != null ? previous.Split : 0)) * splitFactor;
                var splitCategory = originalSplits != null && i < originalSplits.Count ? originalSplits[i - 1].Category : SplitCategory.Flat;
                var split = new SplitData() { Split = Math.Round(splitNo, 3), Category = splitCategory, Pace = new TimeSpan(0, 0, Convert.ToInt32(avgPace)), PreviousSplit = previous, Distance = splitDistance };
                splits.Add(split);
                previous = split;
            }
            if (splitsCount - splitNo != 0)
            {
                var lastSplit = splitsCount;
                var lastSplitDistance = (lastSplit - (previous != null ? previous.Split : 0)) * splitFactor;
                var lastSplitCategory = originalSplits != null ? originalSplits[originalSplits.Count - 1].Category : SplitCategory.Flat;
                splits.Add(new SplitData() { Split = Math.Round(lastSplit, 3), Category = lastSplitCategory, Pace = new TimeSpan(0, 0, Convert.ToInt32(avgPace)), PreviousSplit = previous, Distance = lastSplitDistance });
            }
            return splits;
        }

        private static SplitData CalcuteSplit(Double distance, SplitData split, bool inKms)
        {
            split = ApplyAltimetry(split, inKms);
            split = ApplyMarathonNationRaceApproach(distance, split, inKms);
            var splitFactor = inKms ? 1000 : conversionFactor;
            var splitSeconds = split.Pace.TotalSeconds / splitFactor * split.Distance;
            var splitTime = new TimeSpan(0, 0, Convert.ToInt32(splitSeconds));
            split.Time = split.PreviousSplit != null ? split.PreviousSplit.Time.Add(splitTime) : splitTime;
            return split;
        }

        private static SplitData ApplyMarathonNationRaceApproach(Double distance, SplitData split, bool inKms)
        {
            var pace = split.Pace.TotalSeconds;
            double secondsToApply = 0;
            var limit1 = 5 / marathonDistanceInMiles; // According Marathon Miles 1 - 5 = 19.07%
            limit1 = inKms ? limit1 * distance : limit1 * distance.FromKilometersToMiles();
            var limit2 = 20 / marathonDistanceInMiles; // According Marathon Miles 6 - 20 = 57.21%
            limit2 = inKms ? limit2 * distance : limit2 * distance.FromKilometersToMiles();
            if (split.Split < limit1)  // First 19.07%
            {
                secondsToApply = 15; // Add 15 seconds per mile
            }
            else if (split.Split < limit2)  // Next 57.21%
            {
                secondsToApply = -5; // Remove 5 seconds per mile
            }
            else // Final 23.72%
            {
                // Keep avg pace
            }
            secondsToApply = inKms ? Math.Truncate(secondsToApply / conversionFactor) : secondsToApply;
            split.Pace = new TimeSpan(0, 0, Convert.ToInt32(pace + secondsToApply));
            return split;
        }

        private static SplitData ApplyAltimetry(SplitData split, bool inKms)
        {
            int secondsToApply = 0;
            if (split.Category == SplitCategory.Uphill)
            {
                secondsToApply = 10; // Add 10 seconds per mile
            }
            else if (split.Category == SplitCategory.Downhill)
            {
                secondsToApply = -10; // Remove 10 seconds per mile
            }
            else if (split.Category == SplitCategory.Flat)
            {
                // Keep pace
            }
            secondsToApply = inKms ? Convert.ToInt32(secondsToApply / conversionFactor) : secondsToApply;
            split.Pace = new TimeSpan(0, 0, Convert.ToInt32(split.Pace.TotalSeconds + secondsToApply));
            return split;
        }
    }
}