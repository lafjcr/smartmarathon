using SmartMarathon.App.Code;
using System;
using System.Threading;
using System.Web;
using System.Web.Helpers;
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

            AntiForgeryConfig.SuppressXFrameOptionsHeader = true;
        }

        protected void Session_Start()
        {
            Code.SmartMarathon.LoadMarathons();
        }

        protected void Application_BeginRequest(Object source, EventArgs e)
        {
            try
            {
                ChangeLanguage();
            }
            catch (Exception ex)
            {

            }
        }

        private void ChangeLanguage()
        {
            var language = Request.Cookies["Language"] != null && !String.IsNullOrEmpty(Request.Cookies["Language"].Value) ? Request.Cookies["Language"].Value : String.Empty;
            if ((String.IsNullOrEmpty(language) || language == "undefined") && Request.UserLanguages != null && Request.UserLanguages.Length > 0)
            {
                language = Request.UserLanguages[0];
                language = language.Length > 2 ? language.Substring(0, 2) : language;
            }
            if (!String.IsNullOrEmpty(language))
            {
                Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(language);
                Thread.CurrentThread.CurrentUICulture = Thread.CurrentThread.CurrentCulture;
                Request.Cookies.Add(new HttpCookie("Language", language));
            }
        }
    }
}
