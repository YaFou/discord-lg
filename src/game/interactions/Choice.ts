import {Stringable, trans} from "../../Translator";
import {MessageReaction} from "discord.js";
import ReactionsInteraction from "./ReactionsInteraction";

export default class Choice<T> extends ReactionsInteraction<T> {
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
}
