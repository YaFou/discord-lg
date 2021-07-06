import {
    Client,
    Guild,
    GuildMember,
    OverwriteResolvable,
    PermissionResolvable,
    TextChannel,
    VoiceChannel
} from "discord.js";
import Store from "./Store";
import {CATEGORY_CHANNEL_ID} from "./Settings";

export type ChannelsSet = {
    textChannel: TextChannel
    voiceChannel: VoiceChannel
    number: number
}

type RawChannelsSet = {
    textChannel: string,
    voiceChannel: string,
    number: number
}[]

export default interface GuildManager {
    createChannelsSet(guild: Guild): ChannelsSet | Promise<ChannelsSet>;

    clearChannels(guild: Guild): void;

    findGameChannelsSet(textChannel: TextChannel): ChannelsSet

    closeChannelsSet(channelsSet: ChannelsSet): void

    clearChannel(textChannel: TextChannel): void

    restrictTextChannelToMembers(textChannel: TextChannel, members: GuildMember[]): Promise<void>;

    openAndBlockChannelsSet(channelsSet: ChannelsSet): Promise<void>;

    deleteChannelsSet(channelsSet: ChannelsSet): void;

    demuteChannel(voiceChannel: VoiceChannel, members: GuildMember[]): void;

    muteChannel(voiceChannel: VoiceChannel, members: GuildMember[]): void;

    moveMembersToVoiceChannel(voiceChannel: VoiceChannel, fallbackVoiceChannel: VoiceChannel): void
}

type PartialsPermissions = {
    deny?: PermissionResolvable,
    allow?: PermissionResolvable
}

export class DiscordGuildManager implements GuildManager {
    constructor(private store: Store, private client: Client) {
    }

    async createChannelsSet(guild: Guild): Promise<ChannelsSet> {
        const category = guild.channels.resolve(CATEGORY_CHANNEL_ID)
        const channelsSets = this.getChannelsSets()
        let number = this.findNextChannelsSetNumber()

        const name = `Loup Garou #${number}`
        const textChannel = await guild.channels.create(name, {type: 'text', parent: category})
        const voiceChannel = await guild.channels.create(name, {type: 'voice', parent: category})

        channelsSets.push({textChannel: textChannel.id, voiceChannel: voiceChannel.id, number})
        this.store.save()

        return {textChannel, voiceChannel, number}
    }

    private findNextChannelsSetNumber(): number {
        let expectedNumber = 1

        for (const channelsSet of this.getChannelsSets()) {
            if (channelsSet.number !== expectedNumber) {
                break
            }

            expectedNumber++
        }

        return expectedNumber
    }

    async clearChannels(guild: Guild): Promise<void> {
        for (const channelsSet of this.getChannelsSets()) {
            await guild.channels.cache.get(channelsSet.textChannel).delete()
            await guild.channels.cache.get(channelsSet.voiceChannel).delete()
        }

        this.store.setValue('channelsSets', [])
        this.store.save()
    }

    async clearChannel(textChannel: TextChannel): Promise<void> {
        const messages = await textChannel.messages.fetch({limit: 100})
        await textChannel.bulkDelete(messages)
    }

    async closeChannelsSet(channelsSet: ChannelsSet): Promise<void> {
        const {textChannel, voiceChannel} = channelsSet
        const members = voiceChannel.members.array()

        await this.restrictPermissionsToMembers(
            textChannel,
            members,
            {deny: ['VIEW_CHANNEL']},
            {allow: ['VIEW_CHANNEL']}
        )
    }

    findGameChannelsSet(textChannel: TextChannel): ChannelsSet {
        const channelsSets = this.getChannelsSets()
        const filteredChannelsSets = channelsSets.filter(({textChannel: currentTextChannel}) => currentTextChannel === textChannel.id)

        if (filteredChannelsSets.length === 0) {
            return null
        }

        const channelsSet = filteredChannelsSets[0]
        const voiceChannel = this.client.channels.cache.get(channelsSet.voiceChannel)

        if (voiceChannel instanceof VoiceChannel) {
            return {
                textChannel: textChannel,
                voiceChannel: voiceChannel,
                number: channelsSet.number
            }
        }

        return null
    }

    getChannelsSets(): RawChannelsSet {
        return this.store.getValue<RawChannelsSet>('channelsSets', [])
    }

    async restrictTextChannelToMembers(textChannel: TextChannel, members: GuildMember[]): Promise<void> {
        await this.restrictPermissionsToMembers(
            textChannel,
            members,
            {deny: ['VIEW_CHANNEL']},
            {allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES']}
        )
    }

    async openAndBlockChannelsSet({textChannel, voiceChannel}: ChannelsSet): Promise<void> {
        const everyone = textChannel.guild.roles.everyone

        await textChannel.overwritePermissions([{
            id: everyone,
            allow: ['VIEW_CHANNEL'],
            deny: ['SEND_MESSAGES']
        }])

        await voiceChannel.overwritePermissions([{
            id: everyone,
            allow: ['VIEW_CHANNEL'],
            deny: ['SPEAK']
        }])
    }

    async deleteChannelsSet({textChannel, voiceChannel, number}: ChannelsSet): Promise<void> {
        await textChannel.delete()
        await voiceChannel.delete()
        const newChannelsSets = this.getChannelsSets().filter(({number: currentNumber}) => currentNumber !== number)
        this.store.setValue('channelsSets', newChannelsSets)
        this.store.save()
    }

    async demuteChannel(voiceChannel: VoiceChannel, members: GuildMember[]): Promise<void> {
        // TODO

        // await this.restrictPermissionsToMembers(
        //     voiceChannel,
        //     members,
        //     {deny: ['VIEW_CHANNEL']},
        //     {allow: ['VIEW_CHANNEL', 'SPEAK']}
        // )
    }

    private async restrictPermissionsToMembers(channel: TextChannel | VoiceChannel, members: GuildMember[], everyonePermissions: PartialsPermissions, membersPermissions: PartialsPermissions) {
        const permissions: OverwriteResolvable[] = [
            {
                id: channel.guild.roles.everyone,
                ...everyonePermissions
            }
        ]

        members.forEach(member => {
            permissions.push({
                id: member,
                ...membersPermissions
            })
        })

        await channel.overwritePermissions(permissions)
    }

    async muteChannel(voiceChannel: VoiceChannel, members: GuildMember[]): Promise<void> {
        // TODO

        // await this.restrictPermissionsToMembers(
        //     voiceChannel,
        //     members,
        //     {deny: ['VIEW_CHANNEL', 'SPEAK']},
        //     {allow: ['VIEW_CHANNEL'], deny: ['SPEAK']}
        // )
    }

    async moveMembersToVoiceChannel(voiceChannel: VoiceChannel, fallbackVoiceChannel: VoiceChannel): Promise<void> {
        for (const member of voiceChannel.members.array()) {
            await member.voice.setChannel(fallbackVoiceChannel)
        }
    }
}
