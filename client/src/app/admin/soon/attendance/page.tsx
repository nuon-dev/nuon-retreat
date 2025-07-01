"use client"

import axios from "@/config/axios"
import { get } from "@/config/api"
import CommunityBox from "./CommunityBox"
import { User } from "@server/entity/user"
import AdminHeader from "@/components/AdminHeader"
import { Box, Button, Stack } from "@mui/material"
import { Community } from "@server/entity/community"
import { useEffect, useMemo, useState } from "react"
import { AttendData } from "@server/entity/attendData"
import { WorshipSchedule } from "@server/entity/worshipSchedule"
import { AttendStatus } from "@server/entity/types"

export default function AttendanceAdminPage() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null
  )
  const [communityStack, setCommunityStack] = useState<Community[]>([])
  const [soonList, setSoonList] = useState<User[]>([])
  const [attendDataList, setAttendDataList] = useState<AttendData[]>([])

  useEffect(() => {
    fetchCommunities()
  }, [])

  async function fetchCommunities() {
    const data = await get("/admin/community")
    setCommunities(data)
  }

  const filteredCommunities = useMemo(() => {
    if (!selectedCommunity) {
      return communities.filter((community) => !community.parent)
    }
    return communities.filter((community) => {
      return community.parent?.id === selectedCommunity.id
    })
  }, [communities, selectedCommunity])

  useEffect(() => {
    if (filteredCommunities.length === 0) {
      if (!selectedCommunity) {
        setSoonList([])
        setAttendDataList([])
        return
      }
      axios
        .post("/admin/soon/get-soon-list", {
          ids: selectedCommunity?.id,
        })
        .then((response) => {
          setSoonList(response.data)
        })
      return
    }
    axios
      .post("/admin/soon/get-soon-list", {
        ids: filteredCommunities.map((community) => community.id).join(","),
      })
      .then((response) => {
        setSoonList(response.data)
      })
  }, [filteredCommunities])

  useEffect(() => {
    if (soonList.length === 0) return
    const soonIds = soonList.map((user) => user.id)

    axios
      .post("/admin/soon/user-attendance", {
        ids: soonIds.join(","),
      })
      .then((response) => {
        setAttendDataList(response.data)
      })
  }, [soonList])

  const worshipScheduleMapList = useMemo(() => {
    const map: WorshipSchedule[] = []
    attendDataList.forEach((data) => {
      const existing = map.find(
        (worshipSchedule) => worshipSchedule.id === data.worshipSchedule.id
      )
      if (existing) {
        return
      } else {
        map.push(data.worshipSchedule)
      }
    })
    return map.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }, [attendDataList])

  function handleCommunityClick(community: Community) {
    setSelectedCommunity(community)
    setCommunityStack((prev) => {
      const newStack = [...prev, community]
      return newStack
    })
  }

  function handleBackClick() {
    setCommunityStack((prev) => {
      const newStack = [...prev]
      newStack.pop()
      return newStack
    })
    setSelectedCommunity(communityStack[communityStack.length - 2] || null)
  }

  return (
    <Stack>
      <AdminHeader />
      <Stack
        gap="16px"
        margin="4px"
        padding="8px"
        direction="row"
        alignItems="center"
      >
        <Button
          variant="outlined"
          onClick={handleBackClick}
          disabled={communityStack.length === 0}
        >
          Back
        </Button>
        최상위
        {communityStack.map((community) => (
          <Stack key={community.id}>&gt; {community.name}</Stack>
        ))}
      </Stack>
      <Stack margin="4px" direction="row" gap="16px" padding="8px">
        {filteredCommunities.map((community) => (
          <CommunityBox
            key={community.id}
            community={community}
            setSelectedCommunity={handleCommunityClick}
          />
        ))}
      </Stack>
      <Stack margin="4px" overflow="auto" maxHeight="100%" padding="8px">
        <Stack
          ml="12px"
          height="30px"
          direction="row"
          alignItems="center"
          textAlign="center"
        >
          <Box width="99px" mr="12px" height="100%" />
          {worshipScheduleMapList.map((worshipSchedule) => {
            return (
              <Stack
                width="108px"
                height="100%"
                justifyContent="center"
                border="1px solid #ccc"
                key={worshipSchedule.id}
              >
                {worshipSchedule.date}
              </Stack>
            )
          })}
        </Stack>
        {soonList.map((user) => (
          <Stack
            key={user.id}
            direction="row"
            alignItems="center"
            height="40px"
            border="1px solid #ccc"
          >
            <Stack
              padding="10px"
              height="100%"
              width="102px"
              justifyContent="center"
              borderRight="1px solid #ccc"
            >
              {user.name} ({user.community?.name})
            </Stack>
            {worshipScheduleMapList.map((worshipSchedule) => {
              const attendData = attendDataList.find(
                (data) =>
                  data.user.id === user.id &&
                  data.worshipSchedule.id === worshipSchedule.id
              )
              return (
                <Stack
                  padding="4px"
                  height="100%"
                  width="101px"
                  direction="row"
                  textAlign="center"
                  alignItems="center"
                  key={worshipSchedule.id}
                  borderRight="1px solid #ccc"
                >
                  <AttendCell attendData={attendData} />
                </Stack>
              )
            })}
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}

function AttendCell({ attendData }: { attendData: AttendData | undefined }) {
  if (!attendData) {
    return <span style={{ color: "orange" }}>미입력</span>
  }

  if (attendData.isAttend === AttendStatus.ATTEND) {
    return <span style={{ color: "green" }}>출석</span>
  }

  if (attendData.isAttend === AttendStatus.ABSENT) {
    return <span style={{ color: "red" }}>{attendData.memo}</span>
  }
  if (attendData.isAttend === AttendStatus.ETC) {
    return <span style={{ color: "blue" }}>(기타){attendData.memo}</span>
  }
}
