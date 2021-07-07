import {Message} from "discord.js";

export default abstract class Command {
    constructor(readonly name: string, readonly description: string) {
    }

    abstract execute(message: Message): void
}
