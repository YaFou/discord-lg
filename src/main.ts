import Kernel from "./Kernel";
import {Client} from "discord.js";
import dotenv from 'dotenv'

dotenv.config()

const kernel = new Kernel({
    client: new Client(),
    token: process.env.BOT_TOKEN,
    translationsDirectory: 'assets/translations'
})

kernel.login()
