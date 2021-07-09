import EventSubscriber, {EventListener} from "../dispatcher/EventSubscriber";
import {EventsParameters} from "../dispatcher/EventDispatcher";
import Game from "../Game";
import Room from "../Room";
import {Block} from "../../Interactor";
import {trans} from "../../Translator";

export default class StartSubscriber implements EventSubscriber {
    getSubscribedEvents(): [keyof EventsParameters, EventListener<keyof EventsParameters>][] {
        return [
            ['start', this.onStart]
        ];
    }

    private onStart() {
        this.game.getPlayers().forEach(player => {
            const block = new Block(trans('game.role.mp', {role: player.role.name}))
                .setDescription(player.role.description)

            this.room.sendPrivateMessage(player, block)
        })
    }

    constructor(private game: Game, private room: Room) {
    }
}
