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
    if (filteredCommunities.length === 0) return
    axios
      .get("/admin/soon/get-soon-list", {
        params: {
          ids: filteredCommunities.map((community) => community.id).join(","),
        },
      })
      .then((response) => {
        setSoonList(response.data)
      })
  }, [filteredCommunities])

  useEffect(() => {
    if (soonList.length === 0) return
    const soonIds = soonList.map((user) => user.id)

    axios
      .get("/admin/soon/user-attendance", {
        params: {
          ids: soonIds.join(","),
        },
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
    return map
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
      <Stack direction="row" gap="16px" padding="8px" alignItems="center">
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
      <Stack direction="row" gap="16px" padding="8px">
        {filteredCommunities.map((community) => (
          <CommunityBox
            key={community.id}
            community={community}
            setSelectedCommunity={handleCommunityClick}
          />
        ))}
      </Stack>
      <Stack overflow="auto" maxHeight="100%" padding="8px">
        <Stack direction="row" padding="8px">
          <Box width="100px" mr="12px" />
          {worshipScheduleMapList.map((worshipSchedule) => {
            return (
              <Stack
                key={worshipSchedule.id}
                padding="8px"
                border="1px solid #ccc"
                width="100px"
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
            border="1px solid #ccc"
          >
            <Stack margin="12px">
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
                  width="100px"
                  direction="row"
                  textAlign="center"
                  key={worshipSchedule.id}
                  border="1px solid #ccc"
                >
                  {attendData ? (
                    attendData.isAttend ? (
                      <span style={{ color: "green" }}>출석</span>
                    ) : (
                      <span style={{ color: "red" }}>{attendData.memo}</span>
                    )
                  ) : (
                    <span style={{ color: "orange" }}>미입력</span>
                  )}
                </Stack>
              )
            })}
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}
