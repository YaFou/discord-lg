import EventSubscriber, {EventListener} from "../dispatcher/EventSubscriber";
import EventDispatcher, {EventsParameters} from "../dispatcher/EventDispatcher";
import Room from "../Room";
import {WEREWOLVES_CAMP} from "../Role";
import Poll from "../interactions/Poll";
import Player from "../Player";
import {trans} from "../../Translator";
import {GameState} from "../Game";

export default class WerewolvesVoteSubscriber implements EventSubscriber {
    constructor(private dispatcher: EventDispatcher, private room: Room, private players: Player[], private state: GameState) {
    }

    getSubscribedEvents(): [keyof EventsParameters, EventListener<keyof EventsParameters>][] {
        return [
            ['werewolvesWakeUp', this.onWerewolvesWakeUp]
        ];
    }

    private async onWerewolvesWakeUp() {
        await this.room.lockToRole(...WEREWOLVES_CAMP)

        const poll = new Poll(trans('game.werewolvesVote.title', {}), this.players, 30)
            .setLabel(player => player.user.displayName)

        const player = await this.room.sendPoll(poll)
        this.state.deaths.push(player)
        this.dispatcher.dispatch('newDay')
    }
}
