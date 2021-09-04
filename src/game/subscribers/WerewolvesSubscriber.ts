import EventSubscriber, {EventListener} from "../dispatcher/EventSubscriber";
import EventDispatcher, {EventsParameters} from "../dispatcher/EventDispatcher";
import Room from "../Room";
import {trans} from "../../Translator";
import Game, {GameState} from "../Game";
import {WEREWOLVES_VOTE_TIME} from "../../Settings";
import {Camps, getRolesByCamp} from "../Role";
import {removeElement} from "../../Util";
import PlayerPoll from "../interactions/PlayerPoll";

export default class WerewolvesSubscriber implements EventSubscriber {
    constructor(private dispatcher: EventDispatcher, private room: Room, private game: Game, private state: GameState) {
    }

    getSubscribedEvents(): [keyof EventsParameters, EventListener<keyof EventsParameters>][] {
        return [
            ['werewolvesWakeUp', this.onWerewolvesWakeUp],
            ['start', this.onStart]
        ];
    }

    private async onWerewolvesWakeUp() {
        const poll = new PlayerPoll(trans('game.werewolvesVote.title', {}), this.game.getPlayers(), WEREWOLVES_VOTE_TIME)
            .setRandomOnNoVotes()

        const player = await this.room.sendPoll(poll)
        await this.room.sendMessage(trans('game.werewolvesVote.success', {player: player.user.toString()}))
        this.state.deaths.push(player)
        this.state.deadByWerewolves = player
        await this.dispatcher.dispatch('nextTurn')
    }

    private async onStart() {
        const werewolves = this.game.getPlayersByRole(...getRolesByCamp(Camps.WEREWOLVES));

        werewolves.filter(player => {
            const filteredWerewolves = removeElement(werewolves, player)

            if (filteredWerewolves.length === 0) {
                this.room.sendPrivateMessage(player, trans('game.role.mp.werewolves.empty', {}))

                return
            }

            this.room.sendPrivateMessage(player, trans('game.role.mp.werewolves', {werewolves: filteredWerewolves.map(werewolf => werewolf.user.toString())}))
        })
    }
}
