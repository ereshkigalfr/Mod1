using System.Reflection;
using Aki.Reflection.Patching;
using EFT;
using Ereshkigal.TerragroupSpecialist.Exceptions;
using Ereshkigal.TerragroupSpecialist.Utils;

namespace Ereshkigal.TerragroupSpecialist.Patches
{
    public class BotFollowerControllerIsSuitablePatch : Patch
    {
        public BotFollowerControllerIsSuitablePatch() : base(T: typeof(BotFollowerControllerIsSuitablePatch), postfix: nameof(PatchPostfix))
        {
        }

        protected override MethodBase GetTargetMethod()
        {
            var method = ClassResolver.BotFollowerControllerClass
                .GetMethod("IsFollowerSuitableForBoss", BindingFlags.Public | BindingFlags.Static);

            if (method == null)
            {
                throw PatchingException.Create(nameof(BotFollowerControllerIsSuitablePatch), "Unable to locate 'IsFollowerSuitableForBoss' method");
            }

            return method;
        }

        private static void PatchPostfix(WildSpawnType follower, WildSpawnType boss, ref bool __result)
        {
            // After method has executed, we override the result if it matches our condition
            if (follower == EnumResolver.TG_Followers && boss == EnumResolver.TG_Boss)
            {
                __result = true;
            }
        }
    }
}