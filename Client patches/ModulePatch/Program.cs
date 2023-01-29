using Aki.Common;
using Aki.Reflection.Patching;
using Ereshkigal.TerragroupSpecialist.Patches;
using Ereshkigal.TerragroupSpecialist.Utils;

namespace Ereshkigal.TerragroupSpecialist
{
    public class Program
    {
        static void Main(string[] args)
        {
            Log.Info("Ereshkigal.TerragroupSpecialist: Validating Assembly-csharp.dll");

            // Validate that the correct assembly is installed - throws an exception and stops mod loading on fail
            PrePatchValidator.ValidateAssembly();

            // Validate that all classes are being resolved correctly - throws an exception and stops mod loading on fail.
            // Due to resolved classes caching their types, this is essentially pre-caches the data,
            // improving performance when patched methods are invoked for the first time
            PrePatchValidator.ValidateClassResolver();

            Log.Info("Ereshkigal.TerragroupSpecialist: Applying patches...");

            // StaticPatches.PlayerSideMaskPatch(); // Seems to be used in-editor only. Potentially not needed
            StaticPatches.PatchBotGlobalSettings();
            StaticPatches.SetupBossSettings();
            StaticPatches.InitKillCounters();

            var dynamicPatches = new PatchList
            {
                new BotLogicInstantiatorPatch(),
                new BotTacticControllerPatch(),
                new BotBossSettingsIsBossPatch(),
                new BotBossSettingsIsFollowerPatch(),
                new BotFollowerControllerIsSuitablePatch(),
                new BotFollowerControllerBossLogicPatch(),
                new KillListVictimPatch(),

                // These patches need to be executed last, as they depend on previously patched data
                new PlayerStatTrackerOnKillPatch(),
                new PlayerStatTrackerOnDamagePatch()
            };

            dynamicPatches.EnableAll();

            Log.Info("Ereshkigal.TerragroupSpecialist: Patches successfully applied");
        }
    }
}
