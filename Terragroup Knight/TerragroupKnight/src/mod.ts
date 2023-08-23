import { DependencyContainer } from "tsyringe";

// SPT types
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";

//Get all initialization scripts
import { InitAssets } from "./init/InitAssets";
import { InitDatabase } from "./init/InitDatabase";
//import { InitBots } from "./init/InitBots";
import { InitTrader } from "./init/InitTrader";


class main implements IPostDBLoadMod
{
    private config: Object;
    private logger: ILogger;
    private InitAssets: InitAssets;
    private InitDatabase: InitDatabase;
    //private InitBots: InitBots;
    private InitTrader: InitTrader;

    constructor() {
        this.config = require("../config/config.json")
        this.InitAssets = new InitAssets();
        this.InitTrader = new InitTrader();
        this.InitDatabase = new InitDatabase();
    }
    
    
    public postDBLoad(container: DependencyContainer): void {
        const logger = container.resolve<ILogger>("WinstonLogger");
        //Start all scripts that adds something to the database
        if(this.config["Other"]["Extra logging"]){logger.info("TGK:Starting assets initialization")}
        this.InitAssets.postDBLoad(container)
        this.InitAssets.preAkiLoad(container)

        if(this.config["Other"]["Extra logging"]){logger.info("TGK:Starting trader initialization")}
        this.InitTrader.postDBLoad(container)
        this.InitTrader.preAkiLoad(container)
        
        if(this.config["Other"]["Extra logging"]){logger.info("TGK:Starting database initialization")}
        this.InitDatabase.postDBLoad(container)

        if(this.config["Other"]["Extra logging"]){logger.info("TGK:Starting bots initialization")}
        //InitBots

        
    }

}


module.exports = { mod: new main() }