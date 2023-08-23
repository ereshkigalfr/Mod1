import { DependencyContainer } from "tsyringe";

// SPT types
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { ITraderConfig } from "@spt-aki/models/spt/config/ITraderConfig";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";

//Get all initialization scripts
import { InitAssets } from "./init/InitAssets";
import { InitDatabase } from "./init/InitDatabase";
import { InitBots } from "./init/InitBots";
import { InitTrader } from "./init/InitTrader";

//Other
const ModInfo = require("../package.json");

class mod
{

    //All i need here is triggering all init stuff

    //And then i log out mod name + version "enabled"

}


module.exports = { mod: new mod() }