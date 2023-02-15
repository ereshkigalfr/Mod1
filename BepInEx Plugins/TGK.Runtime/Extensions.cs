using System.Reflection;
using TGK.Runtime.Exceptions;

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
    }
}