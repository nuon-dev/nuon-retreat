import { Stack } from "@mui/material"
import styles from "./tab.module.css"
import { useSetRecoilState } from "recoil"
import { SelectedTab, Tabs } from "state/tab"

export default function Tab() {
  const setSelectedTab = useSetRecoilState(SelectedTab)

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
      <Stack
        flex={1}
        height="100%"
        alignItems="center"
        justifyContent="center"
        border="1px solid #ccc"
        onClick={() => onClickTab(Tabs.Receipt)}
      >
        <img className={styles["icon"]} src="free-icon-registration.png" />
      </Stack>
      <Stack
        flex={1}
        height="100%"
        alignItems="center"
        justifyContent="center"
        border="1px solid #ccc"
        onClick={() => onClickTab(Tabs.Home)}
      >
        <img className={styles["icon"]} src="free-icon-schedule.png" />
      </Stack>
      <Stack
        flex={1}
        height="100%"
        alignItems="center"
        justifyContent="center"
        border="1px solid #ccc"
        onClick={() => onClickTab(Tabs.Info)}
      >
        <img className={styles["icon"]} src="free-icon-info.png" />
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
