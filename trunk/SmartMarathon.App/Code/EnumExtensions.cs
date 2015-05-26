using SmartMarathon.App.Models;
using System;
using System.ComponentModel;
using System.Resources;
using System.Web.Script.Serialization;

namespace SmartMarathon.App.Code
{
    public static class EnumExtensions
    {
        private const double mileInKms = 1.609344;

        public static string Description(this Enum value)
        {
            var enumType = value.GetType();
            var field = enumType.GetField(value.ToString());
            var attributes = field.GetCustomAttributes(typeof(DescriptionAttribute),
                                                       false);
            return attributes.Length == 0
                ? value.ToString()
                : ((DescriptionAttribute)attributes[0]).Description;
        }

        public static double ToKilometers(this Distance value)
        {
            double result = 0;
            switch (value)
            {
                case Distance.K42:
                    {
                        result = 42.195;
                        break;
                    }
                case Distance.K30:
                    {
                        result = 30;
                        break;
                    }
                case Distance.K21:
                    {
                        result = 21.097;
                        break;
                    }
                case Distance.K10:
                    {
                        result = 10;
                        break;
                    }
                case Distance.K5:
                    {
                        result = 5;
                        break;
                    }
            }
            return result;
        }

        public static double ToMiles(this Distance value)
        {
            return value.ToKilometers() / mileInKms;
        }

        public static double FromKilometersToMiles(this double value)
        {
            return value / mileInKms;
        }

        public static double FromMilesToKilometers(this double value)
        {
            return value * mileInKms;
        }

        public static string ToJson(this Object obj)
        {
            return new JavaScriptSerializer().Serialize(obj);
        }
    }

    public class LocalizedDescriptionAttribute : DescriptionAttribute
    {
        private readonly string _resourceKey;
        private readonly ResourceManager _resource;
        public LocalizedDescriptionAttribute(string resourceKey, Type resourceType)
        {
            _resource = new ResourceManager(resourceType);
            _resourceKey = resourceKey;
        }

        public override string Description
        {
            get
            {
                string displayName = _resource.GetString(_resourceKey);

                return string.IsNullOrEmpty(displayName)
                    ? string.Format("[[{0}]]", _resourceKey)
                    : displayName;
            }
        }
    }
}