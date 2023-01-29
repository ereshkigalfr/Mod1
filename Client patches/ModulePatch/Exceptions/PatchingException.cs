using System;
using Aki.Common;

namespace Ereshkigal.TerragroupSpecialist.Exceptions
{
    public class PatchingException : Exception
    {
        private PatchingException(string message) : base(message)
        {
        }

        public static PatchingException Create(string patchName, string message)
        {
            var formattedMessage = $"{patchName}: {message}";
            // Due to BSG having catch-all exception handlers for some methods, we need to additionally log our exceptions in case they are caught and not re-thrown
            Log.Error(formattedMessage);
            return new PatchingException(formattedMessage);
        }
    }
}