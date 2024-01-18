/*
エレシュキガル
*/
import { inject, injectable } from "tsyringe";

import { BotInventoryGenerator } from "@spt-aki/generators/BotInventoryGenerator";
import { BotLevelGenerator } from "@spt-aki/generators/BotLevelGenerator";
import { BotDifficultyHelper } from "@spt-aki/helpers/BotDifficultyHelper";
import { BotHelper } from "@spt-aki/helpers/BotHelper";
import { ProfileHelper } from "@spt-aki/helpers/ProfileHelper";
import { WeightedRandomHelper } from "@spt-aki/helpers/WeightedRandomHelper";
import {
    Common,
    Health as PmcHealth,
    IBaseJsonSkills,
    IBaseSkill,
    IBotBase,
    Info,
    Skills as botSkills,
} from "@spt-aki/models/eft/common/tables/IBotBase";
import { Appearance, Health, IBotType } from "@spt-aki/models/eft/common/tables/IBotType";
import { Item, Upd } from "@spt-aki/models/eft/common/tables/IItem";
import { BaseClasses } from "@spt-aki/models/enums/BaseClasses";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { MemberCategory } from "@spt-aki/models/enums/MemberCategory";
import { BotGenerationDetails } from "@spt-aki/models/spt/bots/BotGenerationDetails";
import { IBotConfig } from "@spt-aki/models/spt/config/IBotConfig";
import { IPmcConfig } from "@spt-aki/models/spt/config/IPmcConfig";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { BotEquipmentFilterService } from "@spt-aki/services/BotEquipmentFilterService";
import { LocalisationService } from "@spt-aki/services/LocalisationService";
import { SeasonalEventService } from "@spt-aki/services/SeasonalEventService";
import { HashUtil } from "@spt-aki/utils/HashUtil";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { RandomUtil } from "@spt-aki/utils/RandomUtil";
import { TimeUtil } from "@spt-aki/utils/TimeUtil";


//TGS Imports
import { getBlazeDogtag } from "./getBlazeDogtag";

@injectable()

export class TGS_GenerateBot extends BotCallbacks
{

    

    public override generateBot(
        sessionId: string,
        bot: IBotBase,
        botJsonTemplate: IBotType,
        botGenerationDetails: BotGenerationDetails,
    ): IBotBase
    {
        const botRole = botGenerationDetails.role.toLowerCase();
        const botLevel = this.botLevelGenerator.generateBotLevel(
            botJsonTemplate.experience.level,
            botGenerationDetails,
            bot,
        );

        if (!botGenerationDetails.isPlayerScav)
        {
            this.botEquipmentFilterService.filterBotEquipment(
                sessionId,
                botJsonTemplate,
                botLevel.level,
                botGenerationDetails,
            );
        }

        bot.Info.Nickname = this.generateBotNickname(
            botJsonTemplate,
            botGenerationDetails.isPlayerScav,
            botRole,
            sessionId,
        );

        const skipChristmasItems = !this.seasonalEventService.christmasEventEnabled();
        if (skipChristmasItems)
        {
            this.seasonalEventService.removeChristmasItemsFromBotInventory(
                botJsonTemplate.inventory,
                botGenerationDetails.role,
            );
        }

        // Remove hideout data if bot is not a PMC or pscav
        if (!(botGenerationDetails.isPmc || botGenerationDetails.isPlayerScav))
        {
            bot.Hideout = null;
        }

        bot.Info.Experience = botLevel.exp;
        bot.Info.Level = botLevel.level;
        bot.Info.Settings.Experience = this.randomUtil.getInt(
            botJsonTemplate.experience.reward.min,
            botJsonTemplate.experience.reward.max,
        );
        bot.Info.Settings.StandingForKill = botJsonTemplate.experience.standingForKill;
        bot.Info.Voice = this.randomUtil.getArrayValue(botJsonTemplate.appearance.voice);
        bot.Health = this.generateHealth(botJsonTemplate.health, bot.Info.Side === "Savage");
        bot.Skills = this.generateSkills(<any>botJsonTemplate.skills); // TODO: fix bad type, bot jsons store skills in dict, output needs to be array

        this.setBotAppearance(bot, botJsonTemplate.appearance, botGenerationDetails);

        bot.Inventory = this.botInventoryGenerator.generateInventory(
            sessionId,
            botJsonTemplate,
            botRole,
            botGenerationDetails.isPmc,
            botLevel.level,
        );

        if (this.botHelper.isBotPmc(botRole))
        {
            this.getRandomisedGameVersionAndCategory(bot.Info);
            bot = this.generateDogtag(bot);
            bot.Info.IsStreamerModeAvailable = true; // Set to true so client patches can pick it up later - client sometimes alters botrole to assaultGroup
        }

        if(botRole == "tg_boss")
        {
            bot.Info.Side = "Terragroup";
            bot = getBlazeDogtag.get(bot)

        }

        if(botRole == "tg_follower" || "tg_raider")
        {
            bot.Info.Side = "Terragroup";

        }

        // generate new bot ID
        bot = this.generateId(bot);

        // generate new inventory ID
        bot = this.generateInventoryID(bot);

        return bot;
    }
}