using System;

namespace TGK.Runtime.Exceptions
{
    public class CustomPatchException : Exception
    {
        public bool ShouldHaltAllPatchExecution { get; }

        private CustomPatchException(string message, bool shouldHalt) : base(message)
        {
            ShouldHaltAllPatchExecution = shouldHalt;
        }

        public static CustomPatchException CreateForTargetType()
        {
            return new CustomPatchException("Target type was null", false);
        }

        public static CustomPatchException CreateForTargetMethod(string methodName)
        {
            return new CustomPatchException($"Failed to locate '{methodName}' method", false);
        }
    }
}