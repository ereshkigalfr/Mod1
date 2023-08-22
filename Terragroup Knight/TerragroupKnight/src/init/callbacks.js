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
const callbackUtils = require("../functions/callbackUtils")
const akiFunctions = require("../functions/aki_newFunctions")

class callbacksInit
{
    static Initializing()
    {
        HttpRouter.onStaticRoute["/client/game/bot/generate"]["terragroup"] = callbacksInit.raiderInvade.bind(this);
        HttpRouter.onStaticRoute["/client/game/start"]["terragroup"] = callbacksInit.GameStartCallback.bind(this);
        HttpRouter.onStaticRoute["/client/game/keepalive"]["terragroup"] = callbacksInit.CheckForLabsUnlock.bind(this);
        HttpRouter.onDynamicRoute["/client/location/getLocalloot"]["terragroup"] = callbacksInit.addLoot.bind(this);
        BotController.generateBot = akiFunctions.generateBot;
        this.funcptr = HttpServer.onRespond["IMAGE"];
        HttpServer.onRespond["IMAGE"] = callbacksInit.getImage.bind(this);
        this.chance = 0;
    }

    static GameStartCallback(url, info, sessionID, output)
    {
        
        const profile = SaveServer.profiles[sessionID].characters.pmc;
        
        //Does labs should be locked or not ?
        callbackUtils.checkLabsLock(profile);

        //Change PMC health values based on their skill
        callbackUtils.applyHealthModifications(profile, sessionID);

        //Change PMC Metabolisms valuees based on their skill
        callbackUtils.applyMetabolismModifications(profile, sessionID);

        return HttpResponse.nullResponse();
    }

    static CheckForLabsUnlock(url, info, sessionID, output)
    {
        const profile = ProfileController.getPmcProfile(sessionID);

        callbackUtils.checkLabsLock(profile);

        if(output)
        {
            return output
        }  
        else
        {
            return HttpResponse.getBody({
                "msg": "OK"
            });    
        }
        
    }

    static raiderInvade(url, info, sessionID)
    {
        const profile = ProfileController.getPmcProfile(sessionID);
        const mapName = SaveServer.profiles[sessionID].inraid.location.toLowerCase();
        const config = require("../../config/config.json");

        if (QuestController.questStatus(profile, "twelfthQuest_TGS") === "Started" && mapName === "woods")
        {
            for (let type in info.conditions)
            {
                let roles = info.conditions[type];
                roles.Role = "TG_Raiders";
                roles.Difficulty = "impossible";
            }
            Logger.log("##############################################################################", "white", "red");
            Logger.log("##############################################################################", "white", "red");
            Logger.log("############################# YOU ARE BEING RAIDED #############################", "white", "red");
            Logger.log("##############################################################################", "white", "red");
            Logger.log("##############################################################################", "white", "red");
        }
        else if (mapName !== "laboratory")
        {
            if (this.chance < config.raidsChance)
            {
                for (let type in info.conditions)
                {
                    let roles = info.conditions[type];
                    roles.Role = "TG_Raiders";
                    roles.Difficulty = "impossible";
                    info = info;
                }

                Logger.log("##############################################################################", "white", "red");
                Logger.log("##############################################################################", "white", "red");
                Logger.log("############################# YOU ARE BEING RAIDED #############################", "white", "red");
                Logger.log("##############################################################################", "white", "red");
                Logger.log("##############################################################################", "white", "red");
            }


        }

            return HttpResponse.getBody(BotController.generate(info));
        
    }
    static addLoot(url, info, sessionID, output)
    {
        this.chance = RandomUtil.getIntEx(100);
        const value = require("../../config/values.json");
        const profile = ProfileController.getPmcProfile(sessionID);
        const mapName = SaveServer.profiles[sessionID].inraid.location.toLowerCase();

        if (QuestController.questStatus(profile, "twelfthQuest_TGS") === "Started" && mapName === "woods")
        {
            DatabaseServer.tables.locations["woods"]["loot"]["forced"].push(value.WoodsForcedLoot);
        }

        return HttpResponse.getBody(LocationController.get(info.locationId));
        
    }

    

    static getImage(sessionID, req, resp, body)
    {
        const mod = require("../../package.json");
        const filepath = `${ModLoader.getModPath(mod.name)}res/`;

        if (req.url.includes("/avatar/terragroup_specialist"))
        {
            //Trader avatar
            HttpServer.sendFile(resp, `${filepath}trader/terragroup_specialist.png`);
            return;
        }
        else if (req.url.includes("/files/quest/icon/firstQuest_TGS.png"))
        {
            HttpServer.sendFile(resp, `${filepath}quests/firstQuest_TGS.png`);
            return;
        }
        else if (req.url.includes("/files/quest/icon/secondQuest_TGS.png"))
        {
            HttpServer.sendFile(resp, `${filepath}quests/secondQuest_TGS.png`);
            return;
        }
        else if (req.url.includes("/files/quest/icon/thirdQuest_TGS.png"))
        {
            HttpServer.sendFile(resp, `${filepath}quests/thirdQuest_TGS.png`);
            return;
        }
        else if (req.url.includes("/files/quest/icon/fourthQuest_TGS.png"))
        {
            HttpServer.sendFile(resp, `${filepath}quests/fourthQuest_TGS.png`);
            return;
        }
        else if (req.url.includes("/files/quest/icon/fifthQuest_TGS.png"))
        {
            HttpServer.sendFile(resp, `${filepath}quests/fifthQuest_TGS.png`);
            return;
        }
        else if (req.url.includes("/files/quest/icon/sixthQuest_TGS.jpg"))
        {
            HttpServer.sendFile(resp, `${filepath}quests/sixthQuest_TGS.jpg`);
            return;
        }
        else if (req.url.includes("/files/quest/icon/seventhQuest_TGS.png"))
        {
            HttpServer.sendFile(resp, `${filepath}quests/seventhQuest_TGS.png`);
            return;
        }
        else if (req.url.includes("/files/quest/icon/eightQuest_TGS.jpg"))
        {
            HttpServer.sendFile(resp, `${filepath}quests/eightQuest_TGS.jpg`);
            return;
        }
        else if (req.url.includes("/files/quest/icon/ninthQuest_TGS.png"))
        {
            HttpServer.sendFile(resp, `${filepath}quests/ninthQuest_TGS.png`);
            return;
        }
        else if (req.url.includes("/files/quest/icon/tenthQuest_TGS.jpg"))
        {
            HttpServer.sendFile(resp, `${filepath}quests/tenthQuest_TGS.jpg`);
            return;
        }
        else if (req.url.includes("/files/quest/icon/eleventhQuest_TGS.png"))
        {
            HttpServer.sendFile(resp, `${filepath}quests/eleventhQuest_TGS.png`);
            return;
        }
        else if (req.url.includes("/files/quest/icon/twelfthQuest_TGS.png"))
        {
            HttpServer.sendFile(resp, `${filepath}quests/twelfthQuest_TGS.png`);
            return;
        }

        this.funcptr(sessionID, req, resp, body);
    }
}

module.exports = callbacksInit;