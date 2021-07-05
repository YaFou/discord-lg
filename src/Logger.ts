export default class Logger {
    info(message: string) {
        this.log(LogLevel.INFO, message)
    }

    log(level: LogLevel, message: string) {
        console.log(`[${level}] ${message}`)
    }

    error(message: string) {
        this.log(LogLevel.ERROR, message)
    }
}

export enum LogLevel {
    INFO = 'INFO',
    ERROR = 'ERROR'
}