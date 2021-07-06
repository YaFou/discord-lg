import {Client, DMChannel, Message, MessageEmbed, MessageReaction, NewsChannel, TextChannel, User} from "discord.js";
import Player from "./game/Player";

export default interface Interactor {
    reply(message: Message, answer: string | MessageEmbed): void;

    send(channel: TextChannel | DMChannel | NewsChannel, message: string | MessageEmbed): Promise<Message>

    sendMP(user: User, message: string): void;

    playerPoll(textChannel: TextChannel, question: string, players: Player[], time: number): Promise<Player>;
}

export class DiscordInteractor implements Interactor {
    constructor(private client: Client) {
    }

    async reply(message: Message, answer: string | MessageEmbed): Promise<void> {
        const content = answer instanceof MessageEmbed ?
            answer.setAuthor(
                message.guild.members.resolve(message.author).displayName,
                message.author.displayAvatarURL()
            ) :
            `${message.author} | ${answer}`

        await this.send(message.channel, content)
    }

    async send(channel: TextChannel | DMChannel | NewsChannel, message: string | MessageEmbed): Promise<Message> {
        return await channel.send(message)
    }

    async sendMP(user: User, message: string | MessageEmbed): Promise<void> {
        await user.send(message)
    }

    async playerPoll(textChannel: TextChannel, question: string, players: Player[], time: number): Promise<Player> {
        const reactions = new Map<Player, string>()
        const choices = new Map<User, MessageReaction>()
        let messageText = `${question}\n`

        const emojis = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪']
        let emojiIndex = 0

        players.forEach(player => {
            messageText += `${emojis[emojiIndex]} ${player.member}\n`
            reactions.set(player, emojis[emojiIndex])
            emojiIndex++
        })

        const message = await this.send(textChannel, messageText)

        reactions.forEach(emoji => {
            message.react(emoji)
        })

        const onReact = (reaction: MessageReaction, user: User) => {
            if (reaction.message !== message || user.bot) {
                return
            }

            if (![...reactions.values()].includes(reaction.emoji.toString())) {
                reaction.users.remove(user)

                return
            }

            if (choices.has(user)) {
                const oldReaction = choices.get(user)
                oldReaction.users.remove(user)
            }

            choices.set(user, reaction)
        }

        this.client.on('messageReactionAdd', onReact)

        const reminders = [30, 10, 5]
        reminders.forEach(reminder => {
            if (time <= reminder) {
                return
            }

            setTimeout(() => this.send(textChannel, `Plus que ${reminder} secondes pour voter.`), (time - reminder) * 1000)
        })

        return new Promise<Player>(resolve => {
            setTimeout(() => {
                this.client.removeListener('messageReactionAdd', onReact)
                const sortedReactions = message.reactions.cache.sort((a, b) => b.count - a.count)
                const firstEmoji = sortedReactions.array()[0].emoji.toString()

                for (const [player, emoji] of reactions.entries()) {
                    if (emoji === firstEmoji) {
                        resolve(player)

                        return
                    }
                }

                resolve(null)
            }, time * 1000)
        })
    }
}
