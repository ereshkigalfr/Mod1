using System.Reflection;
using BepInEx.Logging;
using EFT;
using HarmonyLib;
using TGK.Preloader;

namespace TGK.Runtime.Patches
{
    public class BotTacticControllerPatches : IRuntimePatch
    {
        public void ApplyPatches(Harmony harmony, ManualLogSource logger)
        {
            var targetClass = typeof(BotTacticClass);
            var botTacticsActivateMethod = targetClass.GetMethodOrThrow("Activate", BindingFlags.Public | BindingFlags.Instance);

            harmony.Patch(botTacticsActivateMethod,
                prefix: this.GetLocalPatchMethod(nameof(BotTacticSetupPrefixPatch)),
                postfix: this.GetLocalPatchMethod(nameof(BotTacticSetupPostfixPatch)));
        }

        private static void BotTacticSetupPrefixPatch(BotOwner ___botOwner_0, out (bool, int) __state)
        {
            var originalRoleValue = (int)___botOwner_0.Profile.Info.Settings.Role;

            if (originalRoleValue == EnumPatchData.WildSpawnTypeEnumData.TG_BossValue)
            {
                ___botOwner_0.Profile.Info.Settings.Role = WildSpawnType.bossGluhar;
                __state = (true, originalRoleValue);
            }
            else
            {
                __state = (false, 0);
            }
        }

        private static void BotTacticSetupPostfixPatch(BotOwner ___botOwner_0, (bool, int) __state)
        {
            var (roleValueWasChanged, originalValue) = __state;

            if (roleValueWasChanged)
            {
                ___botOwner_0.Profile.Info.Settings.Role = (WildSpawnType)originalValue;
            }
        }
    }
}