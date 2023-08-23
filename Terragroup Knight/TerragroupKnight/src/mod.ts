import { DependencyContainer } from "tsyringe";

// SPT types
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";

//Get all initialization scripts
import { InitAssets } from "./init/InitAssets";
import { InitDatabase } from "./init/InitDatabase";
//import { InitBots } from "./init/InitBots";
import { InitTrader } from "./init/InitTrader";
import * as config from "../config/config.json";



class main implements IPostDBLoadMod, IPreAkiLoadMod
{

    public preAkiLoad(container: DependencyContainer): void
    {
        InitAssets.preAkiLoad(container);
        InitTrader.preAkiLoad(container);
    }
    
    public postDBLoad(container: DependencyContainer): void
    {
        const logger = container.resolve<ILogger>("WinstonLogger");
        //Start all scripts that adds something to the database
        if(config["Other"]["Extra logging"]){logger.info("TGK:Starting assets initialization")}
        InitAssets.postDBLoad(container);
    
        if(config["Other"]["Extra logging"]){logger.info("TGK:Starting trader initialization")}
        InitTrader.postDBLoad(container);
                
        if(config["Other"]["Extra logging"]){logger.info("TGK:Starting database initialization")}
        InitDatabase.postDBLoad(container);

        if(config["Other"]["Extra logging"]){logger.info("TGK:Starting bots initialization")}
        //InitBots

    }
}


module.exports = { mod: new main() }