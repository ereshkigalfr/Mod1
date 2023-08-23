import { DependencyContainer } from "tsyringe";

// SPT types
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";

//Get all initialization scripts
import { InitAssets } from "./init/InitAssets";
import { InitDatabase } from "./init/InitDatabase";
import { InitBots } from "./init/InitBots";
import { InitTrader } from "./init/InitTrader";


class main implements IPostDBLoadMod
{
    constructor() {
        this.config = require("../config/config.json")
    }
    private config: Object
    private logger: ILogger
    private InitAssets: InitAssets
    private InitDatabase: InitDatabase
    private InitBots: InitBots
    private InitTrader: InitTrader
    
    public postDBLoad(container: DependencyContainer): void {
        const logger = container.resolve<ILogger>("WinstonLogger");
        //Start all scripts that adds something to the database
        if(this.config["Other"]["Extra logging"]){logger.info("TGK:Starting assets initialization")}
        InitAssets

        if(this.config["Other"]["Extra logging"]){logger.info("TGK:Starting trader initialization")}
        InitTrader
        
        if(this.config["Other"]["Extra logging"]){logger.info("TGK:Starting database initialization")}
        InitDatabase

        if(this.config["Other"]["Extra logging"]){logger.info("TGK:Starting bots initialization")}
        InitBots

        
    }

}


module.exports = { mod: new main() }