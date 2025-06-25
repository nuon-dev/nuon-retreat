import { Stack } from "@mui/material"

interface IPops {
  content: string
  time: string
}

export default function MyChat(props: IPops) {
  return (
    <Stack
      mx="16px"
      my="6px"
      direction="row"
      justifyContent="flex-end"
      alignItems="flex-end"
      gap="12px"
    >
      <Stack fontSize="12px" color="#5D4431" mb="4px">
        {props.time}
      </Stack>
      <Stack
        p="10px"
        color="#F2E8DE"
        boxShadow="0px 0px 10px 4px rgba(0, 0, 0, 0.1)"
        bgcolor="#ec6c41"
        borderRadius="12px"
        alignSelf="flex-end"
        fontFamily="Cafe24OhsquareAir"
      >
        {props.content}
      </Stack>
    </Stack>
  )
}
