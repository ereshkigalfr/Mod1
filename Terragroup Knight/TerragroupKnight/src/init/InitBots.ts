import { DependencyContainer } from "tsyringe";
import crypto from "crypto";
import { IPostModDatabaseLoadMod } from "@spt-aki/models/external/IPostModDatabaseLoadMod";
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
        const ServerDatabase = FuncDatabaseServer.getTables();
        const ModPath = PreAkiModLoader.getModPath("TerragroupKnight")
        const ModDatabase = FuncImporterUtil.loadRecursive(`${ModPath}db/`)
    }
    public postModDatabaseLoad(container: DependencyContainer): void {
        const Logger = container.resolve<ILogger>("WinstonLogger");
        const PreAkiModLoader = container.resolve("PreAkiModLoader");
        const FuncDatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const FuncImporterUtil = container.resolve<ImporterUtil>("ImporterUtil")
        const imageRouter = container.resolve<ImageRouter>("ImageRouter");
        const VFS = container.resolve<VFS>("VFS");
        const JsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const ServerDatabase = FuncDatabaseServer.getTables();
        const ModPath = PreAkiModLoader.getModPath("TerragroupKnight")
        const ModDatabase = FuncImporterUtil.loadRecursive(`${ModPath}db/`)
        const iconPath = `${ModPath}res/quests/`
        const iconList = VFS.getFiles(iconPath);
        const coremod = container.resolve<CoreMod>("CoreMod")
        const DatabaseItems = ServerDatabase.templates.items;
        const Locale = ServerDatabase.locales.global
        //Add Trader (Old version is hardly to fix so i make a new one)
        for(let td in ModDatabase.trader){
            ServerDatabase.traders[td] = ModDatabase.trader[td]
        }
        VFS.writeFile(`${ModPath}td.json`, JSON.stringify(ServerDatabase.traders, null, 4))
        //Add all item in server database
        //PS: i changed the eth-coin's bundle to new version i maked
        for (let item in ModDatabase.templates.items) {
            ServerDatabase.templates.items[item] = ModDatabase.templates.items[item]
        }
        for(var i = 0; i < ModDatabase.trader["terragroup_specialist"].base.sell_category.length; i++){
            CustomLog(Locale[ModDatabase.trader["terragroup_specialist"].base.sell_category[i]])
        }
        //Convert old locale files to new version, not need rewrite
        for(let lang in ModDatabase.templates.locales){
            //Resolve item locale
            for(let itemid in ModDatabase.templates.locales[lang].templates){
                ServerDatabase.locales.global[lang][itemid + " Name"] = ModDatabase.templates.locales[lang].templates[itemid].Name
                ServerDatabase.locales.global[lang][itemid + " ShortName"] = ModDatabase.templates.locales[lang].templates[itemid].ShortName
                ServerDatabase.locales.global[lang][itemid + " Description"] = ModDatabase.templates.locales[lang].templates[itemid].Description
            }
            //Resolve mail locale
            for(let mails in ModDatabase.templates.locales[lang].mail){
                ServerDatabase.locales.global[lang][mails] = ModDatabase.templates.locales[lang].mail[mails]
            }
            //Resolve trader locale
            for(let trader in ModDatabase.templates.locales[lang].trading){
                ServerDatabase.locales.global[lang][trader + " FullName"] = ModDatabase.templates.locales[lang].trading[trader].FullName
                ServerDatabase.locales.global[lang][trader + " FirstName"] = ModDatabase.templates.locales[lang].trading[trader].FirstName
                ServerDatabase.locales.global[lang][trader + " Nickname"] = ModDatabase.templates.locales[lang].trading[trader].Nickname
                ServerDatabase.locales.global[lang][trader + " Location"] = ModDatabase.templates.locales[lang].trading[trader].Location
                ServerDatabase.locales.global[lang][trader + " Description"] = ModDatabase.templates.locales[lang].trading[trader].Description
            }
            for(let qt in ModDatabase.templates.locales[lang].quest){
                ServerDatabase.locales.global[lang][qt + " name"] = ModDatabase.templates.locales[lang].quest[qt].name
                ServerDatabase.locales.global[lang][qt + " description"] = ModDatabase.templates.locales[lang].quest[qt].description
                ServerDatabase.locales.global[lang][qt + " startedMessageText"] = ModDatabase.templates.locales[lang].quest[qt].startedMessageText
                ServerDatabase.locales.global[lang][qt + " successMessageText"] = ModDatabase.templates.locales[lang].quest[qt].successMessageText
                for(let cd in ModDatabase.templates.locales[lang].quest[qt].conditions){
                    ServerDatabase.locales.global[lang][cd] = ModDatabase.templates.locales[lang].quest[qt].conditions[cd]
                }
            }
        }
        //Add quest
        for(let quest in ModDatabase.templates.quests){
            ServerDatabase.templates.quests[quest] = ModDatabase.templates.quests[quest]
        }
        //Add new version locales (designed for new or uncomplete item just like ethcoin)
        for(let lang in ModDatabase.templates.newlocales){
            for(let key in ModDatabase.templates.newlocales[lang]){
                ServerDatabase.locales.global[lang][key] = ModDatabase.templates.newlocales[lang][key]
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
            var AssortData1 = ServerDatabase.traders[trader].assort
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