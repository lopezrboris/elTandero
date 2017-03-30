using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(elTandero.Startup))]
namespace elTandero
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
