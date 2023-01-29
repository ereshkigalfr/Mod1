using System;
using System.Reflection;
using Aki.Common;
using EFT;
using Ereshkigal.TerragroupSpecialist.Exceptions;
using Ereshkigal.TerragroupSpecialist.Utils;
using HarmonyLib;
using UnityEngine;
using Patch = Aki.Reflection.Patching.Patch;

namespace Ereshkigal.TerragroupSpecialist.Patches
{
    public class BotTacticControllerPatch : Patch
    {
        public BotTacticControllerPatch() : base(T: typeof(BotTacticControllerPatch), postfix: nameof(PatchPostfix))
        {
        }

        protected override MethodBase GetTargetMethod()
        {
            var method = ClassResolver.BotTacticControllerClass
                .GetMethod("Activate", BindingFlags.Instance | BindingFlags.Public);

            if (method == null)
            {
                throw PatchingException.Create(nameof(BotTacticControllerPatch), "Unable to locate 'Activate' method");
            }

            return method;
        }

        private static void PatchPostfix(object __instance)
        {
            try
            {
                // We grab the BotOwner field from the class instance. Basically doing `this.botOwner_0`
                var botOwner = Traverse.Create(__instance).Field("botOwner_0")?.GetValue<BotOwner>();
                if (botOwner == null)
                {
                    throw PatchingException.Create(nameof(BotTacticControllerPatch), "Failed to locate 'botOwner_0' field. Did the name or type change?");
                }

                if (botOwner.Boss.IamBoss && botOwner.Profile.Info.Settings.Role.ToString() == Constants.WildSpawnType.TG_Boss)
                {
                    // We grab Gluhar's Bot Tactic class constructor, so we can create an object with dynamic class references
                    var bossTacticConstructor = ClassResolver.GluharBotTacticClass.GetConstructor(new[] {typeof(BotOwner)});
                    if (bossTacticConstructor == null)
                    {
                        // If this occurs, it's possible that the constructor's types are different, or the amount of parameters has changed
                        throw PatchingException.Create(nameof(BotTacticControllerPatch), "Failed to locate constructor for Gluhar's bot tactic class");
                    }

                    // We invoke the constructor, creating an object of Gluhar's Bot Tactic class
                    var bossTactic = bossTacticConstructor.Invoke(new object[] { botOwner });

                    Traverse.Create(__instance).Property("SubTactic").SetValue(bossTactic);
                }
            }
            catch (Exception e)
            {
                // Due to all exceptions from the BotTacticController getting caught and not logged, we force exception logging for this patch.
                Debug.LogError(e);
                Log.Error($"{e.Message}\n{e.StackTrace}");
                throw;
            }
        }
    }
}