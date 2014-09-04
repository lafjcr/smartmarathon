using SmartMarathon.App.Code;
using SmartMarathon.App.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SmartMarathon.App.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View(new SmartMarathonData(true));
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
            ViewData["InKms"] = model.InKms;
            ViewData["SplitCategories"] = model.SplitCategories;
            return PartialView("Splits", model);
        }

        public ActionResult About()
        {
            return View();
        }

        public ActionResult Contact()
        {
            return View();
        }
    }
}