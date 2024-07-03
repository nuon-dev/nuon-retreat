import { Stack } from "@mui/material"
import TabLayout from "layout/tabLayout"
import { useRouter } from "next/router"

function index() {
  const { push } = useRouter()

  return (
    <TabLayout>
      <Stack>asd</Stack>
    </TabLayout>
  )
}

export default index
