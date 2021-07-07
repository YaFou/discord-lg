import Room from "../game/Room";
import Translator, {Stringable, TranslatableString} from "../Translator";
import {TextChannel, VoiceChannel} from "discord.js";
import Interactor from "../Interactor";
import DiscordInteractor from "./DiscordInteractor";
import Kernel from "../Kernel";

export default class DiscordRoom implements Room {
    private interactor: Interactor

    constructor(private kernel: Kernel, readonly id: number, readonly textChannel: TextChannel, readonly voiceChannel: VoiceChannel) {
        this.interactor = kernel.createInteractor(textChannel)
    }

    sendMessage(message: Stringable): void {
        this.interactor.send(message)
    }
}
