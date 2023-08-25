const newBoss = {
    "BossName": "TG_Boss",
    "BossChance": cfg["TG_Boss SpawnChance"],
    "BossZone": "BotZoneFloor1,BotZoneFloor2,BotZoneBasement",
    "BossPlayer": false,
    "BossDifficult": "impossible",
    "BossEscortType": "TG_Followers",
    "BossEscortDifficult": "impossible",
    "BossEscortAmount": "5",
    "Time": 1,
    "TriggerId": "",
    "TriggerName": "none",
    "Delay": 15,
};

// Adding boss to Labs
for (const bosses in DatabaseServer.tables.locations["laboratory"].base.BossLocationSpawn)
{
    let boss = DatabaseServer.tables.locations["laboratory"].base.BossLocationSpawn[bosses];
    boss.BossName = "TG_Raiders";
    boss.BossEscortType = "TG_Raiders";
    boss.BossEscortAmount = "2,3,3,5,1,1,5,2,2,3,4";
    boss.BossDifficult = "impossible";
    boss.BossChance = 60;
}

DatabaseServer.tables.locations["laboratory"].base.BossLocationSpawn.push(newBoss);

//Lets add some spawns
CoreMod.AddNewSpawnPoint("Spawn1", "laboratory", -263.587, 0.01103304, -390.5421, 0, ["Terragroup"], ["Bot"], "BotZoneMain");
CoreMod.AddNewSpawnPoint("Spawn2", "laboratory", -245.7945, 0.02383833, -380.219, 0, ["Terragroup"], ["Bot"], "BotZoneMain");
CoreMod.AddNewSpawnPoint("Spawn3", "laboratory", -249.6365, 4.104155, -379.0071, 0, ["Terragroup"], ["Bot"], "BotZoneMain");
CoreMod.AddNewSpawnPoint("Spawn4", "laboratory", -245.6283, 4.104156, -379.9973, 0, ["Terragroup"], ["Bot"], "BotZoneMain");
CoreMod.AddNewSpawnPoint("Spawn5", "laboratory", -253.2756, 4.117604, -361.4047, 0, ["Terragroup"], ["Bot"], "BotZoneMain");
CoreMod.AddNewSpawnPoint("Spawn6", "laboratory", -255.1729, 4.117605, -367.925, 0, ["Terragroup"], ["Bot"], "BotZoneMain");
CoreMod.AddNewSpawnPoint("Spawn7", "laboratory", -260.9297, 4.117605, -366.114, 0, ["Terragroup"], ["Bot"], "BotZoneMain");
CoreMod.AddNewSpawnPoint("Spawn8", "laboratory", -251.4255, 4.098026, -318.5574, 0, ["Terragroup"], ["Bot"], "BotZoneMain");
CoreMod.AddNewSpawnPoint("Spawn9", "laboratory", -258.5861, 4.098026, -318.506, 0, ["Terragroup"], ["Bot"], "BotZoneMain");