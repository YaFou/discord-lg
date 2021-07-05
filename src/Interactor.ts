import {Client, DMChannel, GuildMember, Message, MessageEmbed, NewsChannel, TextChannel, User} from "discord.js";
import Player from "./game/Player";

export default interface Interactor {
    reply(message: Message, answer: string | MessageEmbed): void;

    send(channel: TextChannel | DMChannel | NewsChannel, message: string | MessageEmbed): void

    sendMP(user: User, message: string): void;

    playerPoll(textChannel: TextChannel, question: string, players: Player[], time: number): Promise<Player>;
}

export class DiscordInteractor implements Interactor {
    constructor(private client: Client) {
    }

    async reply(message: Message, answer: string | MessageEmbed): Promise<void> {
        const content = answer instanceof MessageEmbed ? answer : `${message.author} | ${answer}`
        await this.send(message.channel, content)
    }

    async send(channel: TextChannel | DMChannel | NewsChannel, message: string | MessageEmbed): Promise<void> {
        await channel.send(message)
    }

    async sendMP(user: User, message: string | MessageEmbed): Promise<void> {
        await user.send(message)
    }

    async playerPoll(textChannel: TextChannel, question: string, players: Player[], time: number): Promise<Player> {
        const votes = new Map<User, Player>()

        const onMessage = async message => {
            if (message.channel.id !== textChannel.id) {
                return
            }

            for (const player of players) {
                if (message.mentions.has(player.member)) {
                    votes.set(message.author, player)
                    await message.react('white_check_mark')

                    return
                }
            }

            await message.react('x')
        }

        this.client.on('message', onMessage)

        return await new Promise<Player>(resolve => {
            setTimeout(() => {
                this.client.removeListener('message', onMessage)
                const count = new Map<Player, number>(players.map(player => [player, 0]))
                votes.forEach(player => count.set(player, count.get(player) + 1))
                const entries = [...count.entries()].sort((a, b) => b[1] - a[1])
                resolve(entries[0][0])
            }, time * 1000)
        })
    }
}
