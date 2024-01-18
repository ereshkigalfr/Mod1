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
import { QuestHelper } from "@spt-aki/helpers/QuestHelper";
import { RandomUtil } from "@spt-aki/utils/RandomUtil";

//TGS Imports
const data = require("../../data/donottouchever.json")
const config = require("../../config/config.json");
import { dataFileGenerator } from "../functions/dataFileGenerator";

let infoToSend = null

export class raiderInvasion {
    static invade(container: DependencyContainer, info, sessionid) {
        const Logger = container.resolve<ILogger>("WinstonLogger");

        for (const bot in info.conditions) {
            info.conditions[bot].Role = "pmcBot"
            info.conditions[bot].Difficulty = "impossible"
        }
        infoToSend = info

        Logger.logWithColor("########################################################################################################################################", "white", "redBG");
        Logger.logWithColor("########################################################################################################################################", "white", "redBG");
        Logger.logWithColor("########################################################################################################################################", "white", "redBG");
        Logger.logWithColor("######################################################## YOU ARE BEING RAIDED ##########################################################", "white", "redBG");
        Logger.logWithColor("########################################################################################################################################", "white", "redBG");
        Logger.logWithColor("########################################################################################################################################", "white", "redBG");
        Logger.logWithColor("########################################################################################################################################", "white", "redBG");

        data[sessionid].Info.IsRaided = true
        dataFileGenerator.saveFile(container, data)

    }

    static canInvade(container: DependencyContainer, profile, sessionid, info) {
        const questHelper = container.resolve<QuestHelper>("QuestHelper");
        const randomUtil = container.resolve<RandomUtil>("RandomUtil");
        const pmcProfile = profile.characters.pmc;
        const mapName = profile.inraid.location.toLowerCase();
        let bool = false;
        //Check if the player is currently being raided
        if (data[sessionid].Info.IsRaided == true) {
            bool = true;
            //Also i shouldn't roll the raid everytime bot/generate is triggered
        } else if (data[sessionid].Info.CurrentRaidResult == false) {
            bool = false;
        } else {
               //If quest 'First contact' is completed and raids cooldown is OFF, can be raided
            if (questHelper.getQuestStatus(pmcProfile, "TGS_Quest3") == 4 && data[sessionid].Info.RaidsCooldown == 0) {
                //Roll a number to see if the player is lucky or not, if lucky, he's getting raided, otherwhise, no raid
                if (randomUtil.getIntEx(100) <= config.Gameplay.raidsChance) {
                    bool = true;
                }
                else {
                    bool = false;
                }
            }
            //If quest 'First contact' is locked, raids can't happen.
            else if (questHelper.getQuestStatus(pmcProfile, "TGS_Quest3") == 0) {
                bool = false;
            }
            //If quest "First contact" is completed but raids cooldown is still ON, raids can't happen
            else if (questHelper.getQuestStatus(pmcProfile, "TGS_Quest3") == 4 && data[sessionid].Info.RaidsCooldown >= 1) {
                bool = false;
            }
            //Force invasion on that specific quest
            if (questHelper.getQuestStatus(pmcProfile, "TGS_Quest15") && mapName == "woods") {
                bool = true;
            }
        }
     

        //Should keep raiding for the entire raid, so i keep the isRaided to true and save it to the data file
        if (bool == true) {
            this.invade(container, info, sessionid);
            data[sessionid].Info.IsRaided == true;
            data[sessionid].Info.CurrentRaidResult == true;
            dataFileGenerator.saveFile(container, data);
        }
        if (data[sessionid].Info.CurrentRaidResult == false) { }
        else if (bool == false) {
            data[sessionid].Info.CurrentRaidResult == false;
            dataFileGenerator.saveFile(container, data);
        }
        return bool
    }

    static newOutput() {

        return infoToSend
    }
}