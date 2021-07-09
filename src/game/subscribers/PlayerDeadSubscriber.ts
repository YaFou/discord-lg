import EventSubscriber, {EventListener} from "../dispatcher/EventSubscriber";
import {EventsParameters} from "../dispatcher/EventDispatcher";
import Player from "../Player";
import Room from "../Room";
import {trans} from "../../Translator";
import Game from "../Game";

export default class PlayerDeadSubscriber implements EventSubscriber {
    getSubscribedEvents(): [keyof EventsParameters, EventListener<keyof EventsParameters>][] {
        return [
            ['playerDead', this.onPlayerDead]
        ];
    }

    private async onPlayerDead(player: Player) {
        await this.room.sendMessage(trans('game.playerDead', {
            player: player.user.toString(),
            role: player.role.name
        }))

        this.game.removePlayer(player)
    }

    constructor(private room: Room, private game: Game) {
    }
}
