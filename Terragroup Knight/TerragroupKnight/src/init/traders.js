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

class TradersInit
{
    static createTraders()
    {
        //Core variables
        const CoreMod = require("../../../CoreMod/src/Core.js");
        const log = require("../logging.js");

        //Data variables
        const trader_id = "terragroup_specialist";
        const traders = DatabaseServer.tables.traders;

        //Create trader base file
        log.development("Starting creation of traders data");

        const traderData = CoreMod.CreateNewTrader(trader_id, true, "/files/trader/avatar/terragroup_specialist.png", "EUR");
        traderData.base.unlockedByDefault = false;
        traderData.base.balance_eur = 100000;
        //Repair data
        traderData.base.repair.availability = true;
        traderData.base.repair.quality = 0.2;
        traderData.base.repair.currency = "5449016a4bdc2d6f028b456f";
        traderData.base.repair.currency_coefficient = 3;
        traderData.base.repair.price_rate = 2;

        //Insurance data
        traderData.base.insurance.availability = true;
        traderData.base.insurance.min_payment = 100000;
        traderData.base.insurance.min_return_hour = 3;
        traderData.base.insurance.max_return_hour = 8;
        traderData.base.insurance.max_storage_time = 72;

        //Loyalty levels
        traderData.base.loyaltyLevels[0] = {
            "minLevel": 30,
            "minSalesSum": 0,
            "minStanding": 0,
            "buy_price_coef": 80,
            "repair_price_coef": 0,
            "insurance_price_coef": 80,
            "exchange_price_coef": 0,
            "heal_price_coef": 0
        };
        traderData.base.loyaltyLevels[1] = {
            "minLevel": 30,
            "minSalesSum": 0,
            "minStanding": 0.2,
            "buy_price_coef": 60,
            "repair_price_coef": 0,
            "insurance_price_coef": 60,
            "exchange_price_coef": 0,
            "heal_price_coef": 0
        };
        traderData.base.loyaltyLevels[2] = {
            "minLevel": 35,
            "minSalesSum": 550000,
            "minStanding": 0.5,
            "buy_price_coef": 50,
            "repair_price_coef": 0,
            "insurance_price_coef": 50,
            "exchange_price_coef": 0,
            "heal_price_coef": 0
        };
        traderData.base.loyaltyLevels[3] = {
            "minLevel": 40,
            "minSalesSum": 1000000,
            "minStanding": 1.5,
            "buy_price_coef": 40,
            "repair_price_coef": 0,
            "insurance_price_coef": 50,
            "exchange_price_coef": 0,
            "heal_price_coef": 0
        };

        //Trader sell category
        traderData.base.sell_category = [
            "5b47574386f77428ca22b33e",
            "5b47574386f77428ca22b33f",
            "5b5f78dc86f77409407a7f8e",
            "5b47574386f77428ca22b346",
            "5b47574386f77428ca22b340",
            "5b47574386f77428ca22b344",
            "5b47574386f77428ca22b342",
            "5b47574386f77428ca22b341",
            "5b47574386f77428ca22b345",
            "5b47574386f77428ca22b343",
            "5b5f71b386f774093f2ecf11",
            "5b5f71c186f77409407a7ec0",
            "5b5f71de86f774093f2ecf13",
            "5b5f724186f77447ed5636ad",
            "5b5f736886f774094242f193",
            "5b5f73ec86f774093e6cb4fd",
            "5b5f74cc86f77447ec5d770a",
            "5b5f750686f774093e6cb503",
            "5b5f751486f77447ec5d770c",
            "5b5f752e86f774093e6cb505",
            "5b5f754a86f774094242f19b",
            "5b5f755f86f77447ec5d770e",
            "5b5f757486f774093e6cb507",
            "5b5f75b986f77447ec5d7710",
            "5b5f75c686f774094242f19f",
            "5b5f75e486f77447ec5d7712",
            "5b5f760586f774093e6cb509",
            "5b5f761f86f774094242f1a1",
            "5b5f764186f77447ec5d7714"
        ];

        traders[trader_id] = traderData;

        log.development("Trader base file finished generating");

    }

    static createAssorts(traderID)
    {
        const log = require("../logging.js");
        const CoreMod = require("../../../CoreMod/src/Core.js");
        let id = null;
        log.development("Starting assort generation");

        //Euros
        CoreMod.CreateTraderAssort(HashUtil.generate(), "569668774bdc2da2298b4568", traderID, 133, "RUB", 1, true, 999999);
        //Grendel Ammo
        id = HashUtil.generate();
        CoreMod.CreateTraderAssort(id, "TGS_65x39mm_grendel", traderID, 49, "EUR", 1, true, 999999, 400);
        CoreMod.CreateTraderAssortUnlock(traderID, "success", id, "seventhQuest_TGS");
        //chemical med 1
        CoreMod.CreateTraderAssort(HashUtil.generate(), "TGS_chemical_meds", traderID, 1500, "EUR", 1, false, 200, 3);
        //chemical med 2
        id = HashUtil.generate();
        CoreMod.CreateTraderAssort(id, "TGS_chemical_meds2", traderID, 1500, "EUR", 1, false, 200, 3);
        CoreMod.CreateTraderAssortUnlock(traderID, "success", id, "eleventhQuest_TGS");
        //Gen M3 6,5x39 mag
        CoreMod.CreateTraderAssort(HashUtil.generate(), "TGS_genm3_fde", traderID, 2500, "EUR", 1, false, 500, 10);
        //Lapua magnum mag
        id = HashUtil.generate();
        CoreMod.CreateTraderAssort(id, "TGS_338_LM_20rnd_mag", traderID, 1250, "EUR", 1, false, 500, 10);
        CoreMod.CreateTraderAssortUnlock(traderID, "success", id, "twelfthQuest_TGS");
        //M16A4 Preset
        id = HashUtil.generate();
        CoreMod.CreateTraderAssortWithPreset(id, "P-M16A4", traderID, 6500, "EUR", 1, false, 10, 3);
        CoreMod.CreateTraderAssortUnlock(traderID, "success", id, "sixthQuest_TGS");
        //M16A4 Preset
        id = HashUtil.generate();
        CoreMod.CreateTraderAssortWithPreset(id, "BadNews", traderID, 8000, "EUR", 1, false, 10, 3);
        CoreMod.CreateTraderAssortUnlock(traderID, "success", id, "twelfthQuest_TGS");
        log.development("Assort generation done");
    }

    static Initialization()
    {
        const log = require("../logging.js");
        TradersInit.createTraders();
        TradersInit.createAssorts("terragroup_specialist");
        log.development("Trader initialization is done");
    }
}

module.exports = TradersInit;