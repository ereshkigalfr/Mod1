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
let data = require("../../data/donottouchever.json")
const config = require("../../config/config.json");
import { coreMod } from "../../src/core/coremod";

export class applyMetabolismModifications {
    static apply(container: DependencyContainer, profile, sessionid) {
        const vfs = container.resolve<VFS>("VFS");
        const JsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const preAkiModLoader: PreAkiModLoader = container.resolve<PreAkiModLoader>("PreAkiModLoader");
        if (profile) {
            //Let's first backup the profile initial health
            data[sessionid].Hydratation = profile.Health.Hydration
            data[sessionid].Energy = profile.Health.Energy

            let metabolismProgress = 0
            if (profile.Skills && profile.Skills.Common) {
                metabolismProgress = profile.Skills.Common.find(x => x.Id === "Metabolism").Progress;
            }
            const hydratationMax = profile.Health.Hydration.Maximum;
            const energyMax = profile.Health.Energy.Maximum;

            let metabolismLevel = 0;

            //Calculcate metabo level correctly
            if (metabolismProgress >= 100) {
                metabolismLevel = Math.floor(metabolismProgress / 100);
            }

            //Increasing Hydratation and Energy rate depending on metabolism level
            const HydratationPerc = (Math.round(metabolismLevel * config.Gameplay.HydratationRate));
            const EnergyPerc = (Math.round(metabolismLevel * config.Gameplay.EnergyRate));

            if (profile.Health) {
                //Check if current hydratation match maximum so we increase both, or not
                if (profile.Health.Hydration.Current === hydratationMax) {
                    profile.Health.Hydration.Maximum = coreMod.percentageCalculation(hydratationMax, HydratationPerc);
                    profile.Health.Hydration.Current = profile.Health.Hydration.Maximum;
                }
                else {
                    profile.Health.Hydration.Maximum = coreMod.percentageCalculation(hydratationMax, (Math.round(metabolismLevel * config.Gameplay.HydratationRate)));
                }

                //Check if current energy match maximum so we increase both, or not
                if (profile.Health.Energy.Current === energyMax) {
                    profile.Health.Energy.Maximum = coreMod.percentageCalculation(energyMax, EnergyPerc);
                    profile.Health.Energy.Current = profile.Health.Energy.Maximum;
                }
                else {
                    profile.Health.Energy.Maximum = coreMod.percentageCalculation(energyMax, (Math.round(metabolismLevel * config.Gameplay.EnergyRate)));
                }
            }
        }
        //Saving the file
        vfs.writeFile(`./${preAkiModLoader.getModPath("TerragroupKnight")}data/donottouchever.json`, JsonUtil.serialize(data, true), false, false)
    }

    static restore(container: DependencyContainer, profile, sessionid) {
        const vfs = container.resolve<VFS>("VFS");
        const JsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const preAkiModLoader: PreAkiModLoader = container.resolve<PreAkiModLoader>("PreAkiModLoader");

        if (data[sessionid].Hydratation || data[sessionid].Energy) {
            if (profile.Health) {

                profile.Health.Hydration.Maximum = data[sessionid].Hydratation.Maximum;
                profile.Health.Energy.Maximum = data[sessionid].Energy.Maximum;
            }
        }

        //Restoring default profile values:
        data[sessionid].Hydratation = {}
        data[sessionid].Energy = {}

        //Saving the file
        vfs.writeFile(`./${preAkiModLoader.getModPath("TerragroupKnight")}data/donottouchever.json`, JsonUtil.serialize(data, true), false, false)
    }
}