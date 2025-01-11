import { type Community } from "@server/entity/community"
import { type User } from "@server/entity/user"
import { Box, Button, Stack } from "@mui/material"
import Header from "components/AdminHeader"
import { get, put } from "pages/api"
import { MouseEvent, useEffect, useState } from "react"

export default function People() {
  const [communityList, setCommunityList] = useState<Community[]>([])
  const [noCommunityUser, setNoCommunityUser] = useState<User[]>([])
  const [selectedRootCommunity, setSelectedRootCommunity] =
    useState<Community | null>(null)
  const [childCommunityList, setChildCommunityList] = useState<Community[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [shiftPosition, setShiftPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    fetchData()
    addEventListener("mousemove", mousemoveListener)
    return () => removeEventListener("mousemove", mousemoveListener)
  }, [])

  useEffect(() => {
    if (selectedRootCommunity) {
      fetchCommunityUserList(selectedRootCommunity.id)
    }
  }, [selectedRootCommunity])

  function mousemoveListener(e: any) {
    const event = e as MouseEvent
    setMousePosition({ x: event.pageX, y: event.pageY })
  }

  async function fetchCommunityUserList(communityId: number) {
    const communityUserListData = await get(
      `/admin/community/user-list/${communityId}`
    )
    setChildCommunityList(communityUserListData)
  }

  async function fetchData() {
    const communityListData = await get("/admin/community")
    setCommunityList(communityListData)
    const noCommunityUserData = await get(
      "/admin/community/no-community-user-list"
    )
    setNoCommunityUser(noCommunityUserData)
  }

  function communityFilter(targetCommunity: Community) {
    if (!selectedRootCommunity) {
      return !targetCommunity.parent
    }
    return targetCommunity.parent?.id === selectedRootCommunity.id
  }

  async function removeCommunityToUser() {
    if (!selectedUser) return
    selectedUser.community = null
    await saveUser(selectedUser)
    setSelectedUser(null)
    if (selectedRootCommunity) {
      await fetchCommunityUserList(selectedRootCommunity.id)
      await fetchData()
    }
  }

  async function setUser(e: MouseEvent, targetCommunity: Community) {
    if (!selectedUser) return
    e.stopPropagation()
    if (
      selectedUser.community &&
      selectedUser.community.id === targetCommunity.id
    ) {
      setSelectedUser(null)
      return
    }
    selectedUser.community = targetCommunity
    await saveUser(selectedUser)
    setSelectedUser(null)
    if (selectedRootCommunity) {
      await fetchCommunityUserList(selectedRootCommunity.id)
      await fetchData()
    }
  }

  async function saveUser(user: User) {
    await put("/admin/soon/update-user", user)
  }

  function selectUser(e: MouseEvent, user: User) {
    e.stopPropagation()
    const target = e.target as HTMLElement
    const shiftX = e.clientX - target.getBoundingClientRect().left
    const shiftY = e.clientY - target.getBoundingClientRect().top
    setShiftPosition({ x: shiftX, y: shiftY })
    setSelectedUser(user)
  }

  function UserBox({ user }: { user: User }) {
    return (
      <Box
        p="4px"
        width="100px"
        borderRadius="4px"
        border="1px solid #ccc"
        onMouseDown={(e) => selectUser(e, user)}
        onClick={(e) => selectUser(e, user)}
        bgcolor="white"
        sx={{
          cursor: "pointer",
        }}
      >
        {user.name} {user.yearOfBirth}
      </Box>
    )
  }

  function CommunityBox(displayCommunity: Community) {
    const myCommunity = childCommunityList.find(
      (community) => community.id === displayCommunity.id
    )

    if (!myCommunity) {
      return (
        <Box
          p="4px"
          borderRadius="4px"
          border="1px solid #ccc"
          onClick={() => setSelectedRootCommunity(displayCommunity)}
        >
          {displayCommunity.name}
        </Box>
      )
    }

    return (
      <Stack
        p="4px"
        borderRadius="4px"
        border="1px solid #ccc"
        onClick={() => setSelectedRootCommunity(displayCommunity)}
        onMouseUp={(e) => setUser(e, displayCommunity)}
        gap="4px"
      >
        {displayCommunity.name}
        {myCommunity.users.map((user) => (
          <UserBox key={user.id} user={user} />
        ))}
      </Stack>
    )
  }

  function getParentCommunityName(community: Community | null): string {
    if (!community) {
      return "> "
    }
    if (!community.parent) {
      return "> " + community.name
    }
    return `${getParentCommunityName(community.parent)} > ${community.name}`
  }

  return (
    <Stack>
      <Header />
      <Stack
        direction="row"
        gap="4px"
        p="4px"
        onMouseUp={() => setSelectedUser(null)}
      >
        <Stack
          flex="1"
          display="flex"
          flexWrap="wrap"
          border="1px solid #ccc"
          gap="4px"
          direction="row"
          onMouseUp={removeCommunityToUser}
        >
          {noCommunityUser.map((user) => UserBox({ user }))}
        </Stack>
        <Stack width="200px" gap="12px">
          <Stack direction="row" gap="12px">
            <Button
              onClick={() => setSelectedRootCommunity(null)}
              variant="outlined"
            >
              최상위로
            </Button>
            <Button
              variant="outlined"
              onClick={() =>
                setSelectedRootCommunity(
                  selectedRootCommunity ? selectedRootCommunity.parent : null
                )
              }
            >
              바로 위로
            </Button>
          </Stack>
          <Stack>{getParentCommunityName(selectedRootCommunity)}</Stack>
          {communityList.filter(communityFilter).length === 0 && (
            <Box>하위 그룹 없음</Box>
          )}
          {communityList
            .filter(communityFilter)
            .map((community) => CommunityBox(community))}
        </Stack>
        {selectedUser && selectedUser.id && (
          <Stack
            position="absolute"
            top={mousePosition.y - shiftPosition.y}
            left={mousePosition.x - shiftPosition.x}
            style={{ pointerEvents: "none" }}
          >
            {UserBox({ user: selectedUser })}
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}
