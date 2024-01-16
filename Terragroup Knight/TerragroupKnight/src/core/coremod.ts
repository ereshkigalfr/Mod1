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

import { HashUtil } from "@spt-aki/utils/HashUtil";

@injectable()

export class coreMod
{
    constructor(){}
    
    static AddNewSpawnPoint(maps, id, map, x, y, z, rot, sides, categories, BotZone)
    {
        const NewSpawn = {
            "Id": id,
            "Position": {
                "x": x,
                "y": y,
                "z": z
            },
            "Rotation": rot,
            "Sides": sides,
            "Categories": categories,
            "Infiltration": "",
            "DelayToCanSpawnSec": 5,
            "ColliderParams": {
                "_parent": "SpawnSphereParams",
                "_props": {
                    "Center": {
                        "x": 0,
                        "y": 0,
                        "z": 0
                    },
                    "Radius": 20
                }
            },
            "BotZoneName": BotZone
        };
        maps[map].base.SpawnPointParams.push(NewSpawn);
    }

    static percentageCalculation(base, percent)
    {
        return Math.round(base + ((percent / 100) * base));
    }

    /**
     * Adds equipment to The bot loadout
     * @param {String} type The type of equipment to add ex. "Headwear"
     * @param {String} id The id of The equipment to add
     * @param {String} bot The role of The bot to modify ex. "pmcbot"
     */
    static AddEquipmentToLoadout(type, id, bot)
    {
        const items = DatabaseServer.tables.templates.items;
        const bots = DatabaseServer.tables.bots.types;

        bots[bot].inventory.equipment[type].push(id);

        if(items[id] && items[id]._props && items[id]._props.Slots)
        {
            for (const slots in items[id]._props.Slots)
            {
                if (!bots[bot].inventory.mods[id])
                {
                    bots[bot].inventory.mods[id] = new Object();
                }
                let slot = items[id]._props.Slots[slots];
                bots[bot].inventory.mods[id][slot._name] = slot._props.filters[0].Filter;

                for (const FirstFilters in slot._props.filters[0].Filter)
                {
                    let id2 = slot._props.filters[0].Filter[FirstFilters];

                    //We need to add mags
                    if (items[id2]._parent === "5448bc234bdc2d3c308b4569")
                    {
                        if (!bots[bot].inventory.mods[id2])
                        {
                            bots[bot].inventory.mods[id2] = new Object();
                        }
                        let mag = items[id2];
                        bots[bot].inventory.mods[id2][mag._props.Cartridges[0]._name] = mag._props.Cartridges[0]._props.filters[0].Filter;
                    }

                    for (const slots2 in items[id2]._props.Slots)
                    {
                        if (!bots[bot].inventory.mods[id2])
                        {
                            bots[bot].inventory.mods[id2] = new Object();
                        }
                        let slot2 = items[id2]._props.Slots[slots2];
                        bots[bot].inventory.mods[id2][slot2._name] = slot2._props.filters[0].Filter;

                        for (const SecondFilters in slot2._props.filters[0].Filter)
                        {
                            let id3 = slot2._props.filters[0].Filter[SecondFilters];
                            for (const slots3 in items[id3]._props.Slots)
                            {
                                if (!bots[bot].inventory.mods[id3])
                                {
                                    bots[bot].inventory.mods[id3] = new Object();
                                }
                                let slot3 = items[id3]._props.Slots[slots3];
                                bots[bot].inventory.mods[id3][slot3._name] = slot3._props.filters[0].Filter;

                                for (const ThirdFilters in slot3._props.filters[0].Filter)
                                {
                                    let id4 = slot3._props.filters[0].Filter[ThirdFilters];
                                    for (const slots4 in items[id4]._props.Slots)
                                    {
                                        if (!bots[bot].inventory.mods[id4])
                                        {
                                            bots[bot].inventory.mods[id4] = new Object();
                                        }
                                        let slot4 = items[id4]._props.Slots[slots4];
                                        bots[bot].inventory.mods[id4][slot4._name] = slot4._props.filters[0].Filter;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }


}