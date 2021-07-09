import EventSubscriber, {EventListener} from "../dispatcher/EventSubscriber";
import {EventsParameters} from "../dispatcher/EventDispatcher";
import Room from "../Room";
import Game, {GameState, GameTurn} from "../Game";
import {Roles} from "../Role";
import {trans} from "../../Translator";
import {Message} from "discord.js";

export default class LittleGirlSubscriber implements EventSubscriber {
    constructor(private room: Room, private game: Game, private state: GameState) {
    }

    getSubscribedEvents(): [keyof EventsParameters, EventListener<keyof EventsParameters>][] {
        return [['message', this.onMessage]]
    }

    private async onMessage(message: Message) {
        if (!this.game.hasRole(Roles.littleGirl) || this.state.turn !== GameTurn.WEREWOLVES_VOTE) {
            return
        }

        this.game.getPlayersByRole(Roles.littleGirl).forEach(littleGirl => {
            this.room.sendPrivateMessage(littleGirl, trans('game.werewolvesVote.littleGirl', {message: message.cleanContent}))
        })
    }
}
