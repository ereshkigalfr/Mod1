import { DependencyContainer } from "tsyringe";

// SPT types
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";

//Get all initialization scripts
import { InitAssets } from "./init/InitAssets";
import { InitDatabase } from "./init/InitDatabase";
//import { InitBots } from "./init/InitBots";
import { InitTrader } from "./init/InitTrader";
import * as config from "../config/config.json";

const initAssets = new InitAssets();
const initTrader = new InitTrader();
const initDatabase = new InitDatabase();

class main implements IPostDBLoadMod, IPreAkiLoadMod
{

    constructor(){}
    
    public postDBLoad(container: DependencyContainer): void {
        const logger = container.resolve<ILogger>("WinstonLogger");
        
        //Start all scripts that adds something to the database
        if(config["Other"]["Extra logging"]){logger.info("TGK:Starting assets initialization")}
        initAssets.postDBLoad(container);
    
        if(config["Other"]["Extra logging"]){logger.info("TGK:Starting trader initialization")}
        initTrader.postDBLoad(container);
                
        if(config["Other"]["Extra logging"]){logger.info("TGK:Starting database initialization")}
        initDatabase.postDBLoad(container);

        if(config["Other"]["Extra logging"]){logger.info("TGK:Starting bots initialization")}
        //InitBots

    }

    public preAkiLoad(container: DependencyContainer): void
    {
        initAssets.preAkiLoad(container);
        initTrader.preAkiLoad(container);
    }

}


module.exports = { mod: new main() }