using System.Reflection;
using BepInEx.Logging;
using EFT;
using HarmonyLib;
using TGK.Preloader;

namespace TGK.Runtime.Patches
{
    public class BotSettingsRepoPatches : IRuntimePatch
    {
        public void ApplyPatches(Harmony harmony, ManualLogSource logger)
        {
            var targetClass = typeof(BotSettingsRepoClass);
            var isBossMethod = targetClass.GetMethodOrThrow("IsBoss", BindingFlags.Public | BindingFlags.Static);
            var isFollowerMethod = targetClass.GetMethodOrThrow("IsFollower", BindingFlags.Public | BindingFlags.Static);

            harmony.Patch(isBossMethod, prefix: new HarmonyMethod(GetType().GetMethod(nameof(IsBossPrefixPatch), BindingFlags.NonPublic | BindingFlags.Static)));
            harmony.Patch(isFollowerMethod, prefix: new HarmonyMethod(GetType().GetMethod(nameof(IsFollowerPrefixPatch), BindingFlags.NonPublic | BindingFlags.Static)));
        }

        private static bool IsBossPrefixPatch(WildSpawnType role, ref bool __result)
        {
            if ((int)role == EnumPatchData.WildSpawnTypeEnumData.TG_BossValue)
            {
                __result = true;
                return false;
            }

            return true;
        }

        private static bool IsFollowerPrefixPatch(WildSpawnType role, ref bool __result)
        {
            if ((int)role == EnumPatchData.WildSpawnTypeEnumData.TG_FollowersValue)
            {
                __result = true;
                return false;
            }

            return true;
        }
    }
}