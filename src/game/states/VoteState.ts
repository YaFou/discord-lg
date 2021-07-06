import State from "./State";
import Player from "../Player";
import Interactor from "../../Interactor";
import Game from "../Game";
import {VOTE_POLL_TIME} from "../../Settings";

export default class VoteState implements State {
    filterPlayersAvailableToRead(players: Player[]): Player[] {
        return players
    }

    isVoiceEnabled(): Boolean {
        return true;
    }

    async run(game: Game, interactor: Interactor): Promise<void> {
        const player = await interactor.playerPoll(game.channelsSet.textChannel, "Le village doit voter pour tuer quelqu'un.", game.players, VOTE_POLL_TIME);
        game.killPlayer(player)
        await interactor.send(game.channelsSet.textChannel, `Le joueur ${player.member} a été désigné par le village pour être pendu ! Il était **${player.role}**.`)
    }
}
