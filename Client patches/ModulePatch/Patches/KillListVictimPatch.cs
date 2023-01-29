using EFT;
using EFT.UI.SessionEnd;
using Ereshkigal.TerragroupSpecialist.Exceptions;
using Ereshkigal.TerragroupSpecialist.Utils;
using HarmonyLib;
using System.Collections.Generic;
using System.Reflection;
using System.Reflection.Emit;
using Patch = Aki.Reflection.Patching.Patch;

namespace Ereshkigal.TerragroupSpecialist.Patches
{
    public class KillListVictimPatch : Patch
    {
        public KillListVictimPatch() : base(T: typeof(KillListVictimPatch), transpiler: nameof(PatchTranspile))
        {
        }

        protected override MethodBase GetTargetMethod()
        {
            // KillListVictim should not change names (as opposed to GClass types), so using a static reference here is fine
            return typeof(KillListVictim).GetMethod("Show", BindingFlags.Public | BindingFlags.Instance);
        }

        private static IEnumerable<CodeInstruction> PatchTranspile(ILGenerator generator, IEnumerable<CodeInstruction> instructions)
        {
            var codes = new List<CodeInstruction>(instructions);

            // We locate our reference index - the instruction that loads the `victim.Side` value
            var startIndex = codes
                .FindIndex(c => c.opcode == OpCodes.Ldfld && (FieldInfo)c.operand == AccessTools.Field(typeof(VictimStats), "Side"));

            if (startIndex == -1)
            {
                throw PatchingException.Create(nameof(KillListVictimPatch), "Failed to locate start index for patching instructions");
            }

            if (codes[startIndex + 2].opcode != OpCodes.Ceq || codes[startIndex + 3].opcode != OpCodes.Stloc_0)
            {
                // If this ever occurs, the patch will need to be updated with either a new startIndex search, or new instructions alltogether. Good luck
                throw PatchingException.Create(nameof(KillListVictimPatch), "Instruction validation failed. Perhaps the method body has changed?");
            }

            // Generate a new pair of labels for logic jumps
            var skipLabel1 = generator.DefineLabel();
            var skipLabel2 = generator.DefineLabel();

            // If the instruction 3 rows down from our reference contains any labels, we clone them. If for some reason it doesn't, we just create a new list
            var newLabels = codes[startIndex + 3].labels != null ? new List<Label>(codes[startIndex + 3].labels) : new List<Label>();
            // We add our first logic jump label to the new list
            newLabels.Add(skipLabel1);
            // And reassign it back to the instruction labels
            codes[startIndex + 3].labels = newLabels;

            // We start by inserting the later instructions, so then we don't have to count how many lines we've added so far for adding instructions on a lower index
            codes.InsertRange(startIndex + 3, new[]
            {
                new CodeInstruction(OpCodes.Br_S, skipLabel1),
                new CodeInstruction(OpCodes.Ldc_I4_1) { labels = new List<Label>{ skipLabel2 } }
            });

            codes.InsertRange(startIndex + 2, new[]
            {
                new CodeInstruction(OpCodes.Beq_S, skipLabel2),
                new CodeInstruction(OpCodes.Ldarg_1),
                new CodeInstruction(OpCodes.Ldfld, AccessTools.Field(typeof(VictimStats), "Side")),
                new CodeInstruction(OpCodes.Ldc_I4_S, (int)EnumResolver.Terragroup),
                new CodeInstruction(OpCodes.Beq_S, skipLabel2),
                new CodeInstruction(OpCodes.Ldarg_1),
                new CodeInstruction(OpCodes.Ldfld, AccessTools.Field(typeof(VictimStats), "Side")),
                new CodeInstruction(OpCodes.Ldc_I4_S, (int)EnumResolver.UN)
            });

            // The inserts above modified the code from this:
            //     bool flag = victim.Side == EPlayerSide.Savage;
            // To this:
            //     bool flag = victim.Side == EPlayerSide.Savage || victim.Side == EPlayerSide.Terragroup || victim.Side == EPlayerSide.UN;

            return codes;
        }
    }
}