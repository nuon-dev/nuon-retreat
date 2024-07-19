import { Box, Stack } from "@mui/material"
import styles from "./tab.module.css"
import { atom, useRecoilState } from "recoil"
import { SelectedTab, Tabs } from "state/tab"

export default function Tab() {
  const [selectedTab, setSelectedTab] = useRecoilState(SelectedTab)

  function onClickTab(tab: Tabs) {
    setSelectedTab(tab)
  }

  return (
    <Stack
      className={styles["tab-area"]}
      direction="row"
      justifyContent="space-around"
      alignItems="center"
    >
      <Stack flex={1} textAlign="center" onClick={() => onClickTab(Tabs.Home)}>
        Home
      </Stack>
      <Stack
        flex={1}
        textAlign="center"
        width="40px"
        onClick={() => onClickTab(Tabs.Receipt)}
      >
        Receipt
      </Stack>
      <Stack
        flex={1}
        textAlign="center"
        width="40px"
        onClick={() => onClickTab(Tabs.Info)}
      >
        Info
      </Stack>
      {/*
      <Stack
        flex={1}
        textAlign="center"
        width="40px"
        onClick={() => onClickTab(Tabs.MyPage)}
      >
        MyPage
      </Stack>
      */}
    </Stack>
  )
}
