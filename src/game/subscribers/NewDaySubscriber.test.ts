import NewDaySubscriber from "./NewDaySubscriber";
import Room from "../Room";
import {trans} from "../../Translator";

test('should send message', () => {
    const send = jest.fn()
    const channel: Room = {sendMessage: send}

    const subscriber = new NewDaySubscriber(channel)
    subscriber.onNewDay(1)
    expect(send).toBeCalledWith(trans('game.global.newDay', {day: 1}))
})