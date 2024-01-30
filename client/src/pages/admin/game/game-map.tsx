import { Button, MenuItem, Select, Stack } from "@mui/material"
import { get, post } from "pages/api"
import { useEffect, useRef, useState } from "react"

export default function GameMap() {
  const worldMapRef = useRef<SVGSVGElement>()
  const [allCountryList, setAllCountryList] = useState<string[]>([])
  const [teamCountryList, setTeamCountryList] = useState<string[]>([])
  const [selectedTeam, setSelectedTeam] = useState(0)
  const [selectedCountry, setSelectedCountry] = useState("Canada")

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
      setAllCountryList(tempList)
    }
  }

  async function fetchTeamCountry() {
    const gameMapList: [] = await get("/admin/game/game-map/all-country")
    const teamCountryList = gameMapList.filter(
      //@ts-ignore
      (gameData) => gameData.teamNumber === selectedTeam
    )
    //@ts-ignore
    setTeamCountryList(teamCountryList.map((d) => d.country))
  }

  async function addCountry() {
    await post("/admin/game/game-map/new-country", {
      teamNumber: selectedTeam,
      country: selectedCountry,
    })
    await fetchTeamCountry()
  }

  function clickTeam(teamNumber: number) {
    setSelectedTeam(teamNumber)
  }

  async function deleteCountry(country: string) {
    await post("/admin/game/game-map/delete-country", {
      teamNumber: selectedTeam,
      country,
    })
    await fetchTeamCountry()
  }

  return (
    <Stack>
      {
        //@ts-ignore
        <svg ref={worldMapRef} width="1px" height="1px" />
      }
      <Stack direction="row" gap="12px" p="12px">
        {new Array(12).fill(0).map((_, index) => {
          return (
            <Stack
              padding="12px"
              onClick={() => clickTeam(index)}
              border="1px solid black"
              borderRadius="4px"
              bgcolor={selectedTeam === index ? "gray" : "white"}
            >
              {index + 1} 팀
            </Stack>
          )
        })}
      </Stack>
      <Stack direction="row" gap="12px">
        <Stack flex={1} p="24px" gap="40px">
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
        <Stack flex={1} p="24px">
          {teamCountryList.map((country) => (
            <Stack onClick={() => deleteCountry(country)}>
              {country}(눌러서 삭제)
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  )
}
