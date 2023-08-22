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

class assetsInit
{
    constructor()
    {
        this.funcptr = HttpServer.onRespond["IMAGE"];
        HttpServer.onRespond["IMAGE"] = assetsInit.getImage.bind(this);
    }

    //Adding res files
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

module.exports = assetsInit;