import {CategoryChannel, Client, Guild, Message, TextChannel, VoiceChannel} from 'discord.js'
import {FileTranslator, trans} from "./Translator";
import {JsonEncoder} from "./Encoder";
import GuildManager from "./discord/GuildManager";
import DiscordInteractor from "./discord/DiscordInteractor";
import Command from "./commands/Command";
import NewGameCommand from "./commands/NewGameCommand";
import HelpCommand from "./commands/HelpCommand";
import StartCommand from "./commands/StartCommand";
import {FileStore, GameEntry, GuildEntry} from "./Store";
import ClearChannelsCommand from "./commands/ClearChannelsCommand";
import Game from "./game/Game";
import Room from "./game/Room";
import RolesCommand from "./commands/RolesCommand";

type Options = {
    client: Client,
    token: string,
    translationsDirectory: string,
    commandPrefix?: string,
    dataDirectory: string
}

export default class Kernel {
    readonly client: Client
    public readonly translator: FileTranslator
    private readonly token: string
    private readonly guildManagers: Map<Guild, GuildManager> = new Map()
    readonly commands: Command[]
    private readonly commandPrefix: string
    private helpCommand: Command
    readonly store: FileStore

    constructor(options: Options) {
        this.client = options.client
        this.token = options.token
        const encoder = new JsonEncoder()
        this.translator = new FileTranslator(options.translationsDirectory + '/fr.json', encoder)
        this.commandPrefix = options.commandPrefix ?? '!lg'
        this.store = new FileStore(options.dataDirectory + '/data.json', encoder)

        this.commands = [
            this.helpCommand = new HelpCommand(this),
            new NewGameCommand(this),
            new StartCommand(this),
            new ClearChannelsCommand(this),
            new RolesCommand(this)
        ]

        this.registerGuildManagers().then(() => this.client.on('message', this.onMessage.bind(this)))
    }

    private async registerGuildManagers() {
        const games = this.store.getAll<GameEntry>('game')

        this.store.getAll<GuildEntry>('guild').map(async entry => {
            const guild = await this.client.guilds.fetch(entry.id)
            const categoryChannel = await this.client.channels.fetch(entry.categoryChannelId)
            const fallbackChannel = await this.client.channels.fetch(entry.fallbackChannelId)

            if (!(categoryChannel instanceof CategoryChannel) || !(fallbackChannel instanceof VoiceChannel)) {
                return
            }

            const guildManager = new GuildManager(
                this,
                guild,
                categoryChannel,
                fallbackChannel
            )

            const filteredGames = games.filter(game => game.guildId === guild.id)
            for (const {room} of filteredGames) {
                const textChannel = await this.client.channels.fetch(room.textChannel)
                const voiceChannel = await this.client.channels.fetch(room.voiceChannel)

                if (!(textChannel instanceof TextChannel) || !(voiceChannel instanceof VoiceChannel)) {
                    continue
                }

                guildManager.pushGame(new Game(new Room(
                    this,
                    room.id,
                    textChannel,
                    voiceChannel
                ), this.client))
            }

            this.guildManagers.set(guild, guildManager)
        })
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
                await command.execute(message)

                return
            }
        }

        if (!(message.channel instanceof TextChannel)) {
            return
        }

        await this.createInteractor(message.channel).reply(message, trans('commands.unknown', {}))
    }
}
