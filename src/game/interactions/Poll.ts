import {MessageReaction, User} from "discord.js";
import {randomElement} from "../../Util";
import ReactionsInteraction from "./ReactionsInteraction";
import {Stringable, trans} from "../../Translator";

export default class Poll<T> extends ReactionsInteraction<T> {
    private choices: Map<User, MessageReaction> = new Map<User, MessageReaction>()
    private randomOnNoVotes = false

    setRandomOnNoVotes(): this {
        this.randomOnNoVotes = true

        return this
    }

    async onReact(reaction: MessageReaction, user: User) {
        if (this.choices.has(user)) {
            await this.choices.get(user).users.remove(user)
        }

        this.choices.set(user, reaction)
    }

    decide(): T {
        if (this.choices.size === 0) {
            return this.randomOnNoVotes ? randomElement(this.elements) : null
        }

        let votes = [...this.choices.values()].sort((a, b) => b.count - a.count)
        votes = votes.filter(vote => vote.count = votes[0].count)
        const randomVote = randomElement(votes)
        const reactions = [...this.getReactionsMap()]

        return reactions.filter(([_, emoji]) => emoji === randomVote.emoji.toString())[0][0]
    }

    protected getHelp(): Stringable {
        return trans('game.interactions.poll.selectReaction', {})
    }
}
