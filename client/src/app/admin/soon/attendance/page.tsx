"use client"

import axios from "@/config/axios"
import { get } from "@/config/api"
import CommunityBox from "./CommunityBox"
import { User } from "@server/entity/user"
import AdminHeader from "@/components/AdminHeader"
import { Box, Button, MenuItem, Select, Stack } from "@mui/material"
import { Community } from "@server/entity/community"
import { useEffect, useMemo, useState } from "react"
import { AttendData } from "@server/entity/attendData"
import { WorshipKind, WorshipSchedule } from "@server/entity/worshipSchedule"
import { AttendStatus } from "@server/entity/types"

export default function AttendanceAdminPage() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null
  )
  const [communityStack, setCommunityStack] = useState<Community[]>([])
  const [soonList, setSoonList] = useState<User[]>([])
  const [attendDataList, setAttendDataList] = useState<AttendData[]>([])
  const [worshipScheduleFilter, setWorshipScheduleFilter] = useState<
    WorshipKind | "all"
  >("all")

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

  const leaders = useMemo(() => {
    return soonList.filter((user) => {
      return (
        user.community?.leader?.id === user.id ||
        user.community?.deputyLeader?.id === user.id
      )
    })
  }, [soonList])

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
          const soonListData = response.data as User[]
          soonListData.sort(sortByCommunityId)
          setSoonList(soonListData)
        })
      return
    }
    axios
      .post("/admin/soon/get-soon-list", {
        ids: filteredCommunities.map((community) => community.id).join(","),
      })
      .then((response) => {
        const soonListData = response.data as User[]
        soonListData.sort(sortByCommunityId)
        setSoonList(soonListData)
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
      }
      if (
        worshipScheduleFilter !== "all" &&
        data.worshipSchedule.kind !== worshipScheduleFilter
      ) {
        return
      }
      map.push(data.worshipSchedule)
    })
    return map.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }, [attendDataList, worshipScheduleFilter])

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
    <Stack maxWidth="100vw">
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
      <Stack
        gap="16px"
        margin="4px"
        padding="8px"
        direction="row"
        alignItems="center"
      >
        조회할 예배 종류:
        <Select
          value={worshipScheduleFilter}
          onChange={(e) =>
            setWorshipScheduleFilter(e.target.value as WorshipKind | "all")
          }
        >
          <MenuItem value="all">전체</MenuItem>
          <MenuItem value={WorshipKind.SundayService}>주일예배</MenuItem>
          <MenuItem value={WorshipKind.FridayService}>금야철야</MenuItem>
        </Select>
      </Stack>
      <Stack margin="4px" maxHeight="100%" padding="8px">
        <Stack
          pt="10px"
          top="0px"
          position="sticky"
          height="40px"
          direction="row"
          alignItems="center"
          textAlign="center"
          bgcolor="white"
        >
          <Stack
            width="122px"
            height="100%"
            direction="row"
            whiteSpace="pre"
            alignItems="center"
            justifyContent="center"
            border="1px solid #555"
          >
            <Box fontSize="12px">순장수 </Box>
            <Box color="blue" fontWeight="bold">
              {leaders.filter((user) => user.gender === "man").length}
            </Box>
            {" / "}
            <Box color="red" fontWeight="bold">
              {leaders.filter((user) => user.gender === "woman").length}
            </Box>
          </Stack>
          {worshipScheduleMapList.map((worshipSchedule) => {
            return (
              <Stack
                width="109px"
                height="100%"
                justifyContent="center"
                borderTop="1px solid #555"
                borderRight="1px solid #555"
                borderBottom="1px solid #555"
                key={worshipSchedule.id}
              >
                {worshipSchedule.date}
                <br />(
                {getAttendUserCount(attendDataList, worshipSchedule.id).attend}/
                {getAttendUserCount(attendDataList, worshipSchedule.id).count}){" "}
                {Math.round(
                  (getAttendUserCount(attendDataList, worshipSchedule.id)
                    .attend /
                    getAttendUserCount(attendDataList, worshipSchedule.id)
                      .count) *
                    100
                )}
                %
              </Stack>
            )
          })}
        </Stack>
        {soonList.map((user) => (
          <Stack
            key={user.id}
            direction="row"
            bgcolor={
              user.community?.leader?.id === user.id
                ? "#999"
                : user.community?.deputyLeader?.id === user.id
                ? "#ccc"
                : "transparent"
            }
            alignItems="center"
            height="40px"
            border="1px solid #555"
          >
            <Stack
              padding="10px"
              height="100%"
              width="102px"
              justifyContent="center"
              color={user.gender === "man" ? "blue" : "red"}
              borderRight="1px solid #555"
            >
              {user.name} ({user.yearOfBirth})
            </Stack>
            {worshipScheduleMapList.map((worshipSchedule) => {
              const attendData = attendDataList.find(
                (data) =>
                  data.user.id === user.id &&
                  data.worshipSchedule.id === worshipSchedule.id
              )
              return (
                <Stack
                  height="100%"
                  width="109px"
                  direction="row"
                  textAlign="center"
                  alignItems="center"
                  key={worshipSchedule.id}
                  borderRight="1px solid #555"
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
    return (
      <Box
        width="100%"
        height="100%"
        textAlign="center"
        alignContent="center"
        justifyContent="center"
      >
        -
      </Box>
    )
  }

  if (attendData.isAttend === AttendStatus.ATTEND) {
    return (
      <Box
        width="100%"
        height="100%"
        textAlign="center"
        alignContent="center"
        justifyContent="center"
        style={{ backgroundColor: "rgb(184, 248,93)" }}
      >
        출석
      </Box>
    )
  }

  if (attendData.isAttend === AttendStatus.ABSENT) {
    return (
      <Box
        width="100%"
        height="100%"
        textAlign="center"
        alignContent="center"
        justifyContent="center"
        style={{ backgroundColor: "rgb(240, 148, 128)" }}
      >
        {attendData.memo}
      </Box>
    )
  }
  if (attendData.isAttend === AttendStatus.ETC) {
    return (
      <Box
        width="100%"
        height="100%"
        textAlign="center"
        alignContent="center"
        justifyContent="center"
        style={{ backgroundColor: "rgb(253,241,113)" }}
      >
        {attendData.memo}
      </Box>
    )
  }
}

function sortByCommunityId(a: User, b: User): number {
  if (a.community?.id !== b.community?.id) {
    return (a.community?.id || 0) - (b.community?.id || 0)
  }
  if (a.community?.leader?.id === a.id) {
    return -2 // a is leader, comes first
  }
  if (b.community?.leader?.id === b.id) {
    return 2 // b is leader, comes first
  }
  if (a.community?.deputyLeader?.id === a.id) {
    return -1 // a is deputy leader, comes before b
  }
  if (b.community?.deputyLeader?.id === b.id) {
    return 1 // b is deputy leader, comes before a
  }
  return a.name.localeCompare(b.name)
}

function getAttendUserCount(
  attendDataList: AttendData[],
  worshipScheduleId: number
): { count: number; attend: number } {
  return attendDataList.reduce(
    (count, data) =>
      data.worshipSchedule.id === worshipScheduleId
        ? data.isAttend === AttendStatus.ATTEND
          ? {
              count: count.count + 1,
              attend: count.attend + 1,
            }
          : {
              count: count.count + 1,
              attend: count.attend,
            }
        : count,
    { count: 0, attend: 0 }
  )
}
