import { DependencyContainer } from "tsyringe";

//SPT Imports
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { CustomItemService } from "@spt-aki/services/mod/CustomItemService";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";


//TGS Imports
import { TGSItems } from "../../db/templates/items.json"
import { TGSQuests } from "../../db/templates/quests.json"
import { TGSMapsLoot } from "../../db/templates/loot.json"
import { TGSLocales } from "../../db/templates/locales.json"
import { TGSHideoutProductions } from "../../db/templates/productions.json"

class InitDatabase implements IPostDBLoadMod
{
    constructor() {
        this.config = require("../../config/config.json")
    }

    private logger: ILogger
    private config: Object
    
    public postDBLoad(container: DependencyContainer): void 
    {
        //Get everything we need as variables
        const MainDatabase = container.resolve<DatabaseServer>("DatabaseServer");
        const CustomItem = container.resolve<CustomItemService>("CustomItemService");
        const ServerDatabase = MainDatabase.getTables();
        const items = ServerDatabase.templates.items;
        const quests = ServerDatabase.templates.quests;
        const customization = ServerDatabase.templates.customization;
        const locales = ServerDatabase.locales.global;
        const productions = ServerDatabase.hideout.production;

        //Adding new items to the database by looping through my already made json file
        if(this.config.Other["Extra logging"]){this.logger.info("Creating new items in the database")};
        for (let i in TGSItems)
        {
            CustomItem.createItemFromClone(TGSItems[i]);
        }

        //Adding new quests to the database by looping through my already made json file
        if(this.config.Other["Extra logging"]){this.logger.info("Creating new quests in the database")};
        for (const quest in TGSQuests)
        {
            quests[TGSQuests[quest]._id] = TGSQuests[quest];
        }

        //Adding new locales to the database by looping through my already made json file
        if(this.config.Other["Extra logging"]){this.logger.info("Creating new locales in the database")};
        for (const lang in TGSLocales)
        {
            for (const node1 in TGSLocales[lang])
            {
                Object.assign(locales[lang][node1], TGSLocales[lang][node1]);
            }
        }

        //Adding suits to customization database
        if(this.config.Other["Extra logging"]){this.logger.info("Creating new customization items in the database")};
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
        if(this.config.Other["Extra logging"]){this.logger.info("Creating new hideout productions in the database")};
        for (const prod in TGSHideoutProductions)
        {
            productions.push(TGSHideoutProductions[prod])
        }

    }
}

module.exports = { mod: new InitDatabase() }