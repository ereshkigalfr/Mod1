/*
エレシュキガル
*/

/*
    Terragroup Knight mod.
    Copyright (C) 2024 Ereshkigal

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import { DependencyContainer } from "tsyringe";

// SPT types
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { BotGenerator } from "@spt-aki/generators/BotGenerator";
//TGS Imports
import { InitAssets } from "./init/InitAssets";
import { InitDatabase } from "./init/InitDatabase";
import { InitBots } from "./init/InitBots";
import { InitCallbacks } from "./init/InitCallbacks";
import { InitTrader } from "./init/InitTrader";
import { TGS_GenerateBot } from "../src/functions/generateBot";
import * as config from "../config/config.json";

class main implements IPostDBLoadMod, IPreAkiLoadMod
{

    public preAkiLoad(container: DependencyContainer): void
    {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const BotGenerator = container.resolve<BotGenerator>("BotGenerator");
        if(config["Other"]["Extra logging"]){logger.info("TGK:Starting preAki assets initialization")}
        InitAssets.preAkiLoad(container);
        if(config["Other"]["Extra logging"]){logger.info("TGK:Starting preAki trader initialization")}
        InitTrader.preAkiLoad(container);
        //Replacing AKI Fucntions
        BotGenerator.generateBot = TGS_GenerateBot.generateMyOwnBot
    }
    
    public postDBLoad(container: DependencyContainer): void
    {
        const logger = container.resolve<ILogger>("WinstonLogger");
        //Start all scripts that adds something to the database    
        if(config["Other"]["Extra logging"]){logger.info("TGK:Starting trader initialization")}
        InitTrader.postDBLoad(container);
                
        if(config["Other"]["Extra logging"]){logger.info("TGK:Starting database initialization")}
        InitDatabase.postDBLoad(container);

        if(config["Other"]["Extra logging"]){logger.info("TGK:Starting bots initialization")}
        InitBots.initAll(container);

    }
}


module.exports = { mod: new main() }