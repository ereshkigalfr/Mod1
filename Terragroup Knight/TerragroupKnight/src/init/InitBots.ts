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

const TGSBotBoss = require("../../db/bots/tg_boss.json");
const TGSBotFollower = require("../../db/bots/tg_followers.json");
const TGSBotRaider = require("../../db/bots/tg_raiders.json");
const TGSBotUN = require("../../db/bots/untroops.json");

export class InitBots
{
    static initAll(container: DependencyContainer)
    {
        const MainDatabase = container.resolve<DatabaseServer>("DatabaseServer");
        const logger = container.resolve<ILogger>("WinstonLogger");
        const JsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const BotConfig = configServer.getConfig<IBotConfig>(ConfigTypes.BOT);
        const ServerDatabase = MainDatabase.getTables();
        const maps = ServerDatabase.locations
        const bots = ServerDatabase.bots

        //Adding all the bots types
        if(config["Other"]["Extra logging"]){logger.info("TGK:Adding all bots types to database")};
        bots.types["tg_boss"] = TGSBotBoss;
        bots.types["tg_followers"] = TGSBotFollower;
        bots.types["tg_raiders"] = TGSBotRaider;
        bots.types["untroops"] = TGSBotUN;


        if(config["Other"]["Extra logging"]){logger.info("TGK:Replacing default raiders with custom one")};
        //Replacing all regular raiders on labs by TG raiders
       
        for (const bosses in maps.laboratory.base.BossLocationSpawn)
        {
            let boss = maps.laboratory.base.BossLocationSpawn[bosses];
            boss.BossName = "TG_Raiders";
            boss.BossEscortType = "TG_Raiders";
            boss.BossEscortAmount = "3,4,2,1,1,2,3,4,5,2,3,3,4";
            boss.BossDifficult = "impossible";
            boss.BossChance = 55;
        }

        if(config["Other"]["Extra logging"]){logger.info("TGK:Adding new boss to maps")};
        
        //Adding the new boss to the spawnlist of labs
        const newBoss = configBots.newBoss;
        newBoss.BossChance = config.Gameplay["TG_Boss SpawnChance"]
        maps.laboratory.base.BossLocationSpawn.push(newBoss);

        //Lets add some spawns
        /*
        InitBots.AddNewSpawnPoint(maps, "Spawn1", "laboratory", -263.587, 0.01103304, -390.5421, 0, ["Terragroup"], ["Bot"], "BotZoneMain");
        InitBots.AddNewSpawnPoint(maps, "Spawn2", "laboratory", -245.7945, 0.02383833, -380.219, 0, ["Terragroup"], ["Bot"], "BotZoneMain");
        InitBots.AddNewSpawnPoint(maps, "Spawn3", "laboratory", -249.6365, 4.104155, -379.0071, 0, ["Terragroup"], ["Bot"], "BotZoneMain");
        InitBots.AddNewSpawnPoint(maps, "Spawn4", "laboratory", -245.6283, 4.104156, -379.9973, 0, ["Terragroup"], ["Bot"], "BotZoneMain");
        InitBots.AddNewSpawnPoint(maps, "Spawn5", "laboratory", -253.2756, 4.117604, -361.4047, 0, ["Terragroup"], ["Bot"], "BotZoneMain");
        InitBots.AddNewSpawnPoint(maps, "Spawn6", "laboratory", -255.1729, 4.117605, -367.925, 0, ["Terragroup"], ["Bot"], "BotZoneMain");
        InitBots.AddNewSpawnPoint(maps, "Spawn7", "laboratory", -260.9297, 4.117605, -366.114, 0, ["Terragroup"], ["Bot"], "BotZoneMain");
        InitBots.AddNewSpawnPoint(maps, "Spawn8", "laboratory", -251.4255, 4.098026, -318.5574, 0, ["Terragroup"], ["Bot"], "BotZoneMain");
        InitBots.AddNewSpawnPoint(maps, "Spawn9", "laboratory", -258.5861, 4.098026, -318.506, 0, ["Terragroup"], ["Bot"], "BotZoneMain");
        */

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
        
        
        /*
        //Adding tg_followers equipment to loadouts
        coreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5fc3e272f8b6a877a729eac5", "tg_followers"); //UMP-45
        coreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "tgs_prototype_m16", "tg_followers"); // Proto M-16
        coreMod.AddEquipmentToLoadout("Holster", "5cadc190ae921500103bb3b6", "tg_followers"); // M9A3
        coreMod.AddEquipmentToLoadout("Headwear", "5e00c1ad86f774747333222c", "tg_followers"); // Team Exfil black
        coreMod.AddEquipmentToLoadout("Headwear", "5a154d5cfcdbcb001a3b00da", "tg_followers"); //Fast MT black

        //Adding tg_boss equipment to loadouts
        coreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5fc22d7c187fea44d52eda44", "tg_boss"); // MK-18
        coreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "tgs_338_badnews", "tg_boss"); // Bad New
        coreMod.AddEquipmentToLoadout("SecondPrimaryWeapon", "5e81ebcd8e146c7080625e15", "tg_boss"); // GL40
        coreMod.AddEquipmentToLoadout("Holster", "5f36a0e5fbf956000b716b65", "tg_boss"); // M45A1
        coreMod.AddEquipmentToLoadout("Headwear", "tgs_helmet_prototype", "tg_boss"); // Helmet proto
        coreMod.AddEquipmentToLoadout("Headwear", "5f60b34a41e30a4ab12a6947", "tg_boss"); // Caiman

        //Adding tg_raiders equipment to loadouts
        coreMod.AddEquipmentToLoadout("Headwear", "5ea17ca01412a1425304d1c0", "tg_raiders"); // Bastion
        coreMod.AddEquipmentToLoadout("Headwear", "5e4bfc1586f774264f7582d3", "tg_raiders"); // Gallet helmet
        coreMod.AddEquipmentToLoadout("Headwear", "5b40e1525acfc4771e1c6611", "tg_raiders"); // Ulach IIIA black
        coreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5fbcc1d9016cce60e8341ab3", "tg_raiders"); // MCX
        coreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5bb2475ed4351e00853264e3", "tg_raiders"); // HK-416
        coreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5447a9cd4bdc2dbd208b4567", "tg_raiders"); // M4A1
        coreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5d43021ca4b9362eab4b5e25", "tg_raiders"); // TX-15
        coreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5b0bbe4e5acfc40dc528a72d", "tg_raiders"); // SA-58
        coreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5dcbd56fdbd3d91b3e5468d5", "tg_raiders"); // MDR 7,62
        coreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5c488a752e221602b412af63", "tg_raiders"); // MDR 5,56
        coreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5a367e5dc4a282000e49738f", "tg_raiders"); // RSASS
        coreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5aafa857e5b5b00018480968", "tg_raiders"); // M1A
        coreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5cc82d76e24e8d00134b4b83", "tg_raiders"); // P90
        coreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5926bb2186f7744b1c6c6e60", "tg_raiders"); // MP5
        coreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5f2a9575926fd9352339381f", "tg_raiders"); // RFB
        coreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5fc3f2d5900b1d5091531e57", "tg_raiders"); // Vector 9mm
        coreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "58948c8e86f77409493f7266", "tg_raiders"); // MPX
        coreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5a7828548dc32e5a9c28b516", "tg_raiders"); // M870
        coreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5e870397991fd70db46995c8", "tg_raiders"); // Mossberg
        coreMod.AddEquipmentToLoadout("Holster", "5a7ae0c351dfba0017554310", "tg_raiders"); // Glock17
        coreMod.AddEquipmentToLoadout("Holster", "5b1fa9b25acfc40018633c01", "tg_raiders"); // Glock18C
        coreMod.AddEquipmentToLoadout("Holster", "56d59856d2720bd8418b456a", "tg_raiders"); //P226*/
    }
}



