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
    villager: {
        name: trans('game.role.villager', {}),
        description: trans('game.role.villager.description', {}),
        camp: Camps.VILLAGE,
        canBeMany: true
    },
    werewolf: {
        name: trans('game.role.werewolf', {}),
        description: trans('game.role.werewolf.description', {}),
        camp: Camps.WEREWOLVES,
        canBeMany: true
    },
    littleGirl: {
        name: trans('game.role.littleGirl', {}),
        description: trans('game.role.littleGirl.description', {}),
        camp: Camps.VILLAGE,
        canBeMany: false
    },
    oracle: {
        name: trans('game.role.oracle', {}),
        description: trans('game.role.oracle.description', {}),
        camp: Camps.VILLAGE,
        canBeMany: false
    }
}

export const RolesArray: Role[] = Object.values(Roles)

export function getRolesByCamp(camp: Camp) {
    return RolesArray.filter(role => role.camp === camp)
}
