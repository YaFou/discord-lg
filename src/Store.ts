import Encoder from "./Encoder";
import {readFileSync, writeFile} from "fs";
import {removeElement} from "./Util";

type Id = string

interface Entry {
    id: Id
}

export interface GuildEntry extends Entry {
    categoryChannelId?: string
    fallbackChannelId?: string
    games?: Id[]
}

export interface GameEntry extends Entry {
    room: {
        id: number
        textChannel: string
        voiceChannel: string
    }
    guildId: Id
}

type EntryType = 'guild' | 'game'

export default interface Store {
    create<T extends Entry>(type: EntryType, entry: T): void

    has(type: EntryType, id: Id): Boolean

    get<T extends Entry>(type: EntryType, id: Id): T

    getAll<T extends Entry>(type: EntryType): T[]

    save<T extends Entry>(type: EntryType, entry: T): void

    delete<T extends Entry>(type: EntryType, entry: T): void
}

export class FileStore implements Store {
    private readonly data: object
    private isWriting = false

    constructor(private file: string, private encoder: Encoder) {
        this.data = encoder.decode(readFileSync(file).toString())
    }

    create<T extends Entry>(type: EntryType, entry: T): void {
        this.getAllEntries(type)[entry.id] = entry
    }

    getAll<T extends Entry>(type: EntryType): T[]
    {
        return Object.values(this.getAllEntries<T>(type))
    }

    private write(): void {
        if (!this.isWriting) {
            this.isWriting = false
            writeFile(this.file, this.encoder.encode(this.data), () => this.isWriting = false)
        }
    }

    get<T extends Entry>(type: EntryType, id: Id): T {
        return this.has(type, id) ? this.getAllEntries(type)[id] : null
    }

    has(type: EntryType, id: Id): Boolean {
        return this.getAllEntries(type)[id] !== undefined
    }

    private getAllEntries<T extends Entry>(type: EntryType): T[] {
        if (this.data[type] === undefined) {
            this.data[type] = {}
        }

        return this.data[type]
    }

    save<T extends Entry>(type: EntryType, entry: T) {
        if (!this.has(type, entry.id)) {
            this.create(type, entry)
        }

        this.getAllEntries(type)[entry.id] = entry
        this.write()
    }

    delete<T extends Entry>(type: EntryType, entry: T) {
        delete this.getAllEntries(type)[entry.id]
        this.write()
    }
}
