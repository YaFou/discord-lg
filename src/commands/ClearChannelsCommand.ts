import Command from "./Command";
import {trans} from "../Translator";
import {GuildMember, Message, TextChannel} from "discord.js";
import Kernel from "../Kernel";

export default class ClearChannelsCommand extends Command {
    constructor(private kernel: Kernel) {
        super('clearchannels', trans('commands.clearchannels.description', {}));
    }

    async execute(message: Message): Promise<void> {
        if (!(message.channel instanceof TextChannel)) {
            return
        }

        const guildManager = this.kernel.getGuildManager(message.guild)
        guildManager.getGames().forEach(game => {
            guildManager.deleteGame(game)
        })

        await this.kernel.createInteractor(message.channel).reply(message, trans('commands.clearchannels.success', {}))
    }

    hasPermission(member: GuildMember): Boolean {
        return member.hasPermission('MANAGE_CHANNELS')
    }
}