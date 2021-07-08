import {GuildMember} from "discord.js";
import Role from "./Role";

export default class Player {
    constructor(readonly user: GuildMember, readonly role: Role) {
    }
}
