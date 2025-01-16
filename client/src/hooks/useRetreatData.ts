import { atom, useRecoilState, useRecoilValue } from "recoil"
import { RetreatAttend } from "@server/entity/retreatAttend"
import { useEffect } from "react"
import { get } from "pages/api"
import { UserInformationAtom } from "./useUserData"
import { EditContent } from "./useBotChatLogic"

export const RetreatAttendAtom = atom<RetreatAttend | undefined>({
  key: "retreat-attend",
  default: undefined,
})

export default function useRetreatData() {
  const userInformation = useRecoilValue(UserInformationAtom)
  const [retreatAttend, setRetreatAttend] = useRecoilState(RetreatAttendAtom)

  useEffect(() => {
    // fetch retreat data
    get("/retreat").then((data: RetreatAttend | undefined) => {
      setRetreatAttend(data)
      console.log(data, userInformation)
    })
  }, [userInformation])

  function checkMissedRetreatAttendInformation() {
    if (!retreatAttend) {
      return EditContent.HowToGo
    }
    if (!retreatAttend.HowToGo) {
      return EditContent.HowToGo
    }
    if (!retreatAttend.HowToBack) {
      return EditContent.HowToBack
    }

    return EditContent.none
  }

  function editRetreatAttendInformation(
    key: keyof RetreatAttend,
    value: RetreatAttend[keyof RetreatAttend]
  ) {
    if (!retreatAttend) {
      setRetreatAttend({
        HowToBack: "",
        HowToGo: "",

        [key]: value,
      })
      return
    }

    setRetreatAttend({
      ...retreatAttend,
      [key]: value,
    })
  }

  return { checkMissedRetreatAttendInformation, editRetreatAttendInformation }
}
