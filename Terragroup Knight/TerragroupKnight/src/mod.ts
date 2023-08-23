import { DependencyContainer } from "tsyringe";

// SPT types
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";

//Get all initialization scripts
import { InitAssets } from "./init/InitAssets";
import { InitDatabase } from "./init/InitDatabase";
//import { InitBots } from "./init/InitBots";
import { InitTrader } from "./init/InitTrader";
import { config } from "../config/config.json";

class main implements IPostDBLoadMod
{
    
    public postDBLoad(container: DependencyContainer): void {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const initAssets = new InitAssets();
        const initTrader = new InitTrader();
        const initDatabase = new InitDatabase();
        //Start all scripts that adds something to the database
        if(config["Other"]["Extra logging"]){logger.info("TGK:Starting assets initialization")}
        initAssets.postDBLoad(container);
        initAssets.preAkiLoad(container);

        if(config["Other"]["Extra logging"]){logger.info("TGK:Starting trader initialization")}
        initTrader.postDBLoad(container);
        initTrader.preAkiLoad(container);
        
        if(config["Other"]["Extra logging"]){logger.info("TGK:Starting database initialization")}
        initDatabase.postDBLoad(container);

        if(config["Other"]["Extra logging"]){logger.info("TGK:Starting bots initialization")}
        //InitBots

        
    }

}


module.exports = { mod: new main() }