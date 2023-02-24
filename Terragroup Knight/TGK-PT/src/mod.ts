import { DependencyContainer } from "tsyringe";
import crypto from "crypto";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { DialogueHelper } from "@spt-aki/helpers/DialogueHelper";
import { IPostAkiLoadMod } from "@spt-aki/models/external/IPostAkiLoadMod";
import type { StaticRouterModService } from "@spt-aki/services/mod/staticRouter/StaticRouterModService";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { ITraderConfig, UpdateTime } from "@spt-aki/models/spt/config/ITraderConfig";
import { IModLoader } from "@spt-aki/models/spt/mod/IModLoader";
import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { Traders } from "@spt-aki/models/enums/Traders";
import { QuestStatus } from "@spt-aki/models/enums/QuestStatus";
import { MessageType } from "@spt-aki/models/enums/MessageType";
import { HashUtil } from "@spt-aki/utils/HashUtil";
import { VFS } from "@spt-aki/utils/VFS"
import { NotificationSendHelper } from "@spt-aki/helpers/NotificationSendHelper";
import { NotifierHelper } from "@spt-aki/helpers/NotifierHelper";
import { QuestHelper } from "@spt-aki/helpers/QuestHelper";
import { ImporterUtil } from "@spt-aki/utils/ImporterUtil"
import { BundleLoader } from "@spt-aki/loaders/BundleLoader";
import {CoreMod } from "./CoreMod"
import * as baseJson from "../db/trader/terragroup_specialist/base.json";
//
class Mod implements IPreAkiLoadMod {
    private static container: DependencyContainer;
    public preAkiLoad(container: DependencyContainer): void {
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const traderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
        const preAkiModLoader = container.resolve("PreAkiModLoader");
        const staticRouterModService = container.resolve<StaticRouterModService>("StaticRouterModService");
        const imageRouter = container.resolve<ImageRouter>("ImageRouter")
        container.register<CoreMod>("CoreMod", CoreMod);
        this.registerProfileImage(preAkiModLoader, imageRouter);
        this.setupTraderUpdateTime(traderConfig);
    }
    public postAkiLoad(container: DependencyContainer): void {
        const Logger = container.resolve<ILogger>("WinstonLogger");
        const PreAkiModLoader = container.resolve("PreAkiModLoader");
        const FuncDatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const FuncImporterUtil = container.resolve<ImporterUtil>("ImporterUtil")
        const VFS = container.resolve<VFS>("VFS");
        const JsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const ClientDB = FuncDatabaseServer.getTables();
        const ModPath = PreAkiModLoader.getModPath("TGK-PT")
        const DB = FuncImporterUtil.loadRecursive(`${ModPath}db/`)
    }
    public postDBLoad(container: DependencyContainer): void {
        const Logger = container.resolve<ILogger>("WinstonLogger");
        const PreAkiModLoader = container.resolve("PreAkiModLoader");
        const FuncDatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const FuncImporterUtil = container.resolve<ImporterUtil>("ImporterUtil")
        const imageRouter = container.resolve<ImageRouter>("ImageRouter");
        const VFS = container.resolve<VFS>("VFS");
        const JsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const ClientDB = FuncDatabaseServer.getTables();
        const ModPath = PreAkiModLoader.getModPath("TGK-PT")
        const DB = FuncImporterUtil.loadRecursive(`${ModPath}db/`)
        const iconPath = `${ModPath}res/quests/`
        const iconList = VFS.getFiles(iconPath);
        const coremod = container.resolve<CoreMod>("CoreMod")
        const AllItems = ClientDB.templates.items;
        var Therapist = "54cb57776803fa99248b456e"
        var Ragman = "5ac3b934156ae10c4430e83c"
        const Locale = ClientDB.locales.global["ch"]
        const ELocale = ClientDB.locales.global["en"]
        //Add Trader (Old version is hardly to fix so i make a new one)
        for(let td in DB.trader){
            ClientDB.traders[td] = DB.trader[td]
        }
        VFS.writeFile(`${ModPath}td.json`, JSON.stringify(ClientDB.traders, null, 4))
        //Add all item in server database
        //PS: i changed the eth-coin's bundle to new version i maked
        for (let item in DB.templates.items) {
            ClientDB.templates.items[item] = DB.templates.items[item]
        }
        for(var i = 0; i < DB.trader["terragroup_specialist"].base.sell_category.length; i++){
            CustomLog(Locale[DB.trader["terragroup_specialist"].base.sell_category[i]])
        }
        //Convert old locale files to new version, not need rewrite
        for(let lang in DB.templates.locales){
            //Resolve item locale
            for(let itemid in DB.templates.locales[lang].templates){
                ClientDB.locales.global[lang][itemid + " Name"] = DB.templates.locales[lang].templates[itemid].Name
                ClientDB.locales.global[lang][itemid + " ShortName"] = DB.templates.locales[lang].templates[itemid].ShortName
                ClientDB.locales.global[lang][itemid + " Description"] = DB.templates.locales[lang].templates[itemid].Description
            }
            //Resolve mail locale
            for(let mails in DB.templates.locales[lang].mail){
                ClientDB.locales.global[lang][mails] = DB.templates.locales[lang].mail[mails]
            }
            //Resolve trader locale
            for(let trader in DB.templates.locales[lang].trading){
                ClientDB.locales.global[lang][trader + " FullName"] = DB.templates.locales[lang].trading[trader].FullName
                ClientDB.locales.global[lang][trader + " FirstName"] = DB.templates.locales[lang].trading[trader].FirstName
                ClientDB.locales.global[lang][trader + " Nickname"] = DB.templates.locales[lang].trading[trader].Nickname
                ClientDB.locales.global[lang][trader + " Location"] = DB.templates.locales[lang].trading[trader].Location
                ClientDB.locales.global[lang][trader + " Description"] = DB.templates.locales[lang].trading[trader].Description
            }
            for(let qt in DB.templates.locales[lang].quest){
                ClientDB.locales.global[lang][qt + " name"] = DB.templates.locales[lang].quest[qt].name
                ClientDB.locales.global[lang][qt + " description"] = DB.templates.locales[lang].quest[qt].description
                ClientDB.locales.global[lang][qt + " startedMessageText"] = DB.templates.locales[lang].quest[qt].startedMessageText
                ClientDB.locales.global[lang][qt + " successMessageText"] = DB.templates.locales[lang].quest[qt].successMessageText
                for(let cd in DB.templates.locales[lang].quest[qt].conditions){
                    ClientDB.locales.global[lang][cd] = DB.templates.locales[lang].quest[qt].conditions[cd]
                }
            }
        }
        //Add quest
        for(let quest in DB.templates.quests){
            ClientDB.templates.quests[quest] = DB.templates.quests[quest]
        }
        //Add new version locales (designed for new or uncomplete item just like ethcoin)
        for(let lang in DB.templates.newlocales){
            for(let key in DB.templates.newlocales[lang]){
                ClientDB.locales.global[lang][key] = DB.templates.newlocales[lang][key]
            }
        }
        //For test
        AddAssort(Therapist, "tgs_ethCoin", 1, 1)
        coremod.CreateHandbookItem("tgs_ethCoin", "5b47574386f77428ca22b2f1", 100000)
        //Add quest images
        for (const icon of iconList) {
            const filename = VFS.stripExtension(icon);
            imageRouter.addRoute(`/files/quest/icon/${filename}`, `${iconPath}${icon}`);
        }
        //Custom functions
        function GenerateHash(string) {
            const shasum = crypto.createHash("sha1");
            shasum.update(string);
            return shasum.digest("hex").substring(0, 24);
        }
        function CustomLog(string) {
            Logger.logWithColor("[Console]: " + string, "cyan");
        }
        function CustomAccess(string) {
            Logger.logWithColor("[Console]: " + string, "green");
        }
        function CustomDenied(string) {
            Logger.logWithColor("[Console]: " + string, "red");
        }
        function AddAssort(trader, id, price, ll) {
            var AssortData1 = ClientDB.traders[trader].assort
            var CacheHashID = GenerateHash(id)
            AssortData1.items.push({
                "_id": CacheHashID,
                "_tpl": id,
                "parentId": "hideout",
                "slotId": "hideout",
                "upd": {
                    "StackObjectsCount": 99999,
                    "UnlimitedCount": true
                }
            })
            AssortData1.barter_scheme[CacheHashID] = [[{
                count: price,
                _tpl: '5449016a4bdc2d6f028b456f'
            }]]
            AssortData1.loyal_level_items[CacheHashID] = ll
        }
    }
    //添加商人头像
    private registerProfileImage(preAkiModLoader: PreAkiModLoader, imageRouter: ImageRouter): void {
        const imageFilepath = `./${preAkiModLoader.getModPath("TGK-PT")}res/trader`;
        imageRouter.addRoute(baseJson.avatar.replace(".png", ""), `${imageFilepath}/terragroup_specialist.png`);
    }
    //商人刷新时间
    private setupTraderUpdateTime(traderConfig: ITraderConfig): void {
        const traderRefreshRecord: UpdateTime = { traderId: baseJson._id, seconds: 3600 }
        traderConfig.updateTime.push(traderRefreshRecord);
    }
}
module.exports = { mod: new Mod() }