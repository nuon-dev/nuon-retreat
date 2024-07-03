import { Button, MenuItem, Select, Stack } from "@mui/material"
import { useRouter } from "next/router"
import { get, post } from "pages/api"
import { useEffect, useRef, useState } from "react"
import { useSetRecoilState } from "recoil"
import { NotificationMessage } from "state/notification"

export default function GameMap() {
  const { push } = useRouter()
  const worldMapRef = useRef<SVGSVGElement>()
  const [allCountryList, setAllCountryList] = useState<string[]>([])
  const [teamCountryList, setTeamCountryList] = useState<string[]>([])
  const [selectedTeam, setSelectedTeam] = useState(0)
  const [selectedCountry, setSelectedCountry] = useState("Canada")
  const setNotificationMessage = useSetRecoilState(NotificationMessage)

  useEffect(() => {
    if (worldMapRef) {
      fetchMap()
    }
  }, [worldMapRef])

  useEffect(() => {
    fetchTeamCountry()
  }, [selectedTeam])

  async function fetchMap() {
    if (!worldMapRef.current) {
      return
    }
    const svgString = await (await fetch("/world_map.svg")).text()
    worldMapRef.current.innerHTML = svgString

    const tempList: string[] = []
    for (const node of worldMapRef.current?.childNodes[0].childNodes) {
      if (node.childNodes.length > 0) {
        //@ts-ignore
        tempList.push(node.childNodes[1].id)
      }
      tempList.sort()
      setAllCountryList(tempList)
    }
  }

  async function fetchTeamCountry() {
    const gameMapList: [] = await get("/admin/game/game-map/all-country")
    const teamCountryList = gameMapList.filter(
      (gameData: any) => gameData.teamNumber === selectedTeam
    )
    setTeamCountryList(teamCountryList.map((d: any) => d.country))
  }

  async function addCountry() {
    try {
      await post("/admin/game/game-map/new-country", {
        teamNumber: selectedTeam,
        country: selectedCountry,
      })
    } catch {
      push("/admin")
      setNotificationMessage("권한이 없습니다.")
      return
    }
    await fetchTeamCountry()
  }

  function clickTeam(teamNumber: number) {
    setSelectedTeam(teamNumber)
  }

  async function deleteCountry(country: string) {
    try {
      await post("/admin/game/game-map/delete-country", {
        teamNumber: selectedTeam,
        country,
      })
    } catch {
      push("/admin")
      setNotificationMessage("권한이 없습니다.")
      return
    }
    await fetchTeamCountry()
  }

  return (
    <Stack>
      {
        //@ts-ignore
        <svg ref={worldMapRef} width="1px" height="1px" />
      }
      <Stack direction="row" gap="12px" p="12px" flexWrap="wrap">
        {new Array(12).fill(0).map((_, index) => {
          return (
            <Stack
              padding="12px"
              fontWeight="600"
              borderRadius="4px"
              border="1px solid black"
              onClick={() => clickTeam(index + 1)}
              color={selectedTeam === index + 1 ? "white" : "black"}
              bgcolor={selectedTeam === index + 1 ? "gray" : "white"}
            >
              {index + 1} 팀
            </Stack>
          )
        })}
      </Stack>
      <Stack gap="12px">
        <Stack flex={1} p="24px" gap="24px">
          <Select
            onChange={(e) => setSelectedCountry(e.target.value as string)}
            value={selectedCountry}
          >
            {allCountryList.map((country) => (
              <MenuItem value={country}>{country}</MenuItem>
            ))}
          </Select>
          <Button onClick={addCountry} variant="contained">
            추가하기
          </Button>
        </Stack>
        <Stack flex={1} p="24px" gap="8px">
          {teamCountryList.map((country) => (
            <Stack
              p="4px"
              px="12px"
              borderRadius="12px"
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              border="1px solid black"
            >
              {country}{" "}
              <Button
                variant="contained"
                onClick={() => deleteCountry(country)}
              >
                삭제
              </Button>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  )
}
