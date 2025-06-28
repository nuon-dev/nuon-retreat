import { Stack } from "@mui/material"
import styles from "./index.module.css"
import { ChatButton } from "@/types/retreat"
import Image from "next/image"
import { useAtomValue } from "jotai"
import { isEvenAtom } from "@/state/retreat"

interface IPops {
  content: string
  time: string
  buttons?: ChatButton[]
}

export default function BotChat(props: IPops) {
  const isEven = useAtomValue(isEvenAtom)

  return (
    <Stack direction="row" gap="12px" mx="12px" className={styles["chat"]}>
      <Stack minWidth="40px" height="40px" borderRadius="16px">
        <Image
          src={isEven ? "/profile_2.png" : "/profile.png"}
          width="40"
          height="40"
          alt=""
          style={{
            borderRadius: "16px",
          }}
        />
      </Stack>
      <Stack>
        <Stack fontFamily="SCDream" fontWeight="500">
          새벽이슬 대학청년부
        </Stack>
        <Stack
          my="6px"
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-end"
          gap="12px"
        >
          <Stack
            p="10px"
            bgcolor="rgba(145, 22, 27, 0.48)"
            color="white"
            fontWeight="200"
            borderRadius="12px"
            alignSelf="flex-end"
            whiteSpace="pre-wrap"
            fontFamily="SCDream"
            boxShadow="0px 0px 10px 4px rgba(0, 0, 0, 0.1)"
          >
            {props.content}
            {props.buttons && props.buttons.length > 0 && (
              <Stack mt="12px" gap="8px">
                {props.buttons?.map((button, index) => (
                  <Stack
                    px="16px"
                    py="14px"
                    key={index}
                    fontSize="16px"
                    bgcolor="rgb(113 22 26)"
                    textAlign="center"
                    borderRadius="24px"
                    onClick={button.onClick}
                    fontFamily="SCDream"
                  >
                    {button.content}
                  </Stack>
                ))}
              </Stack>
            )}
          </Stack>
          <Stack fontSize="12px" color="#5D4431" mb="4px">
            {props.time}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}
