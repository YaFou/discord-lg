import Encoder from "./Encoder";
import {readFileSync} from "fs";

export type Stringable = string | TranslatableString<any>

export class TranslatableString<T extends keyof KeyParameters> {
    constructor(readonly key: T, private args: KeyParameters[T]) {
    }

    translate(message: string): string {
        let newString = message

        for (const key of Object.keys(this.args)) {
            newString = newString.replace(new RegExp(`%${key}%`, 'g'), this.args[key])
        }

        return newString
    }
}

export function trans<T extends keyof KeyParameters>(key: T, args: KeyParameters[T]): TranslatableString<T> {
    return new TranslatableString<T>(key, args)
}

interface KeyParameters {
    // COMMANDS
    'commands.newgame.success': {textChannel: string, voiceChannelInvite: string}

    // GAME | GLOBAL
    'game.global.newDay': { day: number },
    'game.global.roomName': { id: number }
}

export default interface Translator {
    translate<K extends keyof KeyParameters>(message: TranslatableString<K>): string
}

export abstract class AbstractTranslator implements Translator {
    translate<K extends keyof KeyParameters>(message: TranslatableString<K>): string {
        return message.translate(this.getMessage(message.key))
    }

    protected abstract getMessage<K extends keyof KeyParameters>(key: K): string
}

export class FileTranslator extends AbstractTranslator {
    messages: object

    constructor(private file: string, private encoder: Encoder) {
        super();
        this.messages = encoder.decode(readFileSync(file).toString())
    }

    protected getMessage<K extends keyof KeyParameters>(key: K): string {
        return this.messages[key.toString()]
    }
}
