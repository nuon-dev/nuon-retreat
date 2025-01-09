import { type Group } from "@server/entity/group"
import { type User } from "@server/entity/user"
import { Box, Button, Stack } from "@mui/material"
import Header from "components/AdminHeader"
import { get, put } from "pages/api"
import { MouseEvent, useEffect, useState } from "react"

export default function People() {
  const [groupList, setGroupList] = useState<Group[]>([])
  const [noGroupUser, setNoGroupUser] = useState<User[]>([])
  const [selectedRootGroup, setSelectedRootGroup] = useState<Group | null>(null)
  const [childGroupList, setChildGroupList] = useState<Group[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [shiftPosition, setShiftPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    fetchData()
    addEventListener("mousemove", mousemoveListener)
    return () => removeEventListener("mousemove", mousemoveListener)
  }, [])

  useEffect(() => {
    if (selectedRootGroup) {
      fetchGroupUserList(selectedRootGroup.id)
    }
  }, [selectedRootGroup])

  function mousemoveListener(e: any) {
    const event = e as MouseEvent
    setMousePosition({ x: event.pageX, y: event.pageY })
  }

  async function fetchGroupUserList(groupId: number) {
    const groupUserListData = await get(`/admin/group/user-list/${groupId}`)
    setChildGroupList(groupUserListData)
  }

  async function fetchData() {
    const groupListData = await get("/admin/group")
    setGroupList(groupListData)
    const noGroupUserData = await get("/admin/group/no-group-user-list")
    setNoGroupUser(noGroupUserData)
  }

  function groupFilter(targetGroup: Group) {
    if (!selectedRootGroup) {
      return !targetGroup.parent
    }
    return targetGroup.parent?.id === selectedRootGroup.id
  }

  async function removeGroupToUser() {
    if (!selectedUser) return
    selectedUser.group = null
    await saveUser(selectedUser)
    setSelectedUser(null)
    if (selectedRootGroup) {
      await fetchGroupUserList(selectedRootGroup.id)
      await fetchData()
    }
  }

  async function setUser(e: MouseEvent, targetGroup: Group) {
    if (!selectedUser) return
    e.stopPropagation()
    if (selectedUser.group && selectedUser.group.id === targetGroup.id) {
      setSelectedUser(null)
      return
    }
    selectedUser.group = targetGroup
    await saveUser(selectedUser)
    setSelectedUser(null)
    if (selectedRootGroup) {
      await fetchGroupUserList(selectedRootGroup.id)
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

  function GroupBox(displayGroup: Group) {
    const myGroup = childGroupList.find((group) => group.id === displayGroup.id)

    if (!myGroup) {
      return (
        <Box
          p="4px"
          borderRadius="4px"
          border="1px solid #ccc"
          onClick={() => setSelectedRootGroup(displayGroup)}
        >
          {displayGroup.name}
        </Box>
      )
    }

    return (
      <Stack
        p="4px"
        borderRadius="4px"
        border="1px solid #ccc"
        onClick={() => setSelectedRootGroup(displayGroup)}
        onMouseUp={(e) => setUser(e, displayGroup)}
        gap="4px"
      >
        {displayGroup.name}
        {myGroup.users.map((user) => (
          <UserBox key={user.id} user={user} />
        ))}
      </Stack>
    )
  }

  function getParentGroupName(group: Group | null): string {
    if (!group) {
      return "> "
    }
    if (!group.parent) {
      return "> " + group.name
    }
    return `${getParentGroupName(group.parent)} > ${group.name}`
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
          onMouseUp={removeGroupToUser}
        >
          {noGroupUser.map((user) => UserBox({ user }))}
        </Stack>
        <Stack width="200px" gap="12px">
          <Stack direction="row" gap="12px">
            <Button
              onClick={() => setSelectedRootGroup(null)}
              variant="outlined"
            >
              최상위로
            </Button>
            <Button
              variant="outlined"
              onClick={() =>
                setSelectedRootGroup(
                  selectedRootGroup ? selectedRootGroup.parent : null
                )
              }
            >
              바로 위로
            </Button>
          </Stack>
          <Stack>{getParentGroupName(selectedRootGroup)}</Stack>
          {groupList.filter(groupFilter).length === 0 && (
            <Box>하위 그룹 없음</Box>
          )}
          {groupList.filter(groupFilter).map((group) => GroupBox(group))}
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
