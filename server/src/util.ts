import crypto from 'crypto'
import dotenv from 'dotenv'
import { PermissionType } from './entity/types'
import { userDatabase } from './model/dataSource'

const env = dotenv.config().parsed || {}

export const hashCode = function(content: string) {
  return crypto.createHash('sha512').update(content + env.HASH_KEY).digest('hex')
}

export function isTokenExpire(expire: Date){
  if(expire.getTime() < new Date().getTime()){
    return true
  }
  return false
}
  
export async function hasPermission(token: string | undefined, permissionType: PermissionType): Promise<boolean>{
  const foundUser = await userDatabase.findOne({
    where:{
        token,
    },
    relations: {
        permissions: true,
    }
  })

  if(!foundUser){
    console.log('사용자를 찾을 수 없음')
      return false;
  }

  if(isTokenExpire(foundUser.expire)){
      console.log('토큰이 만료됨')
      return false
  }
  
  if(foundUser.isSuperUser){
    console.log('최고 사용자 접근')
    return true
  }

  const userListPermission = foundUser.permissions.find(permission => permission.permissionType === permissionType)
    
  if(userListPermission && userListPermission.have){
    console.log('권한 있는 사용자')
    return true
  }

  console.log('권한 없는 사용자')
  return false
}