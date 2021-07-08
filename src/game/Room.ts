import {MessageReaction, OverwriteResolvable, TextChannel, User, VoiceChannel} from "discord.js";
import Interactor, {Message} from "../Interactor";
import Kernel from "../Kernel";
import Role from "./Role";
import Game from "./Game";
import Poll from "./interactions/Poll";

export default class Room {
    private interactor: Interactor
    private game: Game

    constructor(private kernel: Kernel, readonly id: number, readonly textChannel: TextChannel, readonly voiceChannel: VoiceChannel) {
        this.interactor = kernel.createInteractor(textChannel)
    }

    setGame(game: Game) {
        this.game = game
    }

    sendMessage(message: Message): void {
        this.interactor.send(message)
    }

    async lockToRole(...roles: Role[]) {
        const players = this.game.filterPlayersByRoles(...roles)

        const permissions: OverwriteResolvable[] = players.map(player => {
            return {
                id: player.user,
                allow: ['VIEW_CHANNEL'],
                deny: ['READ_MESSAGE_HISTORY']
            }
        })

        await this.textChannel.overwritePermissions([
            {
                id: this.textChannel.guild.roles.everyone,
                deny: ['VIEW_CHANNEL']
            },
            ...permissions
        ])
    }

    async sendPoll<T>(poll: Poll<T>): Promise<T> {
        const message = await this.interactor.send(poll.generateBlock())
        poll.getReactionsMap().forEach(emoji => message.react(emoji))

        const onReact = async (reaction: MessageReaction, user: User) => {
            if (message !== reaction.message || user.bot) {
                return
            }

            if (![...poll.getReactionsMap().values()].includes(reaction.emoji.toString())) {
                await reaction.users.remove(user)
            }

            await poll.onReact(reaction, user)
        }

        this.kernel.client.on('messageReactionAdd', onReact)

        return new Promise<T>(resolve => {
            setTimeout(() => {
                this.kernel.client.removeListener('messageReactionAdd', onReact)
                resolve(poll.decide())
            }, poll.time * 1000)
        })
    }

    async delete() {
        await this.textChannel.delete()
        await this.voiceChannel.delete()
    }
}
