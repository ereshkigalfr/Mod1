import { DependencyContainer } from "tsyringe";

// SPT types
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";

// New trader settings
import { Money } from "@spt-aki/models/enums/Money";
import { Traders } from "@spt-aki/models/enums/Traders";
import { HashUtil } from "@spt-aki/utils/HashUtil";
import { TraderHelper } from "../helpers/traderHelpers";


// TGS Types
import { TGSTraderBase } from "../../db/templates/TGS_knight/base.json";
import { TGSTraderAssorts } from "../../db/templates/TGS_knight/assort.json";
import { TGSTraderQuestsUnlocks } from "../../db/templates/TGS_knight/questassort.json"

export class InitTrader implements IPreAkiLoadMod, IPostDBLoadMod
{

    constructor() {
        this.config = require("../../config/config.json")
    }

    private config: Object
    private traderHelper: TraderHelper

    /**
     * Some work needs to be done prior to SPT code being loaded, registering the profile image + setting trader update time inside the trader config json
     * @param container Dependency container
     */
    public preAkiLoad(container: DependencyContainer): void
    {

        const configServer = container.resolve<ConfigServer>("ConfigServer");
        this.traderHelper = new TraderHelper();
        // Add trader to trader enum
        Traders[TGSTraderBase._id] = TGSTraderBase._id;
    }
    
    /**
     * Majority of trader-related work occurs after the aki database has been loaded but prior to SPT code being run
     * @param container Dependency container
     */
    public postDBLoad(container: DependencyContainer): void
    {
        //Get everything we need as variables
        const MainDatabase = container.resolve<DatabaseServer>("DatabaseServer");
        const logger = container.resolve<ILogger>("WinstonLogger");
        const JsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const ServerDatabase = MainDatabase.getTables();
        

        if(this.config["Other"]["Extra logging"]){logger.info("TGK:Adding new trader in database")};
        this.traderHelper.addTraderToDb(TGSTraderBase, ServerDatabase, JsonUtil);

        //Maybe do assorts generation by there ? I need to think about it
        /*
        blabla assort
        */

        //Adding assorts unlocks of quests
        if(this.config["Other"]["Extra logging"]){logger.info("TGK:Adding quests unlocks to trader")};
        //I also need to do those and rethink them

    }
}

module.exports = { mod: new InitTrader() }