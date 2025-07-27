import { Box, Stack } from "@mui/material"
import { User } from "@server/entity/user"
import { AttendData } from "@server/entity/attendData"
import { WorshipSchedule } from "@server/entity/worshipSchedule"
import AttendCell from "./AttendCell"

interface AttendanceTableProps {
  soonList: User[]
  attendDataList: AttendData[]
  worshipScheduleMapList: WorshipSchedule[]
  leaders: User[]
  getAttendUserCount: (attendDataList: AttendData[], worshipScheduleId: number) => { count: number; attend: number }
}

export default function AttendanceTable({
  soonList,
  attendDataList,
  worshipScheduleMapList,
  leaders,
  getAttendUserCount
}: AttendanceTableProps) {
  return (
    <Stack margin="4px" maxHeight="100%" padding="8px">
      {/* Table Header */}
      <Stack
        pt="10px"
        top="0px"
        position="sticky"
        height="40px"
        direction="row"
        alignItems="center"
        textAlign="center"
        bgcolor="white"
      >
        <Stack
          width="122px"
          height="100%"
          direction="row"
          whiteSpace="pre"
          alignItems="center"
          justifyContent="center"
          border="1px solid #555"
        >
          <Box fontSize="12px">순장수 </Box>
          <Box color="blue" fontWeight="bold">
            {leaders.filter((user) => user.gender === "man").length}
          </Box>
          {" / "}
          <Box color="red" fontWeight="bold">
            {leaders.filter((user) => user.gender === "woman").length}
          </Box>
        </Stack>
        {worshipScheduleMapList.map((worshipSchedule) => {
          return (
            <Stack
              width="109px"
              height="100%"
              justifyContent="center"
              borderTop="1px solid #555"
              borderRight="1px solid #555"
              borderBottom="1px solid #555"
              key={worshipSchedule.id}
            >
              {worshipSchedule.date}
              <br />(
              {getAttendUserCount(attendDataList, worshipSchedule.id).attend}/
              {getAttendUserCount(attendDataList, worshipSchedule.id).count}){" "}
              {Math.round(
                (getAttendUserCount(attendDataList, worshipSchedule.id)
                  .attend /
                  getAttendUserCount(attendDataList, worshipSchedule.id)
                    .count) *
                  100
              )}
              %
            </Stack>
          )
        })}
      </Stack>

      {/* Table Body */}
      {soonList.map((user) => (
        <Stack
          key={user.id}
          direction="row"
          bgcolor={
            user.community?.leader?.id === user.id
              ? "#999"
              : user.community?.deputyLeader?.id === user.id
              ? "#ccc"
              : "transparent"
          }
          alignItems="center"
          height="40px"
          border="1px solid #555"
        >
          <Stack
            padding="10px"
            height="100%"
            width="102px"
            justifyContent="center"
            color={user.gender === "man" ? "blue" : "red"}
            borderRight="1px solid #555"
          >
            {user.name} ({user.yearOfBirth})
          </Stack>
          {worshipScheduleMapList.map((worshipSchedule) => {
            const attendData = attendDataList.find(
              (data) =>
                data.user.id === user.id &&
                data.worshipSchedule.id === worshipSchedule.id
            )
            return (
              <Stack
                height="100%"
                width="109px"
                direction="row"
                textAlign="center"
                alignItems="center"
                key={worshipSchedule.id}
                borderRight="1px solid #555"
              >
                <AttendCell attendData={attendData} />
              </Stack>
            )
          })}
        </Stack>
      ))}
    </Stack>
  )
}