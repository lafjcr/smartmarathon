using SmartMarathon.App.Code;
using SmartMarathon.App.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web.Mvc;

namespace SmartMarathon.App.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            try
            {
                return View(new SmartMarathonData(true, null, false));
            }
            catch (Exception ex)
            {
                return View("Error", new HandleErrorInfo(ex, "Home", "Index"));
            }
        }

        [HttpPost]
        public ActionResult Index(SmartMarathonData model)
        {
            try
            {
                EventModel raceEvent = null;
                if (!String.IsNullOrEmpty(Request.UrlReferrer.Query))
                {
                    var requestParams = Request.UrlReferrer.Query.Substring(1, Request.UrlReferrer.Query.Length - 1).Split('&').ToList();

                    // Parse race event                    
                    try
                    {
                        var eventParam = requestParams.Find(i => i.StartsWith("r="));
                        if (eventParam != null)
                        {
                            eventParam = eventParam.Replace("r=", "");
                            var eventsParamValues = eventParam.Split('K');
                            var eventDistance = Convert.ToInt32(eventsParamValues[0]);
                            var eventID = Convert.ToInt32(eventsParamValues[1]);
                            if (!Enum.IsDefined(typeof(Distance), eventDistance))
                                return View("Error", new HandleErrorInfo(
                                    new ArgumentException("Invalid events parameter.", "r"), "Home", "Calculator"));
                            var eventDistanceValue = (Distance)eventDistance;
                            raceEvent = new EventModel { Id = eventID, Distance = eventDistanceValue };
                        }
                    }
                    catch (Exception innerEx)
                    {
                        return View("Error", new HandleErrorInfo(
                            new ArgumentException("Invalid events parameter.", "r", innerEx), "Home", "Calculator"));
                    }
                }

                var newModel = new SmartMarathonData(true, raceEvent, false);
                newModel.GoalTime = model.GoalTime;
                newModel.Marathon = model.Marathon;
                SplitsManager.Calculate(newModel);
                ViewData["SplitCategories"] = newModel.SplitCategories;

                return View(newModel);
            }
            catch (Exception ex)
            {
                return View("Error", new HandleErrorInfo(ex, "Home", "Index"));
            }
        }

        public ActionResult Calculator()
        {
            try
            {
                // Parse race events
                var events = new List<EventModel>();
                try
                {
                    var eventParam = Request.Params["r"];
                    if (eventParam != null)
                    {
                        var eventsParams = eventParam.Split('-');
                        for (int i = 0; i < eventsParams.Length; i++)
                        {
                            var eventsParamValues = eventsParams[i].Split('K');
                            var eventDistance = Convert.ToInt32(eventsParamValues[0]);
                            var eventID = Convert.ToInt32(eventsParamValues[1]);
                            if (!Enum.IsDefined(typeof(Distance), eventDistance))
                                return View("Error", new HandleErrorInfo(
                                    new ArgumentException("Invalid events parameter.", "r"), "Home", "Calculator"));
                            var eventDistanceValue = (Distance)eventDistance;
                            events.Add(new EventModel { Id = eventID, Distance = eventDistanceValue });
                        }
                    }
                }
                catch (Exception innerEx)
                {
                    return View("Error", new HandleErrorInfo(
                        new ArgumentException("Invalid events parameter.", "r", innerEx), "Home", "Calculator"));
                }

                // Parse distances
                var distances = new List<Distance>();
                try
                {                    
                    var distancesParam = Request.Params["d"];
                    if (distancesParam != null)
                    {
                        var distancesParams = distancesParam.Split('-');
                        for (int i = 0; i < distancesParams.Length; i++)
                        {
                            var distance = Convert.ToInt32(distancesParams[i]);
                            if (Enum.IsDefined(typeof(Distance), distance))
                                distances.Add((Distance)distance);
                            else
                                return View("Error", new HandleErrorInfo(
                                    new ArgumentException("Invalid distances parameter.", "d"), "Home", "Calculator"));
                        }
                    }
                }
                catch (Exception innerEx)
                {
                    return View("Error", new HandleErrorInfo(
                        new ArgumentException("Invalid distances parameter.", "d", innerEx), "Home", "Calculator"));
                }

                // Parse is external
                var isExternal = false;
                try
                {
                    var isExternalParam = Request.Params["e"];
                    if (isExternalParam != null)
                        isExternal = Convert.ToBoolean(Convert.ToInt32(isExternalParam));
                }
                catch (Exception innerEx)
                {
                    return View("Error", new HandleErrorInfo(
                        new ArgumentException("Invalid IsExternal parameter.", "e", innerEx), "Home", "Calculator"));
                }

                var model = new SmartMarathonData(true, events, distances, isExternal);
                return View(model);
            }
            catch (Exception ex)
            {
                return View("Error", new HandleErrorInfo(ex, "Home", "Calculator"));
            }
        }

        [HttpGet]
        public JsonResult EventsByDistance(string distance)
        {
            var data = Code.SmartMarathon.Marathons((Distance) Convert.ToInt32(distance));
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Calculate(SmartMarathonData model)
        {
            SplitsManager.Calculate(model);
            ViewData["SplitCategories"] = model.SplitCategories;
            return PartialView("Splits", model);
        }

        [HttpPost]
        public JsonResult CalculateGoalTimeAndAvgPaces(GoalTimeAndAvgPacesModel model)
        {
            SplitsManager.CalculateGoalTimeAndAvgPaces(model);
            return Json(model, JsonRequestBehavior.AllowGet);
        }

        //public ActionResult About()
        //{
        //    return View();
        //}

        //public ActionResult Contact()
        //{
        //    return View();
        //}
    }
}