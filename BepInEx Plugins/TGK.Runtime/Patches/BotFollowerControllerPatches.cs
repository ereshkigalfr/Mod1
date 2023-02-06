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
            var targetClass = typeof(GClass307);
            var isFollowerSuitableMethod = targetClass.GetMethodOrThrow("IsFollowerSuitableForBoss", BindingFlags.Public | BindingFlags.Static);
            var bossLogicSetupMethod = targetClass.GetMethodOrThrow("method_0", BindingFlags.NonPublic | BindingFlags.Instance);

            harmony.Patch(isFollowerSuitableMethod, postfix: new HarmonyMethod(GetType().GetMethod(nameof(IsFollowerSuitablePostfixPatch), BindingFlags.NonPublic | BindingFlags.Static)));
            harmony.Patch(bossLogicSetupMethod, postfix: new HarmonyMethod(GetType().GetMethod(nameof(BossLogicSetupPrefixPatch), BindingFlags.NonPublic | BindingFlags.Static)));
        }

        private static void IsFollowerSuitablePostfixPatch(WildSpawnType follower, WildSpawnType boss, ref bool __result)
        {
            if ((int)follower == EnumPatchData.WildSpawnTypeEnumData.TG_FollowersValue && (int)boss == EnumPatchData.WildSpawnTypeEnumData.TG_BossValue)
            {
                __result = true;
            }
        }

        private static void BossLogicSetupPrefixPatch(GClass307 __instance, BotOwner ___botOwner_0)
        {
            if ((int)___botOwner_0.Profile.Info.Settings.Role == EnumPatchData.WildSpawnTypeEnumData.TG_BossValue)
            {
                var bossLogic = new GClass294(___botOwner_0, __instance); // Gluhar's logic class
                Traverse.Create(__instance).Property("BossLogic").SetValue(bossLogic);
                Traverse.Create(__instance).Property("NeedsProtection").SetValue(true);
            }

            if ((int)___botOwner_0.Profile.Info.Settings.Role == EnumPatchData.WildSpawnTypeEnumData.TG_RaidersValue)
            {
                var raiderBossLogic = new GClass293(___botOwner_0, __instance); // assaultGroup logic class
                Traverse.Create(__instance).Property("BossLogic").SetValue(raiderBossLogic);
            }
        }
    }
}