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

//SPT Imports
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";

//TGS Imports
const TGSItems = require("../../db/items.json");
const TGSQuests = require("../../db/quests.json");
const TGSMapsLoot = require("../../db/loot.json");
const TGSLocales = require("../../db/locales.json");
const TGSHideoutProductions = require("../../db/productions.json");
const TGSPresets = require("../../data/presets.json");
const TGSGlobals = require("../../config/globals.json");
const config = require("../../config/config.json");

export class InitDatabase
{
    static postDBLoad(container: DependencyContainer)
    {
        //Get everything we need as variables
        const MainDatabase = container.resolve<DatabaseServer>("DatabaseServer");
        const logger = container.resolve<ILogger>("WinstonLogger");
        const JsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const ServerDatabase = MainDatabase.getTables();
        const handbook = ServerDatabase.templates.handbook;
        const items = ServerDatabase.templates.items;
        const quests = ServerDatabase.templates.quests;
        const customization = ServerDatabase.templates.customization;
        const locales = ServerDatabase.locales.global;
        const productions = ServerDatabase.hideout.production;
        const globals = ServerDatabase.globals;
        const maps = ServerDatabase.locations

        //Adding new items to the database by looping through my already made json file
        if(config["Other"]["Extra logging"]){logger.info("TGK:Creating new items in the database")};
        for (let i in TGSItems)
        {
                let item = TGSItems[i]
                items[i] = item;
                handbook.Items.push({
                    "Id": i,
                    "ParentId": item._handbook,
                    "Price": item._props.CreditsPrice
                });
        }

        //Adding new quests to the database by looping through my already made json file
        if(config["Other"]["Extra logging"]){logger.info("TGK:Creating new quests in the database")};
        for (const quest in TGSQuests)
        {
                quests[TGSQuests[quest]._id] = TGSQuests[quest];
        }

        //Adding new locales to the database by looping through my already made json file
        if(config["Other"]["Extra logging"]){logger.info("TGK:Creating new locales in the database")};
        for (const lang in TGSLocales)
        {
            Object.assign(locales[lang], TGSLocales[lang]);
        }

        
        //Adding suits to customization database
        if(config["Other"]["Extra logging"]){logger.info("TGK:Creating new customization items in the database")};
        const NewSuit = JsonUtil.clone(customization["5d1f56f186f7744bcb0acd1a"]);
        const NewSuit2 = JsonUtil.clone(customization["5d1f623386f7744bcd135833"]);

        //TG Top suit
        NewSuit._id = "TG_Top";
        NewSuit._name = "Terragroup member TOP";
        NewSuit._props.Side = ["Savage"];
        NewSuit._props.Prefab.path = "assets/suits/tshirt_usec_combatshirt.bundle";
        NewSuit._props.Name = NewSuit._name;
        NewSuit._props.ShortName = NewSuit._name;
        NewSuit._props.Description = NewSuit._name;
        customization[NewSuit._id] = NewSuit;

        //Suits for sell(no use)
        NewSuit2._id = "TG_Top_Suits";
        NewSuit2._name = "Terragroup member TOP";
        NewSuit2._props.Name = NewSuit._name;
        NewSuit2._props.ShortName = NewSuit._name;
        NewSuit2._props.Description = NewSuit._name;
        NewSuit2._props.Side = NewSuit._props.Side;
        NewSuit2._props.Body = NewSuit._id;
        customization[NewSuit2._id] = NewSuit2;

        //Adding new hideout productions to the database
        
        /*
        if(config["Other"]["Extra logging"]){logger.info("TGK:Creating new hideout productions in the database")};
        for (const prod in TGSHideoutProductions)
        {
            productions.push(TGSHideoutProductions[prod])
        }
        */
        //Making changes to the globals
        if(config["Other"]["Extra logging"]){logger.info("TGK:Creating new presets in globals")};
        for (const foo in TGSPresets)
        {
            Object.assign(globals.ItemPresets, TGSPresets[foo]);
        }

        //Add new stims
        if(config["Other"]["Extra logging"]){logger.info("TGK:Creating new stims in globals")};
        Object.assign(globals["config"]["Health"]["Effects"]["Stimulator"]["Buffs"], TGSGlobals.Buffs);

        //Add new weapons masteries
        if(config["Other"]["Extra logging"]){logger.info("TGK:Creating new weapons masteries in globals")};
        for (const mastery in TGSGlobals.WeaponMastery)
        {
            globals["config"]["Mastering"].push(TGSGlobals.WeaponMastery[mastery]);
        }

        //Adding loot to the maps
        if(config["Other"]["Extra logging"]){logger.info("TGK:Creating new loots place on maps")};
        for (const lootMaps in TGSMapsLoot) {
                for (const lootCat in TGSMapsLoot[lootMaps]) {
                        for (const catArray in TGSMapsLoot[lootMaps][lootCat]) {
                            
                            maps[lootMaps].looseLoot[lootCat].push(TGSMapsLoot[lootMaps][lootCat][catArray]);
                        }
            }
        }

    }
}