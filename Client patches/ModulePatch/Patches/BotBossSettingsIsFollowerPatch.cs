using System.Reflection;
using Aki.Reflection.Patching;
using EFT;
using Ereshkigal.TerragroupSpecialist.Exceptions;
using Ereshkigal.TerragroupSpecialist.Utils;

namespace Ereshkigal.TerragroupSpecialist.Patches
{
    public class BotBossSettingsIsFollowerPatch : Patch
    {
        public BotBossSettingsIsFollowerPatch() : base(T: typeof(BotBossSettingsIsFollowerPatch), postfix: nameof(PatchPostfix))
        {
        }

        protected override MethodBase GetTargetMethod()
        {
            var method = ClassResolver.BotBossSettingsClass
                .GetMethod("IsFollower", BindingFlags.Public | BindingFlags.Static);

            if (method == null)
            {
                throw PatchingException.Create(nameof(BotBossSettingsIsFollowerPatch), "Unable to locate 'IsFollower' method");
            }

            return method;
        }

        private static void PatchPostfix(WildSpawnType role, ref bool __result)
        {
            // After the method has executed, we override the result if role was TG_Followers
            if (role.ToString() == Constants.WildSpawnType.TG_Followers)
            {
                __result = true;
            }
        }
    }
}