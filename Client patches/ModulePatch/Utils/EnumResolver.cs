using System;
using EFT;
using EFT.Counters;

namespace Ereshkigal.TerragroupSpecialist.Utils
{
    public static class EnumResolver
    {
        public static WildSpawnType TG_Boss => (WildSpawnType)Enum.Parse(typeof(WildSpawnType), Constants.WildSpawnType.TG_Boss, true);
        public static WildSpawnType TG_Followers => (WildSpawnType)Enum.Parse(typeof(WildSpawnType), Constants.WildSpawnType.TG_Followers, true);
        public static WildSpawnType TG_Raiders => (WildSpawnType)Enum.Parse(typeof(WildSpawnType), Constants.WildSpawnType.TG_Raiders, true);
        public static WildSpawnType UNTroops => (WildSpawnType) Enum.Parse(typeof(WildSpawnType), Constants.WildSpawnType.UNTroops, true);

        public static CounterTag KilledTerragroup => (CounterTag)Enum.Parse(typeof(CounterTag), Constants.CounterTag.KilledTerragroup, true);

        public static EPlayerSide Terragroup => (EPlayerSide)Enum.Parse(typeof(EPlayerSide), Constants.EPlayerSide.Terragroup, true);
        public static EPlayerSide UN => (EPlayerSide)Enum.Parse(typeof(EPlayerSide), Constants.EPlayerSide.UN, true);
    }
}