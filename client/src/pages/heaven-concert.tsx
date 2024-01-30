import { Stack } from "@mui/material"
import { get } from "pages/api"
import { useEffect, useRef, useState } from "react"

const colors = [
  "#F7A3A7",
  "#F7AD97",
  "#FAD892",
  "#C8D7C4",
  "#BBCBD2",
  "#B7B6D6",
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
  const worldMapRef = useRef<SVGSVGElement>()
  const [selectedTeam, setSelectedTeam] = useState(0)

  const tempList = ["American_Samoa", "Brazil"]
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

    await drawMap()
  }

  async function drawMap() {
    if (!worldMapRef.current) {
      return
    }
    const data = await get("/admin/game/game-map/all-country")
    const countryList = data
      //@ts-ignore
      .filter((d) => d.teamNumber === selectedTeam)
      //@ts-ignore
      .map((d) => d.country)
    const mapNodes = worldMapRef.current?.childNodes[0].childNodes
    if (!mapNodes) {
      return
    }
    for (const node of mapNodes) {
      if (node.childNodes.length === 0) {
        continue
      }
      //@ts-ignore
      if (countryList.includes(node.childNodes[1].id)) {
        //@ts-ignore
        node.childNodes[1].style = `fill: ${colors[selectedTeam]}; stroke: rgb(0, 0, 0); stroke-width: 0.15;`
      } else {
        //@ts-ignore
        node.childNodes[1].style = `fill: #ddd; stroke: rgb(0, 0, 0); stroke-width: 0.15;`
      }
    }
  }

  function clickTeam(teamNumber: number) {
    setSelectedTeam(teamNumber)
  }

  return (
    <Stack width="100vw" height="100vh">
      <Stack direction="row" p="12px" gap="4px">
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
      {
        //@ts-ignore
        <svg ref={worldMapRef} width="100%" height="100%" />
      }
    </Stack>
  )
}
