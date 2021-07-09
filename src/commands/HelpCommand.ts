import Command from "./Command";
import {Message, TextChannel} from "discord.js";
import Kernel from "../Kernel";
import {Block} from "../Interactor";
import {trans} from "../Translator";

export default class HelpCommand extends Command {
    constructor(private kernel: Kernel) {
        super('help', trans('commands.help.description', {}))
    }

    async execute(message: Message): Promise<void> {
        if (!(message.channel instanceof TextChannel)) {
            return
        }

        const interactor = this.kernel.createInteractor(message.channel)
        const commands = this.kernel.commands.filter(command => command.hasPermission(message.member))
        const block = new Block(trans('commands.help.title', {}), commands.map(command => [command.name, command.description]))
            .setDescription(trans('commands.help.usage', {prefix: this.kernel.commandPrefix}))
        await interactor.send(block)
    }
}
