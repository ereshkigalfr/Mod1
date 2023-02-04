namespace TGK.Preloader
{
    /// <summary>
    /// Since a preloader patch doesn't add any compile-time references to enums, this class serves as a way to reference the various enum values that will be patched in
    /// </summary>
    public static class EnumPatchData
    {
        public static class UniversalEnumData
        {
            public const string TerragroupName = "Terragroup";
            public const string UN_Name = "UN";
        }

        public static class WildSpawnTypeEnumData
        {
            public const string TG_RaidersName = "TG_Raiders";
            public const int TG_RaidersValue = 3;

            public const string TG_BossName = "TG_Boss";
            public const int TG_BossValue = 5;

            public const string TG_FollowersName = "TG_Followers";
            public const int TG_FollowersValue = 6;

            public const string UNTroopsName = "UNTroops";
            public const int UNTroopsValue = 7;
        }

        public static class EPlayerSideEnumData
        {
            public const int TerragroupValue = 8;
            public const int UN_Value = 16;
        }

        public static class EPlayerSideMaskEnumData
        {
            public const int TerragroupValue = 8;
            public const int UN_Value = 9;
            public const int All_ChangedValue = 31;
        }

        public static class ESideTypeEnumData
        {
            public const int TerragroupValue = 3;
            public const int UN_Value = 4;
        }

        public static class CounterTagEnumData
        {
            public const string TerragroupName = "KilledTerragroup";
            public const int TerragroupValue = 1000;

            public const string UN_Name = "KilledUN";
            public const int UN_Value = 1001;
        }

        public static class EDogtagExchangeSide
        {
            public const int TerragroupValue = 5;
            public const int UN_Value = 6;
        }
    }
}