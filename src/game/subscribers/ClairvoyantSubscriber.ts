import EventSubscriber, {EventListener} from "../dispatcher/EventSubscriber";
import {EventsParameters} from "../dispatcher/EventDispatcher";
import Room from "../Room";
import Game, {GameState, GameTurn} from "../Game";
import {Roles} from "../Role";
import {trans} from "../../Translator";
import {Message} from "discord.js";
import {CLAIRVOYANT_CHOICE_TIME} from "../../Settings";
import Choice from "../interactions/Choice";
import PlayerChoice from "../interactions/PlayerChoice";

export default class LittleGirlSubscriber implements EventSubscriber {
    constructor(private room: Room, private game: Game) {
    }

    getSubscribedEvents(): [keyof EventsParameters, EventListener<keyof EventsParameters>][] {
        return [['clairvoyantWakeUp', this.onClairvoyantWakeUp]]
    }

    private async onClairvoyantWakeUp() {
        if (!this.game.hasRole(Roles.clairvoyant)) {
            return
        }

        const players = this.game.getPlayersByNotRole(Roles.clairvoyant);
        const choice = new PlayerChoice(trans('game.clairvoyant.title', {}), players, CLAIRVOYANT_CHOICE_TIME)
        const player = await this.room.sendChoice(choice)

        if (!player) {
            await this.room.sendMessage(trans('game.clairvoyant.noExposed', {}))

            return
        }

        await this.room.sendMessage(trans('game.clairvoyant.exposeRole', {player: player.user.toString(), role: player.role.name}))
    }
}
