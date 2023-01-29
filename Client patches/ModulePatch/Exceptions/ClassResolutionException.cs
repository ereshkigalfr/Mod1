using System;
using Aki.Common;

namespace Ereshkigal.TerragroupSpecialist.Exceptions
{
    public class ClassResolutionException : Exception
    {
        private ClassResolutionException(string message) : base(message)
        {
        }

        public static ClassResolutionException Create(string className)
        {
            // Due to BSG having catch-all exception handlers for some methods, we need to additionally log our exceptions in case they are caught and not re-thrown
            var message = $"Failed to dynamically resolve {className}";
            Log.Error(message);
            return new ClassResolutionException(message);
        }
    }
}