import {Client, Guild, OverwriteResolvable, TextChannel, VoiceChannel} from "discord.js";
import Store from "./Store";

export type ChannelsSet = {
    textChannel: TextChannel
    voiceChannel: VoiceChannel
}

export default interface GuildManager {
    createChannelsSet(guild: Guild): ChannelsSet | Promise<ChannelsSet>;

    clearChannels(guild: Guild): void;

    findGameChannelsSet(textChannel: TextChannel): ChannelsSet

    closeChannelsSet(channelsSet: ChannelsSet): void

    clearChannel(textChannel: TextChannel): void
}

export class DiscordGuildManager implements GuildManager {
    constructor(private store: Store, private client: Client) {
    }

    async createChannelsSet(guild: Guild): Promise<ChannelsSet> {
        const category = guild.channels.cache.get('861608867728588832')
        const channels = this.getChannels()
        let number = DiscordGuildManager.findNextChannelNumber(channels)

        const name = `Loup Garou #${number}`
        const textChannel = await guild.channels.create(name, {type: 'text', parent: category})
        const voiceChannel = await guild.channels.create(name, {type: 'voice', parent: category})

        channels[number] = {textChannel: textChannel.id, voiceChannel: voiceChannel.id}
        this.store.save()

        return {textChannel, voiceChannel}
    }

    private static findNextChannelNumber(channels: object): number {
        let expectedNumber = 1

        for (const number of Object.keys(channels)) {
            if (Number.parseInt(number) !== expectedNumber) {
                break
            }

            expectedNumber++
        }

        return expectedNumber
    }

    async clearChannels(guild: Guild): Promise<void> {
        const channels = this.getChannels()

        for (const number of Object.keys(channels)) {
            const channelsSet = channels[number]
            await guild.channels.cache.get(channelsSet.textChannel).delete()
            await guild.channels.cache.get(channelsSet.voiceChannel).delete()
            delete channels[number]
        }

        this.store.save()
    }

    async clearChannel(textChannel: TextChannel): Promise<void> {
        const messages = await textChannel.messages.fetch({limit: 100})
        await textChannel.bulkDelete(messages)
    }

    async closeChannelsSet(channelsSet: ChannelsSet): Promise<void> {
        const {textChannel, voiceChannel} = channelsSet
        const members = voiceChannel.members

        if (!(textChannel instanceof TextChannel)) {
            return
        }

        const permissions: OverwriteResolvable[] = [
            {
                id: textChannel.guild.roles.everyone,
                deny: ['VIEW_CHANNEL']
            }
        ]

        members.forEach(member => {
            permissions.push({
                id: member,
                allow: ['VIEW_CHANNEL']
            })
        })

        await textChannel.overwritePermissions(permissions)
        await voiceChannel.overwritePermissions(permissions)
    }

    findGameChannelsSet(textChannel: TextChannel): ChannelsSet {
        const channels = this.getChannels()

        for (const number in channels) {
            if (channels[number].textChannel === textChannel.id) {
                const voiceChannel = this.client.channels.cache.get(channels[number].voiceChannel)

                if (voiceChannel instanceof VoiceChannel) {
                    return {
                        textChannel: textChannel,
                        voiceChannel: voiceChannel
                    }
                }
            }
        }

        return null
    }

    getChannels(): { textChannel: string, voiceChannel: string }[] {
        return this.store.getValue<{ textChannel: string, voiceChannel: string }[]>('channels', [])
    }
}
