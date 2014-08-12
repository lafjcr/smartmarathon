using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(SmartMarathon.App.Startup))]
namespace SmartMarathon.App
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
