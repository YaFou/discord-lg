import Role, {Camp} from "./Role";

export default class CupidRole implements Role {
    readonly camp: Camp = Camp.VILLAGE
    readonly description: string = 'Le cupidon tire deux flèches qui formeront un couple éternel.'
    readonly name: string = 'Cupidon'
}
