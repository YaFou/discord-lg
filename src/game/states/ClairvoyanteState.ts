import State from "./State";
import Player from "../Player";
import Game from "../Game";
import Interactor from "../../Interactor";
import ClairvoyantRole from "../roles/ClairvoyantRole";
import {CLAIRVOYANCE_CHOICE_TIME, CLAIRVOYANCE_WAIT_TIME} from "../../Settings";

export default class ClairvoyanteState implements State {
    private clairvoyants: Player[]

    filterPlayersAvailableToRead(players: Player[]): Player[] {
        return this.clairvoyants = players.filter(player => player.role instanceof ClairvoyantRole)
    }

    isVoiceEnabled(): Boolean {
        return false;
    }

    async run(game: Game, interactor: Interactor): Promise<void> {
        const {textChannel} = game.channelsSet
        const availablePlayers = game.players.filter(player => !this.clairvoyants.includes(player))
        const player = await interactor.playerChoice(textChannel, 'Quel rôle veux-tu consulter dans ta boule de crystal ?', availablePlayers, CLAIRVOYANCE_CHOICE_TIME)
        await interactor.send(textChannel, `${player.member} est **${player.role.name}**.`)
    }
}
