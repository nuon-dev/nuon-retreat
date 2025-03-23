import { Box, Button, Stack } from "@mui/material"
import { InOutInfo } from "@server/entity/retreat/inOutInfo"
import { RetreatAttend } from "@server//entity/retreat/retreatAttend"
import { HowToMove } from "@server/entity/types"
import { User } from "@server/entity/user"
import { Dispatch, SetStateAction } from "react"

interface IProps {
  retreatAttend: RetreatAttend | undefined
  inOutData: Array<InOutInfo>
  reloadFunction: () => void
  setEditMode: Dispatch<SetStateAction<boolean>>
}

export default function ReceiptResult(props: IProps) {
  if (!props.retreatAttend) return <div>로딩중</div>

  return (
    <Stack padding="6px" minWidth="340px" gap="16px" color="white">
      <InfoStack title="이름" content={props.retreatAttend.user.name} />
      <InfoStack title="전화번호" content={props.retreatAttend.user.phone} />
      <InfoStack
        title="출생년도"
        content={props.retreatAttend.user.yearOfBirth + " 년생"}
      />
      <InfoStack
        title="성별"
        content={props.retreatAttend.user.gender === "man" ? "남" : "여"}
      />
      <InfoStack
        title="소속 마을 / 다락방"
        content={
          props.retreatAttend.user.community?.parent?.name +
          " 마을 / " +
          props.retreatAttend.user.community?.name +
          " 다락방"
        }
      />
      <InfoStack title="수련회장 이동 방법" content={"asd"} />
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
              <Box>{inout.inOutType === "in" ? "들어오기" : "나가기"}</Box>
            </Stack>
          </Stack>
        )
      })}
      <InfoStack
        title="주일날 교회로 오는 방법"
        content=""
        //content={getHowToMoveString(props.user.howToLeave)}
      />
      <InfoStack
        title="금요일 출근 예정이신가요?"
        content=""
        //content={props.user.isOutAtThursday === "true" ? "예" : "아니요"}
      />
      {props.retreatAttend.user.etc && (
        <InfoStack title="기타 사항" content={props.retreatAttend.user.etc} />
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

export function getHowToMoveString(howToMove: HowToMove): string {
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
  return ""
}

export function getMoveTypeString(moveType: HowToMove) {
  switch (moveType) {
    case HowToMove.driveCarWithPerson:
      return "자차 (카풀 가능)"
    case HowToMove.driveCarAlone:
      return "자차 (카풀 불가)"
    case HowToMove.rideCar:
      return "신청한 카풀"
    case HowToMove.goAlone:
      return "대중교통 (여주역)"
  }
}
