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
        [Display(Name = "Label_Distance", ResourceType = typeof(Resources))]
        public Distance Distance { get; set; }
        
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

        public SmartMarathonData() : this(false)
        {

        }

        public SmartMarathonData(bool create)
        {
            Distance = Distance.K42;
            Distances = new SelectList(Code.SmartMarathon.Distances(), "Value", "Text");
            SplitCategories = new SelectList(Code.SmartMarathon.SplitCategories(), "Value", "Text");
            var marathons = Code.SmartMarathon.Marathons(Distance) as List<SelectListItem>;
            Marathons = new SelectList(marathons, "Value", "Text");
            if (create)
            {                
                InKms = true;                
                Marathon = marathons.Find(item => item.Selected).Value;
                Splits = Code.SplitsManager.Build(Distance);
            }
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
    }

    public enum SplitCategory
    {
        Downhill = -1,
        Flat = 0,
        Uphill = 1
    }

    public enum Distance
    {
        [Description("Marathon")]
        K42 = 42,
        [Description("30K")]
        K30 = 30,
        [Description("Half Marathon")]
        K21 = 21,
        [Description("10K")]
        K10 = 10,
        [Description("5K")]
        K5 = 5
    }
}
