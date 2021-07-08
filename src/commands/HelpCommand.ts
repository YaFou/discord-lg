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
        const block = new Block(trans('commands.help.title', {}), this.kernel.commands.map(command => [command.name, command.description]))
        await interactor.send(block)
    }
}
