import EventSubscriber, {EventListener} from "../dispatcher/EventSubscriber";
import {EventsParameters} from "../dispatcher/EventDispatcher";
import Player from "../Player";
import Room from "../Room";
import {trans} from "../../Translator";
import Game from "../Game";
import {Roles} from "../Role";
import PlayerChoice from "../interactions/PlayerChoice";
import {HUNTER_CHOICE_TIME} from "../../Settings";

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

        if (player.role === Roles.HUNTER) {
            const choice = new PlayerChoice(trans('game.hunter.introduction', {}), this.game.getPlayers(), HUNTER_CHOICE_TIME)
                .setRandomOnNoChoice()
                .setPossibleInteractors([player.user])

            const shotPlayer = await this.room.sendChoice(choice)
            this.game.removePlayer(shotPlayer)
            await this.room.sendMessage(trans('game.hunter.dead', {player: shotPlayer.user.toString(), role: shotPlayer.role.name}))
        }

        this.game.removePlayer(player)
    }

    constructor(private room: Room, private game: Game) {
    }
}
