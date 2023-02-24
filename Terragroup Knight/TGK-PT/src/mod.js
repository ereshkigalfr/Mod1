"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const CoreMod_1 = require("./CoreMod");
const baseJson = __importStar(require("../db/trader/terragroup_specialist/base.json"));
//
class Mod {
    preAkiLoad(container) {
        const configServer = container.resolve("ConfigServer");
        const traderConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        const preAkiModLoader = container.resolve("PreAkiModLoader");
        const staticRouterModService = container.resolve("StaticRouterModService");
        const imageRouter = container.resolve("ImageRouter");
        container.register("CoreMod", CoreMod_1.CoreMod);
        this.registerProfileImage(preAkiModLoader, imageRouter);
        this.setupTraderUpdateTime(traderConfig);
    }
    postAkiLoad(container) {
        const Logger = container.resolve("WinstonLogger");
        const PreAkiModLoader = container.resolve("PreAkiModLoader");
        const FuncDatabaseServer = container.resolve("DatabaseServer");
        const FuncImporterUtil = container.resolve("ImporterUtil");
        const VFS = container.resolve("VFS");
        const JsonUtil = container.resolve("JsonUtil");
        const ClientDB = FuncDatabaseServer.getTables();
        const ModPath = PreAkiModLoader.getModPath("TGK-PT");
        const DB = FuncImporterUtil.loadRecursive(`${ModPath}db/`);
    }
    postDBLoad(container) {
        const Logger = container.resolve("WinstonLogger");
        const PreAkiModLoader = container.resolve("PreAkiModLoader");
        const FuncDatabaseServer = container.resolve("DatabaseServer");
        const FuncImporterUtil = container.resolve("ImporterUtil");
        const imageRouter = container.resolve("ImageRouter");
        const VFS = container.resolve("VFS");
        const JsonUtil = container.resolve("JsonUtil");
        const ClientDB = FuncDatabaseServer.getTables();
        const ModPath = PreAkiModLoader.getModPath("TGK-PT");
        const DB = FuncImporterUtil.loadRecursive(`${ModPath}db/`);
        const iconPath = `${ModPath}res/quests/`;
        const iconList = VFS.getFiles(iconPath);
        const coremod = container.resolve("CoreMod");
        const AllItems = ClientDB.templates.items;
        var Therapist = "54cb57776803fa99248b456e";
        var Ragman = "5ac3b934156ae10c4430e83c";
        const Locale = ClientDB.locales.global["ch"];
        const ELocale = ClientDB.locales.global["en"];
        //Add Trader (Old version is hardly to fix so i make a new one)
        for (let td in DB.trader) {
            ClientDB.traders[td] = DB.trader[td];
        }
        VFS.writeFile(`${ModPath}td.json`, JSON.stringify(ClientDB.traders, null, 4));
        //Add all item in server database
        //PS: i changed the eth-coin's bundle to new version i maked
        for (let item in DB.templates.items) {
            ClientDB.templates.items[item] = DB.templates.items[item];
        }
        for (var i = 0; i < DB.trader["terragroup_specialist"].base.sell_category.length; i++) {
            CustomLog(Locale[DB.trader["terragroup_specialist"].base.sell_category[i]]);
        }
        //Convert old locale files to new version, not need rewrite
        for (let lang in DB.templates.locales) {
            //Resolve item locale
            for (let itemid in DB.templates.locales[lang].templates) {
                ClientDB.locales.global[lang][itemid + " Name"] = DB.templates.locales[lang].templates[itemid].Name;
                ClientDB.locales.global[lang][itemid + " ShortName"] = DB.templates.locales[lang].templates[itemid].ShortName;
                ClientDB.locales.global[lang][itemid + " Description"] = DB.templates.locales[lang].templates[itemid].Description;
            }
            //Resolve mail locale
            for (let mails in DB.templates.locales[lang].mail) {
                ClientDB.locales.global[lang][mails] = DB.templates.locales[lang].mail[mails];
            }
            //Resolve trader locale
            for (let trader in DB.templates.locales[lang].trading) {
                ClientDB.locales.global[lang][trader + " FullName"] = DB.templates.locales[lang].trading[trader].FullName;
                ClientDB.locales.global[lang][trader + " FirstName"] = DB.templates.locales[lang].trading[trader].FirstName;
                ClientDB.locales.global[lang][trader + " Nickname"] = DB.templates.locales[lang].trading[trader].Nickname;
                ClientDB.locales.global[lang][trader + " Location"] = DB.templates.locales[lang].trading[trader].Location;
                ClientDB.locales.global[lang][trader + " Description"] = DB.templates.locales[lang].trading[trader].Description;
            }
            for (let qt in DB.templates.locales[lang].quest) {
                ClientDB.locales.global[lang][qt + " name"] = DB.templates.locales[lang].quest[qt].name;
                ClientDB.locales.global[lang][qt + " description"] = DB.templates.locales[lang].quest[qt].description;
                ClientDB.locales.global[lang][qt + " startedMessageText"] = DB.templates.locales[lang].quest[qt].startedMessageText;
                ClientDB.locales.global[lang][qt + " successMessageText"] = DB.templates.locales[lang].quest[qt].successMessageText;
                for (let cd in DB.templates.locales[lang].quest[qt].conditions) {
                    ClientDB.locales.global[lang][cd] = DB.templates.locales[lang].quest[qt].conditions[cd];
                }
            }
        }
        //Add quest
        for (let quest in DB.templates.quests) {
            ClientDB.templates.quests[quest] = DB.templates.quests[quest];
        }
        //Add new version locales (designed for new or uncomplete item just like ethcoin)
        for (let lang in DB.templates.newlocales) {
            for (let key in DB.templates.newlocales[lang]) {
                ClientDB.locales.global[lang][key] = DB.templates.newlocales[lang][key];
            }
        }
        //For test
        AddAssort(Therapist, "tgs_ethCoin", 1, 1);
        coremod.CreateHandbookItem("tgs_ethCoin", "5b47574386f77428ca22b2f1", 100000);
        //Add quest images
        for (const icon of iconList) {
            const filename = VFS.stripExtension(icon);
            imageRouter.addRoute(`/files/quest/icon/${filename}`, `${iconPath}${icon}`);
        }
        //Custom functions
        function GenerateHash(string) {
            const shasum = crypto_1.default.createHash("sha1");
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
            var AssortData1 = ClientDB.traders[trader].assort;
            var CacheHashID = GenerateHash(id);
            AssortData1.items.push({
                "_id": CacheHashID,
                "_tpl": id,
                "parentId": "hideout",
                "slotId": "hideout",
                "upd": {
                    "StackObjectsCount": 99999,
                    "UnlimitedCount": true
                }
            });
            AssortData1.barter_scheme[CacheHashID] = [[{
                        count: price,
                        _tpl: '5449016a4bdc2d6f028b456f'
                    }]];
            AssortData1.loyal_level_items[CacheHashID] = ll;
        }
    }
    //添加商人头像
    registerProfileImage(preAkiModLoader, imageRouter) {
        const imageFilepath = `./${preAkiModLoader.getModPath("TGK-PT")}res/trader`;
        imageRouter.addRoute(baseJson.avatar.replace(".png", ""), `${imageFilepath}/terragroup_specialist.png`);
    }
    //商人刷新时间
    setupTraderUpdateTime(traderConfig) {
        const traderRefreshRecord = { traderId: baseJson._id, seconds: 3600 };
        traderConfig.updateTime.push(traderRefreshRecord);
    }
}
module.exports = { mod: new Mod() };
