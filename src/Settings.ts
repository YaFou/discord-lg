import dotenv from 'dotenv'

dotenv.config()

// export const VOTE_POLL_TIME = 120
// export const WEREWOLVES_POLL_TIME = 90
// export const DESTROY_TIME = 60
// export const CLAIRVOYANCE_CHOICE_TIME = 30
// export const HUNTER_POLL_TIME = 30
// export const CLAIRVOYANCE_WAIT_TIME = 10
// export const CUPID_CHOICE_TIME = 30
export const VOTE_POLL_TIME = 30
export const WEREWOLVES_POLL_TIME = 30
export const DESTROY_TIME = 60
export const CLAIRVOYANCE_CHOICE_TIME = 30
export const HUNTER_CHOICE_TIME = 30
export const CLAIRVOYANCE_WAIT_TIME = 10
export const CUPID_CHOICE_TIME = 30

export const CATEGORY_CHANNEL_ID = process.env.CATEGORY_CHANNEL_ID
export const FALLBACK_CHANNEL_ID = process.env.FALLBACK_CHANNEL_ID
export const BOT_TOKEN = process.env.BOT_TOKEN
