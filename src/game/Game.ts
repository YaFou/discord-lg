import Player from "./Player";
import {ChannelsSet} from "../GuildManager";
import State from "./states/State";
import WerewolvesState from "./states/WerewolvesState";
import VoteState from "./states/VoteState";
import {GuildMember} from "discord.js";
import {Camp} from "./roles/Role";

export default class Game {
    state: State = null
    day: number = 1
    isNewDay: Boolean
    isSunset: Boolean
    deathThisNight: Player[] = []
    isNight: Boolean = false

    constructor(public players: Player[], readonly channelsSet: ChannelsSet) {
    }

    nextState(): State {
        this.state = this.state instanceof WerewolvesState ? new VoteState() : new WerewolvesState()
        this.isNewDay = this.state instanceof VoteState
        this.isSunset = this.state instanceof WerewolvesState
        this.isNight = this.state instanceof WerewolvesState

        if (this.state instanceof VoteState) {
            this.day++
        }

        return this.state
    }

    isFinished(): Boolean {
        const camps = this.players.map(player => player.role.camp)

        return camps.includes(Camp.VILLAGE) ? !camps.includes(Camp.WEREWOLVES) : true
    }

    resetDeaths() {
        this.deathThisNight = []
    }

    killPlayer(player: Player) {
        this.players = this.players.filter(currentPlayer => currentPlayer !== player)

        if (this.isNight) {
            this.deathThisNight.push(player)
        }
    }

    getMembers(): GuildMember[] {
        return this.players.map(player => player.member)
    }
}
