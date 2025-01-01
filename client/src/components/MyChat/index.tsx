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
      <Stack fontSize="12px" color="#333" mb="4px">
        {props.time}
      </Stack>
      <Stack
        p="12px"
        boxShadow="0px 0px 10px 4px rgba(0, 0, 0, 0.1)"
        bgcolor="#FAE54D"
        borderRadius="8px"
        alignSelf="flex-end"
      >
        {props.content}
      </Stack>
    </Stack>
  )
}
