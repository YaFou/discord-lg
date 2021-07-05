import {AbstractCommand} from "./Command";
import {EmbedFieldData, Message, MessageEmbed} from "discord.js";

export default class HelpCommand extends AbstractCommand {
    execute(message: Message): void {
        const commands: EmbedFieldData[] = this.bot.commands.map(command => {
            return {
                name: `!lg ${command.getName()}`,
                value: command.getDescription()
            }
        })

        const embed = new MessageEmbed()
            .setTitle('Aide')
            .setDescription('Commandes disponibles')
            .addFields(...commands)

        this.interactor.reply(message, embed)
    }

    getName(): string {
        return 'help'
    }

    getDescription(): string {
        return 'Liste les commandes disponibles'
    }
}
