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

//SPT Imports
import { DependencyContainer } from "tsyringe";

import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";

//TGS Imports
let data = require("../../data/donottouchever.json")
const config = require("../../config/config.json");

//import { coreMod } from "../../src/core/coremod";
let infoToSend = null

export class raiderInvasion
{
    static invade(container: DependencyContainer,info)
    {
        const Logger = container.resolve<ILogger>("WinstonLogger");
        
        for (const bot in info.conditions){
            info.conditions[bot].Role = "pmcBot"
            info.conditions[bot].Difficulty = "impossible"
        }
        infoToSend = info

        Logger.logWithColor("############################################################################################################################################", "white", "redBG");
        Logger.logWithColor("############################################################################################################################################", "white", "redBG");
        Logger.logWithColor("############################################################################################################################################", "white", "redBG");
        Logger.logWithColor("########################################################## YOU ARE BEING RAIDED ############################################################", "white", "redBG");
        Logger.logWithColor("############################################################################################################################################", "white", "redBG");
        Logger.logWithColor("############################################################################################################################################", "white", "redBG");
        Logger.logWithColor("############################################################################################################################################", "white", "redBG");
    }

    static canInvade(container: DependencyContainer,profile){
        let bool = false

        return bool
    }

    static newOutput(){
        return infoToSend
    }
}