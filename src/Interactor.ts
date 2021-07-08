import {Stringable} from "./Translator";
import {Message as DiscordMessage} from "discord.js";

export default interface Interactor {
    send(message: Message): DiscordMessage | Promise<DiscordMessage>

    reply(message: DiscordMessage, answer: Message): DiscordMessage | Promise<DiscordMessage>
}

export type Message = Stringable | Block

export class Block {
    constructor(readonly title: Stringable, readonly fields: [Stringable, Stringable][]) {
    }
}
