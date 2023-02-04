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

class callbackUtils
{
    static getBlazeDogtag(bot)
    {
        bot = bot
            bot.Info.Level = 80;
            bot.Info.Experience = 15006660;
            bot.Info.Side = "Terragroup";
            bot.Inventory.items.push({
                _id: HashUtil.generate(),
                _tpl: "tgs_Blaze_Dogtags",
                parentId: bot.Inventory.equipment,
                slotId: "Dogtag",
                upd: {
                    "Dogtag": {
                        "AccountId": bot.aid,
                        "ProfileId": bot._id,
                        "Nickname": "Blaze",
                        "Side": bot.Info.Side,
                        "Level": bot.Info.Level,
                        "Time": (new Date().toISOString()),
                        "Status": "Killed by ",
                        "KillerAccountId": "Unknown",
                        "KillerProfileId": "Unknown",
                        "KillerName": "Unknown",
                        "WeaponName": "Unknown"
                    }
                }
            });
            return bot
    }

    static checkLabsLock(profile)
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

    static applyHealthModifications(profile, sessionID)
    {
        const config = require("../../config/config.json");
        const CoreMod = require("../../../CoreMod/src/Core.js");
        const templateProfile = DatabaseServer.tables.templates.profiles.Standard.bear.character;
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

    static applyMetabolismModifications(profile, sessionID)
    {
        const config = require("../../config/config.json");
        const CoreMod = require("../../../CoreMod/src/Core.js");
        //Metabolism additions
        const templateProfile = DatabaseServer.tables.templates.profiles.Standard.bear.character;
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


module.exports = callbackUtils;