import {Stringable, trans} from "../../Translator";
import {MessageReaction} from "discord.js";
import ReactionsInteraction from "./ReactionsInteraction";
import {randomElement} from "../../Util";

export default class Choice<T> extends ReactionsInteraction<T> {
    private randomOnNoChoice = false

    setRandomOnNoChoice(): this {
        this.randomOnNoChoice = true

        return this
    }

    onReact(reaction: MessageReaction): T {
        for (const [element, emoji] of [...this.getReactionsMap().entries()]) {
            if (emoji === reaction.emoji.toString()) {
                return element
            }
        }

        return null
    }

    protected getHelp(): Stringable {
        return trans('game.interactions.choice.selectReaction', {})
    }

    decide(): T {
        return this.randomOnNoChoice ? randomElement(this.elements) : null
    }
}
