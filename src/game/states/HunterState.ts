import State from "./State";
import Game from "../Game";
import Interactor from "../../Interactor";
import Player from "../Player";
import {HUNTER_CHOICE_TIME} from "../../Settings";

export default class HunterState implements State {
    constructor(private hunters: Player[]) {
    }

    filterPlayersAvailableToRead(players: Player[]): Player[] {
        return this.hunters
    }

    isVoiceEnabled(): Boolean {
        return true
    }

    async run(game: Game, interactor: Interactor): Promise<void> {
        const {textChannel} = game.channelsSet
        const player = await interactor.playerChoice(textChannel, 'Tu es mort, tu vas tirer ta dernière balle. Mais vers qui ?', game.players, HUNTER_CHOICE_TIME)
        game.killPlayer(player)
        await interactor.send(textChannel, `Le coup est tiré, ${player.member.displayName} a été tué sur le coup.`)
    }
}
