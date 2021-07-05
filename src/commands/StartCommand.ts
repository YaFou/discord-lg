import {AbstractCommand} from "./Command";
import {Message, TextChannel} from "discord.js";

export default class StartCommand extends AbstractCommand {
    async execute(message: Message): Promise<void> {
        if (!(message.channel instanceof TextChannel)) {
            this.interactor.reply(message, 'Tu dois être dans un salon de jeu pour commencer une partie.')

            return
        }

        const channelSet = await this.guildManager.findGameChannelsSet(message.channel)

        if (!channelSet) {
            this.interactor.reply(message, 'Tu dois être dans un salon de jeu pour commencer une partie.')

            return
        }

        const mentions = channelSet.voiceChannel.members.map(member => member.toString()).join(' ')
        this.interactor.send(message.channel, `La partie va démarrer... Tenez vous prêts ${mentions} !`)
        this.guildManager.closeChannelsSet(channelSet)

        const game = this.gameManager.create(channelSet, channelSet.voiceChannel.members)
        this.interactor.send(message.channel, 'La partie démarre. Bon jeu à tous !')
        this.guildManager.clearChannel(message.channel)
        await this.gameManager.start(game)
    }

    getName(): string {
        return 'start'
    }

    getDescription(): string {
        return 'Démarrer une partie'
    }
}