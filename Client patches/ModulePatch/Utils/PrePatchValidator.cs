using Aki.Common;
using EFT;
using Ereshkigal.TerragroupSpecialist.Exceptions;
using System;
using System.Linq;
using System.Runtime.InteropServices;

namespace Ereshkigal.TerragroupSpecialist.Utils
{
    public static class PrePatchValidator
    {
        [DllImport("User32.dll", EntryPoint = "MessageBox", CharSet = CharSet.Auto)]
        private static extern int MsgBox(IntPtr hWnd, string lpText, string lpCaption, uint uType);

        private const uint OkButton = 0x00000000;
        private const uint ErrorIcon = 0x00000010;

        private static void ThrowErrorModal(string message)
        {
            // Display an error message box, warning the user that they've potentially installed the mod incorrectly
            MsgBox(IntPtr.Zero,
                "Assembly-csharp.dll is missing some required changes, please make sure you've correctly installed TerragroupSpecialist.", 
                "Assembly Validation Error",
                OkButton | ErrorIcon);

            throw PatchingException.Create(nameof(PrePatchValidator), message);
        }

        // These values cannot change without reworking some transpile patches
        private const int TerragroupEPlayerSideValue = 8;
        private const int UnEPlayerSideValue = 16;

        public static void ValidateAssembly()
        {
            if (!Enum.IsDefined(typeof(EPlayerSide), Constants.EPlayerSide.Terragroup))
            {
                ThrowErrorModal($"{nameof(EPlayerSide)} enum doesn't have {Constants.EPlayerSide.Terragroup} defined!");
            }

            if (!Enum.IsDefined(typeof(EPlayerSide), Constants.EPlayerSide.UN))
            {
                ThrowErrorModal($"{nameof(EPlayerSide)} enum doesn't have {Constants.EPlayerSide.UN} defined!");
            }

            if ((int)EnumResolver.Terragroup != TerragroupEPlayerSideValue)
            {
                ThrowErrorModal($"{nameof(EPlayerSide)}.{Constants.EPlayerSide.Terragroup} has an incorrect value! Expected: {TerragroupEPlayerSideValue}, found: {(int)EnumResolver.Terragroup}");
            }

            if ((int)EnumResolver.UN != UnEPlayerSideValue)
            {
                ThrowErrorModal($"{nameof(EPlayerSide)}.{Constants.EPlayerSide.UN} has an incorrect value! Expected: {UnEPlayerSideValue}, found: {(int)EnumResolver.UN}");
            }

            if (!Enum.IsDefined(typeof(WildSpawnType), Constants.WildSpawnType.TG_Boss))
            {
                ThrowErrorModal($"{nameof(WildSpawnType)} enum doesn't have {Constants.WildSpawnType.TG_Boss} defined!");
            }

            if (!Enum.IsDefined(typeof(WildSpawnType), Constants.WildSpawnType.TG_Followers))
            {
                ThrowErrorModal($"{nameof(WildSpawnType)} enum doesn't have {Constants.WildSpawnType.TG_Followers} defined!");
            }

            if (!Enum.IsDefined(typeof(WildSpawnType), Constants.WildSpawnType.TG_Raiders))
            {
                ThrowErrorModal($"{nameof(WildSpawnType)} enum doesn't have {Constants.WildSpawnType.TG_Raiders} defined!");
            }
        }

        public static void ValidateClassResolver()
        {
            var classResolverMethods = typeof(ClassResolver).GetMethods().Where(m => m.Name.StartsWith("get_")).ToList();

            var failed = false;
            foreach (var method in classResolverMethods)
            {
                try
                {
                    method.Invoke(null, new object[] { });
                }
                catch (Exception e)
                {
                    Log.Error($"{e.Message}\n{e.StackTrace}");
                    failed = true;
                }
            }

            if (failed)
            {
                throw PatchingException.Create(nameof(PrePatchValidator), "ClassResolver validation failed!");
            }
        }
    }
}