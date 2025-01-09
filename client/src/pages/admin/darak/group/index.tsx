import { type Group } from "@server/entity/group"
import { Button, Card, Input, Stack } from "@mui/material"
import Header from "components/AdminHeader"
import { MouseEvent, useEffect, useState } from "react"
import { useSetRecoilState } from "recoil"
import { NotificationMessage } from "state/notification"
import styles from "./index.module.css"
import { dele, get, post, put } from "pages/api"
import { set } from "@node_modules/@types/lodash"

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

  const [clickedGroup, setClickedGroup] = useState<Group | undefined>()
  const [isGroupNameEditMode, setIsGroupNameEditMode] = useState(false)
  const [clickedGroupName, setClickedGroupName] = useState("")
  const [isMoveMode, setIsMoveMode] = useState(false)

  const setNotificationMessage = useSetRecoilState(NotificationMessage)

  useEffect(() => {
    fetchData()
    addEventListener("mousemove", mousemoveListener)
    return () => removeEventListener("mousemove", mousemoveListener)
  }, [])

  useEffect(() => {
    ;(async () => {
      if (!isGroupNameEditMode && clickedGroup) {
        await saveGroup({ ...clickedGroup, name: clickedGroupName })
        setClickedGroup(undefined)
        fetchData()
      }
    })()
  }, [isGroupNameEditMode])

  function mousemoveListener(e: any) {
    const event = e as MouseEvent
    setMousePosition({ x: event.pageX, y: event.pageY })
    setIsMoveMode(true)
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
    setIsMoveMode(false)
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
    await saveGroup(selectedGroup)
    setSelectedGroup(undefined)
    fetchData()
  }

  async function removeGroup() {
    await dele(`/admin/group`, selectedGroup)
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
    await saveGroup(selectedGroup)
    setSelectedGroup(undefined)
    fetchData()
  }

  async function saveGroup(group: Group) {
    await put(`/admin/group`, group)
  }

  async function addGroup() {
    await post(`/admin/group`, { name: "새로운 그룹", parentId: 0 })
    await fetchData()
  }

  function GroupRecursion(rootGroup: Group, depth = 0) {
    if (depth > 10) {
      return null
    }

    return (
      <Card
        onDoubleClick={() => setGroupStack([...groupStack, rootGroup])}
        className={selectedGroup && styles.group_name}
        style={{
          border: "1px solid #ddd",
          minHeight: "60px",
        }}
        onMouseUp={(e) => setGroup(e, rootGroup)}
        onMouseDown={(e) => selectGroup(e, rootGroup)}
        sx={{
          cursor: "pointer",
        }}
      >
        <Stack m="4px">
          <Stack
            py="6px"
            onDoubleClick={(e) => {
              e.stopPropagation()
              setClickedGroupName(rootGroup.name)
              setClickedGroup(rootGroup)
              setIsGroupNameEditMode(true)
            }}
            onClick={(e) => e.stopPropagation()}
            borderRadius="4px"
            border="1px solid #ccc"
            padding="4px"
          >
            {isGroupNameEditMode && clickedGroup?.id === rootGroup.id ? (
              <Input
                value={clickedGroupName}
                onChange={(e) => {
                  setClickedGroupName(e.target.value)
                }}
              />
            ) : (
              `${rootGroup.name}`
            )}
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
    async function onClick() {
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
            {group.name}
          </Stack>
        </Stack>
      </Card>
    )
  }

  return (
    <Stack minHeight="100vh">
      <Header />
      <Stack
        direction="row"
        p="4px"
        gap="12px"
        border="1px solid #ddd"
        justifyContent="space-between"
      >
        <Stack direction="row" gap="12px">
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
        <Stack direction="row" gap="12px">
          <Button variant="outlined" onClick={addGroup}>
            새로운 그룹 추가
          </Button>
          <Stack
            borderRadius="12px"
            border="1px solid #ccc"
            p="12px"
            justifyContent="center"
            onMouseUp={removeGroup}
            className={selectedGroup && styles.group_name}
          >
            삭제
          </Stack>
        </Stack>
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
        onClick={() => {
          if (isGroupNameEditMode) {
            setIsGroupNameEditMode(false)
          } else if (clickedGroup) {
            setClickedGroup(undefined)
          }
        }}
      >
        {groupList
          .filter((group) => {
            if (groupStack.length === 0) return !group.parentId
            return group.parentId === groupStack[groupStack.length - 1].id
          })
          .map((group) => GroupRecursion(group))}
        {selectedGroup &&
          selectedGroup.id &&
          isMoveMode &&
          !isGroupNameEditMode && (
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
