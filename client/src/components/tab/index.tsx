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
      <Stack onClick={() => onClickTab(Tabs.Home)}>Home</Stack>
      <Stack onClick={() => onClickTab(Tabs.Etc)}>Etc</Stack>
      <Stack onClick={() => onClickTab(Tabs.MyPage)}>MyPage</Stack>
    </Stack>
  )
}
