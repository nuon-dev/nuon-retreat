import { InOutInfo } from "@entity/inOutInfo"
import { HowToMove, MoveType } from "@entity/types"
import { User } from "@entity/user"
import { Box, Button, Stack } from "@mui/material"
import { Dispatch, SetStateAction } from "react"

interface IProps {
  user: User
  inOutData: Array<InOutInfo>
  reloadFunction: () => void
  setEditMode: Dispatch<SetStateAction<boolean>>
}

export default function ReceiptResult(props: IProps) {
  return (
    <Stack padding="6px" minWidth="340px" gap="16px" color="white">
      <InfoStack title="이름" content={props.user.name} />
      <InfoStack title="전화번호" content={props.user.phone} />
      <InfoStack title="출생년도" content={props.user.age + " 년생"} />
      <InfoStack
        title="성별"
        content={props.user.sex === "man" ? "남" : "여"}
      />
      <InfoStack
        title="소속 마을 / 다락방"
        content={props.user.village + " 마을 / " + props.user.darak + " 다락방"}
      />
      <InfoStack
        title="수련회장 이동 방법"
        content={getHowToMoveString(props.user.howToGo)}
      />
      {props.inOutData.map((inout, index) => {
        return (
          <Stack
            key={index}
            bgcolor="white"
            borderRadius="12px"
            p="12px"
            gap="12px"
            color="#1d321a"
          >
            <Stack direction="row" gap="8px">
              <Box>{inout.day + 15}일</Box>
              <Box>{inout.time}시에 </Box>
            </Stack>
            <Stack direction="row" gap="8px">
              <Box>{getMoveTypeString(inout.howToMove)} 타고 </Box>
              <Box>{inout.inOutType === "in" ? "나가기" : "들어오기"}</Box>
            </Stack>
          </Stack>
        )
      })}
      <InfoStack
        title="주일날 교회로 오는 방법"
        content={getHowToMoveString(props.user.howToLeave)}
      />
      <InfoStack
        title="금요일 출근 예정이신가요?"
        content={props.user.isOutAtThursday === "true" ? "예" : "아니요"}
      />
      {props.user.etc && (
        <InfoStack title="기타 사항" content={props.user.etc} />
      )}
      <Button
        variant="contained"
        onClick={() => props.setEditMode(true)}
        style={{ fontSize: "18px", backgroundColor: "white", color: "#1d321a" }}
      >
        수정하기
      </Button>
    </Stack>
  )
}

function InfoStack({ title, content }: { title: string; content: string }) {
  return (
    <Stack gap="12px">
      <Box>{title}</Box>
      <Box
        p="12px"
        color="#1d321a"
        borderRadius="12px"
        bgcolor="white"
        lineHeight="20px"
        alignItems="center"
      >
        {content}
      </Box>
    </Stack>
  )
}

export function getHowToMoveString(howToMove: HowToMove) {
  switch (howToMove) {
    case HowToMove.driveCarAlone:
      return "자차 (카풀 불가)"
    case HowToMove.driveCarWithPerson:
      return "자차 (카풀 가능, 이동 방법을 추가해주세요)"
    case HowToMove.goAlone:
      return "대중교통 (여주역)"
    case HowToMove.etc:
      return "기타 (하단에 메모)"
    case HowToMove.rideCar:
      return "카풀 신청 (이동 방법을 추가해주세요)"
    case HowToMove.together:
      return "교회 버스로"
  }
}

export function getMoveTypeString(moveType: MoveType) {
  switch (moveType) {
    case MoveType.driveCarWithPerson:
      return "자차 이동(카풀 가능)"
    case MoveType.driveCarAlone:
      return "자차 이동(카풀 불가)"
    case MoveType.rideCar:
      return "카풀 요청"
    case MoveType.goAlone:
      return "대중교통 (여주역)"
  }
}
