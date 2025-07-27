import { Box } from "@mui/material"
import { AttendData } from "@server/entity/attendData"
import { AttendStatus } from "@server/entity/types"

interface AttendCellProps {
  attendData: AttendData | undefined
}

export default function AttendCell({ attendData }: AttendCellProps) {
  if (!attendData) {
    return (
      <Box
        width="100%"
        height="100%"
        textAlign="center"
        alignContent="center"
        justifyContent="center"
      >
        -
      </Box>
    )
  }

  if (attendData.isAttend === AttendStatus.ATTEND) {
    return (
      <Box
        width="100%"
        height="100%"
        textAlign="center"
        alignContent="center"
        justifyContent="center"
        style={{ backgroundColor: "rgb(184, 248,93)" }}
      >
        출석
      </Box>
    )
  }

  if (attendData.isAttend === AttendStatus.ABSENT) {
    return (
      <Box
        width="100%"
        height="100%"
        textAlign="center"
        alignContent="center"
        justifyContent="center"
        style={{ backgroundColor: "rgb(240, 148, 128)" }}
      >
        {attendData.memo}
      </Box>
    )
  }

  if (attendData.isAttend === AttendStatus.ETC) {
    return (
      <Box
        width="100%"
        height="100%"
        textAlign="center"
        alignContent="center"
        justifyContent="center"
        style={{ backgroundColor: "rgb(253,241,113)" }}
      >
        {attendData.memo}
      </Box>
    )
  }
}