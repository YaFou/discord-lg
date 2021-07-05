import {Message} from "discord.js";
import Bot from "../Bot";
import Interactor from "../Interactor";
import GuildManager from "../GuildManager";
import Store from "../Store";
import GameManager from "../game/GameManager";

export default interface Command {
    execute(message: Message): void
    getName(): string
    getDescription(): string
}

export abstract class AbstractCommand implements Command {
    protected interactor: Interactor
    protected guildManager: GuildManager
    protected store: Store
    protected gameManager: GameManager

    constructor(protected bot: Bot) {
        this.interactor = bot.interactor
        this.guildManager = bot.guildManager
        this.store = bot.store
        this.gameManager = bot.gameManager
    }

    abstract execute(message: Message): void

    abstract getName(): string

    abstract getDescription(): string;
}
