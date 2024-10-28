import { Button, Stack } from "@mui/material"
import { useState } from "react"

export default function JoyfulJourney() {
  const [showHowTo, setShowHowTo] = useState(false)
  const [showSticker, setShowSticker] = useState(0)
  const [currentImage, setCurrentImage] = useState(1)

  const stickers = [
    [],
    [
      "Bless_you.png",
      "cute.png",
      "yummy.png",
      "가보자고~!!.png",
      "기분_체고.png",
      "두근..!.png",
      "만남의_축복이_끝이_없네.png",
      "매일_행복하게_살기.png",
      "세잎클로버_길게.png",
      "세잎클로버.png",
      "아자아자.png",
      "와!.png",
      "재미따.png",
      "하트.png",
      "행복_다_우리꺼.png",
    ],
    [
      "!!!.png",
      "happy_day.png",
      "Joyful_Journey.png",
      "rec.png",
      "start.png",
      "today.png",
      "worship_is_my_life.png",
      "고깔모자.png",
      "냠냠.png",
      "노란_긴_하트.png",
      "룰루랄라.png",
      "반짝.png",
      "별.png",
      "스마일.png",
      "애두라_고마오.png",
      "음표.png",
      "클로버1.png",
      "클로버2.png",
      "플레이리스트.png",
      "하트_세_개.png",
      "해피_클로버.png",
      "행복_충전_중.png",
      "행복을_찾아서.png",
    ],
    [
      "love.png",
      "so_cute.png",
      "귀여오.png",
      "기분조아.png",
      "두둥.png",
      "오늘의_말씀.png",
      "완료.png",
      "짜잔.png",
      "최고.png",
      "커피.png",
      "행복가득.png",
    ],
  ]

  function downloadStickerFile(e: any) {
    e.stopPropagation()

    const fileName = `/sticker/${stickers[showSticker][currentImage]}`
    var pom = document.createElement("a")
    // file 폴더의 파일을 다운로드
    var filePath = encodeURIComponent(fileName)
    console.log(filePath)
    pom.setAttribute("type", "application/octet-stream;charset=utf-8")
    pom.setAttribute("href", fileName)
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
          onClick={() => setShowHowTo(true)}
        >
          행복축제 스티커 적용법
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
            setCurrentImage(0)
            setShowSticker(1)
          }}
        >
          행복축제 네컷사진 스티커 1
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
            setCurrentImage(0)
            setShowSticker(2)
          }}
        >
          행복축제 네컷사진 스티커 2
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
            setCurrentImage(0)
            setShowSticker(3)
          }}
        >
          행복축제 네컷사진 스티커 3
        </Stack>
      </Stack>
      <img
        src="/bottom.jpg"
        style={{
          marginTop: "-150px",
        }}
      />
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
      {showSticker > 0 && (
        <Stack
          width="100vw"
          height="100vh"
          position="fixed"
          justifyContent="center"
          alignItems="center"
          zIndex="1000"
          bgcolor="#00000077"
          onClick={() => setShowSticker(0)}
        >
          <Stack width="80%" position="relative">
            <Stack
              bgcolor="white"
              mb="12px"
              borderRadius="12px"
              padding="4px"
              textAlign="center"
              color="#333"
              fontWeight="600"
              fontSize="15px"
            >
              원하는 스티커를 다운 받아
              <br /> 인스타 스토리를 통해 네컷사진을 꾸며보세요!
            </Stack>
            <Stack height="400px" bgcolor="#333" borderRadius="24px">
              <Stack textAlign="right" padding="12px">
                {currentImage + 1}/{stickers[showSticker].length}
              </Stack>
              <img
                width="100%"
                src={`/sticker/${stickers[showSticker][currentImage]}`}
              />
            </Stack>
            <Stack direction="row" justifyContent="space-around" padding="24px">
              <Stack
                bgcolor={currentImage === 0 ? "#aaa" : "white"}
                padding="12px"
                borderRadius="12px"
                fontSize="20px"
                onClick={(e) => {
                  e.stopPropagation()
                  if (currentImage === 0) {
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
                onClick={(e) => downloadStickerFile(e)}
              >
                다운로드
              </Stack>
              <Stack
                bgcolor={
                  currentImage === stickers[showSticker].length - 1
                    ? "#aaa"
                    : "white"
                }
                padding="12px"
                borderRadius="12px"
                fontSize="20px"
                onClick={(e) => {
                  e.stopPropagation()
                  if (currentImage === stickers[showSticker].length - 1) {
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
    </Stack>
  )
}
