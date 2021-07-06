import {AbstractCommand} from "./Command";
import {Message, MessageEmbed} from "discord.js";
import VillagerRole from "../game/roles/VillagerRole";
import WerewolfRole from "../game/roles/WerewolfRole";
import Role from "../game/roles/Role";

export default class RolesCommand extends AbstractCommand {
    execute(message: Message): void {
        const roles: Role[] = [
            new VillagerRole(),
            new WerewolfRole()
        ]

        const embed = new MessageEmbed()
            .setTitle('Rôles')
            .addFields(...roles.map(role => {
                return {
                    name: `${role.name} | Camp : ${role.camp}`,
                    value: role.description
                }
            }))

        this.interactor.reply(message, embed)
    }

    getDescription(): string {
        return 'Affiche les rôles disponibles'
    }

    getName(): string {
        return 'roles'
    }
}
