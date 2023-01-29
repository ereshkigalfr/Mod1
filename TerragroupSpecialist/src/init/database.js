/*
エレシュキガル
*/

/*
    SPT-AKI TerragroupSpecialist mod.
    Copyright (C) 2022  Ereshkigal

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

"use strict";

class DatabaseInit
{
    static createTemplates()
    {
        //Important constants to load
        const CoreMod = require("../../../CoreMod/src/Core.js");
        const log = require("../logging");

        //Database constants
        const database = DatabaseServer.tables;
        const items = database.templates.items;
        const suits = database.templates.customization;
        const quests = database.templates.quests;
        const Hideout = database.hideout;

        //Terragroup database constants
        const itemsList = require("../../db/items.json");
        const questList = require("../../db/quests.json");

        log.development("Starting initialization of the database");

        log.development("Handbook initialization");
        //Adding handbook
        for (let i in itemsList)
        {
            let item = itemsList[i];
            if (!CoreMod.DoesHandbookAlreadyExist(item._id))
            {
                CoreMod.CreateHandbookItem(i, item._parent, 0);
            }
        }

        log.development("Handbook database populated");

        log.development("Populating database with new items...");

        //Adding new items to the game
        for (const item in itemsList)
        {
            items[itemsList[item]._id] = itemsList[item];
        }

        log.development("New items added to the database");

        log.development("Adding the new quests");
        //Adding new quests to the game
        for (const quest in questList)
        {
            quests[questList[quest]._id] = questList[quest];
        }
        log.development("New quests added");

        log.development("Adding new clothing to the database");
        const NewSuit = JsonUtil.clone(suits["5d1f56f186f7744bcb0acd1a"]);
        const NewSuit2 = JsonUtil.clone(suits["5d1f623386f7744bcd135833"]);

        //TG Top suit
        NewSuit._id = "TG_Top";
        NewSuit._name = "Terragroup member TOP";
        NewSuit._props.Side = ["Savage"];
        NewSuit._props.Prefab.path = "assets/suits/tshirt_usec_combatshirt.bundle";
        NewSuit._props.Name = NewSuit._name;
        NewSuit._props.ShortName = NewSuit._name;
        NewSuit._props.Description = NewSuit._name;
        suits[NewSuit._id] = NewSuit;

        //Suits for sell(no use)
        NewSuit2._id = "TG_Top_Suits";
        NewSuit2._name = "Terragroup member TOP";
        NewSuit2._props.Name = NewSuit._name;
        NewSuit2._props.ShortName = NewSuit._name;
        NewSuit2._props.Description = NewSuit._name;
        NewSuit2._props.Side = NewSuit._props.Side;
        NewSuit2._props.Body = NewSuit._id;
        suits[NewSuit2._id] = NewSuit2;
        log.development("All clothes added");

        //Add hideout stuff
        //Maybe it's supposed to work now ? 

        
        const eth_prod = require('../../db/hideout/production/terragroupSpecialist_ETHProduction.json');
        const grendelProd = require('../../db/hideout/production/terragroupSpecialistGrendelProduction.json')
        
        Hideout.production.push(eth_prod,grendelProd)

    }

    static createTranslations()
    {
        const database = DatabaseServer.tables;
        const locales = database.locales.global;
        const localesList = require("../../db/locales.json");
        for (const lang in localesList)
        {
            for (const node1 in localesList[lang])
            {
                Logger.log(localesList[lang][node1]);
                Object.assign(locales[lang][node1], localesList[lang][node1]);
            }
        }

    }

    static applyGlobalsChanges()
    {
        //Database constants
        const database = DatabaseServer.tables;
        const global = database.globals;
        //Terragroup database constants
        const values = require("../../config/values.json");
        const expTable = require("../../config/expTable.json");
        const newPresets = require("../../config/presets.json");

        //Add new weapons masteries
        for (const mastery in values.WeaponMastery)
        {
            global.config.Mastering.push(values.WeaponMastery[mastery]);
        }

        //Add new weapons presets
        for (const foo in newPresets)
        {
            Object.assign(global.ItemPresets, newPresets[foo]);
        }

        //Add our own globals values needed
        global.config.exp.level.exp_table = expTable; // New EXP table to go to lvl 81

        //Add new stims
        Object.assign(global.config.Health.Effects.Stimulator.Buffs, values.BuffToAdd);


    }

    static applyMapsChanges()
    {

        //Important constants to load
        const CoreMod = require("../../../CoreMod/src/Core.js");
        const tgLoot = require('../../db/loot.json');
        const cfg = require('../../config/config.json')

        //Adding loot to the maps
        for(const lootMaps in tgLoot)
        {  
            for(const lootCat in tgLoot[lootMaps])
            {
                for(const catArray in tgLoot[lootMaps][lootCat])
                {
                    DatabaseServer.tables.locations[lootMaps].loot[lootCat].push(tgLoot[lootMaps][lootCat][catArray]);
                }
            }
        }

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
    }

    static DatabaseInitialization()
    {
        DatabaseInit.createTemplates();
        DatabaseInit.applyGlobalsChanges();
        DatabaseInit.createTranslations();
        DatabaseInit.applyMapsChanges();
    }

}


module.exports = DatabaseInit;