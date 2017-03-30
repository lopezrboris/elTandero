// --------------------------------------------------------------------------------------------------------------------
// <copyright file="HomeController.cs" company="">
//   
// </copyright>
// <summary>
//   The home controller.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace elTandero.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Web.Mvc;

    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;

    /// <summary>The home controller.</summary>
    public class HomeController : Controller
    {
        /// <summary>The index.</summary>
        /// <returns>The <see cref="ActionResult"/>.</returns>
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>The about.</summary>
        /// <returns>The <see cref="ActionResult"/>.</returns>
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        /// <summary>The contact.</summary>
        /// <returns>The <see cref="ActionResult"/>.</returns>
        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        /// <summary>The campañas.</summary>
        /// <returns>The <see cref="ActionResult"/>.</returns>
        public ActionResult Campañas()
        {
            using (StreamReader r = new StreamReader(AppDomain.CurrentDomain.BaseDirectory + @"\Content\events.json"))
            {
                string json = r.ReadToEnd();
                List<Campaña> items = JsonConvert.DeserializeObject<List<Campaña>>(json, new IsoDateTimeConverter { DateTimeFormat = "yyyy-MM-dd" });
                return this.Json(items, JsonRequestBehavior.AllowGet);
            }
        }
    }

    /// <summary>The campaña.</summary>
    public class Campaña
    {
        /// <summary>Gets or sets the title.</summary>
        public string title { get; set; }

        /// <summary>Gets or sets the start.</summary>
        public DateTime start { get; set; }

        /// <summary>Gets or sets the end.</summary>
        public DateTime end { get; set; }

        /// <summary>Gets or sets the url.</summary>
        public string url { get; set; }

        /// <summary>Gets or sets the color.</summary>
        public string color { get; set; }
    }
}