using SmartMarathon.App.Models;
using System;
using System.ComponentModel;

namespace SmartMarathon.App.Code
{
    public static class EnumExtensions
    {
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
            return value.ToKilometers() / 1.609344;
        }
    }
}