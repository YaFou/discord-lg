import {GuildMember, Message} from "discord.js";
import {Stringable} from "../Translator";

export default abstract class Command {
    constructor(readonly name: string, readonly description: Stringable) {
    }

    abstract execute(message: Message): void

    hasPermission(member: GuildMember): Boolean {
        return true
    }
}
