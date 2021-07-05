const we = {
    name: 'Loup garou'
}

enum Role {
    VILLAGER = 'Villageois',
    WEREWOLF = 'Loup garou'
}

enum Camp {
    VILLAGE = 'Village',
    WEREWOLF = 'Loups garous'
}

export function getCamp(role: Role): Camp {
    switch (role) {
        case Role.VILLAGER:
            return Camp.VILLAGE

        case Role.WEREWOLF:
            return Camp.WEREWOLF
    }

    return null
}

export default Role
