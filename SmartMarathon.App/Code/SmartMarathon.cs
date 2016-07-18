using Newtonsoft.Json;
using SmartMarathon.App.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SmartMarathon.App.Code
{
    public class SmartMarathon
    {
        public static void LoadMarathons()
        {
            var json = File.ReadAllText(HttpContext.Current.Server.MapPath("~/marathons.json"));
            var marathons = JsonConvert.DeserializeObject<List<MarathonData>>(json);
            HttpContext.Current.Session["Marathons"] = marathons;
        }

        public static List<MarathonData> GetMarathons()
        {
            var marathons = HttpContext.Current.Session["Marathons"] as List<MarathonData>;
            return marathons;
        }

        public static IEnumerable<SelectListItem> Marathons(Distance distance)
        {
            var marathons = GetMarathons();

            var result = new List<SelectListItem>();
            marathons = marathons.Where(item => item.Distance == distance).OrderBy(item => item.Country).ThenBy(item => item.Name).ToList();
            marathons.ForEach(item => result.Add(new SelectListItem() { Value = String.Format("{0};{1};{2}", item.Id, item.Kms, item.Miles), Text = String.Format("[{0}] {1}", item.Country, item.Name), Selected = item.Id == 0}));            

            return result;
        }

        public static IEnumerable<SelectListItem> Marathons(List<EventModel> events)
        {
            var marathons = GetMarathons();

            var result = new List<SelectListItem>();
            marathons = marathons.Where(item => CompareEvent(events, item)).OrderBy(item => item.Country).ThenBy(item => item.Name).ToList();
            marathons.ForEach(item => result.Add(new SelectListItem() { Value = String.Format("{0};{1};{2}", item.Id, item.Kms, item.Miles), Text = String.Format("[{0}] {1}", item.Country, item.Name), Selected = item.Id == events[0].Id }));

            return result;
        }

        public static IEnumerable<SelectListItem> Marathons(EventModel raceEvent)
        {
            var marathons = GetMarathons();

            var result = new List<SelectListItem>();
            marathons = marathons.Where(item => item.Distance == raceEvent.Distance).ToList();
            marathons.ForEach(item => result.Add(new SelectListItem() { Value = String.Format("{0};{1};{2}", item.Id, item.Kms, item.Miles), Text = String.Format("[{0}] {1}", item.Country, item.Name), Selected = item.Id == raceEvent.Id }));

            return result;
        }

        private static bool CompareEvent(List<EventModel> events, MarathonData marathon)
        {
            return events.Any(i => i.Distance == marathon.Distance && i.Id == marathon.Id);
        }

        public static IEnumerable<SelectListItem> SplitCategories()
        {
            var items = Enum.GetValues(typeof(SplitCategory)).Cast<SplitCategory>();
            var list = items.Select(i => new SelectListItem { Text = i.ToString(), Value = ((int)i).ToString() }).ToList();
            return list;
        }

        public static List<SelectListItem> Distances(IEnumerable<Distance> distances = null)
        {
            var firstDistance = distances != null ? distances.FirstOrDefault() : Distance.K0;
            var items = distances ?? Enum.GetValues(typeof(Distance)).Cast<Distance>();
            var orderedItems = items.OrderByDescending(i => i.ToKilometers());
            var list = orderedItems.Select(i => new SelectListItem { Text = i.Description(), Value = ((int)i).ToString(), Selected = i == firstDistance }).ToList();
            return list;
        }
    }    
}