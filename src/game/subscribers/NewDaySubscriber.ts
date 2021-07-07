import EventSubscriber from "../dispatcher/EventSubscriber";
import {EventsParameters} from "../dispatcher/EventDispatcher";
import Room from "../Room";
import {trans} from "../../Translator";

export default class NewDaySubscriber implements EventSubscriber {
    constructor(private room: Room) {
    }

    getSubscribedEvents(): [keyof EventsParameters, EventListener<keyof EventsParameters>][] {
        return [['newDay', this.onNewDay]]
    }

    onNewDay(day: number): void {
        this.room.sendMessage(trans('game.global.newDay', {day}))
    }
}

export type EventListener<K extends keyof EventsParameters> = (...args: EventsParameters[K]) => void
