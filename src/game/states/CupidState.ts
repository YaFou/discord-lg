import State from "./State";
import CupidRole from "../roles/CupidRole";
import Player from "../Player";
import Interactor from "../../Interactor";
import Game from "../Game";
import {CUPID_CHOICE_TIME} from "../../Settings";
import CoupleRole from "../roles/CoupleRole";

export default class CupidState implements State {
    filterPlayersAvailableToRead(players: Player[]): Player[] {
        return players.filter(player => player.role instanceof CupidRole)
    }

    isVoiceEnabled(): Boolean {
        return false;
    }

    async run(game: Game, interactor: Interactor): Promise<void> {
        const {textChannel} = game.channelsSet
        const player1 = await interactor.playerChoice(textChannel, 'Sur qui veux-tu tirer ta première flèche ?', game.players, CUPID_CHOICE_TIME)
        const availablePlayers = game.players.filter(player => player !== player1)
        const player2 = await interactor.playerChoice(textChannel, 'Sur qui veux-tu tirer ta deuxième flèche ?', availablePlayers, CUPID_CHOICE_TIME)

        player1.role = new CoupleRole(player1.role, player2)
        player2.role = new CoupleRole(player2.role, player1)

        await interactor.sendMP(player1.member.user, `Tu es tombé fou amoureux de ${player2.member} !\n**Ton but :** Etre les deux dernières personnes en vie.`)
        await interactor.sendMP(player2.member.user, `Tu es tombé fou amoureux de ${player1.member} !\n**Ton but :** Etre les deux dernières personnes en vie.`)
    }
}
