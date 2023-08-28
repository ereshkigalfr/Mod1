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