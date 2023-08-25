import { DependencyContainer } from "tsyringe";

//SPT Imports
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";

//TGS Imports
import * as TGSItems from "../../db/templates/items.json";
import * as TGSQuests from "../../db/templates/quests.json";
import * as TGSMapsLoot from "../../db/templates/loot.json";
import * as TGSLocales from "../../db/templates/locales.json";
import * as TGSHideoutProductions from "../../db/templates/productions.json";
import * as TGSPresets from "../../config/presets.json";
import * as TGSValues from "../../config/values.json";
import * as config from "../../config/config.json";

import { CoreMod } from "../CoreMod"

export class InitDatabase
{
    static postDBLoad(container: DependencyContainer)
    {
        //Get everything we need as variables
        const MainDatabase = container.resolve<DatabaseServer>("DatabaseServer");
        const logger = container.resolve<ILogger>("WinstonLogger");
        const JsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const ServerDatabase = MainDatabase.getTables();
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
            if(i != "default")
            {
                let item = TGSItems[i]
                items[item] = item;
                CoreMod.CreateHandbookItem(ServerDatabase.templates, i, item._parent, item._props.CreditsPrice)
            }
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
            if(lang != "default")
            {
                Object.assign(locales[lang], TGSLocales[lang]);
            }
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
        if(config["Other"]["Extra logging"]){logger.info("TGK:Creating new hideout productions in the database")};
        for (const prod in TGSHideoutProductions)
        {
            productions.push(TGSHideoutProductions[prod])
        }

        //Making changes to the globals
        if(config["Other"]["Extra logging"]){logger.info("TGK:Creating new presets in globals")};
        for (const foo in TGSPresets)
        {
            if(foo != "default")
            {
                Object.assign(globals.ItemPresets, TGSPresets[foo]);
            }
        }

        //Add new stims
        if(config["Other"]["Extra logging"]){logger.info("TGK:Creating new stims in globals")};
        Object.assign(globals["config"]["Health"]["Effects"]["Stimulator"]["Buffs"], TGSValues.BuffToAdd);

        //Add new weapons masteries
        if(config["Other"]["Extra logging"]){logger.info("TGK:Creating new weapons masteries in globals")};
        for (const mastery in TGSValues.WeaponMastery)
        {
            globals["config"]["Mastering"].push(TGSValues.WeaponMastery[mastery]);
        }

        //Adding loot to the maps
        if(config["Other"]["Extra logging"]){logger.info("TGK:Creating new loots place on maps")};
        //Needs to be worked on, structure changed since the last mod
        for (const lootMaps in TGSMapsLoot) {
            if(lootMaps != "default"){
                for (const lootCat in TGSMapsLoot[lootMaps]) {
                    if(lootCat != "default")
                    {
                        for (const catArray in TGSMapsLoot[lootMaps][lootCat]) {
                            
                            maps[lootMaps].looseLoot[lootCat].push(TGSMapsLoot[lootMaps][lootCat][catArray]);
                        }
                    }
                }
            }
        }

    }
}