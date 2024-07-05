import { Select, Stack } from "@mui/material"

export default function Edit({ onClose }: { onClose: () => void }) {
  return (
    <Stack
      position="fixed"
      width="100vw"
      height="100vh"
      onClick={onClose}
      bgcolor="rgb(0,0,0,0.5)"
      padding="10%"
    >
      <Stack
        onClick={(e) => e.stopPropagation()}
        bgcolor="white"
        borderRadius="12px"
        minHeight="90%"
        p="12px"
      >
        이 화면을 일정 추가하는거 처럼 접수를 받아야 하는데.. <br />
        어떻게 디자인 할 것인가? <br />
        <br />
        받아야 하는 정보:
        <br />
        이름, 전화번호, 생년월일, 성별, 참석방법 (수련회장 가는 방법), 교회로
        오는 방법(버스 or 자차),기타 사항
        <br /> <br />
        아니면 위치나 시간은 여기서 적고 개인 정보는 마이페이지에서? 그렇다면
        접수하고 마이페이지 수정 안하면? =&gt; 자연스러운 UX 필요
        <br /> <br />
        수련회 참석 날짜
        <Select />
      </Stack>
    </Stack>
  )
}
