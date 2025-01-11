export const enum MoveType {
  together = 1,
  driveCarAlone,
  driveCarWithPerson,
  rideCar,
  goAlone,
}

export const enum CurrentStatus {
  null,
  arriveChurch,
  arriveAuditorium,
}

export enum PermissionType {
  superUser,
  admin,
  userList,
  carpooling,
  permissionManage,
  showRoomAssignment,
  roomManage,
  showGroupAssignment,
  groupManage,
  dashBoard,
  deposit,
  editUserData,
  editTeamScore,
  deleteUser,
}

export enum Days {
  firstDay,
  secondDay,
  thirdDay,
  fourthDay,
}

export enum InOutType {
  IN = "in",
  OUT = "out",
}
