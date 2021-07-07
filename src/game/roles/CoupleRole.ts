import Role, {Camp} from "./Role";
import Player from "../Player";

export default class CoupleRole implements Role {
    constructor(readonly role: Role, readonly inLoveWith: Player) {
    }

    readonly camp: Camp = this.role.camp
    readonly description: string = this.role.description
    readonly name: string = this.role.name
}
