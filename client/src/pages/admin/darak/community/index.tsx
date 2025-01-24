import { type Community } from "@server/entity/community"
import { Button, Card, Input, Stack } from "@mui/material"
import Header from "components/AdminHeader"
import { MouseEvent, useEffect, useState } from "react"
import { useSetRecoilState } from "recoil"
import { NotificationMessage } from "state/notification"
import styles from "./index.module.css"
import { dele, get, post, put } from "pages/api"

enum EditMode {
  All,
  Folder,
}

export default function CommunityComponent() {
  const [communityList, setCommunityList] = useState<Community[]>([])
  const [selectedCommunity, setSelectedCommunity] = useState<
    Community | undefined
  >(undefined)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [shiftPosition, setShiftPosition] = useState({ x: 0, y: 0 })
  const [editMode, setEditMode] = useState<EditMode>(EditMode.All)
  const [communityStack, setCommunityStack] = useState<Community[]>([])

  const [clickedCommunity, setClickedCommunity] = useState<
    Community | undefined
  >()
  const [isCommunityNameEditMode, setIsCommunityNameEditMode] = useState(false)
  const [clickedCommunityName, setClickedCommunityName] = useState("")
  const [isMoveMode, setIsMoveMode] = useState(false)

  const setNotificationMessage = useSetRecoilState(NotificationMessage)

  useEffect(() => {
    fetchData()
    addEventListener("mousemove", mousemoveListener)
    return () => removeEventListener("mousemove", mousemoveListener)
  }, [])

  useEffect(() => {
    ;(async () => {
      if (!isCommunityNameEditMode && clickedCommunity) {
        await saveCommunity({ ...clickedCommunity, name: clickedCommunityName })
        setClickedCommunity(undefined)
        fetchData()
      }
    })()
  }, [isCommunityNameEditMode])

  function mousemoveListener(e: any) {
    const event = e as MouseEvent
    setMousePosition({ x: event.pageX, y: event.pageY })
    setIsMoveMode(true)
  }

  async function fetchData() {
    const data = await get("/admin/community")
    setCommunityList(data)
  }

  function selectCommunity(e: MouseEvent, community: Community) {
    e.stopPropagation()
    const target = e.target as HTMLElement
    const shiftX = e.clientX - target.getBoundingClientRect().left
    const shiftY = e.clientY - target.getBoundingClientRect().top
    setShiftPosition({ x: shiftX, y: shiftY })
    setSelectedCommunity(community)
    setIsMoveMode(false)
  }

  async function setCommunity(e: MouseEvent, parentCommunity: Community) {
    if (!selectedCommunity) return
    e.stopPropagation()
    const canAdd = checkLoopReference(selectedCommunity, parentCommunity.id)
    if (!canAdd) {
      if (selectedCommunity.id !== parentCommunity.id) {
        setNotificationMessage(`순환 참조 입니다.`)
      }
      setSelectedCommunity(undefined)
      return
    }
    selectedCommunity.parent = parentCommunity
    await saveCommunity(selectedCommunity)
    setSelectedCommunity(undefined)
    fetchData()
  }

  async function removeCommunity() {
    await dele(`/admin/community`, selectedCommunity)
    setSelectedCommunity(undefined)
    fetchData()
  }

  function checkLoopReference(
    checkCommunity: Community,
    parentId: number
  ): boolean {
    if (checkCommunity.id === parentId) return false
    const childList = communityList.filter((community) => {
      if (!community.parent) return false
      return community.parent.id === checkCommunity.id
    })
    return childList.every((child) => checkLoopReference(child, parentId))
  }

  async function resetParent() {
    if (!selectedCommunity) return
    selectedCommunity.parent = null
    await saveCommunity(selectedCommunity)
    setSelectedCommunity(undefined)
    fetchData()
  }

  async function saveCommunity(community: Community) {
    await put(`/admin/community`, community)
  }

  async function addCommunity() {
    await post(`/admin/community`, { name: "새로운 그룹", parentId: 0 })
    await fetchData()
  }

  function CommunityRecursion(rootCommunity: Community, depth = 0) {
    if (depth > 10) {
      return null
    }

    return (
      <Card
        onDoubleClick={() =>
          setCommunityStack([...communityStack, rootCommunity])
        }
        className={selectedCommunity && styles.community_name}
        style={{
          border: "1px solid #ddd",
          minHeight: "60px",
          boxShadow: "0px 0px 4px 1px #aaa",
        }}
        onMouseUp={(e) => setCommunity(e, rootCommunity)}
        onMouseDown={(e) => selectCommunity(e, rootCommunity)}
        sx={{
          cursor: "pointer",
          height: "fit-content",
        }}
      >
        <Stack m="4px">
          <Stack
            py="6px"
            onDoubleClick={(e) => {
              e.stopPropagation()
              setClickedCommunityName(rootCommunity.name)
              setClickedCommunity(rootCommunity)
              setIsCommunityNameEditMode(true)
            }}
            onClick={(e) => e.stopPropagation()}
            borderBottom="1px solid #ccc"
            padding="4px"
            textAlign="center"
          >
            {isCommunityNameEditMode &&
            clickedCommunity?.id === rootCommunity.id ? (
              <Input
                value={clickedCommunityName}
                autoFocus
                onChange={(e) => {
                  setClickedCommunityName(e.target.value)
                }}
              />
            ) : (
              `${rootCommunity.name}`
            )}
          </Stack>
          {editMode === EditMode.All && (
            <Stack gap="8px" m="4px" p="4px" direction="row">
              {communityList
                .filter(
                  (community) => community.parent?.id === rootCommunity.id
                )
                .map((community) => CommunityRecursion(community, depth + 1))}
            </Stack>
          )}
        </Stack>
      </Card>
    )
  }

  function NavigationCommunity(community: Community) {
    async function onClick() {
      const myIndex = communityStack.findIndex((g) => g.id === community.id)
      setCommunityStack(communityStack.slice(0, myIndex + 1))
    }

    return (
      <Card style={{ border: "1px solid #ddd" }}>
        <Stack m="4px">
          <Stack
            py="6px"
            onMouseUp={(e) => setCommunity(e, community)}
            onMouseDown={(e) => selectCommunity(e, community)}
            className={selectedCommunity && styles.community_name}
            onClick={onClick}
            sx={{
              cursor: "pointer",
            }}
          >
            {community.name}
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
          {NavigationCommunity({ id: 0, name: "전체" } as Community)}
          {communityStack.map((community) => NavigationCommunity(community))}
        </Stack>
        <Stack direction="row" gap="12px">
          <Button variant="outlined" onClick={addCommunity}>
            새로운 그룹 추가
          </Button>
          <Stack
            borderRadius="12px"
            border="1px solid #ccc"
            p="12px"
            justifyContent="center"
            onMouseUp={removeCommunity}
            className={selectedCommunity && styles.community_name}
          >
            삭제
          </Stack>
        </Stack>
      </Stack>
      <Stack
        p="12px"
        gap="12px"
        display="flex"
        direction="row"
        flexWrap="wrap"
        alignContent="flex-start"
        flex={1}
        onMouseUp={() => resetParent()}
        onClick={() => {
          if (isCommunityNameEditMode) {
            setIsCommunityNameEditMode(false)
          } else if (clickedCommunity) {
            setClickedCommunity(undefined)
          }
        }}
      >
        {communityList
          .filter((community) => {
            if (communityStack.length === 0) return !community.parent
            return (
              community.parent?.id ===
              communityStack[communityStack.length - 1].id
            )
          })
          .map((community) => CommunityRecursion(community))}
        {selectedCommunity &&
          selectedCommunity.id &&
          isMoveMode &&
          !isCommunityNameEditMode && (
            <Stack
              position="absolute"
              top={mousePosition.y - shiftPosition.y}
              left={mousePosition.x - shiftPosition.x}
              style={{
                pointerEvents: "none",
              }}
            >
              {CommunityRecursion(selectedCommunity)}
            </Stack>
          )}
      </Stack>
    </Stack>
  )
}
