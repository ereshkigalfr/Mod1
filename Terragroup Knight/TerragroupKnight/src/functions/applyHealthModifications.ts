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
import { VFS } from "@spt-aki/utils/VFS";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
//TGS Types

import { coreMod } from "../../src/core/coremod";
let data = require("../../data/donottouchever.json")
const config = require("../../config/config.json");

export class applyHealthModifications {

    static apply(container: DependencyContainer, profile, sessionid) {
        const vfs = container.resolve<VFS>("VFS");
        const preAkiModLoader: PreAkiModLoader = container.resolve<PreAkiModLoader>("PreAkiModLoader");
        const JsonUtil = container.resolve<JsonUtil>("JsonUtil");
        //Let's first backup the profile initial health
        if (profile) {
            data[sessionid].Health = profile.Health

            let healthLevel = 0;
            let healthProgression = 0;
            let pmcBones = [];
            if (profile.Skills && profile.Skills.Common) {
                healthProgression = profile.Skills.Common.find(x => x.Id === "Health").Progress;
            }

            if (profile.Health && profile.Health.BodyParts) {
                pmcBones = profile.Health.BodyParts;
            }

            //Calculate health level properly
            if (healthProgression >= 100) {
                healthLevel = Math.floor(healthProgression / 100);
            }

            const HealthPerc = (Math.round(healthLevel * config.Gameplay.hpRate));

            for (const bone in pmcBones) {
                let boneMaximum = profile.Health.BodyParts[bone].Health.Maximum;
                let boneCurrent = pmcBones[bone].Health.Current;

                if (boneCurrent === boneMaximum) {
                    profile.Health.BodyParts[bone].Health.Maximum = coreMod.percentageCalculation(boneMaximum, HealthPerc);
                    profile.Health.BodyParts[bone].Health.Current = profile.Health.BodyParts[bone].Health.Maximum;
                }
                else {
                    profile.Health.BodyParts[bone].Health.Maximum = coreMod.percentageCalculation(boneMaximum, HealthPerc);
                }

                profile.Health.BodyParts[bone] = pmcBones[bone];
            }
        }

        //Saving the file
        vfs.writeFile(`./${preAkiModLoader.getModPath("TerragroupKnight")}data/donottouchever.json`, JsonUtil.serialize(data, true), false, false)
    }

    static restore(container: DependencyContainer, profile, sessionid) {
        const vfs = container.resolve<VFS>("VFS");
        const JsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const preAkiModLoader: PreAkiModLoader = container.resolve<PreAkiModLoader>("PreAkiModLoader");
        let pmcBones = [];

        if (data[sessionid].Health) {
            if (profile.Health && profile.Health.BodyParts) {
                pmcBones = profile.Health.BodyParts;
            }

            for (const bone in pmcBones) {

                profile.Health.BodyParts[bone].Health.Maximum = data[sessionid].Health.BodyParts[bone].Health.Maximum;

            }
        }
        //Empty the data array again
        if (data[sessionid].Health) {
            data[sessionid].Health = {}
        }
        //Saving the file
        vfs.writeFile(`./${preAkiModLoader.getModPath("TerragroupKnight")}data/donottouchever.json`, JsonUtil.serialize(data, true), false, false)
    }
}