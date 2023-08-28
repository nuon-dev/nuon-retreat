import crypto from "crypto"
import dotenv from "dotenv"
import { PermissionType } from "./entity/types"
import {
  attendInfoDatabase,
  groupAssignmentDatabase,
  permissionDatabase,
  roomAssignmentDatabase,
  userDatabase,
} from "./model/dataSource"
import { User } from "./entity/user"

const env = dotenv.config().parsed || {}

export const hashCode = function (content: string) {
  return crypto
    .createHash("sha512")
    .update(content + env.HASH_KEY)
    .digest("hex")
}

export function isTokenExpire(expire: Date) {
  if (expire.getTime() < new Date().getTime()) {
    return true
  }
  return false
}

export async function hasPermission(
  token: string | undefined,
  permissionType: PermissionType
): Promise<boolean> {
  const foundUser = await userDatabase.findOne({
    where: {
      token,
    },
    relations: {
      permissions: true,
    },
  })

  if (!token) {
    return false
  }

  if (!foundUser) {
    return false
  }

  if (isTokenExpire(foundUser.expire)) {
    return false
  }

  if (foundUser.isSuperUser) {
    return true
  }

  const userListPermission = foundUser.permissions.find(
    (permission) => permission.permissionType === permissionType
  )

  if (userListPermission && userListPermission.have) {
    return true
  }

  return false
}

export async function deleteUser(user: User) {
  const permissionDelete = user.permissions.map(async (permission) => {
    return await permissionDatabase.delete(permission)
  })
  await Promise.all(permissionDelete)
  const inoutInfoDelete = user.inOutInfos.map(async (info) => {
    await attendInfoDatabase.update(
      { rideCarInfo: { id: info.id } },
      { rideCarInfo: null }
    )
    return await attendInfoDatabase.delete(info)
  })
  await Promise.all(inoutInfoDelete)
  await userDatabase.delete({ id: user.id })
  await groupAssignmentDatabase.delete({ id: user.groupAssignment.id })
  await roomAssignmentDatabase.delete({ id: user.roomAssignment.id })
}
