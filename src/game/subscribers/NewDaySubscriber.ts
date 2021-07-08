import EventSubscriber, {EventListener} from "../dispatcher/EventSubscriber";
import {EventsParameters} from "../dispatcher/EventDispatcher";
import Room from "../Room";
import {trans} from "../../Translator";
import {GameState} from "../Game";

export default class NewDaySubscriber implements EventSubscriber {
    constructor(private room: Room, private state: GameState) {
    }

    getSubscribedEvents(): [keyof EventsParameters, EventListener<keyof EventsParameters>][] {
        return [['newDay', this.onNewDay]]
    }

    private onNewDay(): void {
        this.room.sendMessage(trans('game.newDay', {day: ++this.state.day}))
    }
}
