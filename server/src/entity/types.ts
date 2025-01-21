export const enum HowToMove {
  none = 0,
  together = 1,
  driveCarAlone,
  driveCarWithPerson,
  rideCar,
  goAlone,
  etc,
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
  firstDay = 1,
  secondDay,
  thirdDay,
}

export enum InOutType {
  none = "none",
  IN = "in",
  OUT = "out",
}
