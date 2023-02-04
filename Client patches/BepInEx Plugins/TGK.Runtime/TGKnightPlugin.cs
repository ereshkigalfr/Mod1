using System;
using BepInEx;
using HarmonyLib;
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

                new BotSettingsRepoPatches().ApplyPatches(harmony);
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
