import EventSubscriber, {EventListener} from "./EventSubscriber";

export default class EventDispatcher {
    private listeners: [keyof EventsParameters, EventListener<keyof EventsParameters>[]][] = []

    constructor(...subscribers: EventSubscriber[]) {
        subscribers.forEach(subscriber => {
            subscriber.getSubscribedEvents().forEach(event => {
                this.getListeners(event[0]).push(event[1].bind(subscriber))
            })
        })
    }

    private getListeners<K extends keyof EventsParameters>(event: K): EventListener<K>[] {
        const events = this.listeners.filter(currentEvent => currentEvent[0] === event)

        if (!events.length) {
            const newEntry: [K, EventListener<K>[]] = [event, []];
            this.listeners.push(newEntry)

            return newEntry[1]
        }

        return events[0][1]
    }

    dispatch<K extends keyof EventsParameters>(event: K, ...args: EventsParameters[K]): void {
        const listeners = this.getListeners(event)

        listeners.forEach(listener => {
            listener(...args)
        })
    }
}

export interface EventsParameters {
    newDay: [number]
}
