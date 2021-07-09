import Command from "./Command";
import {trans} from "../Translator";
import {Message, TextChannel} from "discord.js";
import Kernel from "../Kernel";
import {Block} from "../Interactor";
import {Roles} from "../game/Role";

export default class RolesCommand extends Command {
    async execute(message: Message) {
        if (!(message.channel instanceof TextChannel)) {
            return
        }

        const interactor = this.kernel.createInteractor(message.channel)
        const block = new Block(trans('commands.roles.title', {}), Roles.map(role => {
            return [role.name, role.description]
        }))
        await interactor.reply(message, block)
    }

    constructor(private kernel: Kernel) {
        super('roles', trans('commands.roles.description', {}));
    }
}
