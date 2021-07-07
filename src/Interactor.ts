import {Stringable} from "./Translator";
import {Message} from "discord.js";

export default interface Interactor {
    send(message: Stringable): Message | Promise<Message>

    reply(message: Message, answer: Stringable): Message | Promise<Message>
}
