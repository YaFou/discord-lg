import State from "./State";
import Player from "../Player";
import Interactor from "../../Interactor";
import Game from "../Game";
import {Camp, filterPlayersByCamp} from "../roles/Role";
import {WEREWOLVES_POLL_TIME} from "../../Settings";
import {Message} from "discord.js";
import LittleGirlRole from "../roles/LittleGirlRole";

export default class WerewolvesState implements State {
    filterPlayersAvailableToRead(players: Player[]): Player[] {
        return filterPlayersByCamp(players, Camp.WEREWOLVES)
    }

    isVoiceEnabled(): Boolean {
        return false;
    }

    async run(game: Game, interactor: Interactor): Promise<void> {
        const littleGirls = game.players.filter(player => player.role instanceof LittleGirlRole)
        const client = game.channelsSet.textChannel.client
        let onMessage = null

        if (littleGirls.length) {
            onMessage = (message: Message) => {
                if (message.author.bot || message.channel !== game.channelsSet.textChannel) {
                    return
                }

                littleGirls.forEach(player => {
                        interactor.sendMP(player.member.user, `Loups garous > *${message.cleanContent}*`)
                    })
            }

            client.on('message', onMessage)
        }

        const player = await interactor.playerPoll(game.channelsSet.textChannel, 'Quelle victime voulez vous dévorez ?', game.players, WEREWOLVES_POLL_TIME);

        if (onMessage) {
            client.removeListener('message', onMessage)
        }

        game.killPlayer(player)
        await interactor.send(game.channelsSet.textChannel, `Vous avez tué ${player.member} !`)
    }
}
