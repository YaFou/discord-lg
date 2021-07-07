export default interface Encoder {
    encode(data: object): string
    decode(data: string): object
}

export class JsonEncoder implements Encoder {
    decode(data: string): object {
        return JSON.parse(data)
    }

    encode(data: object): string {
        return JSON.stringify(data)
    }
}
