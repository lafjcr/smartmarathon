using SmartMarathon.App.Code;
using System;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace SmartMarathon.App
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            ModelBinders.Binders.Add(typeof(TimeSpan), new TimeSpanBinder());
        }

        protected void Session_Start()
        {
            Code.SmartMarathon.LoadMarathons();
        }
    }
}
