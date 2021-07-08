import {unlink, writeFile} from "fs";
import Encoder from "./Encoder";
import {FileTranslator, trans} from "./Translator";

describe('FileTranslator', () => {
    beforeAll(() => writeFile('__test', 'data', () => {}))

    test('should call encoder', () => {
        const encoder: Encoder = {
            encode(data: object): string {
                return ''
            },
            decode(data: string): object {
                return {'game.global.newDay': 'sunrise: day %day%'}
            }
        }

        const translator = new FileTranslator('__test', encoder)
        expect(translator.translate(trans('game.newDay', {day: 1}))).toBe('sunrise: day 1')
    })

    afterAll(() => unlink('__test', () => {}))
})

describe('TranslatableString', () => {
    const string = trans('game.newDay', {day: 1})

    test('replace no argument', () => {
        expect(string.translate('string')).toBe('string')
    })

    test('replace argument', () => {
        expect(string.translate('string %day%')).toBe('string 1')
    })

    test('replace argument twice', () => {
        expect(string.translate('%day% string %day%')).toBe('1 string 1')
    })
})
