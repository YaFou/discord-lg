import Command from "./Command";
import {Message, TextChannel} from "discord.js";
import Kernel from "../Kernel";
import {trans} from "../Translator";

export default class NewGameCommand extends Command {
    private kernel: Kernel;

    constructor(kernel: Kernel) {
        super('newgame', trans('commands.newgame.description', {prefix: kernel.commandPrefix}));
        this.kernel = kernel
    }

    async execute(message: Message): Promise<void> {
        if (!(message.channel instanceof TextChannel)) {
            return
        }

        const guildManager = this.kernel.getGuildManager(message.guild)
        const {room} = await guildManager.newGame()
        const interactor = this.kernel.createInteractor(message.channel)
        const voiceChannelInvite = await room.voiceChannel.createInvite();
        await interactor.reply(
            message,
            trans('commands.newgame.success', {
                textChannel: room.textChannel.toString(),
                voiceChannelInvite: voiceChannelInvite.toString(),
                prefix: this.kernel.commandPrefix
            })
        )
    }
}
