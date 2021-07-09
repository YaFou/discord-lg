import EventSubscriber, {EventListener} from "../dispatcher/EventSubscriber";
import EventDispatcher, {EventsParameters} from "../dispatcher/EventDispatcher";
import Room from "../Room";
import {trans} from "../../Translator";
import {GameState} from "../Game";

export default class NewDaySubscriber implements EventSubscriber {
    constructor(private room: Room, private state: GameState, private dispatcher: EventDispatcher) {
    }

    getSubscribedEvents(): [keyof EventsParameters, EventListener<keyof EventsParameters>][] {
        return [['newDay', this.onNewDay]]
    }

    private async onNewDay() {
        await this.room.sendMessage(trans('game.newDay', {day: ++this.state.day}))

        for (const death of this.state.deaths) {
            await this.dispatcher.dispatch('playerDead', death)
        }

        this.state.deaths = []
    }
}
