using System;
using System.Collections.Generic;
using System.Linq;

namespace EnumPatcherApp
{
    public static class Utils
    {
        public static void LogInfo(string message)
        {
            Console.ForegroundColor = ConsoleColor.DarkCyan;
            Console.WriteLine($"[INFO] {message}");
            Console.ResetColor();
        }
        
        public static void LogWarning(string message)
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine($"[WARNING] {message}");
            Console.ResetColor();
        }

        public static void LogError(string message)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine($"[ERROR] {message}");
            Console.ResetColor();
        }

        public static bool IsNullOrEmpty<T>(this IEnumerable<T> enumerable)
        {
            return !(enumerable?.Any() ?? false);
        }
    }
}