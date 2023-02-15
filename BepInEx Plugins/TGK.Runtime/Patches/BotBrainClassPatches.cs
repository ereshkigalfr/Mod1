using System.Reflection;
using BepInEx.Logging;
using EFT;
using HarmonyLib;
using TGK.Preloader;

namespace TGK.Runtime.Patches
{
    public class BotBrainClassPatches : IRuntimePatch
    {
        public void ApplyPatches(Harmony harmony, ManualLogSource logger)
        {
            var targetClass = typeof(BotBrainClass);
            var botBrainActivateMethod = targetClass.GetMethodOrThrow("Activate", BindingFlags.Public | BindingFlags.Instance);

            harmony.Patch(
                botBrainActivateMethod,
                prefix: new HarmonyMethod(GetType().GetMethod(nameof(BotBrainSetupPrefixPatch), BindingFlags.NonPublic | BindingFlags.Static)),
                postfix: new HarmonyMethod(GetType().GetMethod(nameof(BotBrainSetupPostfixPatch), BindingFlags.NonPublic | BindingFlags.Static)));
        }

        // We intercept the method and set a fake role value for the bot that's being evaluated, so that it grabs and uses the needed brain class without having to reference it directly through a patch.
        // We save the original role value and a flag for whether or not a replacement was being made, which is later passed on to the postfix patch
        private static void BotBrainSetupPrefixPatch(BotOwner ___botOwner_0, out (bool, int) __state)
        {
            var originalRoleValue = (int)___botOwner_0.Profile.Info.Settings.Role;

            switch (originalRoleValue)
            {
                case EnumPatchData.WildSpawnTypeEnumData.TG_BossValue:
                    ___botOwner_0.Profile.Info.Settings.Role = WildSpawnType.bossGluhar;
                    __state = (true, originalRoleValue);
                    break;
                case EnumPatchData.WildSpawnTypeEnumData.TG_RaidersValue:
                    ___botOwner_0.Profile.Info.Settings.Role = WildSpawnType.pmcBot; // TODO: SPT PMCs now use different settings, maybe we should use something other than pmcBot?
                    __state = (true, originalRoleValue);
                    break;
                case EnumPatchData.WildSpawnTypeEnumData.TG_FollowersValue:
                    ___botOwner_0.Profile.Info.Settings.Role = WildSpawnType.followerGluharSecurity;
                    __state = (true, originalRoleValue);
                    break;
                case EnumPatchData.WildSpawnTypeEnumData.UNTroopsValue:
                    ___botOwner_0.Profile.Info.Settings.Role = WildSpawnType.pmcBot;
                    __state = (true, originalRoleValue);
                    break;
                default:
                    __state = (false, 0);
                    break;
            }
        }

        // After the original method has executed, we check if we overwrote the role value in the prefix patch and restore it if needed
        private static void BotBrainSetupPostfixPatch(BotOwner ___botOwner_0, (bool, int) __state)
        {
            var (roleValueWasChanged, originalValue) = __state;

            if (roleValueWasChanged)
            {
                ___botOwner_0.Profile.Info.Settings.Role = (WildSpawnType)originalValue;
            }
        }
    }
}