import { DependencyContainer } from "tsyringe";

//SPT Imports
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { CustomItemService } from "@spt-aki/services/mod/CustomItemService";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";


//TGS Imports
import { TGSItems } from "../../db/templates/items.json";
import { TGSQuests } from "../../db/templates/quests.json";
import { TGSMapsLoot } from "../../db/templates/loot.json";
import { TGSLocales } from "../../db/templates/locales.json";
import { TGSHideoutProductions } from "../../db/templates/productions.json";
import { TGSPresets } from "../../config/presets.json";
import { TGSValues } from "../../config/values.json";
import { config } from "../../config/config.json"

export class InitDatabase implements IPostDBLoadMod
{
    
    public postDBLoad(container: DependencyContainer): void 
    {
        //Get everything we need as variables
        const MainDatabase = container.resolve<DatabaseServer>("DatabaseServer");
        const CustomItem = container.resolve<CustomItemService>("CustomItemService");
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
            CustomItem.createItemFromClone(TGSItems[i]);
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
            for (const node1 in TGSLocales[lang])
            {
                Object.assign(locales[lang][node1], TGSLocales[lang][node1]);
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
            Object.assign(globals.ItemPresets, TGSPresets[foo]);
        }

        //Add new stims
        if(config["Other"]["Extra logging"]){logger.info("TGK:Creating new stims in globals")};
        Object.assign(global["config"]["Health"]["Effects"]["Stimulator"]["Buffs"], TGSValues.BuffToAdd);

        //Add new weapons masteries
        if(config["Other"]["Extra logging"]){logger.info("TGK:Creating new weapons masteries in globals")};
        for (const mastery in TGSValues.WeaponMastery)
        {
            global["config"]["Mastering"].push(TGSValues.WeaponMastery[mastery]);
        }

        //Adding loot to the maps
        if(config["Other"]["Extra logging"]){logger.info("TGK:Creating new loots place on maps")};
        //Needs to be worked on, structure changed since the last mod
        for(const lootMaps in TGSMapsLoot)
        {  
            for(const lootCat in TGSMapsLoot[lootMaps])
            {
                for(const catArray in TGSMapsLoot[lootMaps][lootCat])
                {
                    maps[lootMaps].loot[lootCat].push(TGSMapsLoot[lootMaps][lootCat][catArray]);
                }
            }
        }

    }
}

module.exports = { mod: new InitDatabase() }