"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreMod = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const DatabaseServer_1 = require("C:/snapshot/project/obj/servers/DatabaseServer");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const JsonUtil_1 = require("C:/snapshot/project/obj/utils/JsonUtil");
const HashUtil_1 = require("C:/snapshot/project/obj/utils/HashUtil");
let CoreMod = class CoreMod {
    constructor(logger, hashUtil, databaseServer, jsonUtil) {
        this.logger = logger;
        this.hashUtil = hashUtil;
        this.databaseServer = databaseServer;
        this.jsonUtil = jsonUtil;
    }
    /**
     * Adds the provided item id to the handbook
     * @param {String} id The item id
     * @param {String} category The category of the item https://docs.sp-tarkov.com/#resources/other.md
     * @param {Number} price The price in RUB of the item on the flea
     */
    CreateHandbookItem(id, category, price) {
        const handbook = this.databaseServer.getTables().templates.handbook;
        handbook.Items.push({
            "Id": id,
            "ParentId": category,
            "Price": price
        });
    }
};
CoreMod = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(1, (0, tsyringe_1.inject)("HashUtil")),
    __param(2, (0, tsyringe_1.inject)("DatabaseServer")),
    __param(3, (0, tsyringe_1.inject)("JsonUtil")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof HashUtil_1.HashUtil !== "undefined" && HashUtil_1.HashUtil) === "function" ? _b : Object, typeof (_c = typeof DatabaseServer_1.DatabaseServer !== "undefined" && DatabaseServer_1.DatabaseServer) === "function" ? _c : Object, typeof (_d = typeof JsonUtil_1.JsonUtil !== "undefined" && JsonUtil_1.JsonUtil) === "function" ? _d : Object])
], CoreMod);
exports.CoreMod = CoreMod;
