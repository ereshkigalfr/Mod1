using System.Reflection;
using BepInEx.Logging;
using EFT;
using EFT.UI.SessionEnd;
using HarmonyLib;
using TGK.Preloader;

namespace TGK.Runtime.Patches
{
    public class KillListVictimPatches : IRuntimePatch
    {
        public void ApplyPatches(Harmony harmony, ManualLogSource logger)
        {
            var targetClass = typeof(KillListVictim);
            var showMethod = targetClass.GetMethodOrThrow("Show", BindingFlags.Public | BindingFlags.Instance);

            harmony.Patch(showMethod,
                prefix: this.GetLocalPatchMethod(nameof(OnShowVictimListPrefixPatch)),
                postfix: this.GetLocalPatchMethod(nameof(OnShowVictimListPostfixPatch)));
        }

        private static void OnShowVictimListPrefixPatch(VictimStats victim, out (bool, int) __state)
        {
            var originalVictimSide = (int)victim.Side;

            switch (originalVictimSide)
            {
                case EnumPatchData.EPlayerSideEnumData.TerragroupValue:
                    victim.Side = EPlayerSide.Savage;
                    __state = (true, originalVictimSide);
                    break;
                case EnumPatchData.EPlayerSideEnumData.UN_Value:
                    victim.Side = EPlayerSide.Savage;
                    __state = (true, originalVictimSide);
                    break;
                default:
                    __state = (false, 0);
                    break;
            }
        }

        private static void OnShowVictimListPostfixPatch(VictimStats victim, (bool, int) __state)
        {
            var (sideValueWasChanged, originalValue) = __state;

            if (sideValueWasChanged)
            {
                victim.Side = (EPlayerSide)originalValue;
            }
        }
    }
}