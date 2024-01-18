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
import { VFS } from "@spt-aki/utils/VFS";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";

export class dataFileGenerator {
    static createFiles(container: DependencyContainer, sessionid) {
        const vfs = container.resolve<VFS>("VFS");
        const preAkiModLoader: PreAkiModLoader = container.resolve<PreAkiModLoader>("PreAkiModLoader");
        const JsonUtil = container.resolve<JsonUtil>("JsonUtil");
        let data = {}

        if (vfs.exists(`./${preAkiModLoader.getModPath("TerragroupKnight")}data/donottouchever.json`)) {
            data = require("../../data/donottouchever.json")
        }

        if (!data[sessionid]) {

            data[sessionid] = { "Health": {}, "Hydratation": {}, "Energy": {}, "Info": {} }
            data[sessionid].Info.RaidsCooldown = 0
            data[sessionid].Info.IsRaided = false
            data[sessionid].Info.CurrentRaidResult = null

            //Saving data the file
            vfs.writeFile(`./${preAkiModLoader.getModPath("TerragroupKnight")}data/donottouchever.json`, JsonUtil.serialize(data, true), false, false)

        }
    }

    static saveFile(container: DependencyContainer, data) {
        const vfs = container.resolve<VFS>("VFS");
        const preAkiModLoader: PreAkiModLoader = container.resolve<PreAkiModLoader>("PreAkiModLoader");
        const JsonUtil = container.resolve<JsonUtil>("JsonUtil");

        //Saving data the file
        vfs.writeFile(`./${preAkiModLoader.getModPath("TerragroupKnight")}data/donottouchever.json`, JsonUtil.serialize(data, true), false, false)
    }
}