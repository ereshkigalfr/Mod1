using System.Reflection;
using Aki.Reflection.Patching;
using EFT;
using Ereshkigal.TerragroupSpecialist.Exceptions;
using Ereshkigal.TerragroupSpecialist.Utils;

namespace Ereshkigal.TerragroupSpecialist.Patches
{
    public class BotLogicInstantiatorPatch : Patch
    {
        public BotLogicInstantiatorPatch() : base(T: typeof(BotLogicInstantiatorPatch), prefix: nameof(PatchPrefix))
        {
        }

        protected override MethodBase GetTargetMethod()
        {
            var method = ClassResolver.BotBaseLogicClass
                .GetMethod("smethod_0", BindingFlags.NonPublic | BindingFlags.Static);

            if (method == null)
            {
                throw PatchingException.Create(nameof(BotLogicInstantiatorPatch), "Unable to locate 'smethod_0' method");
            }

            return method;
        }

        private static void PatchPrefix(ref WildSpawnType role)
        {
            // Since dynamically resolving bot logic classes is nearly impossible (almost no way to uniquely identify them),
            // we simply override the role value so it returns the bot logic class we want

            // We match enum values by string because the enum might not have our added enum values during module compilation
            // We don't match by int either, as that could change if new enum values are added to the game
            if (role.ToString() == Constants.WildSpawnType.TG_Boss)
            {
                role = WildSpawnType.bossGluhar;
            }

            if (role.ToString() == Constants.WildSpawnType.TG_Raiders)
            {
                role = WildSpawnType.pmcBot;
            }

            if (role.ToString() == Constants.WildSpawnType.TG_Followers)
            {
                role = WildSpawnType.followerGluharSecurity;
            }

            if (role.ToString() == Constants.WildSpawnType.UNTroops)
            {
                role = WildSpawnType.pmcBot;
            }
        }
    }
}