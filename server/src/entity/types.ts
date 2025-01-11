export const enum HowToMove {
  together = "1",
  driveCarAlone = "2",
  driveCarWithPerson = "3",
  rideCar = "4",
  goAlone = "5",
  etc = "6",
}

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
  communityManage,
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
}

export enum InOutType {
  IN = "in",
  OUT = "out",
}
