using System;
using System.Collections.Generic;
using System.IO;
using dnlib.DotNet;

namespace EnumPatcherApp
{
    internal static class Program
    {
        private const string AssemblyFile = "./Assembly-CSharp.dll";

        internal static void Main(string[] args)
        {
            if (!File.Exists(AssemblyFile))
            {
                Utils.LogError($"Failed to find specified assembly at '{Path.GetFullPath(AssemblyFile)}'");
                Console.ReadKey();
                return;
            }

            var moduleContext = ModuleDef.CreateModuleContext();
            var module = ModuleDefMD.Load(AssemblyFile, moduleContext);

            // NOTE: When adding enums, leave the object value as null for auto-increment

            module
                .AddEnumValues("WildSpawnType",
                    new Dictionary<string, object>
                    {
                        { "TG_Raiders", null },
                        { "TG_Boss", null },
                        { "TG_Followers", null },
                        { "UNTroops", null }
                    })
                .AddEnumValues("EPlayerSide",
                    new Dictionary<string, object>
                    {
                        { "Terragroup", 8 },
                        { "UN", 16 }
                    })
                .AddEnumValues("EPlayerSideMask",
                    new Dictionary<string, object>
                    {
                        { "Terragroup", 8 },
                        { "UN", 9 }
                    })
                .ChangeEnumValues("EPlayerSideMask",
                    new Dictionary<string, object>
                    {
                        { "All", 31 }
                    })
                .AddEnumValues("ESideType",
                    new Dictionary<string, object>
                    {
                        { "Terragroup", null },
                        { "UN", null }
                    })
                .AddEnumValues("CounterTag",
                    new Dictionary<string, object>
                    {
                        { "KilledTerragroup", null },
                        { "KilledUNTroops", null }
                    })
                .AddEnumValues("EDogtagExchangeSide",
                    new Dictionary<string, object>
                    {
                        { "Terragroup", 5 },
                        { "UN",  6 }
                    })
                .AddKilledTerragroupFieldToSessionCounters()
                .SaveChanges();

            Utils.LogInfo("Finished applying patches. Press any key to exit...");
            Console.ReadKey();
        }

        private static void SaveChanges(this ModuleDefMD module)
        {
            module.Write($"{Path.GetFileNameWithoutExtension(AssemblyFile)}.Patched.dll");
        }
    }
}
