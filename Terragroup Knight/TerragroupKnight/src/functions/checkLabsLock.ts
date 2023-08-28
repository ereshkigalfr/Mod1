/*
エレシュキガル
*/

/*
    Terragroup Knight mod.
    Copyright (C) 2023  Ereshkigal

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

import { HashUtil } from "@spt-aki/utils/HashUtil";

@injectable()


export class checkLabslock
{
    constructor()
    {}


    static check(profile)
    {
        if (!profile.TradersInfo )
        {
            DatabaseServer.tables.locations["laboratory"].base.Locked = true;
        }
        else
        {
            if (!profile.TradersInfo["terragroup_specialist"])
            {
                DatabaseServer.tables.locations["laboratory"].base.Locked = true;
            }
            else
            {
                if (!profile.TradersInfo["terragroup_specialist"].unlocked)
                {
                    DatabaseServer.tables.locations["laboratory"].base.Locked = true;
                }
                else
                {
                    DatabaseServer.tables.locations["laboratory"].base.Locked = false;
                }
            }
        }
    }
}