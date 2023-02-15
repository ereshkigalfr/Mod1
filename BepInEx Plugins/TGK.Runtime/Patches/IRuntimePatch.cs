using BepInEx.Logging;
using HarmonyLib;

namespace TGK.Runtime.Patches
{
    public interface IRuntimePatch
    {
        void ApplyPatches(Harmony harmony, ManualLogSource logger);
    }
}