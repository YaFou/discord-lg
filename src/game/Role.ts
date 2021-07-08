enum Role {
    VILLAGER,
    WEREWOLF
}

export const VILLAGE_CAMP = [Role.VILLAGER]
export const WEREWOLVES_CAMP = [Role.WEREWOLF]

export function canBeMany(role: Role) {
    return true
}

export default Role
