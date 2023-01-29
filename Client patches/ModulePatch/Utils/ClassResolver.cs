using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Aki.Common;
using EFT;
using Ereshkigal.TerragroupSpecialist.Exceptions;
using HarmonyLib;

namespace Ereshkigal.TerragroupSpecialist.Utils
{
    public static class ClassResolver
    {
        private static readonly Dictionary<string, Type> ClassCache = new Dictionary<string, Type>();

        public static Type BotBossSettingsClass
        {
            get
            {
                if (ClassCache.ContainsKey(nameof(BotBossSettingsClass)))
                {
                    return ClassCache[nameof(BotBossSettingsClass)];
                }

                var type = typeof(AbstractGame).Assembly.GetTypes()
                    .SingleOrDefault(x => x.IsAbstract && x.IsSealed && x.GetMethod("IsSiutable", BindingFlags.Public | BindingFlags.Static) != null);

                if (type == null)
                {
                    // If this ever occurs, try looking for a static class with methods like "IsBoss", "IsSiutable" and "IsFollower"
                    throw ClassResolutionException.Create(nameof(BotBossSettingsClass));
                }

                ClassCache.Add(nameof(BotBossSettingsClass), type);

                return type;
            }
        }

        public static Type BotFollowerControllerClass
        {
            get
            {
                if (ClassCache.ContainsKey(nameof(BotFollowerControllerClass)))
                {
                    return ClassCache[nameof(BotFollowerControllerClass)];
                }

                var type = typeof(AbstractGame).Assembly.GetTypes()
                    .SingleOrDefault(x => x.GetMethods().Any(m => m.Name == "IsFollowerSuitableForBoss"));

                if (type == null)
                {
                    // If this ever occurs, try looking for a class with methods like "IsFollowerSuitableForBoss", "OfferSelf" or "HaveFollowers"
                    throw ClassResolutionException.Create(nameof(BotFollowerControllerClass));
                }

                ClassCache.Add(nameof(BotFollowerControllerClass), type);

                return type;
            }
        }

        public static Type GluharBossLogicClass
        {
            get
            {
                if (ClassCache.ContainsKey(nameof(GluharBossLogicClass)))
                {
                    return ClassCache[nameof(GluharBossLogicClass)];
                }

                var type = typeof(AbstractGame).Assembly.GetTypes()
                    .SingleOrDefault(x => x.GetMethods().Any(m => m.Name == "OneScoutDoAttack"));

                if (type == null)
                {
                    // If this ever occurs, try looking for a class with methods like "OneScoutDoAttack", "SetHaveCover" or "SeenLessTimeFollowersSecurity"
                    // OR, go to the BotFollowerController class method_0, and check what class is being set as BossLogic for WildSpawnType.bossGluhar
                    throw ClassResolutionException.Create(nameof(GluharBossLogicClass));
                }

                ClassCache.Add(nameof(GluharBossLogicClass), type);

                return type;
            }
        }        
        
        public static Type RaiderBossLogicClass
        {
            get
            {
                if (ClassCache.ContainsKey(nameof(RaiderBossLogicClass)))
                {
                    return ClassCache[nameof(RaiderBossLogicClass)];
                }

                // The class should only have 1 method - SetPatrolMode. Other methods should be inherited (not overriden)
                var type = typeof(AbstractGame).Assembly.GetTypes()
                    .SingleOrDefault(x =>
                        x.GetMethods().Count(m => !m.IsVirtual && !m.IsAbstract) == 1 &&
                        x.GetMethod("SetPatrolMode", BindingFlags.Instance | BindingFlags.Public)?.DeclaringType == x &&
                        x.GetMethod("Activate", AccessTools.all)?.DeclaringType != x &&
                        x.GetMethod("Dispose", AccessTools.all)?.DeclaringType != x &&
                        x.GetMethod("BossLogicUpdate", AccessTools.all)?.DeclaringType != x);

                if (type == null)
                {
                    // If this ever occurs, go to the BotFollowerController class method_0, and check what class is being set as BossLogic for WildSpawnType.assaultGroup
                    // Try to find a way to uniquely identify that class
                    throw ClassResolutionException.Create(nameof(RaiderBossLogicClass));
                }

                ClassCache.Add(nameof(RaiderBossLogicClass), type);

                return type;
            }
        }

        public static Type BotBaseLogicClass
        {
            get
            {
                if (ClassCache.ContainsKey(nameof(BotBaseLogicClass)))
                {
                    return ClassCache[nameof(BotBaseLogicClass)];
                }

                var type = typeof(AbstractGame).Assembly.GetTypes()
                    .SingleOrDefault(x =>
                        x.IsAbstract &&
                        x.GetMethod("smethod_0", BindingFlags.NonPublic | BindingFlags.Static) != null &&
                        x.GetMethods().Any(m => m.Name == "IsCoverGoodForRun" && m.IsVirtual));

                if (type == null)
                {
                    // If this ever occurs, look for an abstract class with virtual methods like "IsCoverGoodForRun", "InFightLogic", "CheckIsCurDesicionEnd"
                    throw ClassResolutionException.Create(nameof(BotBaseLogicClass));
                }

                ClassCache.Add(nameof(BotBaseLogicClass), type);

                return type;
            }
        }

        public static Type BotTacticControllerClass
        {
            get
            {
                if (ClassCache.ContainsKey(nameof(BotTacticControllerClass)))
                {
                    return ClassCache[nameof(BotTacticControllerClass)];
                }

                var type = typeof(AbstractGame).Assembly.GetTypes()
                    .SingleOrDefault(x => x.GetMethods().Any(m => m.Name == "UpdateChangeTactics"));

                if (type == null)
                {
                    // If this ever occurs, try looking for a class with methods like "UpdateChangeTactics" or "AgressionChange"
                    throw ClassResolutionException.Create(nameof(BotTacticControllerClass));
                }

                ClassCache.Add(nameof(BotTacticControllerClass), type);

                return type;
            }
        }

        public static Type BaseBotTacticClass
        {
            get
            {
                if (ClassCache.ContainsKey(nameof(BaseBotTacticClass)))
                {
                    return ClassCache[nameof(BaseBotTacticClass)];
                }

                var type = typeof(AbstractGame).Assembly.GetTypes()
                    .SingleOrDefault(x => x.GetMethods().Any(m => m.Name == "add_OnTacticChange" && m.DeclaringType == x));

                if (type == null)
                {
                    // If this ever occurs, try looking for a class with an event "OnTacticChange", method "SetLastTactic",
                    // or virtual methods like "SearchTypeGoToCover", "SearchTypeAttack" or "SearchRunToCover"
                    throw ClassResolutionException.Create(nameof(BaseBotTacticClass));
                }

                ClassCache.Add(nameof(BaseBotTacticClass), type);

                return type;
            }
        }

        public static Type GluharBotTacticClass
        {
            get
            {
                if (ClassCache.ContainsKey(nameof(GluharBotTacticClass)))
                {
                    return ClassCache[nameof(GluharBotTacticClass)];
                }

                // There are two extremely similar classes that are found here - one for Boss and one for Follower
                var types = typeof(AbstractGame).Assembly.GetTypes()
                    .Where(x => x.BaseType == BaseBotTacticClass && x.GetMethods().Any(m => m.Name == "SearchTypeGoToCover" && !m.IsAbstract && m.DeclaringType == x))
                    .ToList();

                // If we find more or less matching classes, it would indicate something has changed - possibly after a game update
                // If we found more, grabbing the last class after sorting by name would most likely return the wrong one
                if (types.Count != 2)
                {
                    Log.Error($"{nameof(GluharBotTacticClass)}: Found {types.Count} Bot Tactic classes; Expected to find only 2");
                    // If this ever occurs, go to the BotTacticControllerClass class method "Activate", and check what class is being set as SubTactic for WildSpawnType.bossGluhar
                    // Try to find a way to uniquely identify that class
                    throw ClassResolutionException.Create(nameof(GluharBotTacticClass));
                }

                // The boss tactic class should be after the follower class name-wise
                var type = types.OrderBy(t => t.Name).Last();

                ClassCache.Add(nameof(GluharBotTacticClass), type);

                return type;
            }
        }

        public static Type StatisticsServerClass
        {
            get
            {
                if (ClassCache.ContainsKey(nameof(StatisticsServerClass)))
                {
                    return ClassCache[nameof(StatisticsServerClass)];
                }

                var type = typeof(AbstractGame).Assembly.GetTypes()
                    .SingleOrDefault(x => x.IsAbstract && x.GetMethods().Any(m => m.Name == "ForeachItems"));

                if (type == null)
                {
                    // If this ever occurs, try looking for an abstract class with methods like "ForeachItems", "OnEnemyKill" or "OnEnemyDamage"
                    throw ClassResolutionException.Create(nameof(StatisticsServerClass));
                }

                ClassCache.Add(nameof(StatisticsServerClass), type);

                return type;
            }
        }

        public static Type ConfigSettingsClass
        {
            get
            {
                if (ClassCache.ContainsKey(nameof(ConfigSettingsClass)))
                {
                    return ClassCache[nameof(ConfigSettingsClass)];
                }

                var type = typeof(AbstractGame).Assembly.GetTypes()
                    .SingleOrDefault(x => x.GetMethods().Any(m => m.Name == "get_OverDamageFactor"));

                if (type == null)
                {
                    // If this ever occurs, try looking for a class with properties like "OverDamageFactor" or "Associations",
                    // or fields like "RequirementReferences", "SavagePlayCooldown" or "TimeBeforeDeployLocal"
                    throw ClassResolutionException.Create(nameof(ConfigSettingsClass));
                }

                ClassCache.Add(nameof(ConfigSettingsClass), type);

                return type;
            }
        }

        public static Type ExperienceConfigClass
        {
            get
            {
                if (ClassCache.ContainsKey(nameof(ExperienceConfigClass)))
                {
                    return ClassCache[nameof(ExperienceConfigClass)];
                }

                var type = ConfigSettingsClass.GetField("Experience").FieldType;

                if (type == null)
                {
                    throw ClassResolutionException.Create(nameof(ExperienceConfigClass));
                }

                ClassCache.Add(nameof(ExperienceConfigClass), type);

                return type;
            }
        }        
        
        public static Type KillExperienceConfigClass
        {
            get
            {
                if (ClassCache.ContainsKey(nameof(KillExperienceConfigClass)))
                {
                    return ClassCache[nameof(KillExperienceConfigClass)];
                }

                var type = ExperienceConfigClass.GetField("Kill").FieldType;

                if (type == null)
                {
                    throw ClassResolutionException.Create(nameof(KillExperienceConfigClass));
                }

                ClassCache.Add(nameof(KillExperienceConfigClass), type);

                return type;
            }
        }

        public static Type StatisticsCounterClass
        {
            get
            {
                if (ClassCache.ContainsKey(nameof(StatisticsCounterClass)))
                {
                    return ClassCache[nameof(StatisticsCounterClass)];
                }

                var type = typeof(AbstractGame).Assembly.GetTypes()
                    .SingleOrDefault(x => x.GetFields().Any(f => f.Name == "SessionToOverallCounters"));

                if (type == null)
                {
                    // If this ever occurs, look for a static class with fields like "SessionToOverallCounters", "ExpKillBodyPartBonus" or "ExpStationaryContainer"
                    throw ClassResolutionException.Create(nameof(StatisticsCounterClass));
                }

                ClassCache.Add(nameof(StatisticsCounterClass), type);

                return type;
            }
        }

        public static Type StatisticValueClass
        {
            get
            {
                if (ClassCache.ContainsKey(nameof(StatisticValueClass)))
                {
                    return ClassCache[nameof(StatisticValueClass)];
                }

                var type = StatisticsCounterClass.GetField("ExpKillBase").FieldType;

                if (type == null)
                {
                    throw ClassResolutionException.Create(nameof(StatisticValueClass));
                }

                ClassCache.Add(nameof(StatisticValueClass), type);

                return type;
            }
        }

        public static Type StatisticValueParentClass
        {
            get
            {
                if (ClassCache.ContainsKey(nameof(StatisticValueParentClass)))
                {
                    return ClassCache[nameof(StatisticValueParentClass)];
                }

                var type = StatisticValueClass.DeclaringType;

                if (type == null)
                {
                    throw ClassResolutionException.Create(nameof(StatisticValueParentClass));
                }

                ClassCache.Add(nameof(StatisticValueParentClass), type);

                return type;
            }
        }

        public static Type BaseStatisticsServerClass
        {
            get
            {
                if (ClassCache.ContainsKey(nameof(BaseStatisticsServerClass)))
                {
                    return ClassCache[nameof(BaseStatisticsServerClass)];
                }

                var type = StatisticsServerClass.BaseType;

                if (type == null)
                {
                    throw ClassResolutionException.Create(nameof(BaseStatisticsServerClass));
                }

                ClassCache.Add(nameof(BaseStatisticsServerClass), type);

                return type;
            }
        }

        public static Type BotBossInfoClass
        {
            get
            {
                if (ClassCache.ContainsKey(nameof(BotBossInfoClass)))
                {
                    return ClassCache[nameof(BotBossInfoClass)];
                }

                var type = typeof(AbstractGame).Assembly.GetTypes()
                    .SingleOrDefault(x => x.IsAbstract && x.IsSealed && x.GetMethod("IsSiutable", BindingFlags.Public | BindingFlags.Static) != null);

                if (type == null)
                {
                    // If this ever occurs, try looking for a static class with methods like "IsBoss", "IsSiutable" and "IsFollower"
                    throw ClassResolutionException.Create(nameof(BotBossInfoClass));
                }

                ClassCache.Add(nameof(BotBossInfoClass), type);

                return type;
            }
        }

        public static Type AISettingsLoaderClass
        {
            get
            {
                if (ClassCache.ContainsKey(nameof(AISettingsLoaderClass)))
                {
                    return ClassCache[nameof(AISettingsLoaderClass)];
                }

                var type = typeof(AbstractGame).Assembly.GetTypes()
                    .SingleOrDefault(x => x.GetMethods().Any(m => m.Name == "LoadDifficultyStringInternal"));

                if (type == null)
                {
                    // If this ever occurs, look for a static class with static methods like "LoadDifficultyStringInternal", "LoadInternalCoreByString" or "CheckOnExcude"
                    throw ClassResolutionException.Create(nameof(AISettingsLoaderClass));
                }

                ClassCache.Add(nameof(AISettingsLoaderClass), type);

                return type;
            }
        }
    }
}