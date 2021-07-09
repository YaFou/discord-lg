import Encoder from "./Encoder";
import {readFileSync} from "fs";

interface KeyParameters {
    // COMMANDS
    'commands.unknown': {}
    'commands.help.title': {}
    'commands.help.description': {}
    'commands.help.usage': {prefix: Stringable}
    'commands.newgame.description': {}
    'commands.newgame.success': {textChannel: Stringable, voiceChannelInvite: Stringable}
    'commands.start.description': {}
    'commands.start.gameAlreadyStarted': {}
    'commands.start.gameNotFound': {}
    'commands.start.minPlayersRequirement': {minPlayers: number}
    'commands.start.maxPlayersRequirement': {maxPlayers: number}
    'commands.clearchannels.description': {}
    'commands.clearchannels.success': {}
    'commands.roles.description': {}
    'commands.roles.title': {}
    'commands.forbidden': {}

    // GAME | GLOBAL
    'game.global.roomName': { id: number }
    'game.global.win': {camp: Stringable}
    'game.global.channelsDestroy': {seconds: number}

    // GAME | SUBSCRIBERS
    'game.newDay': { day: number }
    'game.sunset': {}
    'game.werewolvesVote.title': {}
    'game.werewolvesVote.success': {player: Stringable}
    'game.werewolvesVote.littleGirl': {message: Stringable}
    'game.playerDead': {player: Stringable, role: Stringable}
    'game.villageVote.introduction': {}
    'game.villageVote.title': {}
    'game.villageVote.death': {player: Stringable, role: Stringable}
    'game.clairvoyant.title': {},
    'game.clairvoyant.exposeRole': {player: Stringable, role: Stringable}
    'game.clairvoyant.noExposed': {}

    // GAME | INTERACTIONS
    'game.interactions.poll.selectReaction': {}
    'game.interactions.choice.selectReaction': {}

    // GAME | ROLES
    'game.role.mp': {role: Stringable}
    'game.role.mp.werewolves': {werewolves: Stringable[]}
    'game.role.mp.werewolves.empty': {}
    'game.role.villager': {}
    'game.role.villager.description': {}
    'game.role.werewolf': {}
    'game.role.werewolf.description': {}
    'game.role.littleGirl': {}
    'game.role.littleGirl.description': {}
    'game.role.clairvoyant': {}
    'game.role.clairvoyant.description': {}

    // GAME | CAMPS
    'game.camp.village': {}
    'game.camp.werewolves': {}

    // OTHERS
    'comma': {}
    'and': {}
}

export type Stringable = string | TranslatableString<any>

export class TranslatableString<T extends keyof KeyParameters> {
    constructor(readonly key: T, private args: KeyParameters[T]) {
    }

    translate(message: string, translator: Translator): string {
        let newString = message

        for (const key of Object.keys(this.args)) {
            let value = this.args[key]

            if (value instanceof TranslatableString) {
                value = translator.translate(value)
            }

            if (Array.isArray(value)) {
                const elements = value.map(element => element instanceof TranslatableString ? translator.translate(element) : element)
                const lastElement = elements.pop()

                if (elements.length == 0) {
                    value = lastElement
                }

                const comma = translator.translate(trans('comma', {}))
                const and = translator.translate(trans('and', {}))
                value = elements.join(comma) + and + lastElement
            }

            newString = newString.replace(new RegExp(`%${key}%`, 'g'), value)
        }

        return newString
    }
}

export function trans<T extends keyof KeyParameters>(key: T, args: KeyParameters[T]): TranslatableString<T> {
    return new TranslatableString<T>(key, args)
}

export default interface Translator {
    translate<K extends keyof KeyParameters>(message: TranslatableString<K>): string
}

export abstract class AbstractTranslator implements Translator {
    translate<K extends keyof KeyParameters>(message: TranslatableString<K>): string {
        return message.translate(this.getMessage(message.key), this)
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
