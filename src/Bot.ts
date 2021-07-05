import {Client, Message} from "discord.js";
import Command from "./commands/Command";
import Interactor from "./Interactor";
import GuildManager from "./GuildManager";
import Store from "./Store";
import GameManager from "./game/GameManager";

export default class Bot {
    readonly commands: Command[] = []
    private helpCommand: Command

    constructor(client: Client, readonly interactor: Interactor, readonly guildManager: GuildManager, readonly store: Store, readonly gameManager: GameManager) {
        client.on('message', this.onMessage.bind(this))
    }

    addCommand(command: Command): this {
        this.commands.push(command)

        return this
    }

    onMessage(message: Message) {
        if (message.author.bot) {
            return
        }

        const content = message.content

        if (!content.startsWith('!lg')) {
            return
        }

        const parts = content.split(' ')

        if (parts.length < 2) {
            this.helpCommand.execute(message)

            return
        }

        const commandName = parts[1]

        for (const command of this.commands) {
            if (command.getName() === commandName) {
                command.execute(message)

                return
            }
        }

        this.interactor.reply(message, "Le commande entrée est inconnu. Pour connaître les commandes disponibles, entrez `!lg " + this.helpCommand.getName() + "`.")
    }

    setHelpCommand(command: Command) {
        this.addCommand(command)
        this.helpCommand = command
    }
}
