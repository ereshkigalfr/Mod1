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
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { IBotConfig } from "@spt-aki/models/spt/config/IBotConfig";

//TGS Types
import * as config from "../../config/config.json"

export class checkLabsLock
{
    static check(container: DependencyContainer, profile)
    {
        const MainDatabase = container.resolve<DatabaseServer>("DatabaseServer");
        const logger = container.resolve<ILogger>("WinstonLogger");
        const JsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const ServerDatabase = MainDatabase.getTables();
        const maps = ServerDatabase.locations

        if (!profile || !profile.TradersInfo )
        {
            maps["laboratory"].base.Locked = true;
            if(config["Other"]["Extra logging"]){logger.info('TGK: No trader data, locking labs')}
        }
        else
        {
            if (!profile.TradersInfo["TGS_knight"])
            {
                maps["laboratory"].base.Locked = true;
                if(config["Other"]["Extra logging"]){logger.info('TGK: Trader not existing, locking labs')}
            }
            else
            {
                if (!profile.TradersInfo["TGS_knight"].unlocked)
                {
                    maps["laboratory"].base.Locked = true;
                    if(config["Other"]["Extra logging"]){logger.info('TGK: Trader locked, locking labs')}
                }
                else
                {
                    maps["laboratory"].base.Locked = false;
                    if(config["Other"]["Extra logging"]){logger.info('TGK: Trader unlock, free labs!!')}
                }
            }
        }
    }
}