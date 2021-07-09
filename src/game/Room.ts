import {MessageReaction, OverwriteResolvable, TextChannel, User, VoiceChannel} from "discord.js";
import Interactor, {Message} from "../Interactor";
import Kernel from "../Kernel";
import Game from "./Game";
import Poll from "./interactions/Poll";
import Player from "./Player";
import {Role} from "./Role";

export default class Room {
    private interactor: Interactor
    private game: Game

    constructor(private kernel: Kernel, readonly id: number, readonly textChannel: TextChannel, readonly voiceChannel: VoiceChannel) {
        this.interactor = kernel.createInteractor(textChannel)
    }

    setGame(game: Game) {
        this.game = game
    }

    async sendMessage(message: Message) {
        await this.interactor.send(message)
    }

    async lockToRole(...roles: Role[]) {
        const players = this.game.getPlayersByRole(...roles)
        await this.lockToPlayers(players)
    }

    async sendPoll<T>(poll: Poll<T>): Promise<T> {
        const message = await this.interactor.send(poll.generateBlock())
        poll.getReactionsMap().forEach(emoji => message.react(emoji))
        const guild = message.guild

        const onReact = async (reaction: MessageReaction, user: User) => {
            const member = await guild.members.fetch(user);

            if (message !== reaction.message || user.bot) {
                return
            }

            if (this.game.getSpectators().includes(member) || ![...poll.getReactionsMap().values()].includes(reaction.emoji.toString())) {
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

    sendPrivateMessage(player: Player, message: Message) {
        this.interactor.sendMP(player.user.user, message)
    }

    async lockToPlayers(players: Player[]) {
        const playersPermissions: OverwriteResolvable[] = players.map(player => {
            return {
                id: player.user,
                allow: ['VIEW_CHANNEL'],
                deny: ['READ_MESSAGE_HISTORY']
            }
        })

        const spectatorsPermissions: OverwriteResolvable[] = this.game.getSpectators().map(spectator => {
            return {
                id: spectator,
                allow: ['VIEW_CHANNEL'],
                deny: ['SEND_MESSAGES', 'ADD_REACTIONS']
            }
        })

        await this.textChannel.overwritePermissions([
            {
                id: this.textChannel.guild.roles.everyone,
                deny: ['VIEW_CHANNEL']
            },
            ...playersPermissions,
            ...spectatorsPermissions
        ])
    }

    // async clearChannel() {
    //     const messages = await this.textChannel.messages.fetch({limit: 100})
    //     await this.textChannel.bulkDelete(messages)
    // }
}
