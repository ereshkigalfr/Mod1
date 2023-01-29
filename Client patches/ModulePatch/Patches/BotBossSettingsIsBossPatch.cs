using System.Reflection;
using Aki.Reflection.Patching;
using EFT;
using Ereshkigal.TerragroupSpecialist.Exceptions;
using Ereshkigal.TerragroupSpecialist.Utils;

namespace Ereshkigal.TerragroupSpecialist.Patches
{
    public class BotBossSettingsIsBossPatch : Patch
    {
        public BotBossSettingsIsBossPatch() : base(T: typeof(BotBossSettingsIsBossPatch), postfix: nameof(PatchPostfix))
        {
        }

        protected override MethodBase GetTargetMethod()
        {
            var method = ClassResolver.BotBossSettingsClass
                .GetMethod("IsBoss", BindingFlags.Public | BindingFlags.Static);

            if (method == null)
            {
                throw PatchingException.Create(nameof(BotBossSettingsIsBossPatch), "Unable to locate 'IsBoss' method");
            }

            return method;
        }

        private static void PatchPostfix(WildSpawnType role, ref bool __result)
        {
            // After the method has executed, we override the result if role was TG_Boss
            if (role.ToString() == Constants.WildSpawnType.TG_Boss)
            {
                __result = true;
            }
        }
    }
}