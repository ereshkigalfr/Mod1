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

class BotsInit
{

    static createBots()
    {
        //Important constants
        const mod = require("../../package.json");

        //Database constants
        const database = DatabaseServer.tables;
        const bots = database.bots;
        //Terragroup database constants
        const botList = VFS.getFiles(`${ModLoader.getModPath(mod.name)}db/bots/`);

        for (const bot of botList)
        {
            const botName = bot.split(".").slice(0, -1).join(".");
            let botFile = JsonUtil.deserialize(VFS.readFile(`${ModLoader.getModPath(`${mod.name}`)}/db/bots/${bot}`));
            bots.types[botName] = botFile;
        }

        BotConfig.presetBatch["TG_Raiders"] = 120;
        BotConfig.presetBatch["TG_Boss"] = 1;
        BotConfig.presetBatch["TG_Followers"] = 60;
        BotConfig.presetBatch["UNTroops"] = 60;

        //Add Gluhar ssd
        bots.types["bossgluhar"].inventory.items.SpecialLoot.push("terragroupSpecialist_ssdDrive");
        bots.types["bossgluhar"].inventory.items.SpecialLoot.push("terragroupSpecialist_ssdDrive");
        bots.types["bossgluhar"].inventory.items.SpecialLoot.push("terragroupSpecialist_ssdDrive");
        bots.types["bossgluhar"].inventory.items.SpecialLoot.push("terragroupSpecialist_ssdDrive");
        bots.types["bossgluhar"].inventory.items.SpecialLoot.push("terragroupSpecialist_ssdDrive");
        bots.types["bossgluhar"].inventory.items.SpecialLoot.push("terragroupSpecialist_ssdDrive");
        bots.types["bossgluhar"].inventory.items.SpecialLoot.push("terragroupSpecialist_ssdDrive");
    }

    static createBotEquipment()
    {
        const CoreMod = require("../../../CoreMod/src/Core.js");
        //Adding TG_Followers equipment to loadouts
        CoreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5fc3e272f8b6a877a729eac5", "tg_followers"); //UMP-45
        CoreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "terragroupSpecialist_prototype_m16", "tg_followers"); // Proto M-16
        CoreMod.AddEquipmentToLoadout("Holster", "5cadc190ae921500103bb3b6", "tg_followers"); // M9A3
        CoreMod.AddEquipmentToLoadout("Headwear", "5e00c1ad86f774747333222c", "tg_followers"); // Team Exfil black
        CoreMod.AddEquipmentToLoadout("Headwear", "5a154d5cfcdbcb001a3b00da", "tg_followers"); //Fast MT black

        //Adding TG_Boss equipment to loadouts
        CoreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5fc22d7c187fea44d52eda44", "tg_boss"); // MK-18
        CoreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "terragroupSpecialist_338_badnews", "tg_boss"); // Bad New
        CoreMod.AddEquipmentToLoadout("SecondPrimaryWeapon", "5e81ebcd8e146c7080625e15", "tg_boss"); // GL40
        CoreMod.AddEquipmentToLoadout("Holster", "5f36a0e5fbf956000b716b65", "tg_boss"); // M45A1
        CoreMod.AddEquipmentToLoadout("Headwear", "terragroupSpecialist_helmet_prototype", "tg_boss"); // Helmet proto
        CoreMod.AddEquipmentToLoadout("Headwear", "5f60b34a41e30a4ab12a6947", "tg_boss"); // Caiman

        //Adding TG_Raiders equipment to loadouts
        CoreMod.AddEquipmentToLoadout("Headwear", "5ea17ca01412a1425304d1c0", "tg_raiders"); // Bastion
        CoreMod.AddEquipmentToLoadout("Headwear", "5e4bfc1586f774264f7582d3", "tg_raiders"); // Gallet helmet
        CoreMod.AddEquipmentToLoadout("Headwear", "5b40e1525acfc4771e1c6611", "tg_raiders"); // Ulach IIIA black
        CoreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5fbcc1d9016cce60e8341ab3", "tg_raiders"); // MCX
        CoreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5bb2475ed4351e00853264e3", "tg_raiders"); // HK-416
        CoreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5447a9cd4bdc2dbd208b4567", "tg_raiders"); // M4A1
        CoreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5d43021ca4b9362eab4b5e25", "tg_raiders"); // TX-15
        CoreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5b0bbe4e5acfc40dc528a72d", "tg_raiders"); // SA-58
        CoreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5dcbd56fdbd3d91b3e5468d5", "tg_raiders"); // MDR 7,62
        CoreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5c488a752e221602b412af63", "tg_raiders"); // MDR 5,56
        CoreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5a367e5dc4a282000e49738f", "tg_raiders"); // RSASS
        CoreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5aafa857e5b5b00018480968", "tg_raiders"); // M1A
        CoreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5cc82d76e24e8d00134b4b83", "tg_raiders"); // P90
        CoreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5926bb2186f7744b1c6c6e60", "tg_raiders"); // MP5
        CoreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5f2a9575926fd9352339381f", "tg_raiders"); // RFB
        CoreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5fc3f2d5900b1d5091531e57", "tg_raiders"); // Vector 9mm
        CoreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "58948c8e86f77409493f7266", "tg_raiders"); // MPX
        CoreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5a7828548dc32e5a9c28b516", "tg_raiders"); // M870
        CoreMod.AddEquipmentToLoadout("FirstPrimaryWeapon", "5e870397991fd70db46995c8", "tg_raiders"); // Mossberg
        CoreMod.AddEquipmentToLoadout("Holster", "5a7ae0c351dfba0017554310", "tg_raiders"); // Glock17
        CoreMod.AddEquipmentToLoadout("Holster", "5b1fa9b25acfc40018633c01", "tg_raiders"); // Glock18C
        CoreMod.AddEquipmentToLoadout("Holster", "56d59856d2720bd8418b456a", "tg_raiders"); //P226

    }

    static botInitialization()
    {
        BotsInit.createBots();
        BotsInit.createBotEquipment();
    }
}


module.exports = BotsInit;