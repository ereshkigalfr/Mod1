/*
エレシュキガル
*/

/*
    SPT-AKI Terragroup Knight mod.
    Copyright (C) 2023  Amelia

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

"use strict";

//Modules
const database = require("./init/database");
const traders = require("./init/traders");
const bots = require("./init/bots");
const callbacks = require("./init/callbacks");

class mod
{
    static init()
    {
        const mod = require("../package.json");
        Logger.info(`Loading: ${mod.name} : ${mod.version}`);
        ModLoader.onLoad["ZZ-TGSpecialist-database"] = database.DatabaseInitialization;
        ModLoader.onLoad["ZZ-TGSpecialist-traders"] = traders.Initialization;
        ModLoader.onLoad["ZZ-TGSpecialist-bots"] = bots.botInitialization;
        ModLoader.onLoad["ZZ-TGSpecialist-callbacks"] = callbacks.Initializing;
    }
}

module.exports = mod;