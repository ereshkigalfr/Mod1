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

import { inject, injectable } from "tsyringe";

//SPT Imports
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";

const config = require("../../config/config.json");

@injectable()

export class checkLabsLock
{
    constructor(
        @inject("DatabaseServer") protected databaseServer: DatabaseServer,
        @inject("WinstonLogger") private logger: ILogger
    )
    {}


    static check(profile)
    {
        const ServerDatabase = this.databaseServer.getTables();
        const maps = ServerDatabase.locations

        if (!profile.TradersInfo )
        {
            maps["laboratory"].base.Locked = true;
            if(config["Other"]["Extra logging"]){this.logger.info('TGK: No trader data, locking labs')}
        }
        else
        {
            if (!profile.TradersInfo["terragroup_specialist"])
            {
                maps["laboratory"].base.Locked = true;
                if(config["Other"]["Extra logging"]){this.logger.info('TGK: Trader not existing, locking labs')}
            }
            else
            {
                if (!profile.TradersInfo["terragroup_specialist"].unlocked)
                {
                    maps["laboratory"].base.Locked = true;
                    if(config["Other"]["Extra logging"]){this.logger.info('TGK: Trader locked, locking labs')}
                }
                else
                {
                    maps["laboratory"].base.Locked = false;
                    if(config["Other"]["Extra logging"]){this.logger.info('TGK: Trader unlock, free labs!!')}
                }
            }
        }
    }
}