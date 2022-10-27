import crypto from 'crypto'
import dotenv from 'dotenv'
import { PermissionType } from './entity/permission'
import { userDatabase } from './model/dataSource'

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
  
export async function hasPermission(token: string, permissionType: PermissionType): Promise<boolean>{
  const foundUser = await userDatabase.findOne({
    where:{
        token,
    },
    relations: {
        permissions: true,
    }
  })

  if(!foundUser){
      return false;
  }

  if(isTokenExpire(foundUser.expire)){
      return false
  }
  
  const userListPermission = foundUser.permissions.find(permission => permission.permissionType === permissionType)
    
  if(userListPermission && userListPermission.have){
    return true
  }

  return false
}