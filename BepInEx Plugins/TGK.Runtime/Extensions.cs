using System.Reflection;
using HarmonyLib;
using TGK.Runtime.Exceptions;
using TGK.Runtime.Patches;

namespace TGK.Runtime
{
    public static class Extensions
    {
        public static MethodInfo GetMethodOrThrow(this System.Type type, string methodName, BindingFlags? bindingFlags = null)
        {
            if (type == null)
            {
                throw CustomPatchException.CreateForTargetType();
            }

            var method = bindingFlags == null ? type.GetMethod(methodName) : type.GetMethod(methodName, (BindingFlags)bindingFlags);

            if (method == null)
            {
                throw CustomPatchException.CreateForTargetMethod(methodName);
            }

            return method;
        }

        public static HarmonyMethod GetLocalPatchMethod(this IRuntimePatch patchClass, string methodName)
        {
            return new HarmonyMethod(patchClass.GetType().GetMethod(methodName, BindingFlags.NonPublic | BindingFlags.Static));
        }
    }
}