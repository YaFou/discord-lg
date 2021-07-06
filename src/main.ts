import {Client} from 'discord.js'
import Bot from "./Bot";
import NewGameCommand from "./commands/NewGameCommand";
import {DiscordInteractor} from "./Interactor";
import {DiscordGuildManager} from "./GuildManager";
import Logger from "./Logger";
import {JsonFileStore} from "./Store";
import ClearChannelsCommand from "./commands/ClearChannelsCommand";
import StartCommand from "./commands/StartCommand";
import HelpCommand from "./commands/HelpCommand";
import GameManager from "./game/GameManager";
import RolesCommand from "./commands/RolesCommand";
import {BOT_TOKEN} from "./Settings";

const client = new Client()

const logger = new Logger()
const store = new JsonFileStore('data.json', logger)
store.load()
const interactor = new DiscordInteractor(client)
const guildManager = new DiscordGuildManager(store, client)
const gameManager = new GameManager(interactor, guildManager)

const bot = new Bot(client, interactor, guildManager, store, gameManager)
bot.addCommand(new NewGameCommand(bot))
    .addCommand(new ClearChannelsCommand(bot))
    .addCommand(new StartCommand(bot))
    .setHelpCommand(new HelpCommand(bot))
    .addCommand(new RolesCommand(bot))

client.login(BOT_TOKEN)
logger.info('Bot connected')
