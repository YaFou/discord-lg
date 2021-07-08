import {CategoryChannel, Guild, GuildMember, TextChannel, VoiceChannel} from "discord.js";
import Game, {GameState} from "../game/Game";
import Room from "../game/Room";
import Kernel from "../Kernel";
import {trans} from "../Translator";
import EventDispatcher from "../game/dispatcher/EventDispatcher";
import NewDaySubscriber from "../game/subscribers/NewDaySubscriber";
import Role, {canBeMany, VILLAGE_CAMP, WEREWOLVES_CAMP} from "../game/Role";
import {randomElement, removeElement, shuffle} from "../Util";
import Player from "../game/Player";

export default class GuildManager {
    private games: Game[] = []

    constructor(private kernel: Kernel, private guild: Guild, private categoryChannel: CategoryChannel, private fallbackChannel: VoiceChannel) {
    }

    async newGame(): Promise<Game> {
        const id = this.findNextRoomId()
        const name = this.kernel.translator.translate(trans('game.global.roomName', {id}))
        const textChannel = await this.guild.channels.create(name, {type: 'text', parent: this.categoryChannel})
        const voiceChannel = await this.guild.channels.create(name, {type: 'voice', parent: this.categoryChannel})
        const room = new Room(this.kernel, id, textChannel, voiceChannel)

        const game = new Game(room)
        this.games.push(game)

        return game
    }

    private findNextRoomId(): number {
        let id = 1

        this.games.forEach(game => {
            if (game.room.id !== id) {
                return id
            }

            id++
        })

        return id
    }

    findGameFromTextChannel(channel: TextChannel): Game {
        for (const game of this.games) {
            if (game.room.textChannel === channel) {
                return game
            }
        }

        return null
    }

    startGame(game: Game, members: GuildMember[]) {
        let villageCamp = [...VILLAGE_CAMP]
        let werewolvesCamp = [...WEREWOLVES_CAMP]
        const villagersTotal = Math.ceil(members.length / 2)
        let villagersCount = 0

        const players = members.map(member => {
            let role = villagersCount === villagersTotal ? randomElement(werewolvesCamp) : randomElement(villageCamp);

            if (!canBeMany(role)) {
                removeElement(villageCamp.includes(role) ? villageCamp : werewolvesCamp, role)
            }

            return new Player(member, role)
        })

        game.setPlayers(players)
        game.start()
    }
}
