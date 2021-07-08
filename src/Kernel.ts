import {CategoryChannel, Client, Guild, Message, TextChannel, VoiceChannel} from 'discord.js'
import {FileTranslator, trans} from "./Translator";
import {JsonEncoder} from "./Encoder";
import GuildManager from "./discord/GuildManager";
import DiscordInteractor from "./discord/DiscordInteractor";
import Command from "./commands/Command";
import NewGameCommand from "./commands/NewGameCommand";
import HelpCommand from "./commands/HelpCommand";
import StartCommand from "./commands/StartCommand";

type Options = {
    client: Client,
    token: string,
    translationsDirectory: string,
    commandPrefix?: string
}

export default class Kernel {
    readonly client: Client
    public readonly translator: FileTranslator
    private readonly token: string
    private readonly guildManagers: Map<Guild, GuildManager> = new Map()
    readonly commands: Command[]
    private readonly commandPrefix: string
    private helpCommand: Command

    constructor(options: Options) {
        this.client = options.client
        this.token = options.token
        const encoder = new JsonEncoder()
        this.translator = new FileTranslator(options.translationsDirectory + '/fr.json', encoder)
        this.commandPrefix = options.commandPrefix ?? '!lg'

        this.commands = [
            new NewGameCommand(this),
            this.helpCommand = new HelpCommand(this),
            new StartCommand(this)
        ]

        this.registerGuildManagers().then(() => this.client.on('message', this.onMessage.bind(this)))
    }

    private async registerGuildManagers() {
        // TODO
        const guild = await this.client.guilds.fetch(process.env.GUILD_ID)
        const categoryChannel = await this.client.channels.fetch(process.env.CATEGORY_CHANNEL_ID)
        const fallbackChannel = await this.client.channels.fetch(process.env.FALLBACK_CHANNEL_ID)

        if (!(categoryChannel instanceof CategoryChannel) || !(fallbackChannel instanceof VoiceChannel)) {
            return
        }

        this.guildManagers.set(guild, new GuildManager(this, guild, categoryChannel, fallbackChannel))
    }

    async login() {
        await this.client.login(this.token)
    }

    getGuildManager(guild: Guild): GuildManager {
        return this.guildManagers.get(guild)
    }

    createInteractor(channel: TextChannel) {
        return new DiscordInteractor(this, channel)
    }

    private async onMessage(message: Message) {
        if (!message.content.startsWith(this.commandPrefix)) {
            return
        }

        const commandParts = message.content.split(' ')

        if (commandParts.length === 1) {
            this.helpCommand.execute(message)

            return
        }

        for (const command of this.commands) {
            if (command.name === commandParts[1]) {
                command.execute(message)

                return
            }
        }

        if (!(message.channel instanceof TextChannel)) {
            return
        }

        await this.createInteractor(message.channel).reply(message, trans('commands.unknown', {}))
    }
}
