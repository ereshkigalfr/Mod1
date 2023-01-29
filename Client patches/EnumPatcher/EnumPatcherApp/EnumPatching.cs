using System.Collections.Generic;
using System.Linq;
using dnlib.DotNet;

namespace EnumPatcherApp
{
    // Modified enum patcher code ripped from Basuro's EnumChanger project
    // https://dev.sp-tarkov.com/Basuro/EnumChanger
    public static class EnumPatching
    {
        public static ModuleDefMD AddEnumValues(this ModuleDefMD module, string enumName, Dictionary<string, object> values)
        {
            if (values.IsNullOrEmpty())
            {
                Utils.LogWarning($"No values to add for '{enumName}'");
                return module;
            }

            Utils.LogInfo($"Patching '{enumName}' with {values.Count} new value{(values.Count > 1 ? "s" : string.Empty)}");

            var enumType = module.GetTypes().FirstOrDefault(type => type.Name == enumName);
            if (enumType == null)
            {
                Utils.LogError($"Failed to locate enum '{enumName}'");
                return module;
            }

            foreach (var kvp in values)
            {
                enumType.Fields.Add(new FieldDefUser(kvp.Key, enumType.Fields.Last().FieldSig.Clone())
                {
                    Attributes = FieldAttributes.Public | FieldAttributes.Static | FieldAttributes.Literal | FieldAttributes.HasDefault,
                    Constant = new ConstantUser(kvp.Value ?? enumType.Fields.Count - 1)
                });
            }

            return module;
        }

        public static ModuleDefMD ChangeEnumValues(this ModuleDefMD module, string enumName, Dictionary<string, object> values)
        {
            if (values.IsNullOrEmpty())
            {
                Utils.LogWarning($"No values to change for '{enumName}'");
                return module;
            }

            Utils.LogInfo($"Patching '{enumName}' and changing {values.Count} value{(values.Count > 1 ? "s" : string.Empty)}");

            var enumType = module.GetTypes().FirstOrDefault(type => type.Name == enumName);
            if (enumType == null)
            {
                Utils.LogError($"Failed to locate enum '{enumName}'");
                return module;
            }

            foreach (var kvp in values)
            {
                if (kvp.Value == null)
                {
                    Utils.LogError($"Failed to patch enum '{enumName}' value '{kvp.Key}' - specified value cannot be null.");
                    continue;
                }

                var field = enumType.Fields.FirstOrDefault(f => f.Name == kvp.Key);
                if (field == null)
                {
                    Utils.LogError($"Failed to patch enum '{enumName}' value '{kvp.Key}' - specified name does not exist.");
                    continue;
                }

                field.Constant = new ConstantUser(kvp.Value);
            }

            return module;
        }
    }
}