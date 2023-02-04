using System.Collections.Generic;
using Mono.Cecil;

namespace TGK.Preloader
{
    public static class PreloaderPatch
    {
        public static IEnumerable<string> TargetDLLs { get; } = new[] { "Assembly-CSharp.dll" };

        public static void Patch(ref AssemblyDefinition assembly)
        {
            var wildSpawnTypeEnum = assembly.MainModule.GetType("EFT.WildSpawnType");
            Utils.AddEnumValue(ref wildSpawnTypeEnum, EnumPatchData.WildSpawnTypeEnumData.TG_RaidersName, EnumPatchData.WildSpawnTypeEnumData.TG_RaidersValue);
            Utils.AddEnumValue(ref wildSpawnTypeEnum, EnumPatchData.WildSpawnTypeEnumData.TG_BossName, EnumPatchData.WildSpawnTypeEnumData.TG_BossValue);
            Utils.AddEnumValue(ref wildSpawnTypeEnum, EnumPatchData.WildSpawnTypeEnumData.TG_FollowersName, EnumPatchData.WildSpawnTypeEnumData.TG_FollowersValue);
            Utils.AddEnumValue(ref wildSpawnTypeEnum, EnumPatchData.WildSpawnTypeEnumData.UNTroopsName, EnumPatchData.WildSpawnTypeEnumData.UNTroopsValue);

            var ePlayerSideEnum = assembly.MainModule.GetType("EFT.EPlayerSide");
            Utils.AddEnumValue(ref ePlayerSideEnum, EnumPatchData.UniversalEnumData.TerragroupName, EnumPatchData.EPlayerSideEnumData.TerragroupValue);
            Utils.AddEnumValue(ref ePlayerSideEnum, EnumPatchData.UniversalEnumData.UN_Name, EnumPatchData.EPlayerSideEnumData.UN_Value);

            var ePlayerSideMaskEnum = assembly.MainModule.GetType("EFT.EPlayerSideMask");
            Utils.AddEnumValue(ref ePlayerSideMaskEnum, EnumPatchData.UniversalEnumData.TerragroupName, EnumPatchData.EPlayerSideMaskEnumData.TerragroupValue);
            Utils.AddEnumValue(ref ePlayerSideMaskEnum, EnumPatchData.UniversalEnumData.UN_Name, EnumPatchData.EPlayerSideMaskEnumData.UN_Value);
            Utils.ChangeEnumValue(ref ePlayerSideMaskEnum, "All", EnumPatchData.EPlayerSideMaskEnumData.All_ChangedValue);

            var eSideTypeEnum = assembly.MainModule.GetType("EFT.ESideType");
            Utils.AddEnumValue(ref eSideTypeEnum, EnumPatchData.UniversalEnumData.TerragroupName, EnumPatchData.ESideTypeEnumData.TerragroupValue);
            Utils.AddEnumValue(ref eSideTypeEnum, EnumPatchData.UniversalEnumData.UN_Name, EnumPatchData.ESideTypeEnumData.UN_Value);

            var counterTagEnum = assembly.MainModule.GetType("EFT.Counters.CounterTag");
            Utils.AddEnumValue(ref counterTagEnum, EnumPatchData.CounterTagEnumData.TerragroupName, EnumPatchData.CounterTagEnumData.TerragroupValue);
            Utils.AddEnumValue(ref counterTagEnum, EnumPatchData.CounterTagEnumData.UN_Name, EnumPatchData.CounterTagEnumData.UN_Value);

            var eDogtagExchangeSideEnum = assembly.MainModule.GetType("EFT.InventoryLogic.EDogtagExchangeSide");
            Utils.AddEnumValue(ref eDogtagExchangeSideEnum, EnumPatchData.UniversalEnumData.TerragroupName, EnumPatchData.EDogtagExchangeSide.TerragroupValue);
            Utils.AddEnumValue(ref eDogtagExchangeSideEnum, EnumPatchData.UniversalEnumData.UN_Name, EnumPatchData.EDogtagExchangeSide.UN_Value);
        }
    }
}
