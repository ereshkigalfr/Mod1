import { DependencyContainer } from "tsyringe";

import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { VFS } from "@spt-aki/utils/VFS"


export class InitAssets implements IPostDBLoadMod, IPostDBLoadMod
{

    constructor() {
        this.config = require("../../config/config.json")
    }

    private config: Object

    public preAkiLoad(container: DependencyContainer): void
    {
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const preAkiModLoader = container.resolve("PreAkiModLoader");
        const imageRouter = container.resolve<ImageRouter>("ImageRouter")
        const logger = container.resolve<ILogger>("WinstonLogger");
        const imageFilepath = `./${preAkiModLoader.getModPath("TerragroupKnight")}res/trader`;

        //Adding trader assets to the game
        if(this.config["Other"]["Extra logging"]){logger.info("TGK:Adding trader pic to the game")}
        imageRouter.addRoute("/files/trader/avatar/TGS_Trader", `${imageFilepath}/TGS_Trader.png`);
    }

    public postDBLoad(container: DependencyContainer): void
    {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const imageRouter = container.resolve<ImageRouter>("ImageRouter")
        const preAkiModLoader = container.resolve("PreAkiModLoader");
        const VFS = container.resolve<VFS>("VFS");
        const TGSAssetsPath = `./${preAkiModLoader.getModPath("TerragroupKnight")}res`;
        const TGSQuestBannersList = VFS.getFiles(TGSAssetsPath);

        //Add quest images
        if(this.config["Other"]["Extra logging"]){logger.info("TGK:Adding quests banner to the game")}
        for (const banner of TGSQuestBannersList) {
            const filename = VFS.stripExtension(banner);
            imageRouter.addRoute(`/files/quest/icon/${filename}`, `${TGSAssetsPath}${banner}`);
        }
    }


}

module.exports = { mod: new InitAssets() }