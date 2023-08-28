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


export class applyHealthModifications
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
        const templateProfile = this.DatabaseServer.getTables().templates.profiles.Standard.bear.character;
        let healthLevel = 0;
        let healthProgression = 0;
        let pmcBones = [];
        if(profile.Skills && profile.Skills.Common)
        {
            healthProgression = profile.Skills.Common.find(x => x.Id === "Health").Progress;
        }

        if(profile.Health && profile.Health.BodyParts)
        {
            pmcBones = profile.Health.BodyParts;
        }

        //Calculate health level properly
        if (healthProgression >= 100)
        {
            healthLevel = Math.floor(healthProgression / 100);
        }

        const HealthPerc = (Math.round(healthLevel * config.hpRate));

        for (const bone in pmcBones)
        {
            let boneMaximum = templateProfile.Health.BodyParts[bone].Health.Maximum;
            let boneCurrent = pmcBones[bone].Health.Current;

            if (boneCurrent === boneMaximum)
            {
                profile.Health.BodyParts[bone].Health.Maximum = CoreMod.percentageCalculation(boneMaximum, HealthPerc);
                profile.Health.BodyParts[bone].Health.Current = profile.Health.BodyParts[bone].Health.Maximum;
            }
            else
            {
                profile.Health.BodyParts[bone].Health.Maximum = CoreMod.percentageCalculation(boneMaximum, HealthPerc);
            }

            profile.Health.BodyParts[bone] = pmcBones[bone];
        }

        SaveServer.profiles[sessionID].characters.pmc = profile;
    }
}