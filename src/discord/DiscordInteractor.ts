import Interactor, {Block, Message} from "../Interactor";
import {Stringable, TranslatableString} from "../Translator";
import {Message as DiscordMessage, MessageEmbed, TextChannel, User} from "discord.js";
import Kernel from "../Kernel";

export default class DiscordInteractor implements Interactor {
    constructor(private kernel: Kernel, private channel: TextChannel) {
    }

    async send(message: Message): Promise<DiscordMessage> {
        return await this.channel.send(this.toDiscordMessage(message))
    }

    private toString(message: Stringable): string {
        return message instanceof TranslatableString ? this.kernel.translator.translate(message) : message
    }

    async reply(message: DiscordMessage, answer: Message): Promise<DiscordMessage> {
        const content = answer instanceof Block ? answer : `${message.author} >> ${this.toString(answer)}`

        return await this.send(content)
    }

    private toDiscordMessage(message: Message) {
        if (message instanceof Block) {
            return new MessageEmbed()
                .setTitle(this.toString(message.title))
                .addFields(...message.fields.map(([name, value]) => {
                    return {
                        name: this.toString(name),
                        value: this.toString(value)
                    }
                }))
        }

        return this.toString(message)
    }

    async sendMP(user: User, message: Message) {
        await user.send(this.toDiscordMessage(message))
    }
}
