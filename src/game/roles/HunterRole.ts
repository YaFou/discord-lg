import Role, {Camp} from "./Role";

export default class HunterRole implements Role {
    readonly camp: Camp = Camp.VILLAGE
    readonly description: string = 'A sa mort, le chasseur peut tirer une dernière balle à une personne.'
    readonly name: string = 'Chasseur'
}
