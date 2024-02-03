/*
エレシュキガル
*/

/*
    Terragroup Knight mod.
    Copyright (C) 2024 Ereshkigal

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import { DependencyContainer } from "tsyringe";

// SPT types
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { IBotConfig } from "@spt-aki/models/spt/config/IBotConfig";

//TGS Types
//import { coreMod } from "../../src/core/coremod";
import * as config from "../../config/config.json"
import * as configBots from "../../data/bots.json"
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { coreMod } from "../core/coremod";
import { dataFileGenerator } from "../functions/dataFileGenerator";

const TGSBotBoss = require("../../db/bots/tg_boss.json");
const TGSBotFollower = require("../../db/bots/tg_followers.json");
const TGSBotRaider = require("../../db/bots/tg_raiders.json");
const TGSBotUN = require("../../db/bots/untroops.json");
const TGSRaidersPresets = require("../../data/tg_raiders_presets.json");
const TGSBossPresets = require("../../data/tg_boss_presets.json");
const TGSFollowersPresets = require("../../data/tg_followers_presets.json");

export class InitBots {
    static initAll(container: DependencyContainer) {
        const MainDatabase = container.resolve<DatabaseServer>("DatabaseServer");
        const logger = container.resolve<ILogger>("WinstonLogger");
        const JsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const BotConfig = configServer.getConfig<IBotConfig>(ConfigTypes.BOT);
        const ServerDatabase = MainDatabase.getTables();
        const maps = ServerDatabase.locations
        const bots = ServerDatabase.bots

        //Adding all the bots types
        if (config["Other"]["Extra logging"]) { logger.info("TGK:Adding all bots types to database") };
        bots.types["tg_boss"] = TGSBotBoss;
        bots.types["tg_followers"] = TGSBotFollower;
        bots.types["tg_raiders"] = TGSBotRaider;
        bots.types["untroops"] = TGSBotUN;


        if (config["Other"]["Extra logging"]) { logger.info("TGK:Replacing default raiders with custom one") };
        //Replacing all regular raiders on labs by TG raiders

        for (const bosses in maps.laboratory.base.BossLocationSpawn) {
            let boss = maps.laboratory.base.BossLocationSpawn[bosses];
            boss.BossName = "TG_Raiders";
            boss.BossEscortType = "TG_Raiders";
            boss.BossEscortAmount = "3,4,2,1,1,2,3,4,5,2,3,3,4";
            boss.BossDifficult = "impossible";
            boss.BossChance = 55;
        }

        if (config["Other"]["Extra logging"]) { logger.info("TGK:Adding new boss to maps") };

        //Adding the new boss to the spawnlist of labs
        const newBoss = configBots.newBoss;
        newBoss.BossChance = config.Gameplay["TG_Boss SpawnChance"]
        maps.laboratory.base.BossLocationSpawn.push(newBoss);

        //Lets add some spawns

        coreMod.AddNewSpawnPoint(maps, "Spawn1", "laboratory", -263.587, 0.01103304, -390.5421, 0, ["Terragroup"], ["Bot"], "BotZoneMain");
        coreMod.AddNewSpawnPoint(maps, "Spawn2", "laboratory", -245.7945, 0.02383833, -380.219, 0, ["Terragroup"], ["Bot"], "BotZoneMain");
        coreMod.AddNewSpawnPoint(maps, "Spawn3", "laboratory", -249.6365, 4.104155, -379.0071, 0, ["Terragroup"], ["Bot"], "BotZoneMain");
        coreMod.AddNewSpawnPoint(maps, "Spawn4", "laboratory", -245.6283, 4.104156, -379.9973, 0, ["Terragroup"], ["Bot"], "BotZoneMain");
        coreMod.AddNewSpawnPoint(maps, "Spawn5", "laboratory", -253.2756, 4.117604, -361.4047, 0, ["Terragroup"], ["Bot"], "BotZoneMain");
        coreMod.AddNewSpawnPoint(maps, "Spawn6", "laboratory", -255.1729, 4.117605, -367.925, 0, ["Terragroup"], ["Bot"], "BotZoneMain");
        coreMod.AddNewSpawnPoint(maps, "Spawn7", "laboratory", -260.9297, 4.117605, -366.114, 0, ["Terragroup"], ["Bot"], "BotZoneMain");
        coreMod.AddNewSpawnPoint(maps, "Spawn8", "laboratory", -251.4255, 4.098026, -318.5574, 0, ["Terragroup"], ["Bot"], "BotZoneMain");
        coreMod.AddNewSpawnPoint(maps, "Spawn9", "laboratory", -258.5861, 4.098026, -318.506, 0, ["Terragroup"], ["Bot"], "BotZoneMain");


        //Adding custom items to bosses
        bots.types["bossgluhar"].inventory.items.SpecialLoot.push("TGS_cryptedphone");

        //Add bots configs

        BotConfig.presetBatch["TG_Raiders"] = 120;
        BotConfig.lootNValue["tg_raiders"] = 2;
        BotConfig.itemSpawnLimits["tg_raiders"] = {};
        BotConfig.equipment["tg_raiders"] = configBots.botEquipmentStuff;
        BotConfig.durability["tg_raiders"] = configBots.durabilityStuff;
        BotConfig.presetBatch["TG_Boss"] = 1;
        BotConfig.lootNValue["tg_boss"] = 1;
        BotConfig.itemSpawnLimits["tg_boss"] = {};
        BotConfig.equipment["tg_boss"] = configBots.botEquipmentStuff;
        BotConfig.durability["tg_boss"] = configBots.durabilityStuff;
        //3.8 stuff
        //BotConfig.botRolesWithDogTags.push("tg_boss")
        BotConfig.presetBatch["TG_Followers"] = 60;
        BotConfig.lootNValue["tg_followers"] = 60;
        BotConfig.itemSpawnLimits["tg_followers"] = {};
        BotConfig.equipment["tg_followers"] = configBots.botEquipmentStuff;
        BotConfig.durability["tg_followers"] = configBots.durabilityStuff;
        BotConfig.presetBatch["UNTroops"] = 60;
        BotConfig.lootNValue["untroops"] = 60;
        BotConfig.itemSpawnLimits["untroops"] = {};
        BotConfig.equipment["untroops"] = configBots.botEquipmentStuff;
        BotConfig.durability["untroops"] = configBots.durabilityStuff;


        //Should i keep this code ?
        //Or should i create weapon pools from presets ?
        //Preset is easier to rewrite, but have to be manually created
        //All equipment from a weapon is harder to rewrite, but nothing to be done manually ?

        /*
        for(const preset in TGSRaidersPresets){
            coreMod.AddEquipmentFromPreset(container,preset,"tg_raiders");
        }*/


        //Adding tg_followers equipment to loadouts
        coreMod.AddEquipmentToLoadout(container, "FirstPrimaryWeapon", "5fc3e272f8b6a877a729eac5", "tg_followers", 1); //UMP-45
        //coreMod.AddEquipmentToLoadout(container, "FirstPrimaryWeapon", "TGS_prototype_m16", "tg_followers", 1); // Proto M-16
        coreMod.AddEquipmentToLoadout(container, "Holster", "5cadc190ae921500103bb3b6", "tg_followers", 1); // M9A3
        coreMod.AddEquipmentToLoadout(container, "Headwear", "5e00c1ad86f774747333222c", "tg_followers", 1); // Team Exfil black
        coreMod.AddEquipmentToLoadout(container, "Headwear", "5a154d5cfcdbcb001a3b00da", "tg_followers", 1); //Fast MT black

        //Adding tg_boss equipment to loadouts
        coreMod.AddEquipmentToLoadout(container, "FirstPrimaryWeapon", "5fc22d7c187fea44d52eda44", "tg_boss", 1); // MK-18
        //coreMod.AddEquipmentToLoadout(container, "FirstPrimaryWeapon", "TGS_338_badnews", "tg_boss", 1); // Bad New
        coreMod.AddEquipmentToLoadout(container, "SecondPrimaryWeapon", "5e81ebcd8e146c7080625e15", "tg_boss", 1); // GL40
        coreMod.AddEquipmentToLoadout(container, "Holster", "5f36a0e5fbf956000b716b65", "tg_boss", 1); // M45A1
        //coreMod.AddEquipmentToLoadout(container, "Headwear", "tgs_helmet_prototype", "tg_boss", 1); // Helmet proto
        coreMod.AddEquipmentToLoadout(container, "Headwear", "5f60b34a41e30a4ab12a6947", "tg_boss", 1); // Caiman

        //Adding tg_raiders equipment to loadouts
        coreMod.AddEquipmentToLoadout(container, "Headwear", "5ea17ca01412a1425304d1c0", "tg_raiders", 1); // Bastion
        coreMod.AddEquipmentToLoadout(container, "Headwear", "5e4bfc1586f774264f7582d3", "tg_raiders", 1); // Gallet helmet
        coreMod.AddEquipmentToLoadout(container, "Headwear", "5b40e1525acfc4771e1c6611", "tg_raiders", 1); // Ulach IIIA black
        coreMod.AddEquipmentToLoadout(container, "FirstPrimaryWeapon", "5fbcc1d9016cce60e8341ab3", "tg_raiders", 1); // MCX
        coreMod.AddEquipmentToLoadout(container, "FirstPrimaryWeapon", "5bb2475ed4351e00853264e3", "tg_raiders", 1); // HK-416
        coreMod.AddEquipmentToLoadout(container, "FirstPrimaryWeapon", "5447a9cd4bdc2dbd208b4567", "tg_raiders", 1); // M4A1
        coreMod.AddEquipmentToLoadout(container, "FirstPrimaryWeapon", "5d43021ca4b9362eab4b5e25", "tg_raiders", 1); // TX-15
        coreMod.AddEquipmentToLoadout(container, "FirstPrimaryWeapon", "5b0bbe4e5acfc40dc528a72d", "tg_raiders", 1); // SA-58
        coreMod.AddEquipmentToLoadout(container, "FirstPrimaryWeapon", "5dcbd56fdbd3d91b3e5468d5", "tg_raiders", 1); // MDR 7,62
        coreMod.AddEquipmentToLoadout(container, "FirstPrimaryWeapon", "5c488a752e221602b412af63", "tg_raiders", 1); // MDR 5,56
        coreMod.AddEquipmentToLoadout(container, "FirstPrimaryWeapon", "5a367e5dc4a282000e49738f", "tg_raiders", 1); // RSASS
        coreMod.AddEquipmentToLoadout(container, "FirstPrimaryWeapon", "5aafa857e5b5b00018480968", "tg_raiders", 1); // M1A
        coreMod.AddEquipmentToLoadout(container, "FirstPrimaryWeapon", "5cc82d76e24e8d00134b4b83", "tg_raiders", 1); // P90
        coreMod.AddEquipmentToLoadout(container, "FirstPrimaryWeapon", "5926bb2186f7744b1c6c6e60", "tg_raiders", 1); // MP5
        coreMod.AddEquipmentToLoadout(container, "FirstPrimaryWeapon", "5f2a9575926fd9352339381f", "tg_raiders", 1); // RFB
        coreMod.AddEquipmentToLoadout(container, "FirstPrimaryWeapon", "5fc3f2d5900b1d5091531e57", "tg_raiders", 1); // Vector 9mm
        coreMod.AddEquipmentToLoadout(container, "FirstPrimaryWeapon", "58948c8e86f77409493f7266", "tg_raiders", 1); // MPX
        coreMod.AddEquipmentToLoadout(container, "FirstPrimaryWeapon", "5a7828548dc32e5a9c28b516", "tg_raiders", 1); // M870
        coreMod.AddEquipmentToLoadout(container, "FirstPrimaryWeapon", "5e870397991fd70db46995c8", "tg_raiders", 1); // Mossberg
        coreMod.AddEquipmentToLoadout(container, "Holster", "5a7ae0c351dfba0017554310", "tg_raiders", 1); // Glock17
        coreMod.AddEquipmentToLoadout(container, "Holster", "5b1fa9b25acfc40018633c01", "tg_raiders", 1); // Glock18C
        coreMod.AddEquipmentToLoadout(container, "Holster", "56d59856d2720bd8418b456a", "tg_raiders", 1); //P226 


        //dataFileGenerator.saveAnyFile(container, bots.types["tg_raiders"])
    }
}



