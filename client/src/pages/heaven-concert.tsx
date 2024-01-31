import { Select, Stack } from "@mui/material"
import { get } from "pages/api"
import { useEffect, useRef, useState } from "react"

const colors = [
  "#FFD700",
  "#F7A3A7",
  "#F7AD97",
  "#FAD892",
  "#E2BBD8",
  "#E55D62",
  "#DB7E6A",
  "#FAAB23",
  "#87B27C",
  "#7DB0C7",
  "#7774B6",
  "#B780A9",
  "#B1A995",
  "#333F4D",
]

export default function HeavenConcert() {
  const worldMapRef = useRef<HTMLElement>()
  const [selectedTeam, setSelectedTeam] = useState(0)

  useEffect(() => {
    fetchMap()
  }, [worldMapRef])

  useEffect(() => {
    drawMap()
  }, [selectedTeam])

  async function fetchMap() {
    if (!worldMapRef.current) {
      return
    }
    const svgString = await (await fetch("/world_map.svg")).text()
    worldMapRef.current.innerHTML = svgString
    const svgElement = worldMapRef.current.children[0] as SVGSVGElement

    await drawMap()
  }

  async function drawMap() {
    if (!worldMapRef.current) {
      return
    }
    const data = await get("/admin/game/game-map/all-country")
    const countryList = data
      .filter((d: any) => selectedTeam === 0 || d.teamNumber === selectedTeam)
      .map((d: any) => d.country)
    if (worldMapRef.current?.childNodes.length === 0) {
      return
    }
    const mapNodes = worldMapRef.current?.childNodes[0].childNodes
    if (!mapNodes) {
      return
    }
    for (const node of mapNodes) {
      if (node.childNodes.length === 0) {
        continue
      }
      const country = node.childNodes[1] as any
      if (countryList.includes(country.id)) {
        country.style = `fill: ${colors[selectedTeam]}; stroke: rgb(0, 0, 0); stroke-width: 0.15;`
      } else {
        country.style = `fill: #eee; stroke: rgb(0, 0, 0); stroke-width: 0.15;`
      }
    }
  }

  function clickTeam(teamNumber: number) {
    setSelectedTeam(teamNumber)
  }

  return (
    <Stack direction="row">
      <Stack p="12px" py="4px" gap="4px">
        <Stack
          width="8vw"
          textAlign="center"
          padding="10px"
          borderRadius="4px"
          fontWeight="600"
          border="1px solid black"
          justifyContent="center"
          height="6vh"
          onClick={() => clickTeam(0)}
          color={selectedTeam === 0 ? "white" : "black"}
          bgcolor={selectedTeam === 0 ? "gray" : "white"}
        >
          전체
        </Stack>
        {new Array(12).fill(0).map((_, index) => {
          return (
            <Stack
              width="8vw"
              height="6vh"
              padding="10px"
              fontWeight="600"
              borderRadius="4px"
              textAlign="center"
              border="1px solid black"
              justifyContent="center"
              onClick={() => clickTeam(index + 1)}
              color={selectedTeam === index + 1 ? "white" : "black"}
              bgcolor={selectedTeam === index + 1 ? "gray" : "white"}
            >
              {index + 1} 팀
            </Stack>
          )
        })}
      </Stack>
      <Stack width="600px">
        {
          //@ts-ignore
          <div ref={worldMapRef} width="900px" height="470px" />
        }
      </Stack>
    </Stack>
  )
}
