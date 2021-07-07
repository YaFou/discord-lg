import EventDispatcher, {EventsParameters} from "./EventDispatcher";
import EventSubscriber, {EventListener} from "./EventSubscriber";

test('should dispatch event to one listener', () => {
    const listener = jest.fn()

    const subscriber: EventSubscriber = {
        getSubscribedEvents: () => [['newDay', listener]]
    }

    const dispatcher = new EventDispatcher(subscriber)
    dispatcher.dispatch('newDay', 1)
    expect(listener).toBeCalledWith(1)
})

test('should dispatch event to two listeners', () => {
    const listener1 = jest.fn()
    const listener2 = jest.fn()

    const subscriber: EventSubscriber = {
        getSubscribedEvents() {
            return [
                ['newDay', listener1],
                ['newDay', listener2]
            ]
        }
    }

    const dispatcher = new EventDispatcher(subscriber)
    dispatcher.dispatch('newDay', 1)
    expect(listener1).toBeCalledWith(1)
    expect(listener2).toBeCalledWith(1)
})
