import {AbstractCommand} from "./Command";
import {Message} from "discord.js";

export default class ClearChannelsCommand extends AbstractCommand {
    execute(message: Message): void {
        this.guildManager.clearChannels(message.guild)
        this.interactor.reply(message, 'Tous les salons de jeux ont été supprimés.')
    }

    getName(): string {
        return 'clearchannels'
    }

    getDescription(): string {
        return 'Supprime tous les salons de jeux'
    }
}