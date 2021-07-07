import {Stringable} from "../Translator";

export default interface Room {
    sendMessage(message: Stringable): void
}
