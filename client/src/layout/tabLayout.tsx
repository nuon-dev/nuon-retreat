import { Box, Stack } from "@mui/material"
import Tab from "components/tab"
import { ReactElement } from "react"
import styles from "./tabLayout.module.css"

export default function TabLayout({ children }: { children: ReactElement }) {
  return (
    <Stack className={styles["tab-layout-root"]}>
      <Box className={styles["inner"]}>{children}</Box>
      <Tab />
    </Stack>
  )
}
