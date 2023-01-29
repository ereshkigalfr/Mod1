using System.Reflection;
using EFT;
using Ereshkigal.TerragroupSpecialist.Exceptions;
using Ereshkigal.TerragroupSpecialist.Utils;
using HarmonyLib;
using Patch = Aki.Reflection.Patching.Patch;

namespace Ereshkigal.TerragroupSpecialist.Patches
{
    public class BotFollowerControllerBossLogicPatch : Patch
    {
        public BotFollowerControllerBossLogicPatch() : base(T: typeof(BotFollowerControllerBossLogicPatch), prefix: nameof(PatchPrefix))
        {
        }

        protected override MethodBase GetTargetMethod()
        {
            var method = ClassResolver.BotFollowerControllerClass
                .GetMethod("method_0", BindingFlags.NonPublic | BindingFlags.Instance);

            if (method == null)
            {
                throw PatchingException.Create(nameof(BotFollowerControllerBossLogicPatch), "Unable to locate 'method_0' method");
            }

            return method;
        }

        private static void PatchPrefix(object __instance)
        {
            // We grab the BotOwner field from the class instance. Basically doing `this.botOwner_0`
            var botOwner = Traverse.Create(__instance).Field("botOwner_0").GetValue<BotOwner>();
            if (botOwner == null)
            {
                throw PatchingException.Create(nameof(BotFollowerControllerBossLogicPatch), "Failed to locate 'botOwner_0' field. Did the name or type change?");
            }

            // If method is called when the bot role is TG_Boss, we assign Gluhar's boss logic and set bool_1 to true
            if (botOwner.Profile.Info.Settings.Role == EnumResolver.TG_Boss)
            {
                // We grab Gluhar's Boss Logic class constructor, so we can create an object with dynamic class references
                var bossLogicConstructor = ClassResolver.GluharBossLogicClass.GetConstructor(new[] { typeof(BotOwner), ClassResolver.BotFollowerControllerClass });
                if (bossLogicConstructor == null)
                {
                    // If this occurs, it's possible that the constructor's types are different, or the amount of parameters has changed
                    throw PatchingException.Create(nameof(BotFollowerControllerBossLogicPatch), "Failed to locate constructor for Gluhar's boss logic class");
                }
                
                // We invoke the constructor, creating an object of Gluhar's Boss Logic class
                var bossLogic = bossLogicConstructor.Invoke(new [] { botOwner, __instance });
                // Then we assign this object to the BossLogic property
                Traverse.Create(__instance).Property("BossLogic").SetValue(bossLogic);
                Traverse.Create(__instance).Field("bool_1").SetValue(true);
            }

            // If method is called when the bot role is TG_Raiders, we only assign assaultGroup's boss logic
            if (botOwner.Profile.Info.Settings.Role == EnumResolver.TG_Raiders)
            {
                // Same logic as for TG_Boss - refer to comments above if explanation is needed.
                var bossLogicConstructor = ClassResolver.RaiderBossLogicClass.GetConstructor(new[] { typeof(BotOwner), ClassResolver.BotFollowerControllerClass });
                if (bossLogicConstructor == null)
                {
                    throw PatchingException.Create(nameof(BotFollowerControllerBossLogicPatch), "Failed to locate constructor for raider boss logic class");
                }

                var bossLogic = bossLogicConstructor.Invoke(new[] { botOwner, __instance });
                Traverse.Create(__instance).Property("BossLogic").SetValue(bossLogic);
                // bool_1 doesn't need to be set for TG_Raiders
            }
        }
    }
}