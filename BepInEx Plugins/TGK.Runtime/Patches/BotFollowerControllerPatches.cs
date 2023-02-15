using System.Linq;
using System.Reflection;
using BepInEx.Logging;
using EFT;
using HarmonyLib;
using TGK.Preloader;

namespace TGK.Runtime.Patches
{
    public class BotFollowerControllerPatches : IRuntimePatch
    {
        public void ApplyPatches(Harmony harmony, ManualLogSource logger)
        {
            var targetClass = typeof(AbstractGame).Assembly.GetTypes().SingleOrDefault(t => t.GetMethod("IsFollowerSuitableForBoss", BindingFlags.Public | BindingFlags.Static) != null);
            var isFollowerSuitableMethod = targetClass.GetMethodOrThrow("IsFollowerSuitableForBoss", BindingFlags.Public | BindingFlags.Static);
            var bossTacticsSetupMethod = targetClass.GetMethodOrThrow("method_0", BindingFlags.NonPublic | BindingFlags.Instance);

            harmony.Patch(isFollowerSuitableMethod, postfix: new HarmonyMethod(GetType().GetMethod(nameof(IsFollowerSuitablePostfixPatch), BindingFlags.NonPublic | BindingFlags.Static)));
            harmony.Patch(
                bossTacticsSetupMethod,
                prefix: new HarmonyMethod(GetType().GetMethod(nameof(BossTacticsSetupPrefixPatch), BindingFlags.NonPublic | BindingFlags.Static)),
                postfix: new HarmonyMethod(GetType().GetMethod(nameof(BossTacticsSetupPostfixPatch), BindingFlags.NonPublic | BindingFlags.Static)));
        }

        private static void IsFollowerSuitablePostfixPatch(WildSpawnType follower, WildSpawnType boss, ref bool __result)
        {
            if ((int)follower == EnumPatchData.WildSpawnTypeEnumData.TG_FollowersValue && (int)boss == EnumPatchData.WildSpawnTypeEnumData.TG_BossValue)
            {
                __result = true;
            }
        }

        // We intercept the method and set a fake role value for the bot that's being evaluated, so that it grabs and uses the needed tactics class without having to reference it directly through a patch.
        // We save the original role value and a flag for whether or not a replacement was being made, which is later passed on to the postfix patch
        private static void BossTacticsSetupPrefixPatch(BotOwner ___botOwner_0, out (bool, int) __state)
        {
            var originalRoleValue = (int)___botOwner_0.Profile.Info.Settings.Role;

            switch (originalRoleValue)
            {
                case EnumPatchData.WildSpawnTypeEnumData.TG_BossValue:
                    ___botOwner_0.Profile.Info.Settings.Role = WildSpawnType.bossGluhar;
                    __state = (true, originalRoleValue);
                    break;
                case EnumPatchData.WildSpawnTypeEnumData.TG_RaidersValue:
                    ___botOwner_0.Profile.Info.Settings.Role = WildSpawnType.exUsec;
                    __state = (true, originalRoleValue);
                    break;
                default:
                    __state = (false, 0);
                    break;
            }
        }

        // After the original method has executed, we check if we overwrote the role value in the prefix patch and restore it if needed
        private static void BossTacticsSetupPostfixPatch(BotOwner ___botOwner_0, (bool, int) __state)
        {
            var (roleValueWasChanged, originalValue) = __state;

            if (roleValueWasChanged)
            {
                ___botOwner_0.Profile.Info.Settings.Role = (WildSpawnType)originalValue;
            }
        }
    }
}