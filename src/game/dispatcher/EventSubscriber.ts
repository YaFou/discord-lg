import {EventsParameters} from "./EventDispatcher";

export default interface EventSubscriber {
    getSubscribedEvents<K extends keyof EventsParameters>(): [keyof EventsParameters, EventListener<keyof EventsParameters>][]
}

export type EventListener<K extends keyof EventsParameters> = (...args: EventsParameters[K]) => void
