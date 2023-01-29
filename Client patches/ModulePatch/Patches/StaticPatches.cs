using System.Collections.Generic;
using System.Reflection;
using Aki.Common;
using EFT;
using EFT.Counters;
using Ereshkigal.TerragroupSpecialist.Exceptions;
using Ereshkigal.TerragroupSpecialist.Utils;
using HarmonyLib;

namespace Ereshkigal.TerragroupSpecialist.Patches
{
    public static class StaticPatches
    {
        public static void PatchBotGlobalSettings()
        {
            Traverse.Create(ClassResolver.AISettingsLoaderClass)
                .Field<Dictionary<WildSpawnType, List<BotDifficulty>>>("ExcludedDifficulties")
                .Value
                .Add(EnumResolver.TG_Boss, new List<BotDifficulty>
                {
                    BotDifficulty.easy,
                    BotDifficulty.normal,
                    BotDifficulty.hard
                });

            Traverse.Create(ClassResolver.AISettingsLoaderClass)
                .Field<Dictionary<WildSpawnType, List<BotDifficulty>>>("ExcludedDifficulties")
                .Value
                .Add(EnumResolver.TG_Followers, new List<BotDifficulty>
                {
                    BotDifficulty.easy,
                    BotDifficulty.normal,
                    BotDifficulty.hard
                });

            Traverse.Create(ClassResolver.AISettingsLoaderClass)
                .Field<Dictionary<WildSpawnType, List<BotDifficulty>>>("ExcludedDifficulties")
                .Value
                .Add(EnumResolver.TG_Raiders, new List<BotDifficulty>
                {
                    BotDifficulty.easy,
                    BotDifficulty.normal,
                    BotDifficulty.hard
                });

            Traverse.Create(ClassResolver.AISettingsLoaderClass)
                .Field<Dictionary<WildSpawnType, List<BotDifficulty>>>("ExcludedDifficulties")
                .Value
                .Add(EnumResolver.UNTroops, new List<BotDifficulty>
                {
                    BotDifficulty.easy,
                    BotDifficulty.normal,
                    BotDifficulty.hard
                });

            Log.Info($"Ereshkigal.TerragroupSpecialist: Applied static patch {nameof(PatchBotGlobalSettings)}");
        }

        public static void SetupBossSettings()
        {
            var method = ClassResolver.BotBossInfoClass
                .GetMethod("smethod_0", BindingFlags.NonPublic | BindingFlags.Static);

            if (method == null)
            {
                throw PatchingException.Create(nameof(SetupBossSettings), "Unable to locate 'smethod_0' method");
            }

            method.Invoke(null, new object[]{
                new List<WildSpawnType>
                {
                    EnumResolver.TG_Boss,
                    EnumResolver.TG_Followers
                }
            });

            Log.Info($"Ereshkigal.TerragroupSpecialist: Applied static patch {nameof(SetupBossSettings)}");
        }

        public static void InitKillCounters()
        {
            var statisticValueConstructor = ClassResolver.StatisticValueClass.GetConstructor(new[] { typeof(CounterValueType), typeof(IEnumerable<string>) });
            if (statisticValueConstructor == null)
            {
                throw PatchingException.Create(nameof(InitKillCounters), "Failed to locate StatisticValueClass constructor");
            }

            Traverse
                .Create(ClassResolver.StatisticsCounterClass)
                .Field("KilledTerragroup")
                .SetValue(statisticValueConstructor.Invoke(new object[] { CounterValueType.Long, new [] { Constants.CounterTag.KilledTerragroup } }));

            Traverse
                .Create(ClassResolver.StatisticsCounterClass)
                .Field("KilledUNTroops")
                .SetValue(statisticValueConstructor.Invoke(new object[] { CounterValueType.Long, new[] { Constants.CounterTag.KilledUNTroops } }));

            var sessionCountersField = Traverse.Create(ClassResolver.StatisticsCounterClass).Field("SessionToOverallCounters").GetValue();

            Traverse.Create(sessionCountersField)
                .Method("Add", new [] { ClassResolver.StatisticValueClass })
                .GetValue(Traverse.Create(ClassResolver.StatisticsCounterClass).Field("KilledTerragroup").GetValue());

            Traverse.Create(sessionCountersField)
                .Method("Add", new[] { ClassResolver.StatisticValueClass })
                .GetValue(Traverse.Create(ClassResolver.StatisticsCounterClass).Field("KilledUNTroops").GetValue());

            Log.Info($"Ereshkigal.TerragroupSpecialist: Applied static patch {nameof(InitKillCounters)}");
        }
    }
}