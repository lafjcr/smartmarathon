using System;
using System.Web.Mvc;

namespace SmartMarathon.App.Code
{
    public class TimeSpanBinder : IModelBinder
    {
        public object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            if (bindingContext.ModelType != typeof(TimeSpan))
                return null;

            int hours = 0, minutes = 0, seconds = 0;

            var name = bindingContext.ModelName;

            var format = Format1;

            // Hour is optional
            try
            {
                hours = ParseTimeComponent(String.Format(format, name, HoursKey), bindingContext);
            }
            catch
            {
                format = Format2;
                try
                {
                    hours = ParseTimeComponent(String.Format(format, name, HoursKey), bindingContext);
                }
                catch
                {
                }
            }
            minutes = ParseTimeComponent(String.Format(format, name, MinutesKey), bindingContext);
            seconds = ParseTimeComponent(String.Format(format, name, SecondsKey), bindingContext);

            return new TimeSpan(hours, minutes, seconds);
        }

        public int ParseTimeComponent(string component, ModelBindingContext bindingContext)
        {
            int result = 0;
            var val = bindingContext.ValueProvider.GetValue(component);

            if (!int.TryParse(val.AttemptedValue, out result))
                bindingContext.ModelState.AddModelError(component, String.Format("The field '{0}' is required.", component));

            // This is important
            bindingContext.ModelState.SetModelValue(component, val);

            return result;
        }

        private readonly string HoursKey = "Hours";
        private readonly string MinutesKey = "Minutes";
        private readonly string SecondsKey = "Seconds";
        private readonly string Format1 = "{0}.{1}";
        private readonly string Format2 = "{0}[{1}]";
    }
}