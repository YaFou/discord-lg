import Player from "../Player";

export default interface Role {
    readonly name: string
    readonly description: string
    readonly camp: Camp
}

export enum Camp {
    VILLAGE = 'Village',
    WEREWOLVES = 'Loups garous'
}

export function filterPlayersByCamp(players: Player[], camp: Camp): Player[] {
    return players.filter(player => player.role.camp === camp)
}
