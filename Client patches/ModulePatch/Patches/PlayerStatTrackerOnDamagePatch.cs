using Ereshkigal.TerragroupSpecialist.Exceptions;
using Ereshkigal.TerragroupSpecialist.Utils;
using HarmonyLib;
using System.Collections.Generic;
using System.Reflection;
using System.Reflection.Emit;
using Patch = Aki.Reflection.Patching.Patch;

namespace Ereshkigal.TerragroupSpecialist.Patches
{
    public class PlayerStatTrackerOnDamagePatch : Patch
    {
        public PlayerStatTrackerOnDamagePatch() : base(T: typeof(PlayerStatTrackerOnDamagePatch), transpiler: nameof(PatchTranspile))
        {
        }

        protected override MethodBase GetTargetMethod()
        {
            var method = ClassResolver.StatisticsServerClass
                .GetMethod("OnEnemyDamage", BindingFlags.Public | BindingFlags.Instance);

            if (method == null)
            {
                throw PatchingException.Create(nameof(PlayerStatTrackerOnDamagePatch), "Unable to locate 'OnEnemyDamage' method");
            }

            return method;
        }

        private static IEnumerable<CodeInstruction> PatchTranspile(ILGenerator generator, IEnumerable<CodeInstruction> instructions)
        {
            var codes = new List<CodeInstruction>(instructions);

            var newInstructionInsertIndex = -1;

            var terragroupInstructionStartLabel = generator.DefineLabel();
            var UN_InstructionStartLabel = generator.DefineLabel();
            var switchEndLabel = default(Label);

            for (var i = 0; i < codes.Count; i++)
            {
                // We locate and grab the label that points to the end of the switch
                if (codes[i].opcode == OpCodes.Ldstr && (string)codes[i].operand == "AnyPmc")
                {
                    switchEndLabel = (Label)codes[i + 2].operand;
                    continue;
                }

                // We locate and save the index where we will be inserting our new instructions
                if (codes[i].opcode == OpCodes.Ldstr && (string)codes[i].operand == "Savage")
                {
                    newInstructionInsertIndex = i + 2;
                    continue;
                }

                // We locate the relevant switch instruction, as more than one could exist in the future
                if (codes[i].opcode == OpCodes.Ldstr && (string)codes[i].operand == "Usec")
                {
                    // From here, 5 codes back is where the switch should start
                    if (codes[i - 5].opcode != OpCodes.Switch)
                    {
                        throw PatchingException.Create(nameof(PlayerStatTrackerOnDamagePatch), "Failed to locate switch instruction");
                    }

                    // We grab the switch operand, which is just an array of labels
                    var switchOperand = (Label[])codes[i - 5].operand;
                    // The third label in the switch operand points to the ArgumentOutOfRangeException
                    var outOfRangeLabel = switchOperand[2];

                    // We create a new list of labels, and add all the old values to it
                    var newSwitchOperand = new List<Label>();
                    newSwitchOperand.AddRange(switchOperand);

                    // Since EPlayerSide.Terragroup is 8, we need values 5, 6 and 7 to also exit the switch statement
                    // We locate the index where our ArgumentOutOfRange exception throwing instructions are
                    var targetCodeIndex = codes.FindIndex(c => c.labels != null && c.labels.Contains(outOfRangeLabel));
                    if (targetCodeIndex == -1)
                    {
                        throw PatchingException.Create(nameof(PlayerStatTrackerOnDamagePatch), "Failed to locate switch ArgumentOutOfRange label target");
                    }

                    // Generate new labels to fill in the unused switch cases
                    var newOutOfRangeLabels = new List<Label>
                    {
                        generator.DefineLabel(),
                        generator.DefineLabel(),
                        generator.DefineLabel(),
                    };

                    // And add them to the ArgumentOutOfRange exception instruction label list
                    codes[targetCodeIndex].labels.AddRange(newOutOfRangeLabels);

                    // Finally, we add the new labels to the switch statement
                    newSwitchOperand.AddRange(newOutOfRangeLabels.ToArray());

                    // Now, we can add the 8th label that will point to our new instructions
                    newSwitchOperand.Add(terragroupInstructionStartLabel);

                    // Same deal, except now we need to pad values 9-15 & add the 16th label for the UN side (int value 16)
                    newOutOfRangeLabels = new List<Label>
                    {
                        generator.DefineLabel(),
                        generator.DefineLabel(),
                        generator.DefineLabel(),
                        generator.DefineLabel(),
                        generator.DefineLabel(),
                        generator.DefineLabel(),
                        generator.DefineLabel()
                    };
                    codes[targetCodeIndex].labels.AddRange(newOutOfRangeLabels);
                    newSwitchOperand.AddRange(newOutOfRangeLabels.ToArray());
                    newSwitchOperand.Add(UN_InstructionStartLabel);

                    // Reassign the switch operand with our new label list
                    codes[i - 5].operand = newSwitchOperand.ToArray();
                    continue;
                }
            }

            if (switchEndLabel == default)
            {
                throw PatchingException.Create(nameof(PlayerStatTrackerOnDamagePatch), "Failed to locate switch end label");
            }

            if (newInstructionInsertIndex == -1)
            {
                throw PatchingException.Create(nameof(PlayerStatTrackerOnDamagePatch), "Failed to locate index to insert instructions at");
            }

            var newInstructions = new List<CodeInstruction>
            {
                // Since the code is being added at the end of one of the switch cases, we need the previous case to exit the switch
                new CodeInstruction(OpCodes.Br_S, switchEndLabel),
                // The following instructions generate this line:
                // if (flag)
                new CodeInstruction(OpCodes.Ldloc_1) { labels = new List<Label>{ terragroupInstructionStartLabel }},
                new CodeInstruction(OpCodes.Brfalse_S, switchEndLabel),
                // The following instructions generate this line:
                // list.Add("Terragroup")
                new CodeInstruction(OpCodes.Ldloc_2),
                new CodeInstruction(OpCodes.Ldstr, Constants.EPlayerSide.Terragroup),
                new CodeInstruction(OpCodes.Callvirt, AccessTools.Method(typeof(List<string>), "Add", new []{ typeof(string) })),
                // From here a new case is added for the UN side damage tracking
                new CodeInstruction(OpCodes.Br_S, switchEndLabel),
                // The following instructions generate this line:
                // if (flag)
                new CodeInstruction(OpCodes.Ldloc_1) { labels = new List<Label>{ UN_InstructionStartLabel }},
                new CodeInstruction(OpCodes.Brfalse_S, switchEndLabel),
                // The following instructions generate this line:
                // list.Add("UN")
                new CodeInstruction(OpCodes.Ldloc_2),
                new CodeInstruction(OpCodes.Ldstr, Constants.EPlayerSide.UN),
                new CodeInstruction(OpCodes.Callvirt, AccessTools.Method(typeof(List<string>), "Add", new []{ typeof(string) }))
            };

            codes.InsertRange(newInstructionInsertIndex, newInstructions);

            return codes;
        }
    }
}