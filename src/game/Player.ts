import {GuildMember} from "discord.js";
import Role from "./roles/Role";

export default class Player {
    constructor(readonly member: GuildMember, public role: Role) {
    }
}