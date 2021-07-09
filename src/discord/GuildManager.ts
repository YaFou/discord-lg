import {CategoryChannel, Guild, GuildMember, TextChannel, VoiceChannel} from "discord.js";
import Game from "../game/Game";
import Room from "../game/Room";
import Kernel from "../Kernel";
import {trans} from "../Translator";
import {randomElement, removeElement, shuffle} from "../Util";
import Player from "../game/Player";
import {GameEntry, GuildEntry} from "../Store"
import {Camps, getRolesByCamp} from "../game/Role";
import {GAME_DESTROY_TIME} from "../Settings";

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

        const entryId = `${id}.${textChannel.id}.${voiceChannel.id}`;
        this.kernel.store.create<GameEntry>('game', {
            room: {
                textChannel: textChannel.id,
                voiceChannel: voiceChannel.id,
                id
            },
            id: entryId,
            guildId: this.guild.id
        })

        const guildEntry = this.kernel.store.get<GuildEntry>('guild', this.guild.id)
        guildEntry.games.push(entryId)
        this.kernel.store.save('guild', guildEntry)

        return game
    }

    pushGame(game: Game) {
        this.games.push(game)
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

    async startGame(game: Game, members: GuildMember[]) {
        let villageCamp = [...getRolesByCamp(Camps.VILLAGE)]
        let werewolvesCamp = [...getRolesByCamp(Camps.WEREWOLVES)]
        const villagersTotal = Math.ceil(members.length / 2)
        let villagersCount = 0

        const players = shuffle(members).map(member => {
            let role = villagersCount >= villagersTotal ? randomElement(werewolvesCamp) : randomElement(villageCamp);

            if (!role.canBeMany) {
                removeElement(villageCamp.includes(role) ? villageCamp : werewolvesCamp, role)
            }

            villagersCount++

            return new Player(member, role)
        })

        game.setPlayers(players)
        await game.start()
        await game.room.sendMessage(trans('game.global.channelsDestroy', {seconds: GAME_DESTROY_TIME}))

        setTimeout(async () => {
            await this.deleteGame(game)
        }, GAME_DESTROY_TIME * 1000)
    }

    async deleteGame(game: Game) {
        const {store} = this.kernel
        const {id: roomId, textChannel, voiceChannel} = game.room
        const gameId = `${roomId}.${textChannel.id}.${voiceChannel.id}`
        const gameEntry = store.get<GameEntry>('game', gameId)
        store.delete('game', gameEntry)
        const members = game.room.voiceChannel.members.array()

        for (const member of members) {
            await member.voice.setChannel(this.fallbackChannel)
        }

        await game.room.delete()
        const entry = store.get<GuildEntry>('guild', this.guild.id)
        entry.games = removeElement(entry.games, gameId)
        store.save('guild', entry)
        this.games = removeElement(this.games, game)
    }

    getGames(): Game[] {
        return this.games
    }
}
