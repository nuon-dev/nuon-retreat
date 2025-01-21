import { Box, Stack } from "@mui/material"
import styles from "./index.module.css"
import { ChatButton } from "types/retreat"

interface IPops {
  content: string
  time: string
  buttons?: ChatButton[]
}

export default function BotChat(props: IPops) {
  return (
    <Stack direction="row" gap="12px" mx="12px" className={styles["chat"]}>
      <Box minWidth="40px" height="40px" bgcolor="blue" borderRadius="16px" />
      <Stack>
        <Stack color="#333">새벽이</Stack>
        <Stack
          my="6px"
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-end"
          gap="12px"
        >
          <Stack
            p="10px"
            boxShadow="0px 0px 10px 4px rgba(0, 0, 0, 0.1)"
            bgcolor="#fff"
            borderRadius="12px"
            alignSelf="flex-end"
          >
            {props.content}
            {props.buttons && props.buttons.length > 0 && (
              <Stack mt="12px" gap="8px">
                {props.buttons?.map((button, index) => (
                  <Stack
                    key={index}
                    px="20px"
                    py="16px"
                    fontSize="16px"
                    bgcolor="#f8f8f8"
                    border="1px solid #ddd"
                    borderRadius="4px"
                    onClick={button.onClick}
                    textAlign="center"
                  >
                    {button.content}
                  </Stack>
                ))}
              </Stack>
            )}
          </Stack>
          <Stack fontSize="12px" color="#333" mb="4px">
            {props.time}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}
