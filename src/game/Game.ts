import Room from "./Room";
import EventDispatcher from "./dispatcher/EventDispatcher";
import NewDaySubscriber from "./subscribers/NewDaySubscriber";
import SunsetSubscriber from "./subscribers/SunsetSubscriber";
import Player from "./Player";
import WerewolvesVoteSubscriber from "./subscribers/WerewolvesVoteSubscriber";
import Role, {VILLAGE_CAMP, WEREWOLVES_CAMP} from "./Role";

export default class Game {
    state: GameState
    private dispatcher: EventDispatcher
    private players: Player[]

    constructor(readonly room: Room) {
        this.room.setGame(this)

        this.state = {
            status: GameStatus.WAITING,
            deaths: [],
            day: 1
        }
    }

    async start() {
        this.state.status = GameStatus.PLAYING
        await this.room.lockToRole(...VILLAGE_CAMP, ...WEREWOLVES_CAMP)

        this.dispatcher = new EventDispatcher()
        this.dispatcher.addSubscribers(
            new NewDaySubscriber(this.room, this.state),
            new SunsetSubscriber(this.dispatcher, this.room),
            new WerewolvesVoteSubscriber(this.dispatcher, this.room, this.players, this.state)
        )

        this.dispatcher.dispatch('sunset')
    }

    setPlayers(players: Player[]) {
        this.players = players
    }

    filterPlayersByRoles(...roles: Role[]): Player[] {
        return this.players.filter(player => !roles.includes(player.role))
    }
}

export type GameState = {
    status: GameStatus,
    deaths: Player[]
    day: number
}

export enum GameStatus {
    WAITING,
    PLAYING,
    FINISHED
}
