import GuildManager, {ChannelsSet} from "../GuildManager";
import {Collection, GuildMember, Snowflake, VoiceChannel} from "discord.js";
import Game from "./Game";
import Interactor from "../Interactor";
import Player from "./Player";
import WerewolfRole from "./roles/WerewolfRole";
import {Camp, filterPlayersByCamp} from "./roles/Role";
import {DESTROY_TIME, FALLBACK_CHANNEL_ID} from "../Settings";
import ClairvoyantRole from "./roles/ClairvoyantRole";
import CupidRole from "./roles/CupidRole";

export default class GameManager {
    constructor(private interactor: Interactor, private guildManager: GuildManager) {
    }

    create(channelsSet: ChannelsSet, members: Collection<Snowflake, GuildMember>): Game {
        const roles = [new ClairvoyantRole(), new WerewolfRole(), new CupidRole()]
        let rolesIndex = -1
        members.sort(() => Math.random() - 0.5)

        const players = members.map(member => {
            rolesIndex++

            return new Player(member, roles[rolesIndex])
        })

        return new Game(players, channelsSet)
    }

    async start(game: Game) {
        await this.initGame(game)
        const {textChannel, voiceChannel} = game.channelsSet

        while (true) {
            const state = game.nextState()

            if (game.isSunset) {
                await this.interactor.send(textChannel, 'La nuit commence à tomber...')
            }

            if (game.isNewDay) {
                const {textChannel} = game.channelsSet
                await this.interactor.send(textChannel, `Le soleil se lève, le jour ${game.day} commence...`)
                await this.showDeaths(game)
            }

            await state.isVoiceEnabled() ?
                this.guildManager.demuteChannel(voiceChannel, game.getMembers()) :
                this.guildManager.muteChannel(voiceChannel, game.getMembers())

            await this.guildManager.restrictTextChannelToMembers(textChannel, state.filterPlayersAvailableToRead(game.players).map(player => player.member))
            await state.run(game, this.interactor)

            if (game.isFinished()) {
                break
            }

            await this.guildManager.clearChannel(game.channelsSet.textChannel)
        }

        await this.terminateGame(game)
    }

    private async showDeaths(game: Game) {
        for (const player of game.deathThisNight) {
            await this.interactor.send(game.channelsSet.textChannel, `Cette nuit, ${player.member} a été tué. Il était **${player.role.name}**.`)
        }

        game.resetDeaths()
    }

    private async initGame(game: Game) {
        for (const player of game.players) {
            await this.interactor.sendMP(player.member.user, `Tu es **${player.role.name}** dans le camp **${player.role.camp}**.`)
            await this.interactor.sendMP(player.member.user, `**Ton but :** ${player.role.description}`)

            if (player.role.camp === Camp.WEREWOLVES) {
                const otherWerewolves = filterPlayersByCamp(game.players, Camp.WEREWOLVES)
                    .filter(currentPlayer => currentPlayer !== player)

                if (otherWerewolves.length) {
                    const mentions = otherWerewolves.map(player => player.member.toString()).join(', ')
                    this.interactor.sendMP(player.member.user, `Tes autres alliés loups garous sont ${mentions}.`)
                } else {
                    this.interactor.sendMP(player.member.user, "Tu n'as pas d'alliés loups garous...")
                }
            }
        }
    }

    private async terminateGame(game: Game) {
        const {textChannel, voiceChannel} = game.channelsSet
        await this.guildManager.openAndBlockChannelsSet(game.channelsSet)
        await this.showDeaths(game)

        if (game.isCoupleWin()) {
            await this.interactor.send(textChannel, 'La partie est terminée ! Le **couple** a gagné, bravo !')
        } else {
            await this.interactor.send(textChannel, `La partie est terminée ! Le camp victorieux est le camp **${game.players[0].role.camp}**, bravo !`)
        }

        await this.interactor.send(textChannel, `Les salons de cette partie vont être supprimés dans 1 minute.`)

        setTimeout(async () => {
            const fallbackVoiceChannel = voiceChannel.guild.channels.resolve(FALLBACK_CHANNEL_ID)

            if (fallbackVoiceChannel instanceof VoiceChannel) {
                await this.guildManager.moveMembersToVoiceChannel(voiceChannel, fallbackVoiceChannel)
            }

            this.guildManager.deleteChannelsSet(game.channelsSet)
        }, 1000 * DESTROY_TIME)
    }
}
