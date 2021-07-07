import Player from "./Player";
import {ChannelsSet} from "../GuildManager";
import State from "./states/State";
import WerewolvesState from "./states/WerewolvesState";
import VoteState from "./states/VoteState";
import {GuildMember} from "discord.js";
import {Camp} from "./roles/Role";
import HunterRole from "./roles/HunterRole";
import HunterState from "./states/HunterState";
import ClairvoyantRole from "./roles/ClairvoyantRole";
import ClairvoyanteState from "./states/ClairvoyanteState";
import CupidRole from "./roles/CupidRole";
import CupidState from "./states/CupidState";
import CoupleRole from "./roles/CoupleRole";

export default class Game {
    state: State = null
    day: number = 1
    isNewDay: Boolean
    isSunset: Boolean
    deathThisNight: Player[] = []
    isNight: Boolean = false
    hasDeadHunter: Boolean = false

    constructor(public players: Player[], readonly channelsSet: ChannelsSet) {
    }

    nextState(): State {
        this.isNewDay = false

        if (this.state === null || this.state instanceof VoteState) {
            this.isSunset = true
            this.isNight = true

            if (this.day === 1 && this.hasCupid()) {
                return this.state = new CupidState()
            }

            return this.state = this.hasClairvoyant() ? new ClairvoyanteState() : new WerewolvesState()
        }

        this.isSunset = false

        if (this.state instanceof CupidState) {
            return this.state = this.hasClairvoyant() ? new ClairvoyanteState() : new WerewolvesState()
        }

        if (this.state instanceof ClairvoyanteState) {
            return this.state = new WerewolvesState()
        }

        if (this.state instanceof WerewolvesState) {
            this.isNight = false
            this.newDay()

            if (this.hasDeadHunter) {
                this.hasDeadHunter = false

                return this.state = new HunterState(this.deathThisNight.filter(player => player.role instanceof HunterRole))
            }

            return this.state = new VoteState()
        }

        if (this.state instanceof HunterState) {
            return this.state = new VoteState()
        }
    }

    private hasClairvoyant(): Boolean {
        for (const player of this.players) {
            if (player.role instanceof ClairvoyantRole) {
                return true
            }

            if (player.role instanceof CoupleRole) {
                if (player.role.role instanceof ClairvoyantRole) {
                    return true
                }
            }
        }

        return false
    }

    private hasCupid(): Boolean {
        for (const player of this.players) {
            if (player.role instanceof CupidRole) {
                return true
            }

            if (player.role instanceof CoupleRole) {
                if (player.role.role instanceof CupidRole) {
                    return true
                }
            }
        }

        return false
    }

    private newDay() {
        this.day++
        this.isNewDay = true
    }

    isFinished(): Boolean {
        const camps = this.players.map(player => player.role.camp)

        if (camps.includes(Camp.VILLAGE)) {
            if (!camps.includes(Camp.WEREWOLVES)) {
                return true
            }

            return this.isCoupleWin()
        }

        return true
    }

    isCoupleWin(): Boolean {
        for (const player of this.players) {
            if (!(player.role instanceof CoupleRole)) {
                return false
            }
        }

        return true
    }

    resetDeaths() {
        this.deathThisNight = []
    }

    killPlayer(player: Player, isCouple: Boolean = false) {
        this.players = this.players.filter(currentPlayer => currentPlayer !== player)

        if (this.isNight || this.state instanceof HunterRole) {
            this.deathThisNight.push(player)

            if (player.role instanceof HunterRole) {
                this.hasDeadHunter = true
            }
        }

        if (!isCouple && player.role instanceof CoupleRole) {
            this.killPlayer(player.role.inLoveWith, true)
        }
    }

    getMembers(): GuildMember[] {
        return this.players.map(player => player.member)
    }
}
