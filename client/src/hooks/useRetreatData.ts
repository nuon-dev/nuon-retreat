import { useRecoilState, useRecoilValue } from "recoil"
import { RetreatAttend } from "@server/entity/retreatAttend"
import { useEffect, useState } from "react"
import { get, post } from "pages/api"
import { UserInformationAtom } from "./useUserData"
import { EditContent } from "./useBotChatLogic"
import { InOutInfo } from "@server/entity/inOutInfo"
import { Days, HowToMove, InOutType } from "@server/entity/types"
import { InOutInformationAtom, RetreatAttendAtom } from "state/retreat"

export default function useRetreatData() {
  const userInformation = useRecoilValue(UserInformationAtom)
  const [retreatAttend, setRetreatAttend] = useRecoilState(RetreatAttendAtom)
  const [inOutInfoList, setInOutInfo] = useRecoilState(InOutInformationAtom)

  useEffect(() => {
    // fetch retreat data
    if (!userInformation) {
      return
    }
    if (!retreatAttend) {
      fetchRetreatAttendInformation()
      fetchInOutInfo()
    }
  }, [userInformation])

  async function fetchRetreatAttendInformation() {
    const retreatAttend = await get("/retreat")
    setRetreatAttend(retreatAttend)
  }

  async function fetchInOutInfo() {
    const inOutInfo = await get("/in-out-info")
    setInOutInfo(inOutInfo)
  }

  function checkMissedRetreatAttendInformation() {
    if (!retreatAttend) {
      return EditContent.none
    }
    if (!retreatAttend.howToGo) {
      return EditContent.howToGo
    }
    if (
      retreatAttend.howToBack === HowToMove.driveCarWithPerson ||
      retreatAttend.howToBack === HowToMove.rideCar ||
      retreatAttend.howToBack === HowToMove.goAlone
    ) {
      const outInfos = inOutInfoList.filter(
        (info) => info.inOutType === InOutType.OUT
      )
      if (outInfos.length === 0) {
        addInfo(InOutType.OUT, retreatAttend.howToBack)
      }
    }
    if (
      retreatAttend.howToGo === HowToMove.driveCarWithPerson ||
      retreatAttend.howToGo === HowToMove.rideCar ||
      retreatAttend.howToGo === HowToMove.goAlone
    ) {
      const inInfos = inOutInfoList.filter(
        (info) => info.inOutType === InOutType.IN
      )
      if (inInfos.length === 0) {
        addInfo(InOutType.IN, retreatAttend.howToGo)
      }
    }
    if (!retreatAttend.howToBack) {
      return EditContent.howToBack
    }

    for (const inOut of inOutInfoList) {
      if (inOut.inOutType === InOutType.none) {
        return EditContent.inOutInfo
      }
      if (inOut.howToMove === HowToMove.none) {
        return EditContent.inOutInfo
      }
      if (!inOut.position) {
        return EditContent.inOutInfo
      }
      if (!inOut.time) {
        return EditContent.inOutInfo
      }
    }
    return EditContent.none
  }

  function editRetreatAttendInformation(
    key: keyof RetreatAttend,
    value: RetreatAttend[keyof RetreatAttend]
  ) {
    if (!retreatAttend) {
      return
    }

    setRetreatAttend({
      ...retreatAttend,
      [key]: value,
    })
  }

  async function saveRetreatAttendInformation() {
    if (!retreatAttend) {
      return
    }
    await post("/retreat/edit-information", {
      ...retreatAttend,
      isCanceled: false,
    })
  }

  function addInfo(inOutType: InOutType, howToMove?: HowToMove) {
    setInOutInfo([
      ...inOutInfoList,
      {
        id: 0,
        inOutType: inOutType,
        day: Days.firstDay,
        time: 0,
        position: "",
        howToMove,
        autoCreated: howToMove !== HowToMove.none,
      } as InOutInfo,
    ])
  }

  function setInOutData(data: InOutInfo[]) {
    setInOutInfo(data)
  }

  return {
    checkMissedRetreatAttendInformation,
    editRetreatAttendInformation,
    saveRetreatAttendInformation,
    addInfo,
    inOutInfoList,
    setInOutData,
  }
}
