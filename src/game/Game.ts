import Player from "./Player";
import {ChannelsSet} from "../GuildManager";
import {getCamp} from "./Role";

export default class Game {
    state: GameState
    day: number

    constructor(public players: Player[], readonly channelsSet: ChannelsSet) {
        this.state = null
        this.day = 0
    }

    nextState(): GameState {
        this.state = this.state === GameState.VOTE ? GameState.WEREWOLVES : GameState.VOTE

        if (this.state === GameState.VOTE) {
            this.day++
        }

        return this.state
    }

    isFinished(): Boolean {
        let camp = null

        for (const player of this.players) {
            if (!camp) {
                camp = getCamp(player.role)

                continue
            }

            if (camp !== getCamp(player.role)) {
                return false
            }
        }

        return true
    }
}

export enum GameState {
    WEREWOLVES,
    VOTE
}
