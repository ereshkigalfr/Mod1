/*
エレシュキガル
*/

/*
    Terragroup Knight mod.
    Copyright (C) 2023  Ereshkigal

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

import * as config from "../../config/config.json"
import * as configValues from "../../config/values.json"

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
        for (const bosses in maps["laboratory"].base.BossLocationSpawn)
        {
            let boss = maps["laboratory"].base.BossLocationSpawn[bosses];
            boss.BossName = "TG_Raiders";
            boss.BossEscortType = "TG_Raiders";
            boss.BossEscortAmount = "2,3,3,5,1,1,5,2,2,3,4";
            boss.BossDifficult = "impossible";
            boss.BossChance = 60;
        }

        if(config["Other"]["Extra logging"]){logger.info("TGK:Adding new boss to maps")};
        //Adding the new boss to the spawnlist of labs
        const newBoss = configValues.newBoss;
        newBoss.BossChance = config.Gameplay["TG_Boss SpawnChance"]

        maps["laboratory"].base.BossLocationSpawn.push(newBoss);

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
    }

    static AddNewSpawnPoint(maps, id, map, x, y, z, rot, sides, categories, BotZone)
    {
        const NewSpawn = {
            "Id": id,
            "Position": {
                "x": x,
                "y": y,
                "z": z
            },
            "Rotation": rot,
            "Sides": sides,
            "Categories": categories,
            "Infiltration": "",
            "DelayToCanSpawnSec": 5,
            "ColliderParams": {
                "_parent": "SpawnSphereParams",
                "_props": {
                    "Center": {
                        "x": 0,
                        "y": 0,
                        "z": 0
                    },
                    "Radius": 20
                }
            },
            "BotZoneName": BotZone
        };
        maps[map].base.SpawnPointParams.push(NewSpawn);
    }
}



