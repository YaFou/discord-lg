import {AbstractCommand} from "./Command";
import {Message, TextChannel, VoiceChannel} from "discord.js";
import {FALLBACK_CHANNEL_ID} from "../Settings";

export default class StartCommand extends AbstractCommand {
    async execute(message: Message): Promise<void> {
        const textChannel = message.channel

        if (!(textChannel instanceof TextChannel)) {
            this.interactor.reply(message, 'Tu dois être dans un salon de jeu pour commencer une partie.')

            return
        }

        const channelSet = await this.guildManager.findGameChannelsSet(textChannel)

        if (!channelSet) {
            this.interactor.reply(message, 'Tu dois être dans un salon de jeu pour commencer une partie.')

            return
        }

        const players = channelSet.voiceChannel.members

        if (players.size < 2) {
            await this.interactor.reply(message, 'Vous devez être au moins 2 joueurs pour jouer.')

            return
        }

        if (players.size > 20) {
            await this.interactor.reply(message, 'Vous devez être au maximum 20 joueurs pour jouer.')

            return
        }

        const mentions = players.map(member => member.toString()).join(' ')
        await this.interactor.send(textChannel, `La partie va démarrer... Tenez vous prêts ${mentions} !`)
        this.guildManager.closeChannelsSet(channelSet)

        const game = this.gameManager.create(channelSet, players)
        this.guildManager.clearChannel(textChannel)
        await this.interactor.send(textChannel, 'La partie démarre. Bon jeu à tous !')
        await this.gameManager.start(game)
    }

    getName(): string {
        return 'start'
    }

    getDescription(): string {
        return 'Démarrer une partie'
    }
}