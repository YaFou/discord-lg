import Command from "./Command";
import {Message, TextChannel} from "discord.js";
import Kernel from "../Kernel";
import {trans} from "../Translator";
import DiscordRoom from "../discord/DiscordRoom";

export default class NewGameCommand extends Command {
    constructor(private kernel: Kernel) {
        super('newgame', 'Créer une nouvelle partie de Loups Garous');
    }

    async execute(message: Message): Promise<void> {
        if (!(message.channel instanceof TextChannel)) {
            return
        }

        const guildManager = this.kernel.getGuildManager(message.guild)
        const {room} = await guildManager.newGame()

        if (!(room instanceof DiscordRoom)) {
            return
        }

        const interactor = this.kernel.createInteractor(message.channel)
        const voiceChannelInvite = await room.voiceChannel.createInvite();
        await interactor.reply(
            message,
            trans('commands.newgame.success', {
                textChannel: room.textChannel.toString(),
                voiceChannelInvite: voiceChannelInvite.toString()
            })
        )
    }
}
