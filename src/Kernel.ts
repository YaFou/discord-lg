import {CategoryChannel, Client, Guild, Message, TextChannel, VoiceChannel} from 'discord.js'
import {FileTranslator} from "./Translator";
import {JsonEncoder} from "./Encoder";
import GuildManager from "./discord/GuildManager";
import DiscordInteractor from "./discord/DiscordInteractor";
import Command from "./commands/Command";
import NewGameCommand from "./commands/NewGameCommand";

type Options = {
    client: Client,
    token: string,
    translationsDirectory: string,
    commandPrefix?: string
}

export default class Kernel {
    private readonly client: Client
    public readonly translator: FileTranslator
    private readonly token: string
    private readonly guildManagers: Map<Guild, GuildManager> = new Map()
    private readonly commands: Command[] = [
        new NewGameCommand(this)
    ]
    private readonly commandPrefix: string

    constructor(options: Options) {
        this.client = options.client
        this.token = options.token
        const encoder = new JsonEncoder()
        this.translator = new FileTranslator(options.translationsDirectory + '/fr.json', encoder)
        this.commandPrefix = options.commandPrefix ?? '!lg'
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

    private onMessage(message: Message) {
        if (!message.content.startsWith(this.commandPrefix)) {
            return
        }

        const commandParts = message.content.split(' ')

        for (const command of this.commands) {
            if (command.name === commandParts[1]) {
                command.execute(message)

                return
            }
        }
    }
}
