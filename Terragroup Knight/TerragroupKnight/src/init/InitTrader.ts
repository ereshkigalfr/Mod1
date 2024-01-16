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
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { ITraderConfig } from "@spt-aki/models/spt/config/ITraderConfig";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";


// New trader settings
import { Money } from "@spt-aki/models/enums/Money";
import { Traders } from "@spt-aki/models/enums/Traders";
import { TraderHelper } from "../helpers/traderHelpers";

// TGS Types
const TGSTraderBase = require("../../db/TGS_knight/base.json");
const TGSTraderAssorts = require("../../db/TGS_knight/assort.json");
const TGSTraderQuestsUnlocks = require("../../db/TGS_knight/questassort.json");
const TGSTraderDialogues = require("../../db/TGS_knight/dialogue.json");
import * as config from "../../config/config.json";

export class InitTrader
{
    static preAkiLoad(container: DependencyContainer)
    {
        // Add trader to trader enum
        Traders["TGS_knight"] = "TGS_knight";
    }
    
    static postDBLoad(container: DependencyContainer)
    {
        //Get everything we need as variables
        const MainDatabase = container.resolve<DatabaseServer>("DatabaseServer");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const logger = container.resolve<ILogger>("WinstonLogger");
        const traderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
        const JsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const ServerDatabase = MainDatabase.getTables();
        const Traders = ServerDatabase.traders
        
        if(config["Other"]["Extra logging"]){logger.info("TGK:Adding new trader in database")};
        traderConfig.updateTime.push({"traderId":TGSTraderBase._id,"seconds":3600})
        Traders[TGSTraderBase._id] = {}
        Traders[TGSTraderBase._id].base = TGSTraderBase;
        Traders[TGSTraderBase._id].questassort = TGSTraderQuestsUnlocks;
        Traders[TGSTraderBase._id].assort = TGSTraderAssorts
        Traders[TGSTraderBase._id].dialogue = TGSTraderDialogues
        
        //Maybe do assorts generation by there ? I need to think about it
        /*
        blabla assort
        */

    }
}