/*
エレシュキガル
*/

class akiFunctions 
{

    static generateBot(bot, role) 
    {
        // generate bot
        const node = DatabaseServer.tables.bots.types[role.toLowerCase()];
        const levelResult = BotController.generateRandomLevel(node.experience.level.min, node.experience.level.max);

        bot.Info.Nickname = `${RandomUtil.getArrayValue(node.firstName)} ${RandomUtil.getArrayValue(node.lastName) || ""}`;
        bot.Info.Experience = levelResult.exp;
        bot.Info.Level = levelResult.level;
        bot.Info.Settings.Experience = RandomUtil.getInt(node.experience.reward.min, node.experience.reward.max);
        bot.Info.Settings.StandingForKill = node.experience.standingForKill;
        bot.Info.Voice = RandomUtil.getArrayValue(node.appearance.voice);
        bot.Health = BotController.generateHealth(node.health);
        bot.Skills = BotController.generateSkills(node.skills);
        bot.Customization.Head = RandomUtil.getArrayValue(node.appearance.head);
        bot.Customization.Body = RandomUtil.getArrayValue(node.appearance.body);
        bot.Customization.Feet = RandomUtil.getArrayValue(node.appearance.feet);
        bot.Customization.Hands = RandomUtil.getArrayValue(node.appearance.hands);
        bot.Inventory = BotGenerator.generateInventory(node.inventory, node.chances, node.generation);

        // add dogtag to PMC's
        if (role === "usec" || role === "bear") 
        {
            bot = BotController.generateDogtag(bot);
        }

        if (role === "tg_followers" || role === "tg_raiders") 
        {
            bot.Info.Side = "Terragroup";
        }

        if (role === "tg_boss") 
        {
            bot = callbackUtils.getBlazeDogtag(bot)
        }

        // generate new bot ID
        bot = BotController.generateId(bot);

        // generate new inventory ID
        bot = InventoryHelper.generateInventoryID(bot);

        return bot;
    }
}


module.exports = akiFunctions;