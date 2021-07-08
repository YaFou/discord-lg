import {Stringable, trans} from "../../Translator";
import {Block} from "../../Interactor";
import {Message, MessageReaction, User} from "discord.js";
import {randomElement} from "../../Util";

const EMOJIS = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪']

export default class Poll<T> {
    private label: (T) => Stringable
    private reactionsMap: Map<T, string> = new Map<T, string>()
    private choices: Map<User, MessageReaction> = new Map<User, MessageReaction>()

    constructor(private title: Stringable, private elements: T[], readonly time: number) {
        this.label = element => element
    }

    setLabel(label: (T) => Stringable): this {
        this.label = label

        return this
    }

    generateBlock(): Block {
        let emojiIndex = 0

        const fields: [Stringable, Stringable][] = this.elements.map(element => {
            const emoji = EMOJIS[emojiIndex]
            this.reactionsMap.set(element, emoji)

            return [`${emoji} ${this.label(element)}`, trans('game.interactions.poll.selectReaction', {})]
        })

        return new Block(this.title, fields)
    }

    getReactionsMap(): Map<T, string> {
        return this.reactionsMap
    }

    async onReact(reaction: MessageReaction, user: User) {
        if (this.choices.has(user)) {
            await this.choices.get(user).users.remove(user)
        }

        this.choices.set(user, reaction)
    }

    decide(): T {
        let votes = [...this.choices.values()].sort((a, b) => b.count - a.count)
        votes = votes.filter(vote => vote.count = votes[0].count)
        const randomVote = randomElement(votes)
        const reactions = [...this.reactionsMap]

        return reactions.filter(([_, emoji]) => emoji === randomVote.emoji.toString())[0][0]
    }
}
