import {EventsParameters} from "./EventDispatcher";

export default interface EventSubscriber {
    getSubscribedEvents<K extends keyof EventsParameters>(): [keyof EventsParameters, (...args: EventsParameters[keyof EventsParameters]) => void][]
}

export type EventListener<K extends keyof EventsParameters> = (...args: EventsParameters[K]) => void
