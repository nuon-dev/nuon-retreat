import crypto from 'crypto'
import dotenv from 'dotenv'

const env = dotenv.config().parsed

export const hashCode = function(content: string) {
  return crypto.createHash('sha512').update(content + env.HASH_KEY).digest('hex')
}

export function isTokenExpire(expire: Date){
  if(expire.getTime() < new Date().getTime()){
    return true
  }
  return false
}
  