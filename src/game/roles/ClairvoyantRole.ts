import Role, {Camp} from "./Role";

export default class ClairvoyantRole implements Role {
    readonly camp: Camp = Camp.VILLAGE
    readonly description: string = "Chaque nuit, la voyante peut voir le rôle d'une personne dans sa boule de crystal."
    readonly name: string = 'Voyante'
}
