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


export class applyMetabolismModifications
{
    constructor(
        @inject("DatabaseServer") protected databaseServer: DatabaseServer,
        @inject("WinstonLogger") private logger: ILogger
    )
    {}


    static apply(profile, sessionID)
    {
        const config = require("../../config/config.json");
        const CoreMod = require("../../../CoreMod/src/Core.js");
        //Metabolism additions
        const templateProfile = this.DatabaseServer.getTables().templates.profiles.Standard.bear.character;
        let metabolismProgress = 0
        if(profile.Skills && profile.Skills.Common)
        {
            metabolismProgress = profile.Skills.Common.find(x => x.Id === "Metabolism").Progress;
        }
        const hydratationMax = templateProfile.Health.Hydration.Maximum;
        const energyMax = templateProfile.Health.Energy.Maximum;
        
        let metabolismLevel = 0;
        
        //Calculcate metabo level correctly
        if (metabolismProgress >= 100)
        {
            metabolismLevel = Math.floor(metabolismProgress / 100);
        }

        //Increasing Hydratation and Energy rate depending on metabolism level
        const HydratationPerc = (Math.round(metabolismLevel * config.HydratationRate));
        const EnergyPerc = (Math.round(metabolismLevel * config.EnergyRate));

        if(profile.Health)
        {
            //Check if current hydratation match maximum so we increase both, or not
            if (profile.Health.Hydration.Current === hydratationMax)
            {
                profile.Health.Hydration.Maximum = CoreMod.percentageCalculation(hydratationMax, HydratationPerc);
                profile.Health.Hydration.Current = profile.Health.Hydration.Maximum;
            }
            else
            {
                profile.Health.Hydration.Maximum = CoreMod.percentageCalculation(hydratationMax, (Math.round(metabolismLevel * config.HydratationRate)));
            }

            //Check if current energy match maximum so we increase both, or not
            if (profile.Health.Energy.Current === energyMax)
            {
                profile.Health.Energy.Maximum = CoreMod.percentageCalculation(energyMax, EnergyPerc);
                profile.Health.Energy.Current = profile.Health.Energy.Maximum;
            }
            else
            {
                profile.Health.Energy.Maximum = CoreMod.percentageCalculation(energyMax, (Math.round(metabolismLevel * config.EnergyRate)));
            }
        }
    }
}