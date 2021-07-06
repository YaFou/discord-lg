import Interactor from "../../Interactor";
import Player from "../Player";
import Game from "../Game";

export default interface State {
    run(game: Game, interactor: Interactor): void

    isVoiceEnabled(): Boolean

    filterPlayersAvailableToRead(players: Player[]): Player[]
}
