using SmartMarathon.App.Code;
using SmartMarathon.App.Models;
using System;
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
                return View(new SmartMarathonData(true));
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
                return View(model);
            }
            catch (Exception ex)
            {
                return View("Error", new HandleErrorInfo(ex, "Home", "Index"));
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