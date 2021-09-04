import {Stringable, trans} from "../Translator";

export type Role = {
    name: Stringable
    description: Stringable
    camp: Camp
    canBeMany: Boolean
}

type Camp = {
    name: Stringable
}

export const Camps = {
    VILLAGE: {
        name: trans('game.camp.village', {})
    },
    WEREWOLVES: {
        name: trans('game.camp.werewolves', {})
    }
}

export const Roles = {
    VILLAGER: {
        name: trans('game.role.villager', {}),
        description: trans('game.role.villager.description', {}),
        camp: Camps.VILLAGE,
        canBeMany: true
    },
    WEREWOLF: {
        name: trans('game.role.werewolf', {}),
        description: trans('game.role.werewolf.description', {}),
        camp: Camps.WEREWOLVES,
        canBeMany: true
    },
    LITTLE_GIRL: {
        name: trans('game.role.littleGirl', {}),
        description: trans('game.role.littleGirl.description', {}),
        camp: Camps.VILLAGE,
        canBeMany: false
    },
    ORACLE: {
        name: trans('game.role.oracle', {}),
        description: trans('game.role.oracle.description', {}),
        camp: Camps.VILLAGE,
        canBeMany: false
    },
    HUNTER: {
        name: trans('game.role.hunter', {}),
        description: trans('game.role.hunter.description', {}),
        camp: Camps.VILLAGE,
        canBeMany: false
    },
    WITCH: {
        name: trans('game.role.witch', {}),
        description: trans('game.role.witch.description', {}),
        camp: Camps.VILLAGE,
        canBeMany: false
    }
}

export const RolesArray: Role[] = Object.values(Roles)

export function getRolesByCamp(camp: Camp) {
    return RolesArray.filter(role => role.camp === camp)
}
