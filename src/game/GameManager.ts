import GuildManager, {ChannelsSet} from "../GuildManager";
import {Collection, GuildMember, Snowflake, TextChannel} from "discord.js";
import Game, {GameState} from "./Game";
import Interactor from "../Interactor";
import Role, {getCamp} from "./Role";
import Player from "./Player";

export default class GameManager {
    constructor(private interactor: Interactor, private guildManager: GuildManager) {
    }

    create(channelsSet: ChannelsSet, members: Collection<Snowflake, GuildMember>): Game {
        let nextRole = Role.WEREWOLF
        members.sort(() => Math.random() - 0.5)

        const players = members.map(member => {
            nextRole = nextRole === Role.VILLAGER ? Role.WEREWOLF : Role.VILLAGER

            return new Player(member, nextRole)
        })

        return new Game(players, channelsSet)
    }

    async start(game: Game) {
        for (const player of game.players) {
            await this.interactor.sendMP(player.member.user, `Tu es **${player.role.toLowerCase()}** dans le camp **${getCamp(player.role).toLowerCase()}**.`)
        }

        const textChannel = game.channelsSet.textChannel

        while (!game.isFinished()) {
            const state = game.nextState()
            switch (state) {
                case GameState.VOTE:
                    await this.voteState(textChannel, game)
                    break

                case GameState.WEREWOLVES:
                    await this.werewolvesState(textChannel, game)
                    break
            }

            await this.guildManager.clearChannel(game.channelsSet.textChannel)
        }

        await this.interactor.send(textChannel, `La partie est terminée ! Le camp victorieux est le camp **${getCamp(game.players[0].role).toLowerCase()}**, bravo !`)
    }

    private removePlayer(game: Game, player: Player) {
        game.players = game.players.splice(game.players.indexOf(player), 1)
    }

    private async voteState(textChannel: TextChannel, game: Game) {
        const player = await this.interactor.playerPoll(textChannel, "Le village doit voter pour tuer quelqu'un.", game.players, 120);
        this.removePlayer(game, player)
        await this.interactor.send(textChannel, `Le joueur ${player.member} a été désigné par le village pour être tué !`)
    }

    private async werewolvesState(textChannel: TextChannel, game: Game) {
        const player = await this.interactor.playerPoll(textChannel, 'Quelle victime voulez vous dévorez ?', game.players, 120);
        this.removePlayer(game, player)
        await this.interactor.send(textChannel, `Vous avez tué ${player.member} !`)
    }
}
