import EventSubscriber, {EventListener} from "../dispatcher/EventSubscriber";
import EventDispatcher, {EventsParameters} from "../dispatcher/EventDispatcher";
import Room from "../Room";
import Game, {GameState} from "../Game";
import {trans} from "../../Translator";
import Choice from "../interactions/Choice";
import {removeElement} from "../../Util";
import {WITCH_CHOICE_TIME} from "../../Settings";
import {Roles} from "../Role";

export default class WitchSubscriber implements EventSubscriber {
    constructor(private room: Room, private game: Game, private state: GameState, private dispatcher: EventDispatcher) {
    }

    getSubscribedEvents(): [keyof EventsParameters, EventListener<keyof EventsParameters>][] {
        return [['witchWakeUp', this.onWitchWakeUp]]
    }

    private async onWitchWakeUp() {
        if (!this.game.hasRole(Roles.WITCH)) {
            await this.dispatcher.dispatch('nextTurn')

            return
        }

        const playerDead = this.state.deadByWerewolves;
        await this.room.sendMessage(trans('game.witch.deadByWerewolves', {player: playerDead.user.toString()}))

        const ACTION_REVIVE = trans('game.role.witch.action.revive', {})
        const ACTION_KILL = trans('game.role.witch.action.kill', {})
        const ACTION_NONE = trans('game.role.witch.action.none', {})

        const choice = new Choice(trans('game.witch.title', {}), [ACTION_REVIVE, ACTION_KILL, ACTION_NONE], WITCH_CHOICE_TIME)
        const selectedChoice = await this.room.sendChoice(choice)
            .setDefaultChoice(ACTION_NONE)

        if (selectedChoice === ACTION_NONE) {
            await this.room.sendMessage(trans('game.role.witch.message.none', {}))
        } else if (selectedChoice === ACTION_REVIVE) {
            this.state.deaths = removeElement(this.state.deaths, playerDead)
            this.state.deadByWerewolves = null
            await this.room.sendMessage(trans('game.role.witch.message.revive', {player: playerDead.user.toString()}))
        } else {

        }

        await this.dispatcher.dispatch('nextTurn')
    }
}
