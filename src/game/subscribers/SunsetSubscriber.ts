import EventSubscriber, {EventListener} from "../dispatcher/EventSubscriber";
import Room from "../Room";
import EventDispatcher, {EventsParameters} from "../dispatcher/EventDispatcher";
import {trans} from "../../Translator";

export default class SunsetSubscriber implements EventSubscriber {
    constructor(private room: Room) {
    }

    getSubscribedEvents(): [keyof EventsParameters, EventListener<keyof EventsParameters>][] {
        return [['sunset', this.onSunset]]
    }

    private async onSunset() {
        await this.room.sendMessage(trans('game.sunset', {}))
    }
}
