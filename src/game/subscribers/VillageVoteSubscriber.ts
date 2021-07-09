import EventSubscriber, {EventListener} from "../dispatcher/EventSubscriber";
import Room from "../Room";
import EventDispatcher, {EventsParameters} from "../dispatcher/EventDispatcher";
import {trans} from "../../Translator";
import Poll from "../interactions/Poll";
import {VILLAGE_VOTE_TIME} from "../../Settings";
import Game from "../Game";

export default class VillageVoteSubscriber implements EventSubscriber {
    constructor(private room: Room, private dispatcher: EventDispatcher, private game: Game) {
    }

    getSubscribedEvents<K extends keyof EventsParameters>(): [keyof EventsParameters, EventListener<keyof EventsParameters>][] {
        return [
            ['villageVote', this.onVillageVote]
        ];
    }

    private async onVillageVote() {
        await this.room.sendMessage(trans('game.villageVote.introduction', {}))

        const poll = new Poll(trans('game.villageVote.title', {}), this.game.getPlayers(), VILLAGE_VOTE_TIME)
            .setLabel(player => player.user.displayName)
            .setRandomOnNoVotes()

        const player = await this.room.sendPoll(poll)
        await this.room.sendMessage(trans('game.villageVote.death', {
            player: player.user.toString(),
            role: player.role.name
        }))

        this.game.removePlayer(player)
        await this.dispatcher.dispatch('nextTurn')
    }
}
