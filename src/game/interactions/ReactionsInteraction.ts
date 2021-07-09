import {Stringable} from "../../Translator";
import {Block} from "../../Interactor";
import {GuildMember} from "discord.js";

const EMOJIS = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪']

export default abstract class ReactionsInteraction<T> {
    private label: (T) => Stringable
    private reactionsMap: Map<T, string> = new Map<T, string>()
    private possibleInteractors: GuildMember[] = null

    constructor(private title: Stringable, protected elements: T[], readonly time: number) {
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
            emojiIndex++

            return [`${emoji} ${this.label(element)}`, this.getHelp()]
        })

        return new Block(this.title, fields)
    }

    protected abstract getHelp(): Stringable

    getReactionsMap(): Map<T, string> {
        return this.reactionsMap
    }

    setPossibleInteractors(possibleInteractors: GuildMember[]): this {
        this.possibleInteractors = possibleInteractors

        return this
    }

    getPossibleInteractors(): GuildMember[] {
        return this.possibleInteractors
    }
}
