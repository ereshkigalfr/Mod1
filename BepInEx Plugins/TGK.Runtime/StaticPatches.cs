using System;
using System.Collections.Generic;
using EFT;
using TGK.Preloader;

namespace TGK.Runtime
{
    public static class StaticPatches
    {
        public static void UpdateBotGlobalSettings()
        {
            GClass555.ExcludedDifficulties.Add(
                (WildSpawnType)EnumPatchData.WildSpawnTypeEnumData.TG_BossValue,
                new List<BotDifficulty> 
                {
                    BotDifficulty.easy,
                    BotDifficulty.hard, 
                    BotDifficulty.impossible
                });

            GClass555.ExcludedDifficulties.Add(
                (WildSpawnType)EnumPatchData.WildSpawnTypeEnumData.TG_FollowersValue,
                new List<BotDifficulty>
                {
                    BotDifficulty.easy,
                    BotDifficulty.hard,
                    BotDifficulty.impossible
                });

            GClass555.ExcludedDifficulties.Add(
                (WildSpawnType)EnumPatchData.WildSpawnTypeEnumData.TG_RaidersValue,
                new List<BotDifficulty>
                {
                    BotDifficulty.easy,
                    BotDifficulty.hard,
                    BotDifficulty.impossible
                });

            GClass555.ExcludedDifficulties.Add(
                (WildSpawnType)EnumPatchData.WildSpawnTypeEnumData.UNTroopsValue,
                new List<BotDifficulty>
                {
                    BotDifficulty.easy,
                    BotDifficulty.hard,
                    BotDifficulty.impossible
                });
        }

        public static void InitKillCounters() // TODO
        {
            throw new NotImplementedException();
        }
    }
}