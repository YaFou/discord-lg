import {AbstractCommand} from "./Command";
import {Message} from "discord.js";

export default class NewGameCommand extends AbstractCommand {
    async execute(message: Message): Promise<void> {
        const channelsSet = await this.guildManager.createChannelsSet(message.guild)
        const invite = await channelsSet.voiceChannel.createInvite({maxAge: 30 * 60})
        this.interactor.reply(message,
            'Des salons ont été créés pour une nouvelle partie.\n' +
            `Tu peux le rejoindre le salon textuel ici : ${channelsSet.textChannel},\n` +
            `et le salon vocal ici : ${invite} !`
        )
    }

    getName(): string {
        return 'newgame'
    }

    getDescription(): string {
        return 'Crée une nouvelle partie de Loup Garou'
    }
}
