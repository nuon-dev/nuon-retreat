import crypto from 'crypto'
import dotenv from 'dotenv'

const env = dotenv.config().parsed

export const hashCode = function(content: string) {
    return crypto.createHash('sha512').update(content + env.HASH_KEY).digest('hex')
  }
  