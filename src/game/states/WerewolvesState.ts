import State from "./State";
import Player from "../Player";
import Interactor from "../../Interactor";
import Game from "../Game";
import {Camp, filterPlayersByCamp} from "../roles/Role";
import {WEREWOLVES_POLL_TIME} from "../../Settings";

export default class WerewolvesState implements State {
    filterPlayersAvailableToRead(players: Player[]): Player[] {
        return filterPlayersByCamp(players, Camp.WEREWOLVES)
    }

    isVoiceEnabled(): Boolean {
        return false;
    }

    async run(game: Game, interactor: Interactor): Promise<void> {
        const player = await interactor.playerPoll(game.channelsSet.textChannel, 'Quelle victime voulez vous dévorez ?', game.players, WEREWOLVES_POLL_TIME);
        game.killPlayer(player)
        await interactor.send(game.channelsSet.textChannel, `Vous avez tué ${player.member} !`)
    }
}
