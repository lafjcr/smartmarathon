using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;

namespace SmartMarathon.App.Models
{
    public class SmartMarathonData
    {
        [Required]
        [Display(Name = "Marathons")]
        public SelectList Marathons { get; set; }

        [Required]
        [Display(Name = "Split Categories")]
        public SelectList SplitCategories { get; set; }

        [Required]
        [Display(Name = "GOAL TIME")]
        [DataType(DataType.Time)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = @"{0:hh\:mm\:ss}")]
        public TimeSpan GoalTime { get; set; }

        [Required]
        [Display(Name = "MARATHON")]
        public string Marathon { get; set; }
        

        [Required]
        [Display(Name = "InKms")]
        public bool InKms { get; set; }        

        [Required]
        [Display(Name = "Splits"), UIHint("Splits")]
        public List<SplitData> SplitsK { get; set; }

        [Required]
        [Display(Name = "Splits"), UIHint("Splits")]
        public List<SplitData> SplitsM { get; set; }

        public SmartMarathonData()
        {
            InKms = true;
            Marathons = new SelectList(Code.SmartMarathon.Marathons(), "Value", "Text");
            SplitCategories = new SelectList(Code.SmartMarathon.SplitCategories(), "Value", "Text");
            SplitsK = CreateSplits(true);
            SplitsM = CreateSplits(false);
        }

        private const double marathonDistanceInKms = 42.195;
        private const double marathonDistanceInMiles = 26.21875;
        private const double conversionFactor = 1.609344; // marathonDistanceInKms / marathonDistanceInMiles;

        public void Calculate()
        {
            InKms = true;
            SplitsK = CreateSplits(InKms, SplitsK);
            if (GoalTime.TotalSeconds != 0)
            {
                SplitsK.ForEach(item => CalcuteSplit(item));
            }

            InKms = false;
            SplitsM = CreateSplits(InKms, SplitsM);
            if (GoalTime.TotalSeconds != 0)
            {
                SplitsM.ForEach(item => CalcuteSplit(item));
            }
        }

        private TimeSpan CalcutaAvgPace()
        {
            return new TimeSpan(0, 0, Convert.ToInt32(Math.Truncate(GoalTime.TotalSeconds / marathonDistanceInMiles)));
        }

        private List<SplitData> CreateSplits(bool inKms)
        {
            return CreateSplits(InKms, null);
        }

        private List<SplitData> CreateSplits(bool inKms, List<SplitData> originalSplits)
        {
            var splits = new List<SplitData>();
            var splitsCount = inKms ? marathonDistanceInKms : marathonDistanceInMiles;
            var avgPace = inKms ? CalcutaAvgPace().TotalSeconds / conversionFactor : CalcutaAvgPace().TotalSeconds;
            var splitFactor = InKms ? 1000 : conversionFactor;
            SplitData previous = null;
            for (int i = 0; i < splitsCount - 1; i++)
            {
                var splitNo = i + 1;
                var splitDistance = (splitNo - (previous != null ? previous.Split : 0)) * splitFactor;
                var splitCategory = originalSplits != null ? originalSplits[i].Category : SplitCategory.Flat;
                var split = new SplitData() { Split = splitNo, Category = splitCategory, Pace = new TimeSpan(0, 0, Convert.ToInt32(avgPace)), PreviousSplit = previous, Distance = splitDistance};
                splits.Add(split);
                previous = split;
            }
            var lastSplit = inKms ? 42.195 : 26.2;
            var lastSplitDistance = (lastSplit - (previous != null ? previous.Split : 0)) * splitFactor;
            var lastSplitCategory = originalSplits != null ? originalSplits[originalSplits.Count - 1].Category : SplitCategory.Flat;
            splits.Add(new SplitData() { Split = lastSplit, Category = lastSplitCategory, Pace = new TimeSpan(0, 0, Convert.ToInt32(avgPace)), PreviousSplit = previous, Distance = lastSplitDistance });
            return splits;
        }

        private SplitData CalcuteSplit(SplitData split)
        {
            split = ApplyAltimetry(split);
            split = ApplyMarathonNationRaceApproach(split);
            var splitFactor = InKms ? 1000 : conversionFactor;
            var splitSeconds = split.Pace.TotalSeconds / splitFactor * split.Distance;
            var splitTime = new TimeSpan(0, 0, Convert.ToInt32(splitSeconds));
            split.Time = split.PreviousSplit != null ? split.PreviousSplit.Time.Add(splitTime) : splitTime;
            return split;
        }

        private SplitData ApplyMarathonNationRaceApproach(SplitData split)
        {
            return InKms ? ApplyMarathonNationRaceApproachForKms(split) : ApplyMarathonNationRaceApproachForMiles(split);
        }
        
        private SplitData ApplyMarathonNationRaceApproachForMiles(SplitData split)
        {
            var pace = split.Pace.TotalSeconds;
            double secondsToApply = 0;
            if (split.Split < 6)  // Miles 1 - 5
            {
                secondsToApply = 15; // Add 15 seconds per mile
            }
            else if (split.Split < 21)  // Miles 6 - 20
            {
                secondsToApply = -5; // Remove 5 seconds per mile
            }
            else // Miles 21 - 26
            {
                // Keep avg pace
            }
            split.Pace = new TimeSpan(0, 0, Convert.ToInt32(pace + secondsToApply));
            return split;
        }

        private SplitData ApplyMarathonNationRaceApproachForKms(SplitData split)
        {
            var pace = split.Pace.TotalSeconds;
            double secondsToApply = 0;
            if (split.Split < 9)  // Kms 1 - 8
            {
                secondsToApply = 15; // Add 15 seconds per mile
            }
            else if (split.Split < 33)  // Kms 9 - 32
            {
                secondsToApply = -5; // Remove 5 seconds per mile
            }
            else // Kms 33 - 42
            {
                // Keep avg pace
            }
            secondsToApply = Math.Truncate(secondsToApply / conversionFactor);
            split.Pace = new TimeSpan(0, 0, Convert.ToInt32(pace + secondsToApply));
            return split;
        }

        private SplitData ApplyAltimetry(SplitData split)
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
            secondsToApply = InKms ? Convert.ToInt32(secondsToApply / conversionFactor) : secondsToApply;
            split.Pace = new TimeSpan(0, 0, Convert.ToInt32(split.Pace.TotalSeconds + secondsToApply));
            return split;
        }
    }

    public class SplitData
    {
        [Required]
        [Display(Name = "Split")]
        public double Split { get; set; }

        [Required]
        [Display(Name = "Category")]
        public SplitCategory Category { get; set; }

        [Required]
        [Display(Name = "Pace")]
        [DisplayFormat(DataFormatString = @"{0:mm\:ss}")]
        public TimeSpan Pace { get; set; }

        [Display(Name = "Time")]
        [DataType(DataType.Time)]
        [DisplayFormat(DataFormatString = @"{0:h\:mm\:ss}")]
        public TimeSpan Time { get; set; }

        [Display(Name = "Distance")]
        [DisplayFormat(DataFormatString = @"{0:h\:mm\:ss}")]
        public double Distance{ get; set; }

        internal SplitData PreviousSplit { get; set; }
    }

    public class MarathonData
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Miles { get; set; }
        public string Kms { get; set; }
    }

    public enum SplitCategory
    {
        Downhill = -1,
        Flat = 0,
        Uphill = 1
    }
}
