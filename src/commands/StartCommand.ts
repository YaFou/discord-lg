import Command from "./Command";
import Kernel from "../Kernel";
import {trans} from "../Translator";
import {Message, TextChannel} from "discord.js";
import {GameState, GameStatus} from "../game/Game";

export default class StartCommand extends Command {
    constructor(private kernel: Kernel) {
        super('start', trans('commands.start.description', {}))
    }

    async execute(message: Message) {
        const channel = message.channel

        if (!(channel instanceof TextChannel)) {
            return
        }

        const interactor = this.kernel.createInteractor(channel)
        const guildManager = this.kernel.getGuildManager(message.guild)
        const game = guildManager.findGameFromTextChannel(channel)

        if (!game) {
            await interactor.reply(message, trans('commands.start.gameNotFound', {}))

            return
        }

        if (game.state.status !== GameStatus.WAITING) {
            await interactor.reply(message, trans('commands.start.gameAlreadyStarted', {}))

            return
        }

        guildManager.startGame(game, game.room.voiceChannel.members.array())
    }
}
