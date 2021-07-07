import {CategoryChannel, Guild, VoiceChannel} from "discord.js";
import Game from "../game/Game";
import DiscordRoom from "./DiscordRoom";
import Kernel from "../Kernel";
import {trans} from "../Translator";

export default class GuildManager {
    private games: Game[] = []

    constructor(private kernel: Kernel, private guild: Guild, private categoryChannel: CategoryChannel, private fallbackChannel: VoiceChannel) {
    }

    async newGame(): Promise<Game> {
        const id = this.findNextRoomId()
        const name = this.kernel.translator.translate(trans('game.global.roomName', {id}))
        const textChannel = await this.guild.channels.create(name, {type: 'text', parent: this.categoryChannel})
        const voiceChannel = await this.guild.channels.create(name, {type: 'voice', parent: this.categoryChannel})
        const room = new DiscordRoom(this.kernel, id, textChannel, voiceChannel)

        const game = new Game(room)
        this.games.push(game)

        return game
    }

    private findNextRoomId(): number {
        let id = 1

        this.games.forEach(game => {
            const room = game.room

            if (room instanceof DiscordRoom && room.id !== id) {
                return id
            }

            id++
        })

        return id
    }
}
