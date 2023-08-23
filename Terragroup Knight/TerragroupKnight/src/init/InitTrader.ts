import { DependencyContainer } from "tsyringe";

// SPT types
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";

// New trader settings
import { Money } from "@spt-aki/models/enums/Money";
import { Traders } from "@spt-aki/models/enums/Traders";
import { TraderHelper } from "../helpers/traderHelpers";


// TGS Types
import * as TGSTraderBase from "../../db/templates/TGS_knight/base.json";
import * as TGSTraderAssorts from "../../db/templates/TGS_knight/assort.json";
import * as TGSTraderQuestsUnlocks from "../../db/templates/TGS_knight/questassort.json"
import * as config from "../../config/config.json"

export class InitTrader
{
    private traderHelper: TraderHelper


    public preAkiLoad(container: DependencyContainer): void
    {

        const configServer = container.resolve<ConfigServer>("ConfigServer");
        this.traderHelper = new TraderHelper();
        // Add trader to trader enum
        Traders["TGS_knight"] = "TGS_knight";
    }
    
    public postDBLoad(container: DependencyContainer): void
    {
        //Get everything we need as variables
        const MainDatabase = container.resolve<DatabaseServer>("DatabaseServer");
        const logger = container.resolve<ILogger>("WinstonLogger");
        const JsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const ServerDatabase = MainDatabase.getTables();
        

        if(config["Other"]["Extra logging"]){logger.info("TGK:Adding new trader in database")};
        this.traderHelper.addTraderToDb(TGSTraderBase, ServerDatabase, JsonUtil);

        //Maybe do assorts generation by there ? I need to think about it
        /*
        blabla assort
        */

        //Adding assorts unlocks of quests
        if(config["Other"]["Extra logging"]){logger.info("TGK:Adding quests unlocks to trader")};
        //I also need to do those and rethink them

    }
}

module.exports = InitTrader;