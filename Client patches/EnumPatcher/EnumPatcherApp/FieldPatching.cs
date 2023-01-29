using System;
using System.Linq;
using dnlib.DotNet;

namespace EnumPatcherApp
{
    public static class FieldPatching
    {
        public static ModuleDefMD AddKilledTerragroupFieldToSessionCounters(this ModuleDefMD module)
        {
            var targetClass = module.GetTypes()
                .FirstOrDefault(t => t.IsAbstract && t.IsSealed && t.GetField("SessionToOverallCounters") != null);

            if (targetClass == null)
            {
                Utils.LogError("Failed to locate target class");
                return module;
            }

            var fieldType = module.GetTypes()
                .FirstOrDefault(t => t.IsNestedPublic && t.Properties.Any(p => p.Name == "ValueType") && 
                                     t.Fields.Any(f => f.IsPrivate && f.FieldType.TypeName == "CounterValueType" && f.Name == "counterValueType_0"));

            if (fieldType == null)
            {
                Utils.LogError("Failed to locate field type");
                return module;
            }

            var newField = new FieldDefUser("KilledTerragroup", targetClass.GetField("KilledBear").FieldSig.Clone())
            {
                Attributes = FieldAttributes.Public | FieldAttributes.Static,
                FieldType = fieldType.ToTypeSig(),
            };

            targetClass.Fields.Add(newField);

            Utils.LogInfo("Added 'KilledTerragroup' field to SessionCounters");

            return module;
        }
    }
}