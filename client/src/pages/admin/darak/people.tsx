import { type Group } from "@server/entity/group"
import { Box, Stack } from "@mui/material"
import Header from "components/AdminHeader"
import { useEffect, useMemo, useState } from "react"
import { get, post } from "pages/api"

export enum GroupType {
  DARAKBANG = "DARAKBANG",
  VILLAGE = "VILLAGE",
}

export default function People() {
  const [groupList, setGroupList] = useState<Group[]>([])
  const [selectedVillage, setSelectedVillage] = useState<Group | undefined>(
    undefined
  )

  useEffect(() => {
    fetchData()
    //addEventListener("mousemove", mousemoveListener)
    //return () => removeEventListener("mousemove", mousemoveListener)
  }, [])

  async function fetchData() {
    const data = await get("/admin/group")
    setGroupList(data)
  }

  const villageList = useMemo(() => {
    return groupList.filter((group) => group.groupType === GroupType.VILLAGE)
  }, [groupList])

  async function 다락방(group: Group) {
    const userList = await get(`/admin/group/user-list/${group.id}`)
    console.log(userList)
    return <></>
  }

  return (
    <Stack>
      <Header />
      <Stack direction="row" gap="4px" p="4px">
        {villageList.map((village) => (
          <Box
            p="4px"
            borderRadius="4px"
            border="1px solid #ccc"
            onClick={() => setSelectedVillage(village)}
            sx={{
              cursor: "pointer",
            }}
          >
            {village.name}
          </Box>
        ))}
      </Stack>
      <Stack>
        {groupList
          .filter((group) => group.parentId === selectedVillage?.id)
          .map((group) => 다락방(group))}
      </Stack>
    </Stack>
  )
}
