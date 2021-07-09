import EventSubscriber, {EventListener} from "./EventSubscriber";
import Player from "../Player";

export default class EventDispatcher {
    private listeners: [keyof EventsParameters, EventListener<keyof EventsParameters>[]][] = []

    private getListeners<K extends keyof EventsParameters>(event: K): EventListener<K>[] {
        const events = this.listeners.filter(currentEvent => currentEvent[0] === event)

        if (!events.length) {
            const newEntry: [K, EventListener<K>[]] = [event, []];
            this.listeners.push(newEntry)

            return newEntry[1]
        }

        return events[0][1]
    }

    addSubscribers(...subscribers: EventSubscriber[]): this {
        subscribers.forEach(subscriber => {
            subscriber.getSubscribedEvents().forEach(event => {
                this.getListeners(event[0]).push(event[1].bind(subscriber))
            })
        })

        return this
    }

    async dispatch<K extends keyof EventsParameters>(event: K, ...args: EventsParameters[K]) {
        const listeners = this.getListeners(event)

        for (const listener of listeners) {
            await listener(...args)
        }
    }
}

export interface EventsParameters {
    newDay: []
    sunset: []
    werewolvesWakeUp: []
    playerDead: [Player]
    nextTurn: []
    villageVote: []
    start: []
}
