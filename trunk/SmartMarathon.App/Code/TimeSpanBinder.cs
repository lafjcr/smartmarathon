using System;
using System.Web.Mvc;

namespace SmartMarathon.App.Code
{
    public class TimeSpanBinder : IModelBinder
    {
        public object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            // Ensure there's incomming data
            var key = bindingContext.ModelName;
            var valueProviderResult = bindingContext.ValueProvider.GetValue(key);

            if (valueProviderResult == null || string.IsNullOrEmpty(valueProviderResult.AttemptedValue))
            {
                return null;
            }

            // Preserve it in case we need to redisplay the form
            bindingContext.ModelState.SetModelValue(key, valueProviderResult);

            // Parse
            var hours = ((string[])valueProviderResult.RawValue)[0];
            var minutes = ((string[])valueProviderResult.RawValue)[1];
            var seconds = ((string[])valueProviderResult.RawValue)[2];

            // A TimeSpan represents the time elapsed since midnight
            var time = new TimeSpan(Convert.ToInt32(hours), Convert.ToInt32(minutes), Convert.ToInt32(seconds));

            return time;
        }
    }
}