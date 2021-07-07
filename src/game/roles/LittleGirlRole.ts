import Role, {Camp} from "./Role";

export default class LittleGirlRole implements Role {
    readonly camp: Camp = Camp.VILLAGE
    readonly description: string = "En se faufilant à travers les murs, la petite fille a la capacité d'observer les loups garous."
    readonly name: string = 'Petite fille'
}
