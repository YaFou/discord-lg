import Room from "./Room";
import Player from "./Player";
import {trans} from "../Translator";
import {removeElement} from "../Util";
import {GuildMember} from "discord.js";
import NewDaySubscriber from "./subscribers/NewDaySubscriber";
import SunsetSubscriber from "./subscribers/SunsetSubscriber";
import WerewolvesSubscriber from "./subscribers/WerewolvesSubscriber";
import PlayerDeadSubscriber from "./subscribers/PlayerDeadSubscriber";
import NextTurnSubscriber from "./subscribers/NextTurnSubscriber";
import VillageVoteSubscriber from "./subscribers/VillageVoteSubscriber";
import EventDispatcher from "./dispatcher/EventDispatcher";
import {Role} from "./Role";
import {GAME_DESTROY_TIME} from "../Settings";
import {Block} from "../Interactor";
import StartSubscriber from "./subscribers/StartSubscriber";

export default class Game {
    state: GameState
    private dispatcher: EventDispatcher
    private players: Player[]
    private spectators: GuildMember[] = []

    constructor(readonly room: Room) {
        this.room.setGame(this)

        this.state = {
            status: GameStatus.WAITING,
            deaths: [],
            day: 1,
            turn: null
        }
    }

    async start() {
        this.state.status = GameStatus.PLAYING
        await this.room.clearChannel()
        await this.room.lockToPlayers(this.players)

        this.dispatcher = new EventDispatcher()
        this.dispatcher.addSubscribers(
            new StartSubscriber(this, this.room),
            new NewDaySubscriber(this.room, this.state, this.dispatcher),
            new SunsetSubscriber(this.room),
            new WerewolvesSubscriber(this.dispatcher, this.room, this, this.state),
            new PlayerDeadSubscriber(this.room, this),
            new NextTurnSubscriber(this.state, this.dispatcher, this.room, this),
            new VillageVoteSubscriber(this.room, this.dispatcher, this)
        )

        await this.dispatcher.dispatch('start')
        await this.dispatcher.dispatch('nextTurn')

        const firstRole = this.players.shift().role
        await this.room.sendMessage(trans('game.global.win', {camp: firstRole.camp.name}))
    }

    getSpectators() {
        return this.spectators
    }

    setPlayers(players: Player[]) {
        this.players = players
    }

    filterPlayersByRoles(...roles: Role[]): Player[] {
        return this.players.filter(player => roles.includes(player.role))
    }

    removePlayer(player: Player) {
        this.players = removeElement(this.players, player)
        this.spectators.push(player.user)
    }

    getPlayers(): Player[] {
        return this.players
    }
}

export type GameState = {
    status: GameStatus,
    deaths: Player[]
    day: number,
    turn: GameTurn
}

export enum GameStatus {
    WAITING,
    PLAYING,
    FINISHED
}

export enum GameTurn {
    WEREWOLVES_VOTE,
    VILLAGE_VOTE
}
