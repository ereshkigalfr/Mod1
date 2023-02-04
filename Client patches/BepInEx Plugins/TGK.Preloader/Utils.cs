using System;
using System.Linq;
using Mono.Cecil;

namespace TGK.Preloader
{
    public static class Utils
    {
        public static void AddEnumValue(ref TypeDefinition enumType, string name, object value)
        {
            const FieldAttributes defaultEnumFieldAttributes = FieldAttributes.Public | FieldAttributes.Static | FieldAttributes.Literal | FieldAttributes.HasDefault;

            enumType.Fields.Add(new FieldDefinition(name, defaultEnumFieldAttributes, enumType) { Constant = value });
        }

        public static void ChangeEnumValue(ref TypeDefinition enumType, string name, object newValue)
        {
            var enumField = enumType.Fields.FirstOrDefault(f => f.Name == name);

            if (enumField == null)
            {
                throw new Exception($"Could not find the an enum field '{name}' on {enumType.FullName}");
            }

            enumField.Constant = newValue;
        }
    }
}