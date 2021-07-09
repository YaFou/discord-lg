import EventSubscriber, {EventListener} from "../dispatcher/EventSubscriber";
import {EventsParameters} from "../dispatcher/EventDispatcher";
import Room from "../Room";
import Game from "../Game";
import {Roles} from "../Role";
import {trans} from "../../Translator";
import {ORACLE_CHOICE_TIME} from "../../Settings";
import PlayerChoice from "../interactions/PlayerChoice";

export default class LittleGirlSubscriber implements EventSubscriber {
    constructor(private room: Room, private game: Game) {
    }

    getSubscribedEvents(): [keyof EventsParameters, EventListener<keyof EventsParameters>][] {
        return [['oracleWakeUp', this.onOracleWakeUp]]
    }

    private async onOracleWakeUp() {
        if (!this.game.hasRole(Roles.oracle)) {
            return
        }

        const players = this.game.getPlayersByNotRole(Roles.oracle);
        const choice = new PlayerChoice(trans('game.oracle.title', {}), players, ORACLE_CHOICE_TIME)
        const player = await this.room.sendChoice(choice)

        if (!player) {
            await this.room.sendMessage(trans('game.oracle.noExposed', {}))

            return
        }

        await this.room.sendMessage(trans('game.oracle.exposeRole', {
            player: player.user.toString(),
            role: player.role.name
        }))
    }
}
