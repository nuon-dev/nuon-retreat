import { Community } from "@server/entity/community"
import { type User } from "@server/entity/user"
import { Box, Button, MenuItem, Select, Stack } from "@mui/material"
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
    } else {
      fetchCommunityUserList(0)
    }
  }, [selectedRootCommunity])

  function mousemoveListener(e: any) {
    if (!selectedUser) {
      return
    }
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

  async function saveCommunityLeader(
    community: Community,
    leaderId: number | null
  ) {
    await put("/admin/community/save-leader", {
      groupId: community.id,
      leaderId,
    })
    await fetchData()
    await fetchCommunityUserList(community.id)
  }

  async function saveCommunityDeputyLeader(
    community: Community,
    deputyLeaderId: number | null
  ) {
    await put("/admin/community/save-deputy-leader", {
      groupId: community.id,
      deputyLeaderId,
    })
    await fetchData()
    await fetchCommunityUserList(community.id)
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
        key={user.id}
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

  function CommunityBox({ displayCommunity }: { displayCommunity: Community }) {
    const myCommunity = childCommunityList.find(
      (community) => community.id === displayCommunity.id
    )

    function onClickCommunity(e: MouseEvent) {
      e.stopPropagation()
      setSelectedRootCommunity(displayCommunity)
    }

    if (!myCommunity) {
      return (
        <Box
          p="4px"
          gap="12px"
          display="flex"
          flexDirection="column"
          borderRadius="4px"
          border="1px solid #ccc"
          onClick={onClickCommunity}
        >
          {displayCommunity.name}?
          {displayCommunity.children?.map((child) => (
            <CommunityBox
              displayCommunity={child}
              key={`${displayCommunity.id}_${child.id}`}
            />
          ))}
        </Box>
      )
    }

    return (
      <Stack
        p="4px"
        gap="12px"
        borderRadius="4px"
        border="1px solid #ccc"
        onClick={onClickCommunity}
        onMouseUp={(e) => setUser(e, displayCommunity)}
      >
        {displayCommunity.name}
        <Box fontWeight="bold">
          순장:
          <Select
            value={displayCommunity.leader?.id || 0}
            sx={{ height: "30px" }}
            onChange={(e) => {
              e.stopPropagation()
              saveCommunityLeader(displayCommunity, e.target.value as number)
            }}
          >
            <MenuItem value={0}>없음</MenuItem>
            {myCommunity.users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box fontWeight="bold">
          부순장:
          <Select
            value={displayCommunity.deputyLeader?.id || 0}
            sx={{ height: "30px" }}
            onChange={(e) => {
              e.stopPropagation()
              saveCommunityDeputyLeader(
                displayCommunity,
                e.target.value as number
              )
            }}
          >
            <MenuItem value={0}>없음</MenuItem>
            {myCommunity.users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
        {myCommunity.users.map((user) => (
          <UserBox key={user.id} user={user} />
        ))}
        {displayCommunity.children?.map((child) => (
          <CommunityBox
            displayCommunity={child}
            key={`${displayCommunity.id}_${child.id}`}
          />
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
          width="200px"
          display="flex"
          flexWrap="wrap"
          border="1px solid #ccc"
          gap="4px"
          direction="row"
          onMouseUp={removeCommunityToUser}
        >
          {noCommunityUser.map((user) => UserBox({ user }))}
        </Stack>
        <Stack flex="1" gap="12px">
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
          <Stack gap="12px" direction="row" flexWrap="wrap">
            {communityList.filter(communityFilter).map((community) => (
              <CommunityBox displayCommunity={community} key={community.id} />
            ))}
          </Stack>
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
