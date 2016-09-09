using SmartMarathon.App.Code;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;

namespace SmartMarathon.App.Models
{
    public class SmartMarathonData
    {
        [Required]
        [Display(Name = "Label_GoalTime", ResourceType=typeof(Resources))]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = @"{0:hh\:mm\:ss}")]
        public TimeSpan GoalTime { get; set; }

        [Required]
        [Display(Name = "Label_GoalPace", ResourceType = typeof(Resources))]
        [DisplayFormat(DataFormatString = @"{0:mm\:ss}")]
        public TimeSpan PaceByKm { get; set; }

        [Required]
        [Display(Name = "Label_GoalPace", ResourceType = typeof(Resources))]
        [DisplayFormat(DataFormatString = @"{0:mm\:ss}")]
        public TimeSpan PaceByMile { get; set; }

        [Required]
        [Display(Name = "Label_Distance", ResourceType = typeof(Resources))]
        public Distance Distance { get; set; }

        [Required]
        [Display(Name = "Label_RealDistance", ResourceType = typeof(Resources))]
        public Double RealDistance { get; set; }
        
        [Required]
        [Display(Name = "Label_Event", ResourceType = typeof(Resources))]
        public string Marathon { get; set; }

        [Required]
        public bool InKms { get; set; }

        [Required]
        public string Language { get; set; }
        
        [Required]
        public SplitsModel Splits { get; set; }

        public SelectList Marathons { get; set; }

        public SelectList Distances { get; set; }

        public SelectList SplitCategories { get; set; }

        public bool ShowDistances{ get; internal set; }

        public bool ShowEvents { get; internal set; }

        public bool IsExternal { get; internal set; }

        public SmartMarathonData() : this(false, null, false)
        {

        }

        public SmartMarathonData(bool create, List<EventModel> events = null, List<Distance> distances = null, bool isExternal = false)
        {
            Distance =
                distances != null && distances.Count > 0 ?
                    distances[0] :
                    (events != null && events.Count > 0 ?
                        events[0].Distance : Distance.K42);
            SplitCategories = new SelectList(Code.SmartMarathon.SplitCategories(), "Value", "Text");
            List<SelectListItem> marathons = null;
            if (events != null && events.Count > 0)
            {
                marathons = Code.SmartMarathon.Marathons(events) as List<SelectListItem>;
            }
            else
            {
                marathons = Code.SmartMarathon.Marathons(Distance) as List<SelectListItem>;
            }
            Marathons = new SelectList(marathons, "Value", "Text");
            List<SelectListItem> distanceItems = null;
            if (create)
            {                
                InKms = true;
                distanceItems = Code.SmartMarathon.Distances(distances);
                Distances = new SelectList(distanceItems, "Value", "Text");
                RealDistance = Distance.ToKilometers();
                Marathon = marathons.Find(item => item.Selected).Value;
                Splits = Code.SplitsManager.Build(Distance);
            }
            ShowEvents = marathons != null && marathons.Count > 1;
            ShowDistances = (events == null || events.Count == 0) &&
                (distanceItems != null && distanceItems.Count > 1);
            IsExternal = isExternal;
        }

        public SmartMarathonData(bool create, EventModel raceEvent = null, bool isExternal = false)
        {
            Distance = raceEvent != null ? raceEvent.Distance : Distance.K42;
            SplitCategories = new SelectList(Code.SmartMarathon.SplitCategories(), "Value", "Text");
            List<SelectListItem> marathons = null;
            List<SelectListItem> distanceItems = null;
            if (raceEvent != null)
            {
                marathons = Code.SmartMarathon.Marathons(raceEvent) as List<SelectListItem>;
                //var distances = new List<Distance>() { Distance };
                //distanceItems = Code.SmartMarathon.Distances(distances);
            }
            else
            {
                marathons = Code.SmartMarathon.Marathons(Distance) as List<SelectListItem>;
                //distanceItems = Code.SmartMarathon.Distances();
            }
            distanceItems = Code.SmartMarathon.Distances();
            Distances = new SelectList(distanceItems, "Value", "Text");
            Marathons = new SelectList(marathons, "Value", "Text");
            if (create)
            {
                InKms = true;
                RealDistance = Distance.ToKilometers();
                Marathon = marathons.Find(item => item.Selected).Value;
                Splits = Code.SplitsManager.Build(Distance);
            }
            IsExternal = isExternal;
            ShowEvents = !IsExternal || (marathons != null && marathons.Count > 1);
            ShowDistances = !IsExternal || ((raceEvent == null) &&
                (distanceItems != null && distanceItems.Count > 1));
        }
    }

    public class SplitsModel
    {
        [Required]
        [Display(Name = "Kilometers"), UIHint("Splits")]
        public List<SplitData> Kilometers { get; set; }

        [Required]
        [Display(Name = "Miles"), UIHint("Splits")]
        public List<SplitData> Miles { get; set; }
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
        public Distance Distance { get; set; }
        public string Country { get; set; }
        public string WebSite { get; set; }
    }

    public class GoalTimeAndAvgPacesModel
    {
        public bool InKms { get; set; }
        public Distance Distance { get; set; }
        public Double RealDistance { get; set; }
        public TimeSpan GoalTime { get; set; }
        public TimeSpan PaceByKm { get; set; }
        public TimeSpan PaceByMile { get; set; }
    }

    public class EventModel
    {
        public Distance Distance { get; set; }
        public int Id { get; set; }
    }

    public enum SplitCategory
    {
        Downhill = -1,
        Flat = 0,
        Uphill = 1
    }

    public enum Distance
    {
        [LocalizedDescription("Distance_Marathon", typeof(Resources))]
        K42 = 42,
        [LocalizedDescription("Distance_30K", typeof(Resources))]
        K30 = 30,
        [LocalizedDescription("Distance_HalfMarathon", typeof(Resources))]
        K21 = 21,
        [LocalizedDescription("Distance_10K", typeof(Resources))]
        K10 = 10,
        [LocalizedDescription("Distance_5K", typeof(Resources))]
        K5 = 5,
        [LocalizedDescription("Distance_Other", typeof(Resources))]
        K0 = 0
    }
}
