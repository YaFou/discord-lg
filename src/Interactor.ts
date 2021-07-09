import {Stringable} from "./Translator";
import {Message as DiscordMessage, User} from "discord.js";

export default interface Interactor {
    send(message: Message): DiscordMessage | Promise<DiscordMessage>

    reply(message: DiscordMessage, answer: Message): DiscordMessage | Promise<DiscordMessage>

    sendMP(user: User, message: Message): void;
}

export type Message = Stringable | Block

export class Block {
    description: Stringable = null

    constructor(readonly title: Stringable, readonly fields: [Stringable, Stringable][] = []) {
    }

    setDescription(description: Stringable): this {
        this.description = description

        return this
    }
}
