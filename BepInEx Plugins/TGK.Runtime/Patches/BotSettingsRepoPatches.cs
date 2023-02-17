using System.Collections.Generic;
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
            var initMethod = targetClass.GetMethodOrThrow("Init", BindingFlags.Public | BindingFlags.Static);

            harmony.Patch(initMethod, prefix: new HarmonyMethod(GetType().GetMethod(nameof(InitSettingsPrefixPatch), BindingFlags.NonPublic | BindingFlags.Static)));
        }

        private static void InitSettingsPrefixPatch(Dictionary<WildSpawnType, BotSettingsValuesClass> ___dictionary_0)
        {
            ___dictionary_0.Add(
                (WildSpawnType)EnumPatchData.WildSpawnTypeEnumData.TG_BossValue,
                new BotSettingsValuesClass(true, false, false, "ScavRole/Boss"));

            ___dictionary_0.Add(
                (WildSpawnType)EnumPatchData.WildSpawnTypeEnumData.TG_FollowersValue,
                new BotSettingsValuesClass(false, true, false, "ScavRole/Follower"));

            ___dictionary_0.Add(
                (WildSpawnType)EnumPatchData.WildSpawnTypeEnumData.TG_RaidersValue,
                new BotSettingsValuesClass(false, false, false, "ScavRole/PmcBot"));

            ___dictionary_0.Add(
                (WildSpawnType)EnumPatchData.WildSpawnTypeEnumData.UNTroopsValue,
                new BotSettingsValuesClass(false, false, false, EnumPatchData.WildSpawnTypeEnumData.UNTroopsName));

            var method = typeof(BotSettingsRepoClass).GetMethodOrThrow("smethod_0", BindingFlags.NonPublic | BindingFlags.Static);

            method.Invoke(null, new object[]
            {
                (WildSpawnType)EnumPatchData.WildSpawnTypeEnumData.TG_BossValue,
                (WildSpawnType)EnumPatchData.WildSpawnTypeEnumData.TG_FollowersValue,
            });
        }
    }
}