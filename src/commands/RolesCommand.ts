import {AbstractCommand} from "./Command";
import {Message, MessageEmbed} from "discord.js";
import VillagerRole from "../game/roles/VillagerRole";
import WerewolfRole from "../game/roles/WerewolfRole";
import Role from "../game/roles/Role";
import ClairvoyantRole from "../game/roles/ClairvoyantRole";
import LittleGirlRole from "../game/roles/LittleGirlRole";
import HunterRole from "../game/roles/HunterRole";
import CupidRole from "../game/roles/CupidRole";

export default class RolesCommand extends AbstractCommand {
    execute(message: Message): void {
        const roles: Role[] = [
            new VillagerRole(),
            new WerewolfRole(),
            new ClairvoyantRole(),
            new LittleGirlRole(),
            new HunterRole(),
            new CupidRole()
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
