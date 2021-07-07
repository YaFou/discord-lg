import Interactor from "../Interactor";
import {Stringable, TranslatableString} from "../Translator";
import {Message, TextChannel} from "discord.js";
import Kernel from "../Kernel";

export default class DiscordInteractor implements Interactor {
    constructor(private kernel: Kernel, private channel: TextChannel) {
    }

    async send(message: Stringable): Promise<Message> {
        return await this.channel.send(this.toString(message))
    }

    private toString(message: Stringable): string {
        return message instanceof TranslatableString ? this.kernel.translator.translate(message) : message
    }

    async reply(message: Message, answer: Stringable): Promise<Message> {
        return await message.channel.send(`${message.author} >> ${this.toString(answer)}`)
    }
}
