import { Button, Stack } from "@mui/material"
import { useState } from "react"

export default function JoyfulJourney() {
  const [showFourCuts, setShowFourCuts] = useState(false)
  const [showHowTo, setShowHowTo] = useState(false)
  const [currentImage, setCurrentImage] = useState(1)

  function onClickClub() {
    global.location.href =
      "https://piquant-bloom-6fa.notion.site/faa131ec580842908ed6cf6e8c015218"
  }

  function onClickInsta() {
    global.location.href = "https://www.instagram.com/suwonjeilch_youngpeople/"
  }

  function onClickFourCuts() {
    global.location.href = "/joyful-journey/four-cuts/"
  }

  function onClickYoutube() {
    global.location.href = "https://youtube.com/@SWJICH_YOUNG"
  }

  function downloadFile(e: any) {
    e.stopPropagation()

    const fileName = `Four-cuts-in-life${currentImage}.jpeg`
    var pom = document.createElement("a")
    // file 폴더의 파일을 다운로드
    var filePath = "/" + encodeURIComponent(fileName)
    pom.setAttribute("type", "application/octet-stream;charset=utf-8")
    pom.setAttribute("href", filePath)
    pom.setAttribute("download", fileName)
    pom.click()
    pom.remove()
  }

  return (
    <Stack
      height="100%"
      minHeight="100vh"
      style={{
        color: "#61986f",
        fontWeight: "600",
        backgroundImage: 'url("/middle.jpg")',
        backgroundSize: "420px",
        backgroundRepeat: "repeat",
        justifyContent: "space-between",
      }}
    >
      <img src="/top.jpg" />
      <Stack gap="40px" mt="-100px" zIndex="100">
        <Stack
          textAlign="center"
          bgcolor="white"
          height="80px"
          marginX="40px"
          alignContent="center"
          justifyContent="center"
          borderRadius="50px"
          boxShadow="0px 3px 5px 2px #aaa"
          onClick={onClickClub}
        >
          새벽이슬 동아리 안내
        </Stack>
        <Stack
          textAlign="center"
          bgcolor="white"
          height="80px"
          marginX="40px"
          alignContent="center"
          justifyContent="center"
          borderRadius="50px"
          boxShadow="0px 3px 5px 2px #aaa"
          onClick={() => {
            setCurrentImage(1)
            setShowFourCuts(true)
          }}
        >
          행복축제 네컷사진 프레임
        </Stack>
        <Stack
          textAlign="center"
          bgcolor="white"
          height="80px"
          marginX="40px"
          alignContent="center"
          justifyContent="center"
          borderRadius="50px"
          boxShadow="0px 3px 5px 2px #aaa"
          onClick={() => {
            onClickFourCuts()
          }}
        >
          행복축제 네컷사진 스티커 png
        </Stack>
        <Stack
          textAlign="center"
          bgcolor="white"
          height="80px"
          marginX="40px"
          alignContent="center"
          justifyContent="center"
          borderRadius="50px"
          boxShadow="0px 3px 5px 2px #aaa"
          onClick={() => onClickInsta()}
        >
          새벽이슬 대학청년부 인스타 계정
        </Stack>
        <Stack
          textAlign="center"
          bgcolor="white"
          height="80px"
          marginX="40px"
          alignContent="center"
          justifyContent="center"
          borderRadius="50px"
          boxShadow="0px 3px 5px 2px #aaa"
          onClick={() => onClickYoutube()}
        >
          새벽이슬 대학청년부 유튜브 계정
        </Stack>
      </Stack>
      <img
        src="/bottom.jpg"
        style={{
          marginTop: "-150px",
        }}
      />
      {showFourCuts && (
        <Stack
          width="100vw"
          height="100vh"
          position="fixed"
          justifyContent="center"
          alignItems="center"
          zIndex="1000"
          bgcolor="#00000077"
          onClick={() => setShowFourCuts(false)}
        >
          <Stack width="90%" position="relative" alignItems="center">
            <Stack
              bgcolor="white"
              mb="12px"
              borderRadius="12px"
              padding="4px"
              textAlign="center"
              color="#333"
              fontWeight="600"
              fontSize="16px"
            >
              원하는 프레임을 다운 받아
              <br /> 인스타 스토리를 통해 네컷사진을 완성해보세요!
            </Stack>
            <img src={`/Four-cuts-in-life${currentImage}.jpeg`} width="80%" />
            <Stack direction="row" gap="24px" padding="24px">
              <Stack
                bgcolor={currentImage === 1 ? "#aaa" : "white"}
                padding="12px"
                borderRadius="12px"
                fontSize="20px"
                onClick={(e) => {
                  e.stopPropagation()
                  if (currentImage === 1) {
                    return
                  }
                  setCurrentImage((pre) => pre - 1)
                }}
              >
                이전
              </Stack>
              <Stack
                bgcolor="white"
                padding="12px"
                borderRadius="12px"
                fontSize="20px"
                onClick={(e) => downloadFile(e)}
              >
                다운로드
              </Stack>
              <Stack
                bgcolor={currentImage === 8 ? "#aaa" : "white"}
                padding="12px"
                borderRadius="12px"
                fontSize="20px"
                onClick={(e) => {
                  e.stopPropagation()
                  if (currentImage === 8) {
                    return
                  }
                  setCurrentImage((pre) => pre + 1)
                }}
              >
                다음
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      )}
      {showHowTo && (
        <Stack
          position="absolute"
          zIndex="1000"
          bgcolor="white"
          onClick={() => setShowHowTo(false)}
        >
          <Stack gap="24px" padding="40px" mb="40px" alignItems="center">
            <Stack
              bgcolor="#61986f"
              width="40px"
              color="white"
              fontWeight="bold"
              textAlign="center"
              borderRadius="8px"
              padding="4px"
            >
              #1
            </Stack>
            <img src={`/sticker/스티커_적용법1.jpg`} width="100%" />
            <Stack
              bgcolor="#61986f"
              width="40px"
              color="white"
              fontWeight="bold"
              textAlign="center"
              borderRadius="8px"
              padding="4px"
            >
              #2
            </Stack>
            <img src={`/sticker/스티커_적용법2.jpg`} width="100%" />
            <Stack
              bgcolor="#61986f"
              width="40px"
              color="white"
              fontWeight="bold"
              textAlign="center"
              borderRadius="8px"
              padding="4px"
            >
              #3
            </Stack>
            <img src={`/sticker/스티커_적용법3.jpg`} width="100%" />
            <Stack
              bgcolor="#61986f"
              width="40px"
              color="white"
              fontWeight="bold"
              textAlign="center"
              borderRadius="8px"
              padding="4px"
            >
              #4
            </Stack>
            <img src={`/sticker/스티커_적용법4.jpg`} width="100%" />

            <Stack
              bgcolor="#61986f"
              width="80px"
              color="white"
              fontWeight="bold"
              textAlign="center"
              borderRadius="8px"
              padding="4px"
            >
              #예시1
            </Stack>
            <img src={`/sticker/단체샷_색칠.JPG`} width="100%" />

            <Stack
              bgcolor="#61986f"
              width="80px"
              color="white"
              fontWeight="bold"
              textAlign="center"
              borderRadius="8px"
              padding="4px"
            >
              #예시2
            </Stack>
            <img src={`/sticker/단체샷_손글씨.JPG`} width="100%" />

            <Stack
              bgcolor="#61986f"
              width="80px"
              color="white"
              fontWeight="bold"
              textAlign="center"
              borderRadius="8px"
              padding="4px"
            >
              #예시3
            </Stack>
            <img src={`/sticker/단체샷_외곽선.JPG`} width="100%" />
            <Button variant="outlined" fullWidth>
              닫기
            </Button>
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}
