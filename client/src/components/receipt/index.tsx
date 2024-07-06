import { Select, Stack } from "@mui/material"

export default function Receipt() {
  return (
    <Stack p="12px">
      받아야 하는 정보:
      <br />
      이름, 전화번호, 생년월일, 성별, 참석방법 (수련회장 가는 방법), 교회로 오는
      방법(버스 or 자차),기타 사항
      <br /> <br />
      여기에서 모든 정보를 받을 것인가?
      <br />
      이름도? 그럼 마이페이지는 그냥 조회용?
      <br />
      마이페이지의 정보는 나중에 공개 필요 - 나중에 오픈?
      <br /> <br />
      수련회 참석 날짜
      <Select />
    </Stack>
  )
}
