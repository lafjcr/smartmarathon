﻿using Newtonsoft.Json;
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

        public static IEnumerable<SelectListItem> Marathons(Distance distance)
        {
            var marathons = HttpContext.Current.Session["Marathons"] as List<MarathonData>;

            var result = new List<SelectListItem>();
            marathons = marathons.Where(item => item.Distance == distance).OrderBy(item => item.Country).ThenBy(item => item.Name).ToList();
            marathons.ForEach(item => result.Add(new SelectListItem() { Value = String.Format("{0};{1};{2}", item.Id, item.Kms, item.Miles), Text = String.Format("[{0}] {1}", item.Country, item.Name), Selected = item.Id == 0}));            

            return result;
        }

        public static IEnumerable<SelectListItem> SplitCategories()
        {
            var splitCategories = Enum.GetValues(typeof(SplitCategory)).Cast<SplitCategory>();
            var splitCategoriesList = from splitCategory in splitCategories
                                    select new SelectListItem
                                    {
                                        Text = splitCategory.ToString(),
                                        Value = ((int)splitCategory).ToString()
                                    };
            return splitCategoriesList;
        }

        public static IEnumerable<SelectListItem> Distances()
        {
            var distances = Enum.GetValues(typeof(Distance)).Cast<Distance>();
            var distancesList = from distance in distances
                                      select new SelectListItem
                                      {
                                          Text = distance.Description(),
                                          Value = ((int)distance).ToString()
                                      };
            return distancesList;
        }
    }    
}