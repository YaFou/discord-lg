import EventSubscriber, {EventListener} from "../dispatcher/EventSubscriber";
import EventDispatcher, {EventsParameters} from "../dispatcher/EventDispatcher";
import Game, {GameState, GameTurn} from "../Game";
import {NEXT_TURN_TIME} from "../../Settings";
import Room from "../Room";
import {Camps, getRolesByCamp, Roles} from "../Role";

export default class NextTurnSubscriber implements EventSubscriber {
    constructor(private state: GameState, private dispatcher: EventDispatcher, private room: Room, private game: Game) {
    }

    getSubscribedEvents(): [keyof EventsParameters, EventListener<keyof EventsParameters>][] {
        return [
            ['nextTurn', this.onNextTurn]
        ];
    }

    private async onNextTurn() {
        // await new Promise<void>(resolve => {
        //     setTimeout(async () => {
                const currentTurn = this.state.turn

                if (currentTurn === GameTurn.WEREWOLVES_VOTE) {
                    await this.room.lockToPlayers(this.game.getPlayers())
                    await this.dispatcher.dispatch('newDay')
                }

                if (this.isVictory()) {
                    // resolve()

                    return
                }

                if (currentTurn === null || currentTurn === GameTurn.VILLAGE_VOTE) {
                    await this.dispatcher.dispatch('sunset')
                    await this.room.lockToRole(Roles.clairvoyant)
                    this.state.turn = GameTurn.CLAIRVOYANT
                    await this.dispatcher.dispatch('clairvoyantWakeUp')
                } else if (currentTurn === GameTurn.CLAIRVOYANT) {
                    await this.room.lockToRole(...getRolesByCamp(Camps.WEREWOLVES))
                    this.state.turn = GameTurn.WEREWOLVES_VOTE
                    await this.dispatcher.dispatch('werewolvesWakeUp')
                } else if (currentTurn === GameTurn.WEREWOLVES_VOTE) {
                    this.state.turn = GameTurn.VILLAGE_VOTE
                    await this.dispatcher.dispatch('villageVote')
                }

                // resolve()
        //     }, NEXT_TURN_TIME * 1000)
        // })
    }

    private isVictory() {
        const players = [...this.game.getPlayers()]
        const firstRole = players.shift().role

        for (const player of players) {
            if (player.role !== firstRole) {
                return false
            }
        }

        return true
    }
}