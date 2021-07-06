import Role, {Camp} from "./Role";

export default class VillagerRole implements Role {
    readonly camp: Camp = Camp.VILLAGE
    readonly description: string = 'Le simple villageois doit déduire et éliminer tous les loups garous.'
    readonly name: string = 'Simple villageois'
}