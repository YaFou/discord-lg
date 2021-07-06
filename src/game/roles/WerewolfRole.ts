import Role, {Camp} from "./Role";

export default class WerewolfRole implements Role {
    readonly camp: Camp = Camp.WEREWOLVES
    readonly description: string = 'Avec ses compères, le loup garou doit éliminer tous les villageois.'
    readonly name: string = 'Loup garou'
}
