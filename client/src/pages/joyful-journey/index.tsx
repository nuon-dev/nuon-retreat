import { Button, Stack } from "@mui/material"
import { useState } from "react"

export default function JoyfulJourney() {
  const [showFourCuts, setShowFourCuts] = useState(false)
  const [showHowTo, setShowHowTo] = useState(false)
  const [showSticker, setShowSticker] = useState(0)
  const [currentImage, setCurrentImage] = useState(1)

  const folderName = [
    "",
    "스티커_모음_색칠",
    "스티커_모음_손글씨",
    "스티커_모음_외곽선",
  ]
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

  function onClickClub() {
    global.location.href =
      "https://piquant-bloom-6fa.notion.site/faa131ec580842908ed6cf6e8c015218"
  }

  function onClickInsta() {
    global.location.href = "https://www.instagram.com/suwonjeilch_youngpeople/"
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

  function downloadStickerFile(e: any) {
    e.stopPropagation()

    const fileName = `/${folderName[showSticker]}/${stickers[showSticker][currentImage]}`
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
          행복축제 인생네컷
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
          onClick={() => setShowHowTo(true)}
        >
          행복축제 스티거 적용법
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
          행복축제 스티커 색칠
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
          행복축제 스티커 손글씨
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
          행복축제 스티커 외곽선
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
          <Stack width="80%" position="relative">
            <Stack
              bgcolor="white"
              mb="12px"
              borderRadius="12px"
              padding="4px"
              textAlign="center"
              color="#333"
              fontWeight="600"
            >
              원하는 프레임을 다운 받아
              <br /> 인스타 스토리를 통해 네컷사진을 완성해보세요!
            </Stack>
            <img src={`/Four-cuts-in-life${currentImage}.jpeg`} width="100%" />
            <Stack direction="row" justifyContent="space-around" padding="24px">
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
          <Stack gap="24px" padding="40px" mb="40px">
            <img src={`/sticker/스티커_적용법1.jpg`} width="100%" />
            <img src={`/sticker/스티커_적용법2.jpg`} width="100%" />
            <img src={`/sticker/스티커_적용법3.jpg`} width="100%" />
            <img src={`/sticker/스티커_적용법4.jpg`} width="100%" />
            <img src={`/sticker/단체샷_색칠.JPG`} width="100%" />
            <img src={`/sticker/단체샷_손글씨.JPG`} width="100%" />
            <img src={`/sticker/단체샷_외곽선.JPG`} width="100%" />
            <Button variant="outlined">닫기</Button>
          </Stack>
        </Stack>
      )}
      {showSticker && (
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
            >
              원하는 스티커를 다운 받아
              <br /> 인스타 스토리를 통해 네컷사진을 완성해보세요!
            </Stack>
            <Stack height="400px" bgcolor="#333" borderRadius="24px">
              <img
                width="100%"
                src={`/${folderName[showSticker]}/${stickers[showSticker][currentImage]}`}
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
