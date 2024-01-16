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

import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { VFS } from "@spt-aki/utils/VFS"
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";

//TGS Imports
import * as config from "../../config/config.json"

export class InitAssets
{
    static preAkiLoad(container: DependencyContainer)
    {
        const preAkiModLoader: PreAkiModLoader = container.resolve<PreAkiModLoader>("PreAkiModLoader");
        const imageRouter = container.resolve<ImageRouter>("ImageRouter")
        const logger = container.resolve<ILogger>("WinstonLogger");
        const VFS = container.resolve<VFS>("VFS");
        const imageFilepath = `./${preAkiModLoader.getModPath("TerragroupKnight")}res/trader`;
        const TGSAssetsPath = `./${preAkiModLoader.getModPath("TerragroupKnight")}res/quests/`;
        const TGSQuestBannersList = VFS.getFiles(TGSAssetsPath);

        //Adding trader assets to the game
        if(config["Other"]["Extra logging"]){logger.info("TGK:Adding trader pic to the game")}
        imageRouter.addRoute("/files/trader/avatar/TGS_Trader", `${imageFilepath}/TGS_Trader.png`);

        //Add quest images
        if(config["Other"]["Extra logging"]){logger.info("TGK:Adding quests banner to the game")}
        for (const banner of TGSQuestBannersList) {
            const filename = VFS.stripExtension(banner);
            imageRouter.addRoute(`/files/quest/icon/${filename}`, `${TGSAssetsPath}${banner}`);
        }
    }
}