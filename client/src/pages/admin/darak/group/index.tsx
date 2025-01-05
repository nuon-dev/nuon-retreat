import { type Group } from "@server/entity/group"
import { Button, Card, Stack } from "@mui/material"
import Header from "components/AdminHeader"
import { MouseEvent, useEffect, useState } from "react"
import { useSetRecoilState } from "recoil"
import { NotificationMessage } from "state/notification"
import styles from "./index.module.css"
import { get } from "pages/api"

enum EditMode {
  All,
  Folder,
}

export default function GroupComponent() {
  const [groupList, setGroupList] = useState<Group[]>([])
  const [selectedGroup, setSelectedGroup] = useState<Group | undefined>(
    undefined
  )
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [shiftPosition, setShiftPosition] = useState({ x: 0, y: 0 })
  const [editMode, setEditMode] = useState<EditMode>(EditMode.All)
  const [groupStack, setGroupStack] = useState<Group[]>([])

  const setNotificationMessage = useSetRecoilState(NotificationMessage)

  useEffect(() => {
    fetchData()
    addEventListener("mousemove", mousemoveListener)
    return () => removeEventListener("mousemove", mousemoveListener)
  }, [])

  function mousemoveListener(e: any) {
    const event = e as MouseEvent
    setMousePosition({ x: event.pageX, y: event.pageY })
  }

  async function fetchData() {
    const data = await get("/admin/group")
    setGroupList(data)
  }

  function selectGroup(e: MouseEvent, group: Group) {
    e.stopPropagation()
    const target = e.target as HTMLElement
    const shiftX = e.clientX - target.getBoundingClientRect().left
    const shiftY = e.clientY - target.getBoundingClientRect().top
    setShiftPosition({ x: shiftX, y: shiftY })
    setSelectedGroup(group)
  }

  async function setGroup(e: MouseEvent, parentGroup: Group) {
    if (!selectedGroup) return
    e.stopPropagation()
    const canAdd = checkLoopReference(selectedGroup, parentGroup.id)
    if (!canAdd) {
      if (selectedGroup.id !== parentGroup.id) {
        setNotificationMessage(`순환 참조 입니다.`)
      }
      setSelectedGroup(undefined)
      return
    }
    selectedGroup.parentId = parentGroup.id
    //await editGroup(selectedGroup)
    setSelectedGroup(undefined)
    fetchData()
  }

  function checkLoopReference(checkGroup: Group, parentId: number): boolean {
    if (checkGroup.id === parentId) return false
    const childList = groupList.filter(
      (group) => group.parentId === checkGroup.id
    )
    return childList.every((child) => checkLoopReference(child, parentId))
  }

  async function resetParent() {
    if (!selectedGroup) return
    selectedGroup.parentId = 0
    //await editGroup(selectedGroup)
    setSelectedGroup(undefined)
    fetchData()
  }

  function GroupRecursion(rootGroup: Group, depth = 0) {
    if (depth > 10) {
      return null
    }
    return (
      <Card style={{ border: "1px solid #ddd" }}>
        <Stack m="4px">
          <Stack
            py="6px"
            onMouseUp={(e) => setGroup(e, rootGroup)}
            onMouseDown={(e) => selectGroup(e, rootGroup)}
            className={selectedGroup && styles.group_name}
            onClick={() => setGroupStack([...groupStack, rootGroup])}
            sx={{
              cursor: "pointer",
            }}
          >
            {rootGroup.name} {rootGroup.id}
          </Stack>
          {editMode === EditMode.All && (
            <Stack gap="4px">
              {groupList
                .filter((group) => group.parentId === rootGroup.id)
                .map((group) => GroupRecursion(group, depth + 1))}
            </Stack>
          )}
        </Stack>
      </Card>
    )
  }

  function NavigationGroup(group: Group) {
    function onClick() {
      const myIndex = groupStack.findIndex((g) => g.id === group.id)
      setGroupStack(groupStack.slice(0, myIndex + 1))
    }

    return (
      <Card style={{ border: "1px solid #ddd" }}>
        <Stack m="4px">
          <Stack
            py="6px"
            onMouseUp={(e) => setGroup(e, group)}
            onMouseDown={(e) => selectGroup(e, group)}
            className={selectedGroup && styles.group_name}
            onClick={onClick}
            sx={{
              cursor: "pointer",
            }}
          >
            {group.name} {group.id}
          </Stack>
        </Stack>
      </Card>
    )
  }

  return (
    <Stack minHeight="100vh">
      <Header />
      <Stack direction="row" p="4px" gap="12px" border="1px solid #ddd">
        <Button
          variant="contained"
          onClick={() =>
            setEditMode(
              editMode === EditMode.All ? EditMode.Folder : EditMode.All
            )
          }
        >
          {editMode === EditMode.All ? "폴더" : "전체"} 모드로 변경
        </Button>
        {NavigationGroup({ id: 0, name: "전체" } as Group)}
        {groupStack.map((group) => NavigationGroup(group))}
      </Stack>
      <Stack
        p="4px"
        gap="12px"
        display="flex"
        direction="row"
        flexWrap="wrap"
        alignContent="flex-start"
        flex={1}
        onMouseUp={() => resetParent()}
      >
        {groupList
          .filter((group) => {
            if (groupStack.length === 0) return !group.parentId
            return group.parentId === groupStack[groupStack.length - 1].id
          })
          .map((group) => GroupRecursion(group))}
        {selectedGroup && selectedGroup.id && (
          <Stack
            position="absolute"
            top={mousePosition.y - shiftPosition.y}
            left={mousePosition.x - shiftPosition.x}
            style={{ pointerEvents: "none" }}
          >
            {GroupRecursion(selectedGroup)}
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}
