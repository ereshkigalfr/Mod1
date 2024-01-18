/*
エレシュキガル
*/
import { LauncherCallbacks } from "@spt-aki/callbacks/LauncherCallbacks";
import { LauncherController } from "@spt-aki/controllers/LauncherController";
import { IEmptyRequestData } from "@spt-aki/models/eft/common/IEmptyRequestData";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { SaveServer } from "@spt-aki/servers/SaveServer";
import { HttpResponseUtil } from "@spt-aki/utils/HttpResponseUtil";
import { Watermark } from "@spt-aki/utils/Watermark";
import { inject, injectable } from "tsyringe";

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