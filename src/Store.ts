import {existsSync, readFile, writeFile} from 'fs'
import Logger from "./Logger";

export default interface Store {
    save(): void

    load(): void

    getValue<T>(key: string, defaultValue: T): T
}

export abstract class AbstractStore implements Store {
    protected data = {}

    abstract save(): void;

    abstract load(): void

    getValue<T>(key: string, defaultValue: T): T {
        let value = this.data[key]

        if (!value) {
            value = this.data[key] = defaultValue
        }

        return value
    }
}

export abstract class FileStore extends AbstractStore {
    constructor(private file: string, private logger: Logger) {
        super();
    }

    save() {
        writeFile(this.file, this.encodeData(this.data), error => this.logError(error))
    }

    private logError(error: Error) {
        if (!error) {
            return
        }

        this.logger.error(error.message)
    }

    protected abstract encodeData(data: object): string

    load() {
        if (!existsSync(this.file)) {
            writeFile(this.file, this.encodeData({}), error => this.logError(error))

            return
        }

        readFile(this.file, (error, data) => {
            this.logError(error)

            if (error) {
                return
            }

            this.data = this.decodeData(data.toString())
        })
    }

    protected abstract decodeData(data: string): object
}

export class JsonFileStore extends FileStore {
    protected encodeData(data: object): string {
        return JSON.stringify(data)
    }

    protected decodeData(data: string): object {
        return JSON.parse(data)
    }
}
