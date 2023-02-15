using System;
using BepInEx;
using HarmonyLib;
using TGK.Runtime.Exceptions;
using TGK.Runtime.Patches;

namespace TGK.Runtime
{
    [BepInPlugin("com.terragroupknight.main", "Terragroup Knight", "1.0.0")]
    public class TGKnightPlugin : BaseUnityPlugin
    {
        public TGKnightPlugin()
        {
            Logger.LogInfo("Loading Terragroup Knight...");

            try
            {
                var harmony = new Harmony("com.terragroupknight.main");

                IRuntimePatch[] patchClasses =
                {
                    new BotSettingsRepoPatches(),
                    new BotFollowerControllerPatches(),
                    new BotBrainClassPatches(),
                };

                patchClasses.ExecuteForEach(patchClass =>
                {
                    Logger.LogInfo($"Applying {patchClass.GetType().Name}");
                    patchClass.ApplyPatches(harmony, Logger);
                });
            }
            catch (CustomPatchException ex)
            {
                // For custom patch exceptions, we want to check the Halt flag
                Logger.LogError(ex);

                if (ex.ShouldHaltAllPatchExecution)
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                // Plugin exceptions are sometimes not logged in SPT-AKI
                Logger.LogError(ex);
                throw;
            }

            Logger.LogInfo("Terragroup Knight loaded.");
        }
    }
}
