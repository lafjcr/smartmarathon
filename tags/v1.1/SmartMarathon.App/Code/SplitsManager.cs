﻿using SmartMarathon.App.Models;
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
            data.Splits = BuildsSplits(data.Distance, data.GoalTime, data.Splits);
            if (data.GoalTime.TotalSeconds != 0)
            {
                data.Splits.Kilometers.ForEach(item => CalcuteSplit(data.Distance, item, true));
                data.Splits.Miles.ForEach(item => CalcuteSplit(data.Distance, item, false));
            }
        }

        private static TimeSpan CalcutaAvgPace(bool inKms, Distance distance, TimeSpan goalTime)
        {
            var conversionFactor = inKms ? distance.ToKilometers() : distance.ToMiles();
            return new TimeSpan(0, 0, Convert.ToInt32(Math.Truncate(goalTime.TotalSeconds / conversionFactor)));
        }

        private static SplitsModel BuildsSplits(Distance distance, TimeSpan goalTime, SplitsModel originalSplits)
        {
            var result = originalSplits == null ? new SplitsModel() : originalSplits;
            result.Kilometers = BuildsSplits(true, distance, goalTime, result.Kilometers);
            result.Miles = BuildsSplits(false, distance, goalTime, result.Miles);
            return result;
        }

        private static List<SplitData> BuildSplits(bool inKms, Distance distance)
        {
            return BuildsSplits(inKms, distance, new TimeSpan(), null);
        }

        //private static List<SplitData> BuildsSplits(bool inKms, Distance distance, TimeSpan goalTime, string marathonInfo)
        //{
        //    var splits = new List<SplitData>();
        //    var splitsCount = inKms ? distance.ToKilometers() : Math.Round(distance.ToMiles(), 1); ;
        //    var avgPace = CalcutaAvgPace(inKms, distance, goalTime).TotalSeconds;
        //    var splitFactor = inKms ? 1000 : conversionFactor;
        //    var originalSplits = String.IsNullOrEmpty(marathonInfo) ? null : (inKms ? marathonInfo.Split(';')[1].Split(',') : marathonInfo.Split(';')[2].Split(','));
        //    SplitData previous = null;
        //    double splitNo = 0;
        //    for (int i = 1; i < splitsCount; i++)
        //    {
        //        splitNo = i;
        //        var splitDistance = (splitNo - (previous != null ? previous.Split : 0)) * splitFactor;
        //        var splitCategory = originalSplits != null && i < originalSplits.Length ? (SplitCategory)Convert.ToInt32(originalSplits[i].ToString()) : SplitCategory.Flat;
        //        var split = new SplitData() { Split = splitNo, Category = splitCategory, Pace = new TimeSpan(0, 0, Convert.ToInt32(avgPace)), PreviousSplit = previous, Distance = splitDistance };
        //        splits.Add(split);
        //        previous = split;
        //    }            
        //    if (splitsCount - splitNo != 0)
        //    {
        //        var lastSplit = splitsCount;
        //        var lastSplitDistance = (lastSplit - (previous != null ? previous.Split : 0)) * splitFactor;
        //        var lastSplitCategory = originalSplits != null ? (SplitCategory)Convert.ToInt32(originalSplits[originalSplits.Length - 1].ToString()) : SplitCategory.Flat;
        //        splits.Add(new SplitData() { Split = lastSplit, Category = lastSplitCategory, Pace = new TimeSpan(0, 0, Convert.ToInt32(avgPace)), PreviousSplit = previous, Distance = lastSplitDistance });
        //    }
        //    return splits;
        //}

        private static List<SplitData> BuildsSplits(bool inKms, Distance distance, TimeSpan goalTime, List<SplitData> originalSplits)
        {
            var splits = new List<SplitData>();
            var splitsCount = inKms ? distance.ToKilometers() : Math.Round(distance.ToMiles(), 1); ;
            var avgPace = CalcutaAvgPace(inKms, distance, goalTime).TotalSeconds;
            var splitFactor = inKms ? 1000 : conversionFactor;
            //var originalSplits = String.IsNullOrEmpty(marathonInfo) ? null : (inKms ? marathonInfo.Split(';')[1].Split(',') : marathonInfo.Split(';')[2].Split(','));
            SplitData previous = null;
            double splitNo = 0;
            for (int i = 1; i < splitsCount; i++)
            {
                splitNo = i;
                var splitDistance = (splitNo - (previous != null ? previous.Split : 0)) * splitFactor;
                var splitCategory = originalSplits != null && i < originalSplits.Count ? originalSplits[i - 1].Category : SplitCategory.Flat;
                var split = new SplitData() { Split = splitNo, Category = splitCategory, Pace = new TimeSpan(0, 0, Convert.ToInt32(avgPace)), PreviousSplit = previous, Distance = splitDistance };
                splits.Add(split);
                previous = split;
            }
            if (splitsCount - splitNo != 0)
            {
                var lastSplit = splitsCount;
                var lastSplitDistance = (lastSplit - (previous != null ? previous.Split : 0)) * splitFactor;
                var lastSplitCategory = originalSplits != null ? originalSplits[originalSplits.Count - 1].Category : SplitCategory.Flat;
                splits.Add(new SplitData() { Split = lastSplit, Category = lastSplitCategory, Pace = new TimeSpan(0, 0, Convert.ToInt32(avgPace)), PreviousSplit = previous, Distance = lastSplitDistance });
            }
            return splits;
        }

        private static SplitData CalcuteSplit(Distance distance, SplitData split, bool inKms)
        {
            split = ApplyAltimetry(split, inKms);
            split = ApplyMarathonNationRaceApproach(distance, split, inKms);
            var splitFactor = inKms ? 1000 : conversionFactor;
            var splitSeconds = split.Pace.TotalSeconds / splitFactor * split.Distance;
            var splitTime = new TimeSpan(0, 0, Convert.ToInt32(splitSeconds));
            split.Time = split.PreviousSplit != null ? split.PreviousSplit.Time.Add(splitTime) : splitTime;
            return split;
        }

        private static SplitData ApplyMarathonNationRaceApproach(Distance distance, SplitData split, bool inKms)
        {
            var pace = split.Pace.TotalSeconds;
            double secondsToApply = 0;
            var limit1 = 5 / marathonDistanceInMiles; // According Marathon Miles 1 - 5 = 19.07%
            limit1 = inKms ? limit1 * distance.ToKilometers() : limit1 * distance.ToMiles();
            var limit2 = 20 / marathonDistanceInMiles; // According Marathon Miles 6 - 20 = 57.21%
            limit2 = inKms ? limit2 * distance.ToKilometers() : limit2 * distance.ToMiles();
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