import dotenv from 'dotenv'

dotenv.config()

// export const VOTE_POLL_TIME = 120
// export const WEREWOLVES_POLL_TIME = 90
// export const DESTROY_TIME = 60
export const VOTE_POLL_TIME = 30
export const WEREWOLVES_POLL_TIME = 30
export const DESTROY_TIME = 60

export const CATEGORY_CHANNEL_ID = process.env.CATEGORY_CHANNEL_ID
export const FALLBACK_CHANNEL_ID = process.env.FALLBACK_CHANNEL_ID
export const BOT_TOKEN = process.env.BOT_TOKEN
